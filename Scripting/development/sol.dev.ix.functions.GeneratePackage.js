
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.dev.ix.ActionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.functions.GeneratePackage" });
/**
 * Generate Packages from templates.
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
 *     sol.common.IxUtils.execute('RF_sol_dev_function_GeneratePackage', {
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
 * @requires  sol.common.IxUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.dev.ix.functions.GeneratePackage", {
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
        solId, sordfs, sordf, i, sordps, sordp, j,
        tempconf, map, objSord, tempSord,
        folder, mode, type, wftemplate, references;

    if (!me.objId) {
      throw "sol.dev.ix.functions.GeneratePackage(): Object Id must not be empty";
    }
    me.config = sol.dev.ix.ActionUtils.loadConfigDev();
    if (sol.dev.ix.ActionUtils.existPathFullNameSpace(me.objId)) {
      return;
    }

    sol.dev.ix.ActionUtils.setLogger(me.logger);
    sol.dev.ix.ActionUtils.setObjId(me.objId);
    tempconf = sol.dev.ix.ActionUtils.loadTemplateConfig(me.objId);

    if (tempconf.mapfields) {
      map = sol.create("sol.common.SordMap", {
        objId: me.objId
      });
      map.read();
      for (i = 0; i < tempconf.mapfields.length; i++) {
        map.setValue(tempconf.mapfields[i].key, tempconf.mapfields[i].value);
      }
      map.write();
    }
    objSord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbAll, LockC.NO).sord;
    tempSord = sol.common.SordUtils.getTemplateSord(objSord);

    if (tempconf.jobs) {
      for (i = 0; i < tempconf.jobs.length; i++) {
        folder = tempconf.jobs[i].folder;
        mode = tempconf.jobs[i].mode;
        type = tempconf.jobs[i].type;
        wftemplate = tempconf.jobs[i].wftemplate;
        references = tempconf.jobs[i].references;
        if (folder) {
          sol.dev.ix.ActionUtils.generateEntry(me.objId, tempSord, folder, mode, type, references);
          me.logger.info(["generate package folder {0} sord (objId={1}): ", folder, me.objId]);
        }
        if (wftemplate) {
          sol.dev.ix.ActionUtils.generateWfTemplate(tempSord, wftemplate, type);
          me.logger.info(["generate wftemplate {0}): ", wftemplate]);
        }
      }
    }

    sordfs = sol.common.RepoUtils.findChildren(me.objId, { recursive: false, level: 1, includeDocuments: false, includeFolders: true, includeReferences: false });
    for (i = 0; i < sordfs.length; i++) {
      sordf = sordfs[i];

      // Move Business Solutions
      if (sordf.name == "Business Solutions") {
        sordps = sol.common.RepoUtils.findChildren(sordf.id, { recursive: false, level: 1, includeDocuments: false, includeFolders: true, includeReferences: false });
        for (j = 0; j < sordps.length; j++) {
          sordp = sordps[j];
          solId = sol.common.RepoUtils.preparePath(me.config.solutionFolderPath);
          sol.dev.ix.ActionUtils.moveSord(sordp.id, solId);
        }
      }
     // Move Business Solutions Custom
      if (sordf.name == "Business Solutions Custom") {
        sordps = sol.common.RepoUtils.findChildren(sordf.id, { recursive: false, level: 1, includeDocuments: false, includeFolders: true, includeReferences: false });
        for (j = 0; j < sordps.length; j++) {
          sordp = sordps[j];
          solId = sol.common.RepoUtils.preparePath(me.config.customSolutionFolderPath);
          sol.dev.ix.ActionUtils.moveSord(sordp.id, solId);
        }
      }
    }
    sol.dev.ix.ActionUtils.moveSord(me.objId, "0");
    me.logger.info(["generate package sord (objId={0}, name={1}): {2} -> {3}", me.objId]);

    sol.common.IxUtils.execute("RF_sol_dev_function_RenamePackage", { objId: me.objId });
    me.logger.info(["rename package sord (objId={0}", me.objId]);
  }
});

/**
 * @member sol.dev.ix.functions.GeneratePackage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GeneratePackage", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.dev.ix.functions.GeneratePackage", params);

  module.process();

  logger.exit("onEnterNode_GeneratePackage");
}


/**
 * @member sol.dev.ix.functions.GeneratePackage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GeneratePackage", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.dev.ix.functions.GeneratePackage", params);

  module.process();

  logger.exit("onExitNode_GeneratePackage");
}


/**
 * @member sol.dev.ix.functions.GeneratePackage
 * @method RF_sol_dev_function_GeneratePackage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_function_GeneratePackage(iXSEContext, args) {
  logger.enter("RF_sol_dev_function_GeneratePackage", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.dev.ix.functions.GeneratePackage", params);

  module.process();

  logger.exit("RF_sol_dev_function_GeneratePackage");
}

