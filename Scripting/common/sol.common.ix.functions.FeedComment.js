
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.client.feed);

//@include lib_Class.js
//@include lib_moment.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.FeedComment" });

/**
 * Writes a feed comment for an archive element.
 *
 * The comments will be read from a language `file` which has to be present in `ELOwfBase/Feed/Script Locales`.
 * A `key` determines which value from the language file will be used. The feed comments in this file can contain placeholders.
 * An additional `data` array contains the configuration on how the placeholders will be handled.
 *
 * # As workflow node
 *
 * `ObjId` is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "file": "sol.invoice.workflow",
 *       "key": "WORKFLOW.INVOICE.APPROVAL.REJECTED",
 *       "data": [ "INVOICE_NET_AMOUNT", "INVOICE_CURRENCY_CODE" ]
 *     }
 *
 * The following configuration examples will be (if not stated otherwise) in JavaScript notation (for better readability).
 * If used in a workflow node configuration they need to be converted to JSON notation.
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the `objId` must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_FeedComment", {
 *       objId: "4711",
 *       file: "sol.invoice.workflow",
 *       key: "WORKFLOW.INVOICE.APPROVAL.REJECTED",
 *       data: [ "INVOICE_NET_AMOUNT", "INVOICE_CURRENCY_CODE" ]
 *     });
 *
 * # Placeholder
 * The key in the property file can contain placeholders. Those are curly braces with an index (starting with zero): `{0}`
 * These placeholders will be replaced with either Sord properties, indexing information, map entries or workflow map entries specified by the data array.
 * Datasource is the object specified by `objId` or on which the workflow runs.
 *
 * By default, the index field names are used in the data array to determine the values to replace the placeholders:
 *
 *     data: [ "MY_FIELD" ]  // abbreviated form, will replace {0} with the value of the index field `MY_FIELD`
 *
 * Advanced placeholder configuration:
 *
 *     data: [ { type: "SORD", key: "name" } ]  // will replace {0} with the name of the sord
 *     data: [ { type: "GRP", key: "MY_FIELD" } ]  // will replace {0} with the value of the index field `MY_FIELD`
 *     data: [ { type: "MAP", key: "MY_MAP" } ]  // will replace {0} with the value of the map field `MY_MAP`
 *     data: [ { type: "WFMAP", key: "MY_WFMAP" } ]  // will replace {0} with the value of the workflow map field `MY_MAP` (only available in workflow functions)
 *     data: [ { type: "FORMBLOB", key: "REASON_OF_REJECTION", "deleteAfterUse": true } ]  // will delete the value after use (only available for type `FORMBLOB`)
 *     data: [ { type: "WFNODE", node: "my.node.translation.key", key: "comment" } ]  // only works in workflows, searches the node either by translation key or by node id and writes the node property defined in key
 *
 * Both notations can be mixed.
 *
 * # Formating
 * Values read from fields, can be formatted. An additional configuration will be needed for that.
 *
 * Currently `dateFormat`, and `eloFormat` is supported.
 *
 * The `dateFormat` has to be in [moment](http://momentjs.com/docs/#/parsing/string-format/) syntax.
 *
 *     data: [ { type: "GRP", key: "MY_DATE_FIELD", dateFormat: "DD.MM.YYYY" } ]  // will output the value of `MY_DATE_FIELD` in the given format e.g. '30.05.2016'
 *
 * The `eloFormat` currently supports the two values `hashtag` and `mention` (or the corresponding shortcuts `h` or `m`)
 *
 *     data: [ { type: "GRP", key: "MY_FIELD", eloFormat: "hashtag" } ]  // will output the value of `MY_FIELD` as an elo hashtag
 *     data: [ { type: "GRP", key: "MY_FIELD", eloFormat: "h" } ]  // will output the value of `MY_FIELD` as an elo hashtag
 *     data: [ { type: "GRP", key: "MY_FIELD", eloFormat: "mention" } ]  // will output the value of `MY_FIELD` as an elo mention
 *     data: [ { type: "GRP", key: "MY_FIELD", eloFormat: "m" } ]  // will output the value of `MY_FIELD` as an elo mention
 *
 * `dateFormat` and `eloFormat` can be combined:
 *
 *     data: [ { type: "GRP", key: "MY_DATE_FIELD", dateFormat: "YYYY[_Q]Q", eloFormat: "h" } ]  // will output the value of `MY_DATE_FIELD` as an elo hashtag, e.g. `#2016_Q2`
 *
 * Hashtags can not be longer than 40 characters. If a values should be longer it will be truncated (since 1.06.000).
 *
 * If formatting should be used, the abbreviated placeholder configuration can not be used.
 *
 * # Using information boxes in feed comments
 *
 * HTML content is allowed if used within localization property files. In order to support colorized information boxes a set of div-containers and colors can be used.
 *
 * Following locale key will display a yellow box including some information after the message.
 *
 *     CONTRACT.SIGNED=signed the contract.<div class="description yellow">Information of the box...</div>
 *
 * By default a set of colors can be used:
 *
 *     <div class="description red">red box</div>
 *     <div class="description green">green box</div>
 *     <div class="description redpurple">red purple box</div>
 *     <div class="description yellow">yellow box</div>
 *     <div class="description orange">orange box</div>
 *     <div class="description pink">pink box</div>
 *
 * HTML-Tags must be used with care since that allows breaking the layout. The use of script tags is also forbidden.
 *
 * # Examples
 *
 * For defining new feed action events a language file should be placed in `\Administration\ELOwf Base\Feed\Script Locales`. It is recommended seperating language files by the solution.
 * If a contract management solution is used define use a file name that includes a namespace. (e.g. `sol.contract` or `sol.contract_fr`)
 *
 * It is recommended using the default locale file (`sol.contract`) for the english translation if multiple language files should be supported.
 * This will be used as a fallback for unsupported languages.
 *
 * ## Using property keys
 *
 * Contents of file `\Administration\ELOwf Base\Feed\Script Locales\sol.contract`:
 *
 *     CONTRACT.CREATED=created a new contract.
 *
 * Workflow node configuration:
 *
 *     {
 *       "file": "sol.contract",
 *       "key": "CONTRACT.CREATED"
 *     }
 *
 * ## Using data placeholders
 *
 * Contents of file `\Administration\ELOwf Base\Feed\Script Locales\sol.contract`:
 *
 *     CONTRACT.CREATED=created a new contract: {0}.
 *
 * Workflow node configuration:
 *
 *     {
 *       "file": "sol.contract",
 *       "key": "CONTRACT.CREATED",
 *       "data": ["CONTRACT_NAME"]
 *     }
 *
 * ## Using information boxes and multiple data placeholders
 *
 * Contents of file `\Administration\ELOwf Base\Feed\Script Locales\sol.contract`:
 *
 *     CONTRACT.CONCLUDED=signed the contract.<div class="description yellow">Comments: {0}<br/>Resposible: {1}</div>
 *
 * Workflow node configuration:
 *
 *     {
 *       "file": "sol.contract",
 *       "key": "CONTRACT.CREATED",
 *       "data": [{ "type": "GRP", "key": "CONTRACT_NAME" }, { "type": "MAP", "key": "CONTRACT_RESPONSIBLE" }]
 *     }
 *
 * ## Using fixed text without localization info
 *
 * Workflow node configuration:
 *
 *     {
 *       "text": "has created a document {0} with content {1}",
 *       "data": ["Test", "xyz"]
 *     }
 *
 *     {
 *       "text": ""has created a document {0}",
 *       "data": [{ "type": "MAP", "key": "TEST" }],
 *       "dynamicData": true
 *     }
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.06.000
 *
 * @eloix
 *
 * @requires  sol.common.ObjectUtils
 * @requires  sol.common.StringUtils
 * @requires  sol.common.DateUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 */
sol.define("sol.common.ix.functions.FeedComment", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */
  objId: undefined,

  /**
   * @cfg {String} file (required)
   * Resource file from 'ELOwf Base\Feed\Script Locales' (without locale extension, e.g. '_de')
   */
  file: undefined,

  /**
   * @cfg {String} key (required)
   * The property key for the message
   */
  key: undefined,

  /**
   * @cfg {String} text (required, if file and key are not set)
   * The constant text for the message if locale extension is not used
   */
  text: undefined,

  /**
   * @cfg {String[]} data
   * If the key requires additional data, this property should hold a list of group fields to hand over to the feed
   */
  data: undefined,

  /**
   * @cfg {Boolean} dynamicData
   * If `text` is given, this property defines if the property `data` contains field definitions
   */
  dynamicData: undefined,

  /**
   * @cfg {Boolean} [writeToParent=false]
   * If true then the comment will be written to the parent of the element
   */

  /**
   * @cfg {Number} [writeToObjId]
   * If set the feed for the given object used used instead.
   * This allows retrieving data from the current object and write feed actions to another object.
   */

  /**
   * @cfg {String} [userGuid]
   * If set the comment will be written under the given users name.
   * This is only allowed if executing user has administrative privileges and cannot be used if used as onEnter or onExit node.
   */

  /**
   * @param {Object} config Config
   */
  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Writes the feed comment for the element.
   */
  process: function () {
    var me = this,
        values = [],
        sord, action, dataString, feedObjId;

    if (!me.text) {
      if (!me.file) {
        throw "Parameter file is empty";
      }
      if (!me.key) {
        throw "Parameter key is empty";
      }
    }
    if (me.text) {
      if (!me.data) {
        throw "Parameter data is empty";
      }
    }
    if (me.data && me.data.length > 0) {
      if ((me.file && me.key) || (me.text && me.dynamicData)) {
        sord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbSord, LockC.NO).sord;
        me.data.forEach(function (entry) {
          var value;
          value = (me.getValue(sord, entry) || "") + "";
          values.push(value);
          me.deleteValue(sord, entry);
        });
      }
    }

    feedObjId = me.writeToObjId || me.objId;

    if (me.writeToParent) {
      sord = sord || sol.common.RepoUtils.getSord(me.objId);
      feedObjId = sord.parentId;
    }

    action = ixConnect.feedService.createAction(EActionType.AutoComment, feedObjId);
    dataString = JSON.stringify(values);

    if (me.text) {
      action.text = me.formatText(me.text, me.dynamicData ? values : me.data);
    } else {
      action.text = '{"file": "' + me.file + '", "key": "' + me.key + '", "data": ' + dataString + "}";
    }

    if (me.userGuid) {
      action.userGuid = me.userGuid;
    }

    ixConnect.feedService.checkinAction(action, ActionC.mbAll);
  },

  /**
   * @private
   * @param {String} text e.g."has created a document {0} with content {1}"
   * @param {Object} data e.g. ["Test", "xyz"]
   * @return {String} formmatted text "has created a document Test with content "xyz""
   */
  formatText: function (text, data) {
    var i;
    for (i = 0; i < data.length; i++) {
      text = text.replace(new RegExp("\\{" + i + "\\}", "g"), data[i]);
    }
    return text;
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} dataConfig
   * @return {String}
   */
  getValue: function (sord, dataConfig) {
    var me = this,
        wfMapValue, wfNodeValue, values, value;
    if (!sol.common.ObjectUtils.isObject(dataConfig)) {
      values = sol.common.SordUtils.getObjKeyValues(sord, dataConfig);
      if (!values) {
        value = "";
      } else {
        value = values.join(", ");
      }
      return value;
    }
    try {
      wfMapValue = me.getWfMapValue(dataConfig);
      wfNodeValue = me.getWfNodeValue(dataConfig);
      if (wfMapValue || wfNodeValue) {
        value = me.formatValue(wfMapValue || wfNodeValue, dataConfig);
      } else {
        values = sol.common.SordUtils.getValues(sord, dataConfig);
        values = me.formatValues(values, dataConfig);
        if (!values) {
          value = "";
        } else {
          value = values.join(", ");
        }
      }
      return value;
    } catch (ex) {
      me.logger.warn(["IllegalConfiguration: could not determine value for '{0}'", JSON.stringify(dataConfig)], ex);
    }
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} dataConfig
   */
  deleteValue: function (sord, dataConfig) {
    if (!sol.common.ObjectUtils.isObject(dataConfig) || (dataConfig.type != "FORMBLOB") || !dataConfig.deleteAfterUse) {
      return;
    }

    ixConnect.ix().deleteMap("formdata", sord.id, [dataConfig.key], LockC.NO);
  },

  /**
   * @private
   * @param {Object} dataConfig
   * @return {String}
   */
  getWfMapValue: function (dataConfig) {
    var me = this,
        flowId = (me.wFDiagram) ? me.wFDiagram.id : me.flowId,
        wfMapitems;

    if (dataConfig.type === "WFMAP" && flowId) {
      wfMapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, flowId, [dataConfig.key], LockC.NO).items;
      if (wfMapitems && wfMapitems.length > 0) {
        return wfMapitems[0].value;
      }
    }
  },

  /**
   * @private
   * @param {Object} dataConfig
   * @return {String}
   */
  getWfNodeValue: function (dataConfig) {
    var me = this,
        value;

    if (me.wFDiagram && dataConfig.type === "WFNODE" && dataConfig.node && dataConfig.key) {
      me.wFDiagram.nodes.some(function (node) {
        if ((node.nameTranslationKey == dataConfig.node) || (node.id == dataConfig.node)) {
          value = node[dataConfig.key];
          return true;
        }
      });
    }
    return value;
  },

  /**
   * @private
   * @param {String} value
   * @param {Object} dataConfig
   * @return {String}
   */
  formatValue: function (value, dataConfig) {
    var date;
    if (dataConfig) {
      if (dataConfig.dateFormat) {
        date = sol.common.DateUtils.isoToDate(value);
        value = sol.common.DateUtils.format(date, dataConfig.dateFormat);
      }
      if (value && (dataConfig.eloFormat === "hashtag" || dataConfig.eloFormat === "h")) {
        value = String(value);
        if (value.length > 40) {
          value = value.substring(0, 37) + "...";
        }
        value = "#[" + value + "]";
      }
      if (value && (dataConfig.eloFormat === "mention" || dataConfig.eloFormat === "m")) {
        value = "@[" + value + "]";
      }
    }
    return value;
  },

  /**
   * @private
   * @param {String[]} values
   * @param {Object} dataConfig
   * @return {String[]}
   */
  formatValues: function (values, dataConfig) {
    var me = this,
        i;

    if (values && values.length > 0) {
      for (i = 0; i < values.length; i++) {
        values[i] = me.formatValue(values[i], dataConfig);
      }
    }
    return values;
  }
});

/**
 * @member sol.common.ix.functions.FeedComment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_FeedComment", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;
  params.userGuid = undefined;

  params.objId = wFDiagram.objId;
  params.wFDiagram = wFDiagram;
  module = sol.create("sol.common.ix.functions.FeedComment", params);

  module.process();

  logger.exit("onEnterNode_FeedComment");
}


/**
 * @member sol.common.ix.functions.FeedComment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_FeedComment", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;
  params.userGuid = undefined;

  params.objId = wFDiagram.objId;
  params.wFDiagram = wFDiagram;
  module = sol.create("sol.common.ix.functions.FeedComment", params);

  module.process();

  logger.exit("onExitNode_FeedComment");
}


/**
 * @member sol.common.ix.functions.FeedComment
 * @method RF_sol_function_FeedComment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_FeedComment(iXSEContext, args) {
  logger.enter("RF_sol_function_FeedComment", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.common.ix.functions.FeedComment", params);

  if (params.userGuid) {
    sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, params);
  }

  module.process();

  logger.exit("RF_sol_function_FeedComment");
}
