
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Learning reputation utilities
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 0.01.000
 *
 * @eloix
 *
 * @requires handlebars
 * @requires sol.common.Config
 * @requires sol.common.IxUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordMap
 * @requires sol.common.SordUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.Template
 */
sol.define("sol.learning.ix.ReputationUtils", {
  singleton: true,

  /**
   * Loads (and merges) the reputation configuration from the JSON file: `/Administration/Business Solutions/learning/Configuration/reputation.config`
   * @return {Object}
   */
  loadConfig: function () {
    var me = this;

    me.config = sol.create("sol.common.Config", { compose: "/learning/Configuration/reputation.config" }).config;

    return me.config;
  },

  /**
   * Grant repution to user
   * @param {String} type Type of reputation point
   * @param {String} user Name or id. If empty current user will be used.
   * @param {Boolean} countDown If set the reputation counter is decremented and the repution points are subtracted
   * @return {Boolean} Checks, if grant reputation was successful or not
   */
  grant: function (type, user, countDown) {
    var me = this,
        repPoint, reputation,
        userId, userFolder,
        userName, count;

    try {
      me.loadConfig();
      repPoint = me.config.reputationPoints[type];

      if (repPoint) {
        repPoint = repPoint.replace(",", ".");
        repPoint = parseFloat(repPoint);

        if (!user || user == "CURRENT") {
          userId = sol.common.UserUtils.getCurrentUserInfo().id;
          userName = sol.common.UserUtils.getCurrentUserInfo().name;
        } else {
          userId = sol.common.UserUtils.getUserInfo(user).id;
          userName = sol.common.UserUtils.getUserInfo(user).name;
        }

        if (countDown) {
          count = me.readStatistics(type, userName);
          if (count === 0) {
            return false;
          }
        }

        userFolder = sol.common.UserUtils.getUserFolder(userId);
        reputation = sol.common.SordUtils.getObjKeyValueAsNumber(userFolder, "REPUTATION");
        if (!reputation) {
          reputation = 0;
        }

        if (countDown) {
          reputation -= repPoint;
        } else {
          reputation += repPoint;
        }

        sol.common.SordUtils.setObjKeyValueAsNumber(userFolder, "REPUTATION", reputation);
        ixConnectAdmin.ix().checkinSord(userFolder, SordC.mbAllIndex, LockC.NO);

        me.writeStatistics(type, userName, countDown);

        return true;

      } else {
        return false;
      }
    } catch (ex) {
      me.logger.warn("Granting reputation failed.", ex);
      return false;
    }
  },

  /**
   * Stores the highest value given for a specific reputation type.
   * This can be used in order to remember the maximum count that was given to a user.
   *
   * e.g. 5 posts of a user recieved 25 upvotes in total. The maximum amount of votes
   * the user reached in all posts was 20 (maxCount).
   *
   * @param {String} type Type of reputation point
   * @param {String} userName or id. If empty current user will be used.
   * @param {Boolean} count The current count value for this type.
   * @return {Boolean} Checks, if grant reputation was successful or not
   *
   */
  maxCount: function (type, userName, count) {
    var me = this,
        statisticPath, map, mapKey, objId;

    try {
      me.loadConfig();
      statisticPath = me.config.reputationStatistic.statisticPath;
      if (sol.common.ObjectUtils.isNumber(userName)) {
        userName = sol.common.UserUtils.getUserInfo(userName).name;
      }
      if (statisticPath) {
        objId = sol.common.RepoUtils.getSord(statisticPath).id;
        map = sol.create("sol.common.SordMap", {
          objId: objId,
          asAdmin: true
        });
        mapKey = "REPUTATION_" + userName + "_" + type;
        map.read(mapKey);
        if (map.keyAndValueExist(mapKey)
          && map.getNumValue(mapKey) > count) {
          return;
        }
        map.setNumValue(mapKey, count);
      }
      map.write();
    } catch (ex) {
      me.logger.warn("Setting max counter failed.", ex);
      return false;
    }
  },

  /**
   * Write Statistic from user
   * @param {String} type Type of reputation point
   * @param {String} userName Name of user.
   * @param {Boolean} countDown If set the reputation counter is decremented and the repution points are subtracted
   */
  writeStatistics: function (type, userName, countDown) {
    var me = this,
        statisticPath, map, mapKey, count, objId;

    statisticPath = me.config.reputationStatistic.statisticPath;
    if (statisticPath) {
      objId = sol.common.RepoUtils.getSord(statisticPath).id;
      map = sol.create("sol.common.SordMap", {
        objId: objId,
        asAdmin: true
      });
      mapKey = "REPUTATION_" + userName + "_" + type;
      map.read(mapKey);
      count = 0;
      if (map.keyAndValueExist(mapKey)) {
        count = map.getNumValue(mapKey);
      }
      if (countDown) {
        count--;
      } else {
        count++;
      }
      map.setNumValue(mapKey, count);
    }
    map.write();
  },

  /**
   * Read Statistic from user
   * @param {String} type Type of reputation point
   * @param {String} userName Name of user.
   * @return {Number} Get reputation counter
   */
  readStatistics: function (type, userName) {
    var me = this,
        statisticPath, map, mapKey, count, objId;

    statisticPath = me.config.reputationStatistic.statisticPath;
    if (statisticPath) {
      objId = sol.common.RepoUtils.getSord(statisticPath).id;
      map = sol.create("sol.common.SordMap", { objId: objId });
      mapKey = "REPUTATION_" + userName + "_" + type;
      map.read(mapKey);
      count = 0;
      if (map.keyAndValueExist(mapKey)) {
        count = map.getNumValue(mapKey);
      }
    }
    return count;
  }

});
