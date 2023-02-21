
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

/**
 * Creates a sord in the chaos cabinet (0) based on a template or from scratch. Executes specified actions on the created element.
 * Returns the objId (and flowId, if a workflow has been started) of the created element if called as an RF.
 *
 * Usually, this function will be used in conjunction with {@link sol.common.ix.functions.FillSord FillSord}, which
 * can be used to fill metadata-fields of the created sord. (CreateSord can be called from within FillSord)
 *
 * ### Creating a sord using a template
 *
 * A template can be copied, resulting in a new sord.
 *
 *     {
 *       sourceElement: { objId: "ARCPATH:/path/to/my/template" }
 *     }
 *
 * Optionally, the templates permissions (acl) can be applied to the created sord:
 *
 *     {
 *       sourceElement: { objId: "ARCPATH:/path/to/my/template" },
 *       options: { copySourceAcl: true }
 *     }
 *
 * ### Creating a sord from scratch
 *
 * If no template is available, the following can be used to create a new sord from scratch
 *
 *     {
 *       sourceElement: { fromScratch: { mask: "Basic Entry", type: "sol.mytype" } }
 *     }
 *
 * ### Retrieving an objId from a service
 *
 * If the sord creation requires a more sophisticated process than a simple template-copy or `fromScratch`,
 * one can define an IX-RF-service/function which e.g. speaks to external systems and returns the objId
 * of the created sord.
 *
 *     {
 *       sourceElement: {
 *         fromService: { name: "RF_CreateSordByDate", params: { a: "x", b: "z"} }
 *       }
 *     }
 *
 *     // this service must return one of the following objects:
 *     { objId: "123456" }
 *     { fromScratch: { mask: "Basic Entry", type: undefined } } // type is optional
 *
 * ### Moving the created sord into a folder
 *
 * As a default, the sord is created in the chaos cabinet (objId 0), however, one must define
 * an objId/ARCPATH/GUID. The created sord will then be moved into this folder after creation.
 * It is possible to define "0" here, if one wants to leave the created sord in the chaos cabinet.
 *
 *     { targetFolder: { objId: "ARCPATH:/where/all/my/sords/go" } }
 *
 * ### Determining the targetFolder objId from a service
 *
 * A Service can be defined instead of specifying a fixed path/objId
 *
 *     {
 *       targetFolder: {
 *         fromService: { name: "RF_PrepareTargetFolder", params: { a: "x", b: "z"} }
 *       }
 *     }
 *
 *     // this service must return an object having an objId or id property:
 *     { objId: "123456" }
 *     { id: "123456" }
 *
 * ### Setting Permissions
 *
 * {@link sol.common.AclUtils.changeRightsInBackground Permissions} are set while copying the template or after creating the sord from scratch.
 *
 *     {
 *       onCreatedElement: {
 *         setPermissions: {
 *           users: [ { name: "MY_GROUP", rights: { r: true, w: true } } ],
 *           recursive: true,
 *           mode: "SET"
 *         }
 *       }
 *     }
 *
 * ### Starting a workflow
 *
 * A workflow can be started by defining the workflow template name and optionally a title
 *
 *     {
 *       onCreatedElement: {
 *         startWorkflow: { name: "sol.mymodule.workflow", title: "this is a workflow title" }
 *       }
 *     }
 *
 * ### Examples
 *
 * ### Sord from scratch, fixed targetFolder and a workflow
 *
 * #### Arguments
 *
 *     {
 *       sourceElement: {
 *         fromScratch: { mask: "Basic Entry", type: "sol.mytype" }
 *       },
 *       targetFolder: { objId: "ARCPATH:/my/target/folder" },
 *       onCreatedElement: {
 *         setName: "My Sord Short Description",
 *         startWorkflow: { name: "sol.mymodule.myworkflow", title: "A workflow title" }
 *       }
 *     }
 *
 * #### Return value
 *
 *     {
 *       objId: "3982",
 *       flowId: "89"
 *     }
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.AsyncUtils
 * @requires sol.common.SordTypeUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.CreateSord", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {Object} sourceElement (optional) Defines, how the new sord will be created (copy template by `objId` or create new `fromScratch`)
   * @cfg {String} sourceElement.objId objId/ARCPATH/GUID of sord to use as template (optional if `fromScratch` is defined)
   * @cfg {Object} sourceElement.fromScratch (optional) options for creating the sord from Scratch
   * @cfg {String} [sourceElement.fromScratch.mask = "Basic Entry"] (optional) mask name
   * @cfg {String} sourceElement.fromScratch.type (optional) sord type name
   * @cfg {Object} sourceElement.fromService (optional) defines a service which must return an Object containing an `objId` or `fromScratch` definition
   * @cfg {String} sourceElement.fromService.name IX-RF name
   * @cfg {Object} [sourceElement.fromService.params = {}] (optional) argument which will be passed to the defined service
   * @cfg {Object} sourceElement.options (optional) additional options used during creation of the new element
   * @cfg {Boolean} [sourceElement.options.copySourceAcl = false] (optional) copy permissions of source element (only when `sourceElement.objId` is defined)
   */

  /**
   * @cfg {Object} targetFolder (optional) Defines, where the created sord should be put
   * @cfg {String} targetFolder.objId objId/ARCPATH/GUID of folder to put created sord in
   * @cfg {String} targetFolder.path (optional) path to folder (which will may created on the fly) NOT IMPLEMENTED YET!
   * @cfg {Object} targetFolder.fromService (optional) defines a service which must return an Object containing an `objId` (or `path` not implemented yet, see above) definition
   * @cfg {String} targetFolder.fromService.name IX-RF name
   * @cfg {Object} [targetFolder.fromService.params = {}] (optional) argument which will be passed to the defined service
   */

  /**
   * @cfg {Object} onCreatedElement (optional) Defines, which actions will pe performed on the created sord
   * @cfg {String} onCreatedElement.setName (optional) sets the sords short-description
   * @cfg {Object} onCreatedElement.setOwner (optional) tries to set `sord.userId` (owner) ...
   * @cfg {Boolean} [onCreatedElement.setOwner.fromConnection = false] (optional) ... to the current connection's user
   * @cfg {String} onCreatedElement.setOwner.toUser (optional) ... to the specified user NOT IMPLEMENTED YET!
   * @cfg {Object} [onCreatedElement.setPermissions = {}] (optional) sets {@link sol.common.AclUtils.changeRightsInBackground permissions} on the created sord
   * @cfg {Object} onCreatedElement.startWorkflow (optional) starts a workflow on the created sord
   * @cfg {String} onCreatedElement.startWorkflow.name workflow template name
   * @cfg {String} [onCreatedElement.startWorkflow.title = "Workflow"] (optional) specifies the workflow-title
   * @cfg {String} onCreatedElement.startWorkflow.startMaskStandardWorkflow (optional) start workflow defined in the specified field NOT IMPLEMENTED YET!
   */

  /**
   * @private
   * @property
   *
   * References objId and flowId
   */

  _moveFct: "RF_sol_function_Move",

  createSordFromScratch: function (cfg) {
    var me = this,
        sord,
        mask = cfg.mask || "Basic Entry",
        user = (me.user && me.user.id) || me.user,
        targetObjId;

    try {
      targetObjId = me.getTargetForCreatedSord().objId;

      me.logger.debug("Trying to create sord from scratch using configuration ", [cfg, targetObjId]);

      sord = ixConnect.ix().createSord(targetObjId, mask, EditInfoC.mbSord).sord;
    } catch (e) {
      me.logger.debug("could not create sord", e);
      throw new Error("CreateSord: could not create sord in chaos cabinet. Mask not available or insufficient permissions? mask:`" + mask + "`");
    }

    sord.name = (me.onCreatedElement && me.onCreatedElement.setName) || "temp";

    if (cfg.type) {
      try {
        sord.type = sol.common.SordTypeUtils.getSordTypeId(cfg.type);
      } catch (e) {
        me.logger.debug("could not retrieve sordtype via id", e);
        throw new Error("CreateSord: could not retrieve sordtype via id `" + cfg.type + "`");
      }
    }

    if (me.onCreatedElement && me.onCreatedElement.setOwner && ((me.onCreatedElement.setOwner.fromConnection && me.user) || (me.onCreatedElement.setOwner.toUser))) {
      if (me.onCreatedElement.setOwner.toUser) {
        throw new Error("CreateSord: `onCreatedElement.setOwner.toUser` is not implemented yet. Please define `onCreatedElement.setOwner.fromConnection` instead");
      }
      if (user) {
        sord.userId = user;
      }
    }

    try {
      return String(ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO));
    } catch (e) {
      me.logger.debug("creating the sord failed during checkin", e);
      throw new Error("CreateSord: creating the sord failed during checkin. Invalid user?` user:" + cfg.user + "`");
    }
  },

  copyElement: function (cfg) {
    var me = this;
    me.logger.debug("Copy Template using configuration ", cfg);
    try {
      return sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
        objId: me.getTargetForCreatedSord().objId,
        source: String(cfg.objId),
        copySourceAcl: !!(cfg.options && cfg.options.copySourceAcl),
        inheritDestinationAcl: false,
        name: (me.onCreatedElement && me.onCreatedElement.setName) || "temp"
      });
    } catch (e) {
      me.logger.debug("could not copy template sord", e);
      throw new Error("CreateSord: could not copy template sord. Insufficient permissions for objId `" + cfg.objId + "`?");
    }
  },

  getTargetForCreatedSord: function () {
    var me = this,
        path = String(me.targetFolder.path || me.targetFolder.objId || "0"),
        preparePathConfig = {
          mask: me.targetFolder.mask,
          skipIfNotExists: false,
          returnDetails: true
        };

    return sol.common.RepoUtils.isObjId(path)
      ? { objId: path }
      : sol.common.RepoUtils.preparePath(path, preparePathConfig);
  },

  prepareSourceElement: function (src) {
    var me = this;
    if (!src) {
      throw new Error("CreateSord: `sourceElement` parameter not defined.");
    }
    if (src.objId) {
      me._createdElement.objId = String(me.copyElement(src));
    } else if (src.fromScratch) {
      me._createdElement.objId = me.createSordFromScratch(src.fromScratch, src.options);
    } else if (src.fromService && src.fromService.name) {
      try {
        me.logger.debug("sord creation fromService:", src.fromService);
        me.prepareSourceElement(sol.common.IxUtils.execute(src.fromService.name, src.fromService.params || {}));
      } catch (e) {
        me.logger.debug("sord creation fromService failed", e);
        throw new Error("CreateSord: sord creation fromService failed. Used RF:`" + src.fromService.name);
      }
    } else {
      throw new Error("Could not determine source in CreateSord. Source config must contain a property `objId`, `fromScratch` or `fromService` which defines a service returning said properties.");
    }
  },

  prepareTargetFolder: function (tgt) {
    var me = this;
    if (!tgt) {
      throw new Error("CreateSord: `targetFolder` parameter not defined.");
    }
    if (tgt.objId || tgt.id) {
      me._createdElement.targetPathId = String(tgt.objId || tgt.id);
    } else if (tgt.path) {
      if (!me.preparePath) {
        throw new Error("CreateSord: `targetFolder.path` is not implemented yet. Please define a `targetFolder.objId` instead");
      }
      me._createdElement.targetPathId = me.preparePath(String(tgt.path));
    } else if (tgt.fromService && tgt.fromService.name) {
      try {
        me.logger.debug("sord creation fromService:", tgt.fromService);
        me.prepareTargetFolder(sol.common.IxUtils.execute(tgt.fromService.name, tgt.fromService.params || {}));
      } catch (e) {
        me.logger.debug("target creation fromService failed", e);
        throw new Error("CreateSord: target creation fromService failed. Used RF:`" + tgt.fromService.name);
      }
    } else {
      throw new Error("Could not determine target folder in CreateSord. targetFolder config must contain a property `objId`, `path`, or `fromService` which defines a service returning said properties.");
    }
  },

  moveElement: function (rights) {
    var me = this,
        moveConfig = {
          objId: me._createdElement.objId,
          path: me._createdElement.targetPathId
        };

    if (rights) {
      moveConfig.rightsConfig = rights;
    }
    me.logger.debug("Moving created sord using config", moveConfig);

    try {
      sol.common.IxUtils.execute(me._moveFct, moveConfig);
    } catch (e) {
      me.logger.debug("moving the created sord failed", e);
      throw new Error("CreateSord: moving the created sord failed. Used RF:`" + me._moveFct);
    }
  },

  setElementPermissions: function (cfg) {
    var me = this;
    me.logger.debug("Setting sord permissions using config", cfg);
    sol.common.AclUtils.changeRightsInBackground(me._createdElement.objId, cfg || {});
  },

  startWorkflowOnElement: function (cfg) {
    var me = this, title = cfg.title || "Workflow";
    if (cfg.startMaskStandardWorkflow) {
      throw new Error("CreateSord: `startWorkflow.startMaskStandardWorkflow` is not implemented yet. Please define a `startWorkflow.name` instead");
    }
    me.logger.debug("Starting workflow using config", cfg);
    try {
      me._createdElement.flowId = sol.common.WfUtils.startWorkflow(cfg.name, title, me._createdElement.objId);
    } catch (e) {
      me.logger.debug("workflow start failed", e);
      throw new Error("CreateSord: starting workflow `" + cfg.name + "` on sord with objId `" + me._createdElement.objId + "` failed.`");
    }
  },

  finalizeCreatedElement: function (cfg) {
    var me = this;
    cfg = cfg || {};
    me.logger.debug("Finalizing created sord using config", cfg);
    if (me._createdElement.targetPathId !== "0") {
      me.moveElement(cfg.setPermissions);
    } else if (cfg.setPermissions) {
      me.setElementPermissions(cfg.setPermissions);
    }
    if (cfg.removePermissions) {
      cfg.removePermissions.mode = "REMOVE";
      me.setElementPermissions(cfg.removePermissions);
    }
    if (cfg.startWorkflow) {
      me.startWorkflowOnElement(cfg.startWorkflow);
    }
  },

  getServiceResult: function (element) {
    var me = this, result = { objId: element.objId };
    if (element.flowId) {
      result.flowId = String(element.flowId);
    }
    me.logger.debug("Sord has been created:", result);
    return result;
  },

  /**
   * @return {Object}
   * @return {String} return.objId objId of created sord
   * @return {String} return.flowId (optional) flowId, if a workflow has been started on the created sord
   */
  process: function () {
    var me = this;
    me._createdElement = {};

    me.logger.debug("Preparing `sourceElement`", me.sourceElement);
    me.prepareSourceElement(me.sourceElement);
    me.logger.debug("Created element so far", me._createdElement);
    me.logger.debug("Preparing `targetFolder`", me.targetFolder);
    me.prepareTargetFolder(me.targetFolder);
    me.logger.debug("Created element so far", me._createdElement);
    me.finalizeCreatedElement(me.onCreatedElement);

    return me.getServiceResult(me._createdElement);
  }
});

/**
 * @member sol.common.ix.functions.CreateSord
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var args, fun;

  args = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  args.sourceElement = args.sourceElement || { objId: wfDiagram.objId, flowId: wfDiagram.id };

  fun = sol.create("sol.common.ix.functions.CreateSord", args);

  fun.process();
}

/**
 * @member sol.common.ix.functions.CreateSord
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var args, fun;

  args = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  args.sourceElement = args.sourceElement || { objId: wfDiagram.objId, flowId: wfDiagram.id };

  fun = sol.create("sol.common.ix.functions.CreateSord", args);

  fun.process();
}


/**
 * @member sol.common.ix.functions.CreateSord
 * @method RF_sol_function_CreateSord
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_CreateSord(iXSEContext, args) {
  var rfArgs, fun, logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CreateSord" });
  logger.enter("RF_sol_function_CreateSord");

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.common.ix.functions.CreateSord", rfArgs);

  logger.exit("RF_sol_function_CreateSord");
  return JSON.stringify(fun.process());
}