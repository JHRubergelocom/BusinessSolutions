
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.functions.CreateSingleVisitor" });

/**
 * Creates a bunch of visitors from a wf list and starts the preregister wf for them
 *
 * The path is specified in the `sol.visitor.Config` file in the `visitor.pathRegistration` property.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute('RF_sol_visitor_function_CreateSingleVisitor', {
 *       objId: "4711"
 *     });
 *
 * @author AR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  handlebars
 * @requires  sol.common.SordUtils
 * @requires  sol.common.SordMap
 * @requires  sol.common.MapTable
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.visitor.ix.functions.CreateSingleVisitor", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */
  objId: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Creates a bunch of sords from the map keys of another sord - only lines with VISITOR_CHECKINVISITOR will be included
   */
  process: function () {
    var me = this,
        visitorConfig, map, table, visitorGuid, visitorMetadata, groupSord, visitorType;

    me.logger.enter("process");

    visitorConfig = sol.visitor.Utils.loadConfig();

    map = sol.create("sol.common.SordMap", { objId: me.objId });
    map.read();

    table = sol.create("sol.common.MapTable", {
      map: map,
      columnNames: [
        "VISITOR_GUID",
        "VISITOR_CHECKINVISITOR",
        "VISITOR_CHECKEDIN",
        "VISITOR_FIRSTNAME",
        "VISITOR_LASTNAME",
        "VISITOR_COMPANYNAME",
        "VISITOR_LICENSETAG",
        "VISITOR_ARRIVALTIME",
        "VISITOR_MAIL",
        "VISITOR_PHONE"
      ]
    });

    while (table.hasNextRow()) {
      table.nextRow();

      if (table.getValue("VISITOR_CHECKINVISITOR") == "1") {
        visitorGuid = table.getValue("VISITOR_GUID");
        visitorMetadata = me.getVisitorMetadata(table);

        if (visitorGuid && visitorGuid != "") {
          me.updateVisitorSord(visitorGuid, visitorMetadata);
        } else {
          groupSord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
          visitorType = sol.common.SordUtils.getObjKeyValue(groupSord, "VISITOR_SUBTYPE");

          me.logger.info(["create new visitor from visitorType={0} (basePath={1})", visitorType, visitorConfig.generators.templateFolderIds.visitorTypes]);

          visitorGuid = me.createVisitorSord(visitorMetadata, visitorType, visitorConfig.generators.templateFolderIds.visitorTypes);

          table.setValue("VISITOR_GUID", visitorGuid);
        }

        ixConnect.ix().startWorkFlow(visitorConfig.visitor.checkinSingleVisitorWF, visitorConfig.visitor.checkinSingleVisitorWFText, visitorGuid);
        table.setValue("VISITOR_CHECKEDIN", "1");
      }
    }

    table.write();

    if (me.checkInMainSord()) {
      ixConnect.ix().startWorkFlow(visitorConfig.visitor.checkinSingleVisitorWF, visitorConfig.visitor.checkinSingleVisitorWFText, me.objId);
    }

    me.logger.exit("process");
  },

  /**
   * @private
   * @return {Boolean}
   */
  checkInMainSord: function () {
    var me = this,
        checkedInCount = 0,
        sordMap, sordMapTable, value,
        totalVisitors;

    sordMap = sol.create("sol.common.SordMap", { objId: me.objId });
    sordMap.read();

    totalVisitors = sordMap.getNumValue("VISITOR_TOTALVISITORS");

    if (!totalVisitors) {
      return false;
    }

    sordMapTable = sol.create("sol.common.MapTable", { map: sordMap, columnNames: ["VISITOR_CHECKEDIN"] });
    while (sordMapTable.hasNextRow()) {
      sordMapTable.nextRow();
      value = sordMapTable.getValue("VISITOR_CHECKEDIN");
      if (value == "1") {
        checkedInCount++;
      }
    }

    if (checkedInCount >= totalVisitors) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * @private
   * @param {sol.common.MapTable} maptable
   * @return {Object[]}
   */
  getVisitorMetadata: function (maptable) {
    var columns = ["VISITOR_FIRSTNAME", "VISITOR_LASTNAME", "VISITOR_COMPANYNAME", "VISITOR_LICENSETAG", "VISITOR_ARRIVALTIME", "VISITOR_MAIL", "VISITOR_PHONE"],
        visitorMetadata = [];

    columns.forEach(function (column) {
      visitorMetadata.push({ type: "GRP", key: column, value: maptable.getValue(column) });
    });

    visitorMetadata.push({ type: "GRP", key: "SOL_TYPE", value: "VISITOR" });

    return visitorMetadata;
  },

  /**
   * @private
   * @param {Object[]} sordInfo
   * @param {String} visitorType
   * @param {String} basePath
   * @return {Number}
   */
  createVisitorSord: function (sordInfo, visitorType, basePath) {
    var me = this,
        guid, newSord, source;

    source = me.getTemplateArcPath(visitorType, basePath);

    if (!source) {
      throw "Can't find single visitor template '" + visitorType + "'";
    }

    guid = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: me.objId,
      source: source,
      copySourceAcl: false,
      inheritDestinationAcl: true,
      name: visitorType,
      asAdmin: true
    });

    newSord = ixConnect.ix().checkoutSord(guid, SordC.mbAllIndex, LockC.YES);

    if (sordInfo) {
      sol.common.SordUtils.updateSord(newSord, sordInfo);
    }

    ixConnect.ix().checkinSord(newSord, SordC.mbAllIndex, LockC.YES);

    sol.common.IxUtils.execute("RF_sol_visitor_function_GenerateVisitorReference", {
      objId: guid,
      applyIdentifier: true
    });

    return newSord.id;
  },

  /**
   * @private
   * @param {String} id
   * @param {Object[]} sordInfo
   */
  updateVisitorSord: function (id, sordInfo) {
    var updateSord = ixConnect.ix().checkoutSord(id, SordC.mbAllIndex, LockC.YES);
    if (sordInfo) {
      sol.common.SordUtils.updateSord(updateSord, sordInfo);
    }
    ixConnect.ix().checkinSord(updateSord, SordC.mbAllIndex, LockC.YES);
  },

  /**
   * @private
   * @param {String} visitorType
   * @param {String} basePath
   * @return {String}
   */
  getTemplateArcPath: function (visitorType, basePath) {
    return sol.common.RepoUtils.getObjIdFromRelativePath(basePath, "/" + visitorType);
  }
});


/**
 * @member sol.visitor.ix.functions.CreateSingleVisitor
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_CreateSingleVisitor", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.visitor.ix.functions.CreateSingleVisitor", params);
  module.process();
  logger.exit("onEnterNode_CreateSingleVisitor");
}


/**
 * @member sol.visitor.ix.functions.CreateSingleVisitor
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_CreateSingleVisitor", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.visitor.ix.functions.CreateSingleVisitor", params);
  module.process();
  logger.exit("onExitNode_CreateSingleVisitor");
}


/**
 * @member sol.visitor.ix.functions.CreateSingleVisitor
 * @method RF_sol_visitor_function_CreateSingleVisitor
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_visitor_function_CreateSingleVisitor(iXSEContext, args) {
  logger.enter("RF_sol_visitor_function_CreateSingleVisitor", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.visitor.ix.functions.CreateSingleVisitor", params);

  module.process();
  logger.exit("RF_sol_visitor_function_CreateSingleVisitor");
}

