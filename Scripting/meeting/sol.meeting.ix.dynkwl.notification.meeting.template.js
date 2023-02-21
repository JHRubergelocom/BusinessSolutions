
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js

/**
 * @class sol.meeting.ix.dynkwl.notification.meeting.template
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
 * @requires sol.common.SordUtils
 * @requires sol.common.IXUtils
 * @requires sol.common.Injection
 * @requires sol.common.ObjectUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 */
sol.define("sol.meeting.ix.dynkwl.notification.meeting.template", {
  extend: "sol.common.ix.DynKwlFindChildrenIterator",

  mixin: false,

  mixins: ["sol.common.mixins.Inject", "sol.common.ix.DynKwlMixin"],

  $configRelation: {
    kwl: "/meeting/Configuration/kwl.config"
  },

  inject: {
    tableTitle: { config: "kwl", prop: "MeetingNotificationTemplate.title" },
    tableHeaders: { config: "kwl", prop: "MeetingNotificationTemplate.header" },
    tableKeyNames: { config: "kwl", prop: "MeetingNotificationTemplate.output" },
    parentFieldKey: { config: "kwl", prop: "MeetingNotificationTemplate.parent.fieldKey" },
    parentFromService: { config: "kwl", prop: "MeetingNotificationTemplate.parent.fromService" }
  },

  /**
   * Opens a connection for the elo java client and non map field capable clients.
   *
   * @param {de.elo.ix.scripting.ScriptExecContext} ec
   * @param {de.elo.ix.client.Sord} sord working version of the current sord object
   * @param {String} fieldName name of the currently focused field
   */
  open: function (ec, sord, fieldName) {
    var parentId,
        templateData,
        source;
    this.log.enter("open", { sord: sord, fieldName: fieldName });

    function getServiceResult(name, params) {
      templateData = sol.common.SordUtils.getTemplateSord(sord);
      return sol.common.IxUtils.execute(
        name,
        sol.common.TemplateUtils.render(
          params,
          templateData
        )
      ).sords[0] || {};
    }

    if (!this.parentIdAlreadyDetermined) {
      if (this.parentFromService) {
        this.parentIdAlreadyDetermined = true;
        source = (getServiceResult(
          this.parentFromService.name,
          this.parentFromService.params
        ) || {});

        templateData = templateData || {};
        templateData.source = source;

        parentId = sol.common.TemplateUtils.render(
          sol.common.ObjectUtils.getProp(templateData, this.parentFromService.fieldKey || this.parentFieldKey),
          templateData
        );

      } else if (this.parentFieldKey) {
        this.parentIdAlreadyDetermined = true;
        parentId = sol.common.SordUtils
          .getObjKeyValue(sord, this.parentFieldKey);
      }
    }

    if (parentId) {
      this.parentId = parentId;
    }

    if (!this.parentId) {
      throw new Error("Please provide a valid parent id");
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
    var parentId,
        source,
        templateData;
    this.log.info("openMap", [focusName, map]);

    function getServiceResult(name, params) {
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

      templateData = {
        sord: Object.keys(map)
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

      return sol.common.IxUtils.execute(
        name,
        sol.common.TemplateUtils.render(
          params,
          templateData
        )
      ).sords[0] || {};
    }

    if (!this.parentIdAlreadyDetermined) {
      if (this.parentFromService) {
        this.parentIdAlreadyDetermined = true;
        source = (getServiceResult(
          this.parentFromService.name,
          this.parentFromService.params
        ) || {});

        templateData = templateData || {};
        templateData.source = source;

        parentId = sol.common.TemplateUtils.render(
          sol.common.ObjectUtils.getProp(templateData, this.parentFromService.fieldKey || this.parentFieldKey),
          templateData
        );

      } else if (this.parentFieldKey) {
        this.parentIdAlreadyDetermined = true;
        parentId = map[this.parentFieldKey];
      }
    }

    if (parentId) {
      this.parentId = parentId;
    }

    if (!this.parentId) {
      throw new Error("Please provide a valid parent id");
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
    if (!this._tableHeaders) {
      sol.common.TranslateTerms.require(this.tableHeaders || []);

      this._tableHeaders = (this.tableHeaders || [])
        .map(function (tableHeader) {
          return sol.common.TranslateTerms.translate(tableHeader);
        });
    }
    return this._tableHeaders || ["Name", "Description"];
  },


  /**
   * @private
   * Basic implementation for search results.
   * This returns the content of the sord index fields.
   * Used for the 'DynKwlSearchIterator'.
   * @param {de.elo.ix.client.Sord} sord
   * @return {String[]}
   */
  getRowData: function (sord) {
    var me = this,
        data = [],
        i;
    if (me.dataFields) {
      for (i = 0; i < me.dataFields.length; i++) {
        data.push(
          sord[me.dataFields[i]] || sol.common.SordUtils.getObjKeyValue(sord, me.dataFields[i])
        );
      }
    } else {
      data = [sord.name, sord.desc];
    }

    return data;
  }
});

function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.dynkwl.notification.meeting.template" }),
      provider;

  try {
    log.info("DynamicKeywordList (");
    provider = sol.create("sol.meeting.ix.dynkwl.notification.meeting.template");
    return new DynamicKeywordDataProvider(provider);
  } finally {
    log.info(")getDataIterator");
  }
}