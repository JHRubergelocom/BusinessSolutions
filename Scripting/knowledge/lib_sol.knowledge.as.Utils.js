
//@include lib_Class.js

/**
 * @abstract
 *
 * ELO Knowledge board Services Library methods for the ELOas.
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloas
 */
sol.define("sol.knowledge.as.Utils", {

  singleton: true,

  /**
   * Loads (and merges) the knowledge configuration from the JSON file: `/Administration/Business Solutions/knowledge/Configuration/knowledge.config`
   * @return {Object}
   */
  loadKnowledgeConfig: function () {
    var me = this;
    if (!me.knowledgeConfig) {
      me.knowledgeConfig = sol.create("sol.common.Config", { compose: "/knowledge/Configuration/knowledge.config" }).config;
    }
    return me.knowledgeConfig;
  },

 /**
  * Reads the complete ELO user list and checks for Generate Badges
  */
  processAllUsers: function () {
    var me = this,
        users = [],
        u, compose, reps, reputationPoints, rpKey;

    me.logger.enter("processAllUsers", arguments);
    if (!me.cfgCategoryBadges) {
      compose = "/knowledge/Configuration/badges.config";
      me.cfgCategoryBadges = sol.create("sol.common.Config", { compose: compose }).config.category;
    }
    if (!me.cfgReputation) {
      compose = "/knowledge/Configuration/reputation.config";
      me.cfgReputation = sol.create("sol.common.Config", { compose: compose }).config;
    }
    reps = [];
    reputationPoints = me.cfgReputation.reputationPoints;
    if (reputationPoints) {
      for (rpKey in reputationPoints) {
        if (reputationPoints.hasOwnProperty(rpKey)) {
          me.logger.debug(rpKey + " -> " + reputationPoints[rpKey]);
          reps.push(rpKey);
        }
      }
    }
    users = ixConnect.ix().checkoutUsers(null, CheckoutUsersC.ALL_USERS_RAW, LockC.NO);
    for (u = 0; u < users.length; u++) {
      me.processUserItems(reps, users[u].id);
    }
    me.logger.exit("processAllUsers");
  },

 /**
  * Generate Badges for the specified user
  * @param {String[]} reps Reputation, e.g. ["GOT_UPVOTED"]
  * @param {String} userId Specified User
  */
  processUserItems: function (reps, userId) {
    var me = this;

    me.logger.enter("processUserItems", arguments);
    try {
      me.processGenerateBadges(reps, userId);
    } catch (e) {
      me.logger.warn("Error processing Generate Badges: " + e);
    }
    me.logger.exit("processUserItems");
  },

 /**
  * GenerateBadges to the user.
  * @param {String[]} reps Reputation, e.g. ["GOT_UPVOTED"]
  * @param {String} userId Specified User
  */
  processGenerateBadges: function (reps, userId) {
    var me = this,
        categoryBadges = [],
        totalCategoryBadges = [],
        count, userFolder, userName, i;

    me.logger.enter("processGenerateBadges", arguments);

    userName = sol.common.UserUtils.getUserInfo(userId).name;

    totalCategoryBadges = [];
    for (i = 0; i < reps.length; i++) {
      count = me.readStatistics(reps[i], userName);
      categoryBadges = me.setCategoryBadges(reps[i], count);
      me.logger.debug("User Name: " + userName);
      me.logger.debug("Reputation Count: " + count);
      me.logger.debug("Badges: ", categoryBadges);
      totalCategoryBadges = me.mergeArrays(totalCategoryBadges, categoryBadges);
    }
    me.logger.debug("Total Badges: ", totalCategoryBadges);
    userFolder = sol.common.UserUtils.getUserFolder(userId);
    sol.common.SordUtils.setObjKeyValues(userFolder, "BADGES", totalCategoryBadges);
    ixConnect.ix().checkinSord(userFolder, SordC.mbAllIndex, LockC.NO);
    me.logger.exit("processGenerateBadges");
  },

  /**
   * Merge to arrays
   * @param {String[]} array1 Type of reputation point, e.g. "GOT_UPVOTED"
   * @param {String[]} array2 Name of user.
   * @return {String[]} Merged array
   */
  mergeArrays: function (array1, array2) {
    var me = this,
        mergedArray = [],
        containsElem = false,
        i, j;

    me.logger.enter("mergeArrays", arguments);
    for (i = 0; i < array1.length; i++) {
      mergedArray.push(array1[i]);
    }

    for (i = 0; i < array2.length; i++) {
      containsElem = false;
      for (j = 0; j < mergedArray.length; j++) {
        if (array2[i] === mergedArray[j]) {
          containsElem = true;
        }
      }
      if (containsElem === false) {
        mergedArray.push(array2[i]);
      }
    }
    me.logger.exit("mergeArrays", mergedArray);
    return mergedArray;
  },

  /**
   * Read Statistic from user
   * @param {String} type Type of reputation point, e.g. "GOT_UPVOTED"
   * @param {String} userName Name of user.
   * @return {Integer} Count Statistic
   */
  readStatistics: function (type, userName) {
    var me = this,
        statisticPath, map, mapKey, count, objId;

    me.logger.enter("readStatistics", arguments);
    statisticPath = me.cfgReputation.reputationStatistic.statisticPath;
    if (statisticPath) {
      objId = sol.common.RepoUtils.getSord(statisticPath).id;
      map = sol.create("sol.common.SordMap", { objId: objId });
      mapKey = "REPUTATION_" + userName + "_" + type;
      map.read(mapKey);
      if (map.keyAndValueExist(mapKey)) {
        count = map.getNumValue(mapKey);
      } else {
        count = 0;
      }
    }
    me.logger.exit("readStatistics", count);
    return count;
  },

 /**
  * Generate Badge.
  * @param {String} categoryType Type of category, e.g. "SOLUTION"
  * @param {Object} cfgBadge Category of badges, e.g. "SOLUTION"
  * @param {String[]} badges
  * @param {String} rep Type of reputation point, e.g. "GOT_UPVOTED"
  * @param {Integer} count Count Reputation
  * @return {String[]} badges entry for userfolder
  */
  setBadge: function (categoryType, cfgBadge, badges, rep, count) {
    var me = this,
        i, relation, value, type;

    me.logger.enter("setBadge", arguments);
    for (i = 0; i < cfgBadge.conditions.length; i++) {
      if (cfgBadge.conditions[i].rep == rep) {
        relation = cfgBadge.conditions[i].relation;
        value = cfgBadge.conditions[i].value;
        type = categoryType + "_" + cfgBadge.type;

        switch (relation) {
          case "<":
            if (count < value) {
              badges.push(type);
            }
            break;

          case ">":
            if (count > value) {
              badges.push(type);
            }
            break;

          case "<=":
            if (count <= value) {
              badges.push(type);
            }
            break;

          case ">=":
            if (count >= value) {
              badges.push(type);
            }
            break;

          case "==":
            if (count == value) {
              badges.push(type);
            }
            break;

          case "!=":
            if (count != value) {
              badges.push(type);
            }
            break;

          default:
            break;
        }
      }
    }
    me.logger.exit("setBadge", badges);
    return badges;
  },

 /**
  * Generate Badges.
  * @param {Object} cfgCategoryBadge Category of badges, e.g. "SOLUTION"
  * @param {String[]} badges
  * @param {String} rep Type of reputation point, e.g. "GOT_UPVOTED"
  * @param {Integer} count Count Reputation
  * @return {String[]} badges entry for userfolder
  */
  setBadges: function (cfgCategoryBadge, badges, rep, count) {
    var me = this,
        cfgBadge, i,
        categoryType, categoryOnlyHighestBadge, categoryBadges,
        tempBadge, tempBadges;

    me.logger.enter("setBadges", arguments);
    categoryType = cfgCategoryBadge.type;
    categoryOnlyHighestBadge = cfgCategoryBadge.onlyHighestBadge;
    categoryBadges = cfgCategoryBadge.badges;

    if (categoryOnlyHighestBadge === true) {
      tempBadges = [];
      for (i = 0; i < categoryBadges.length; i++) {
        cfgBadge = categoryBadges[i];
        tempBadges = me.setBadge(categoryType, cfgBadge, tempBadges, rep, count);
      }
      if (tempBadges.length > 0) {
        tempBadge = tempBadges[tempBadges.length - 1];
        badges.push(tempBadge);
      }
    } else {
      for (i = 0; i < categoryBadges.length; i++) {
        cfgBadge = categoryBadges[i];
        badges = me.setBadge(categoryType, cfgBadge, badges, rep, count);
      }
    }
    me.logger.exit("setBadges", badges);
    return badges;
  },

 /**
  * Generate Category Badges to the user.
  * @param {String} rep Type of reputation point, e.g. "GOT_UPVOTED"
  * @param {Integer} count Count Reputation
  * @return {String[]} badges entry for userfolder
  */
  setCategoryBadges: function (rep, count) {
    var me = this,
        badges = [],
        cfgCategoryBadges, cfgCategoryBadge, i;

    me.logger.enter("setCategoryBadges", arguments);

    cfgCategoryBadges = me.cfgCategoryBadges;
    for (i = 0; i < cfgCategoryBadges.length; i++) {
      cfgCategoryBadge = cfgCategoryBadges[i];
      badges = me.setBadges(cfgCategoryBadge, badges, rep, count);
    }
    me.logger.exit("setCategoryBadges", badges);
    return badges;
  }

});
