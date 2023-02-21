
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_handlebars.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ExecUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.dev.install.Installer.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.functions.Deploy" });
/**
 * Deploys or an unploys an install package
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
 *     sol.common.IxUtils.execute("RF_sol_dev_function_Deploy", {
 *       objId: "4711"
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires  moment
 * @requires  handlebars
 * @requires  sol.common.Config
 * @requires  sol.common.Template
 * @requires  sol.common.ObjectUtils
 * @requires  sol.common.StringUtils
 * @requires  sol.common.DateUtils
 * @requires  sol.common.AsyncUtils
 * @requires  sol.common.FileUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.AclUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.AsUtils
 * @requires  sol.common.HttpUtils
 * @requires  sol.common.UserUtils
 * @requires  sol.common.SordTypeUtils
 * @requires  sol.common.UserProfile
 * @requires  sol.common.FunctionBase
 * @requires  sol.dev.install.Installer
 */
sol.define("sol.dev.ix.functions.Deploy", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Deploys or undeploys a package
   */
  process: function () {
    var me = this,
        installConfig;

    me.mode = me.mode || "undeploy";
    installConfig = me.getInstallConfig();
    if (!installConfig) {
      me.logger.debug("Install config is empty");
      return;
    }
    installConfig[me.mode] = true;
    installConfig.packageFolderId = me.objId;
    installConfig.interactive = false;
    installConfig.undeployRemove = false;

    sol.dev.install.Installer.execute(me.mode, installConfig);
  },

  getInstallConfig: function () {
    var me = this,
        installConfigRepoPath, installConfigObjId, configLoader;

    installConfigRepoPath = "ARCPATH[" + me.objId + "]:/.eloinst/install";
    installConfigObjId = sol.common.RepoUtils.getObjId(installConfigRepoPath);
    if (!installConfigObjId) {
      return;
    }
    configLoader = sol.create("sol.common.Config", { load: installConfigObjId });
    return configLoader.config;
  }
});

/**
 * @member sol.dev.ix.functions.Deploy
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, deploy;

  logger.enter("onEnterNode_Deploy", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);

  params.objId = wFDiagram.objId;
  deploy = sol.create("sol.dev.ix.functions.Deploy", params);

  deploy.process();

  logger.exit("onEnterNode_Deploy");
}


/**
 * @member sol.dev.ix.functions.Deploy
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, deploy;

  logger.enter("onExitNode_Deploy", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);

  params.objId = wFDiagram.objId;
  deploy = sol.create("sol.dev.ix.functions.Deploy", params);
  deploy.process();

  logger.exit("onExitNode_Deploy");
}


/**
 * @member sol.dev.ix.functions.Deploy
 * @method RF_sol_dev_function_Deploy
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_function_Deploy(iXSEContext, args) {
  var params, deploy;

  logger.enter("RF_sol_dev_function_Deploy", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),

  deploy = sol.create("sol.dev.ix.functions.Deploy", params);
  deploy.process();

  logger.exit("RF_sol_dev_function_Deploy");
}

