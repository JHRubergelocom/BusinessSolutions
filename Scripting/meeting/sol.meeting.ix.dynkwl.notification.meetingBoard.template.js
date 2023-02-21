
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js

/**
 * @class sol.meeting.ix.dynkwl.notification.meetingBoard.template
 *
 * Dynamic keyword list that returns a list of available notification templates
 *
 * The list is returned as a table.
 *
 *
 * @author ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.Config
 * @requires sol.common.Injection
 * @requires sol.common.ObjectUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.Template
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 */
sol.define("sol.meeting.ix.dynkwl.notification.meetingBoard.templates", {
  extend: "sol.common.ix.DynKwlFindChildrenIterator",

  mixin: false,

  mixins: ["sol.common.mixins.Inject", "sol.common.ix.DynKwlMixin"],

  $configRelation: {
    kwl: "/meeting/Configuration/kwl.config"
  },

  inject: {
    config: { config: "kwl", prop: "MeetingBoardNotificationTemplates" },
    tableTitle: { config: "kwl", prop: "MeetingBoardNotificationTemplates.title" },
    tableHeaders: { config: "kwl", prop: "MeetingBoardNotificationTemplates.headers" },
    tableKeyNames: { config: "kwl", prop: "MeetingBoardNotificationTemplates.output" },
    parentFieldKey: { config: "kwl", prop: "MeetingBoardNotificationTemplates.parent.fieldKey" },
    parentFromService: { config: "kwl", prop: "MeetingBoardNotificationTemplates.parent.fromService" }
  },

  /**
   * Opens a connection for the elo java client and non map field capable clients.
   *
   * @param {de.elo.ix.scripting.ScriptExecContext} ec
   * @param {de.elo.ix.client.Sord} sord working version of the current sord object
   * @param {String} fieldName name of the currently focused field
   */
  open: function (ec, sord, fieldName) {
    this.log.enter("open", { sord: sord, fieldName: fieldName, id: sord.id });
    var templateSord;

    if (!this.parentId) {
      templateSord = sol.common.SordUtils.getTemplateSord(sord);
      this.parentId = sol.common.TemplateUtils.render(
        sol.common.SordUtils.getObjKeyValue(sord, this.parentFieldKey) ||
        sol.common.ObjectUtils.getProp(templateSord, this.parentFieldKey),
        templateSord
      );
    }

    this._keyNames = this.getTableKeyNames(fieldName);

    this.index = 0;
    this._findInfo = this.getFindInfo(this.createSearchFilterList(ec, fieldName, null, null, sord));
    this.resultSet = this.getSearchResults();
    this.log.exit("open");
  },

  /**
   * Opens a connection for elo wf forms and map field capable components
   *
   * @param {de.elo.ix.scripting.ScriptExecContext} ec
   * @param {Object} map Map of all entries passed by the client
   * @param {String} focusName Name of the currently focused field
   */
  openMap: function (ec, map, focusName) {
    this.log.info("openMap", { focusName: focusName, map: map, tableHeaders: this.tableHeaders });
    var templateData;

    function replaceKeyName(keyName) {
      var keyNames = {
        IX_GRP_: "objKeys.",
        IX_MAP_: "mapKeys.",
        WF_MAP_: "wfMapKeys.",
        IX_NAME: "name",
        IX_ID: "id"
      };
      return {
        keyName: keyName,
        formattedKeyName: keyNames[keyName.substring(0, 7)]
          ? keyNames[keyName.substring(0, 7)] + keyName.substr(7)
          : keyName
      };
    }

    if (!this.parentId) {
      templateData = {
        source: Object.keys(map)
          .map(replaceKeyName)
          .reduce(function (acc, keyObj) {
            sol.common.ObjectUtils.setProp(
              acc,
              keyObj.formattedKeyName,
              map[keyObj.keyName]
            );
            return acc;
          }, {})
      };

      this.parentId = sol.common.TemplateUtils.render(
        map[this.parentFieldKey] || sol.common.ObjectUtils.getProp(templateData, this.parentFieldKey),
        templateData
      );
    }

    this.index = 0;

    this._keyNames = this.getTableKeyNames(focusName)
      .map(function (fieldIndex, keyName) {
        return !!keyName ? ((fieldIndex != "") ? keyName.replace("{i}", fieldIndex) : keyName) : null;
      }.bind(this, this.getIndexFromName(focusName)));


    this._findInfo = this.getFindInfo(
      this.createSearchFilterList(ec, focusName, this.getIndexFromName(focusName), map, null)
    );

    this.resultSet = this.getSearchResults();
    this.log.exit("openMap");
  },

  /**
   * Returns the header of this table that can be displayed by the clients.
   *
   * @return {String[]} Table header
   */
  getHeader: function () {
    return this.tableHeaders || ["Name", "Description"];
  }
});

function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.dynkwl.notification.meetingBoard.templates" }),
      provider;

  try {
    log.info("DynamicKeywordList (");
    provider = sol.create("sol.meeting.ix.dynkwl.notification.meetingBoard.templates");
    return new DynamicKeywordDataProvider(provider);
  } finally {
    log.info(")getDataIterator");
  }
}