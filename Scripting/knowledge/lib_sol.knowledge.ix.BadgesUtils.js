
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Knowledge badges utilities
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.01.000
 *
 * @eloix
 *
 * @requires handlebars
 * @requires sol.common.Config
 * @requires sol.common.TranslateTerms
 */
sol.define("sol.knowledge.ix.BadgesUtils", {
  singleton: true,

  /**
   * Loads (and merges) the badges configuration from the JSON file: `/Administration/Business Solutions/knowledge/Configuration/badges.config`
   * @return {Object}
   */
  loadConfig: function () {
    var me = this;

    me.config = sol.create("sol.common.Config", { compose: "/knowledge/Configuration/badges.config" }).config;

    return me.config;
  },

  /**
   * Get Badges from JSON-Structure
   * @param {Object} badgesJsonElem
   * @param {Object} category
   * @param {Object[]} categoryBadges
   * @return {Object[]}
   */
  getBadges: function (badgesJsonElem, category, categoryBadges) {
    var me = this,
        i, newBadge, badgeJsonElem;

    me.logger.enter("getBadges", arguments);
    for (i = 0; i < badgesJsonElem.length; i++) {
      badgeJsonElem = badgesJsonElem[i];
      newBadge = {};
      newBadge.category = category.category;
      newBadge.type = badgeJsonElem.type;

      if (badgeJsonElem.name) {
        newBadge.name = sol.common.TranslateTerms.translate(badgeJsonElem.name);
      } else if (category.name) {
        newBadge.name = category.name;
      } else {
        newBadge.name = "";
      }

      if (badgeJsonElem.description) {
        newBadge.description = sol.common.TranslateTerms.translate(badgeJsonElem.description);
      } else if (category.description) {
        newBadge.description = category.description;
      } else {
        newBadge.description = "";
      }

      if (badgeJsonElem.icon) {
        newBadge.icon = badgeJsonElem.icon;
      } else if (category.icon) {
        newBadge.icon = category.icon;
      } else {
        newBadge.icon = "";
      }

      if (badgeJsonElem.color) {
        newBadge.color = badgeJsonElem.color;
      } else if (category.color) {
        newBadge.color = category.color;
      } else {
        newBadge.color = "";
      }

      categoryBadges.push(newBadge);
    }
    me.logger.exit("getBadges", categoryBadges);
    return categoryBadges;
  },

  /**
   * Get Categoy Badges Array from JSON-Structure
   * @param {String} language
   * @return {Object[]}
   */
  getCategoryBadges: function () {
    var me = this,
        language = ixConnect.loginResult.clientInfo.language,
        i, categoryJsonElem, category;

    me.logger.enter("getCategoryBadges");
    me.loadConfig();
    if (!me.categoryBadges) {
      me.categoryBadges = {};
    }
    if (!me.categoryBadges[language]) {
      me.categoryBadges[language] = [];
      for (i = 0; i < me.config.category.length; i++) {
        categoryJsonElem = me.config.category[i];
        category = {};
        category.category = categoryJsonElem.type;
        if (categoryJsonElem.name) {
          category.name = sol.common.TranslateTerms.translate(categoryJsonElem.name);
        }
        if (categoryJsonElem.description) {
          category.description = sol.common.TranslateTerms.translate(categoryJsonElem.description);
        }
        if (categoryJsonElem.color) {
          category.color = categoryJsonElem.color;
        }
        if (categoryJsonElem.icon) {
          category.icon = categoryJsonElem.icon;
        }
        me.categoryBadges[language] = me.getBadges(categoryJsonElem.badges, category, me.categoryBadges[language]);
      }
    }
    me.logger.exit("getCategoryBadges", me.categoryBadges[language]);
    return me.categoryBadges[language];
  }

});
