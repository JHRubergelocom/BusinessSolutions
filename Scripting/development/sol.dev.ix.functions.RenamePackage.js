
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.dev.ix.ActionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.functions.RenamePackage" });
/**
 * Rename Packages from templates.
 *
 * Dynamic parts are in [handlebars] (http://handlebarsjs.com/) syntax (see also {@link sol.common.Template})
 * and have access to the sord object in form of a {@link sol.common.ObjectFormatter.TemplateSord TemplateSord}.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute('RF_sol_dev_function_RenamePackage', {
 *       objId: "4711"
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 * @requires  handlebars
 * @requires  sol.common.SordUtils
 * @requires  sol.common.Map
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.ObjectFormatter
 * @requires  sol.common.Template
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.dev.ix.functions.RenamePackage", {
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
   * Moves the element to a new location.
   */
  process: function () {
    var me = this,
        sordfs, sordf, i, sordps, sordp,
        map, nameSpace, package, sordpname, replacement,
        fullNameSpace, path1, path2, obj1Id, obj2Id;

    if (!me.objId) {
      throw "sol.dev.ix.functions.RenamePackage(): Object Id must not be empty";
    }

    sol.dev.ix.ActionUtils.setLogger(me.logger);
    sol.dev.ix.ActionUtils.setObjId(me.objId);
    me.config = sol.dev.ix.ActionUtils.loadConfigDev();

    map = sol.create("sol.common.SordMap", {
      objId: me.objId
    });
    map.read();
    nameSpace = map.getValue("NAMESPACE");
    package = map.getValue("PACKAGE");

    fullNameSpace = map.getValue("FULLNAMESPACE");
    if ((!fullNameSpace) || (fullNameSpace == "")) {
      fullNameSpace = map.getValue("NAMESPACE") + "." + map.getValue("PACKAGE");
    }

    path1 = me.config.solutionFolderPath + "/" + fullNameSpace;
    path2 = me.config.customSolutionFolderPath + "/" + fullNameSpace;

    obj1Id = sol.common.RepoUtils.getObjId(path1);
    obj2Id = sol.common.RepoUtils.getObjId(path2);

    sordps = [];
    sordfs = sol.common.RepoUtils.findChildren(obj1Id, { recursive: true, level: -1, includeDocuments: true, includeFolders: true, includeReferences: true, name: "n.p.config" });
    for (i = 0; i < sordfs.length; i++) {
      sordf = sordfs[i];
      sordps.push(sordf);
    }
    sordfs = sol.common.RepoUtils.findChildren(obj2Id, { recursive: true, level: -1, includeDocuments: true, includeFolders: true, includeReferences: true, name: "n.custom.p.config" });
    for (i = 0; i < sordfs.length; i++) {
      sordf = sordfs[i];
      sordps.push(sordf);
    }
    for (i = 0; i < sordps.length; i++) {
      sordp = sordps[i];
      sordp = sol.common.RepoUtils.getSord(sordp.id);
      sordpname = sordp.name;
      replacement = nameSpace + "." + package + ".config";
      sordpname = sol.common.StringUtils.replaceAll(sordpname, "n.p.config", replacement);
      replacement = nameSpace + ".custom." + package + ".config";
      sordpname = sol.common.StringUtils.replaceAll(sordpname, "n.custom.p.config", replacement);
      sordp.name = sordpname;
      ixConnect.ix().checkinSord(sordp, SordC.mbAllIndex, LockC.NO);
    }
    me.logger.info(["rename package sords"]);
  }
});

/**
 * @member sol.dev.ix.functions.RenamePackage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_RenamePackage", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.dev.ix.functions.RenamePackage", params);

  module.process();

  logger.exit("onEnterNode_RenamePackage");
}


/**
 * @member sol.dev.ix.functions.RenamePackage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_RenamePackage", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.dev.ix.functions.RenamePackage", params);

  module.process();

  logger.exit("onExitNode_RenamePackage");
}


/**
 * @member sol.dev.ix.functions.RenamePackage
 * @method RF_sol_dev_function_RenamePackage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_function_RenamePackage(iXSEContext, args) {
  logger.enter("RF_sol_dev_function_RenamePackage", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.dev.ix.functions.RenamePackage", params);

  module.process();

  logger.exit("RF_sol_dev_function_RenamePackage");
}

