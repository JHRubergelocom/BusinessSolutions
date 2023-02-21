
//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ActionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.actions.Standard" });

/**
 * An generic action to do most common tasks.
 *
 * # Prefill metadata
 * The metadata of an element can be prefilled. There are several possible configurations.
 * For the configuration the {@link #$metadata} property will be used.
 *
 * ## Special properties (always)
 *
 * - owner: The owner of the element can be set to the connection user (only used on new elements)
 * - solType: The field `SOL_TYPE` can be set to a fixed value
 *
 * ## Fixed values (always)
 * The ObjKeys of an element can always be set to fixe values by providing a `key` and a fix `value`.
 *
 * ## Copy data from a source element
 * Planned for future versions
 *
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.AsyncUtils
 * @requires sol.common.SordTypeUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.Template
 * @requires sol.common.ix.ActionBase
 */
sol.define("sol.common.ix.actions.Standard", {
  extend: "sol.common.ix.ActionBase",

  _SordZ: SordC.mbAllIndex,

  /**
   * @cfg {String} $name (optional) The name of the action (returned by {@link #getName}). If not set, the name will be 'sol.common.ix.actions.Standard'.
   */

  /**
   * @cfg {Object} $new (optional) Definition for creating a new element (see also {@link #objId}).
   * @cfg {String} $new.name (optional) Handlebars syntax.
   * @cfg {String} $new.mask (optional) If a new element is created (not from template) this mask will be used. Default will be `DocMaskC.GUID_FOLDER`.
   * @cfg {String} $new.type (optional) If a new element is created (not from template) this type will be used.
   * @cfg {Object} $new.target (optional) Default will be 'DEFAULT' mode
   * @cfg {String} $new.target.mode (optional) Supported are DEFAULT (chaos cabinet), SELECTED ({@link #objId} as target) and FIND (determine target by search)
   * @cfg {String} $new.target.params (optional) Required, if `mode=FIND` is used (for configuration see {@link sol.common.RepoUtils#getObjIdByIndex})
   * @cfg {Object} $new.template (optional) Definition for creating an element by copying a template structure.
   * @cfg {String} $new.template.objId (optional) Arcpath, objId or GUID of a template. This has priority over '$new.template.base' and '$new.template.name'.
   * @cfg {String} $new.template.base (optional) The base folder (arcpath, objId or GUID) containing the templates. If used, '$new.template.name' has to be defined.
   * @cfg {String} $new.template.name (optional) The name of a sub folder (the template) in the base folder. If used, '$new.template.base' has to be defined.
   */

  /**
   * @cfg {Object} $metadata (optional) Definition of additional metadata
   * @cfg {String} $metadata.solType (optional) The SOL_TYPE of the object
   * @cfg {Object} $metadata.owner (optional)
   * @cfg {Boolean} $metadata.owner.fromConnection (optional) Sets the elements owner to the connection user (only for new elements)
   * @cfg {Object[]} $metadata.objKeys (optional) Sets the elements ObjKeys
   * @cfg {String} $metadata.objKeys.key The ObjKeys name
   * @cfg {String} $metadata.objKeys.value The ObjKeys value
   */

  /**
   * @cfg {Object} $permissions (optional)
   * @cfg {String} $permissions.mode (optional) Supported values are "ADD", "SET" and "REMOVE". See {@link sol.common.AclUtils AclUtils} for further documentation and default.
   * @cfg {Object} $permissions.inherit (optional) If `$new.target.mode=DEFAULT` is used, this parameter will be ignored.
   * @cfg {Boolean} $permissions.inherit.fromDirectParent (optional) The parent ACL will be used. Has priority over `solutionObjectTypes`.
   * @cfg {String[]} $permissions.inherit.solutionObjectTypes (optional) Searches in hierarchy for the specified SOL_TYPES and applies those objects ACL.
   * @cfg {Boolean} [$permissions.copySource=false] (optional) Has only an effect, if a new element is created from a template. The ACL of the template will be copied.Has priority over `fromDirectParent`.
   */

  /**
   * @cfg {Object} $wf
   * @cfg {String} $wf.name (optional) Handlebars syntax supported. If not set, the sord name will be used.
   * @cfg {Object} $wf.template Defines the workflow, which should be started. Either name or key has to be defined.
   * @cfg {String} $wf.template.name (optional) The name of the workflow template which should be started. This has priority over `$wf.template.key`.
   * @cfg {String} $wf.template.key (optional) The field to read the name of the workflow template which should be started from.
   */

  /**
   * @cfg {Object[]} $events (optional)
   * @cfg {String} $events.id See {@link sol.common.IxUtils#CONST.EVENT_TYPES}. Currently supported: REFRESH, GOTO, DIALOG and FEEDBACK.
   * @cfg {String} $events.onWfStatus (optional)
   */

  /**
   * @cfg {String} objId (optional) Start the action on an existing element. If there is a {@link #$new} configuration with `target` set to `mode=SELECTD` this will be used as target.
   */

  //requiredConfig: [],

  initialize: function (config) {
    var me = this;

    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
  },

  getName: function () {
    var me = this;
    return me.$name || "sol.common.ix.actions.Standard";
  },

  /**
   *
   */
  process: function () {
    var me = this;

    me._ctx = {};  // used to carry data
    me._state = { dirty: false };  // used to track internal state

    me.initializeElement();
    me.editMetadata();
    me.saveChanges();

    me.applyPermissions();

    me.startWorkflow();

    me.addEvents();

  },

  /**
   * Creates a new element, either from scratch or by copying a template, if {@link #$new} is defined.
   * If there is no configuration for creating an element, an existing element will be used.
   * The new `objId` will be saved to the execution context (`_ctx.objId`).
   * If {@link #$new} is not defined the given objId will be used as _ctx.objId.
   */
  initializeElement: function () {
    var me = this;

    if (me.$new && me.$new.template) { // create element from template
      me._ctx.objId = me.createElementFromTemplate();
      me._state.new = true;
    } else if (me.$new) { // create new element
      me._sord = me.createElementFromScratch();
      me._state.new = true;
    } else if (me.objId) { // use existing element
      me._ctx.objId = me.objId;
      me._state.existing = true;
    } else {
      throw "IllegalArgumentException: at least an 'objId' has to be defined";
    }

  },

  /**
   * Applies changes to the elements metadata.
   */
  editMetadata: function () {
    var me = this,
        data = [];

    if (!me._sord && me._ctx.objId && me.$metadata) {
      me._sord = sol.common.RepoUtils.getSord(me._ctx.objId, { sordZ: me._SordZ });
    }

    if (me._sord && me.$metadata) {

      if (me.$metadata.owner && (me._state.new === true)) {
        if (me.$metadata.owner.fromConnection) {
          data.push({ type: "SORD", key: "ownerId", value: me.user.id });
        }
      }

      if (me.$metadata.solType) {
        data.push({ type: "GRP", key: "SOL_TYPE", value: me.$metadata.solType });
      }

      if (me.$metadata.objKeys && (me.$metadata.objKeys.length > 0)) {
        me.$metadata.objKeys.forEach(function (objKey) {
          if (objKey.key && objKey.value) {
            data.push({ type: "GRP", key: objKey.key, value: objKey.value });
          }
        });
      }

      if (me.$metadata.mapItems && (me.$metadata.mapItems.length > 0)) {
        me.$metadata.mapItems.forEach(function (mapItem) {
          if (mapItem.key && mapItem.value) {
            data.push({ type: "MAP", key: mapItem.key, value: mapItem.value });
          }
        });
      }

      if (data.length > 0) {
        me._mapitems = sol.common.SordUtils.updateSord(me._sord, data);
        me._state.dirty = true;
      }
    }
  },

  /**
   * Saves the sord changes or the new sord (indicated by the `_dirty` flag) to the database.
   */
  saveChanges: function () {
    var me = this;

    if (me._sord && me._state.dirty) {
      me._ctx.objId = ixConnect.ix().checkinSord(me._sord, me._SordZ, LockC.NO);

      if (me._mapitems) {
        ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me._sord.id, me._sord.id, me._mapitems, LockC.NO);
      }
    }

    me._sord = null;
    me._mapitems = null;
    me._state.dirty = false;
  },

  /**
   * Applies the permissions to the opbject.
   */
  applyPermissions: function () {
    var me = this,
        apply = false,
        params, modeParam, inheritParam;

    if (!me.$permissions) {
      return;
    }

    // '$permissions.copySource' is used by (and only by) 'createElementFromTemplate'

    if (me.$permissions.inherit && !me._state.chaos) {  // skip if element is in chaos cabinet
      if (me.$permissions.inherit.fromDirectParent && !me._state.permissionsAlreadyInheritedFromParent) {  // skip, if already processed by 'createElementFromTemplate'
        inheritParam = { fromDirectParent: true };
        apply = true;
      } else if (me.$permissions.inherit.solutionObjectTypes) {
        inheritParam = { solutionObjectTypes: me.$permissions.inherit.solutionObjectTypes };
        apply = true;
      }
    }

    if (me.$permissions.mode && (me.$permissions.mode == "ADD" || me.$permissions.mode == "SET" || me.$permissions.mode == "REMOVE")) {
      modeParam = me.$permissions.mode;
    }

    if (apply) {
      params = {
        mode: modeParam,
        inherit: inheritParam
      };

      me.checkAccessRights(me._ctx.objId);

      sol.common.AclUtils.changeRightsInBackground(me._ctx.objId, params);
    }
  },

  startWorkflow: function () {
    var me = this,
        wfName, flowId;

    if (!me.$wf || !me.$wf.template) {
      throw "IllegalArgumentException: a '$wf.template' has to be defined";
    }

    if (!me.$wf.template.name && !me.$wf.template.key) {
      throw "IllegalArgumentException: at least '$wf.template.name' or '$wf.template.key' has to be defined";
    }

    wfName = me.createWorkflowName();

    if (me.$wf.template.name) {
      flowId = me.$super("sol.common.ActionBase", "startWorkflow", [me._ctx.objId, me.$wf.template.name, wfName]);
    } else if (me.$wf.template.key) {
      flowId = me.startMaskStandardWorkflow(me._ctx.objId, { field: me.$wf.template.key, name: wfName });
    }

    me._ctx.flowId = flowId;
  },

  addEvents: function () {
    var me = this;

    if (me.$events && (me.$events.length > 0)) {
      me.$events.forEach(function (event) {
        var on;

        if (event.onWfStatus && me._ctx.flowId) {
          on = { type: "WF_STATUS", value: event.onWfStatus, flowId: me._ctx.flowId };
        }

        switch (event.id) {
          case sol.common.IxUtils.CONST.EVENT_TYPES.REFRESH:
            me.addRefreshEvent(me._ctx.objId, on);
            break;
          case sol.common.IxUtils.CONST.EVENT_TYPES.GOTO:
            me.addGotoIdEvent(me._ctx.objId, null, on);
            break;
          case sol.common.IxUtils.CONST.EVENT_TYPES.DIALOG:
            me.addWfDialogEvent(me._ctx.flowId, {
              objId: me._ctx.objId,
              title: me._ctx.wfName || me._ctx.name,
              dialogId: me.getName()
            }, on);
            break;
          case sol.common.IxUtils.CONST.EVENT_TYPES.FEEDBACK:
            me.addFeedbackEvent(event.message, null, null, on);
            break;
          default:
            me.logger.warn(["event type {0} is not supported", event.id]);
        }
      });
    }
  },

  createElementFromTemplate: function () {
    var me = this,
        templateId, targetId, copyACL, inheritACL, objId;

    if (me.$new.template.objId) {
      templateId = me.$new.template.objId;
    } else if (me.$new.template.base && me.$new.template.name) {
      templateId = sol.common.RepoUtils.getObjIdFromRelativePath(me.$new.template.base, "/" + me.$new.template.name);
    } else {
      throw "IllegalArgumentException: at least a '$new.template.objId' has to be defined";
    }

    targetId = me.getTargetId();

    me._state.fromTemplate = true;
    me._state.chaos = (targetId === "0");

    // force 'copyAcl' if element will be created in chaos cabinet to avoid copy error

    copyACL = (me._state.chaos || (me.$permissions && (me.$permissions.copySource === true))) ? true : false;
    inheritACL = (me._state.chaos || (me.$permissions && me.$permissions.inherit && (me.$permissions.inherit.fromDirectParent === false))) ? false : true;

    if (inheritACL) {
      me._state.permissionsAlreadyInheritedFromParent = true;
    }

    me.checkAccessRights(templateId);
    if (!me._state.chaos) {
      me.checkAccessRights(targetId, { r: true, l: true });
    }

    objId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: targetId,
      source: templateId,
      copySourceAcl: copyACL,
      inheritDestinationAcl: inheritACL,
      name: me.createElementName(),
      useQuickCopy: true,
      acl: {
        mode: "ADD",
        entries: [
          { userName: "$CURRENTUSER", rights: { r: true, w: true, d: true, e: true, l: true, p: true } }
        ]
      }
    });

    return objId;
  },

  createElementFromScratch: function () {
    var me = this,
        targetId, mask, sord, type;

    targetId = me.getTargetId();
    mask = me.getMask();

    me._state.fromScratch = true;
    me._state.chaos = (targetId === "0");

    if (!me._state.chaos) {
      me.checkAccessRights(targetId, { r: true, l: true });
    }

    sord = ixConnect.ix().createSord(targetId, mask, EditInfoC.mbSord).sord;
    sord.name = me.createElementName() || sord.guid;

    type = me.getType();
    if (type) {
      sord.type = type;
    }

    sol.common.SordUtils.addRights(sord, { users: ["$CURRENTUSER"] });

    me._state.dirty = true;

    return sord;
  },

  checkAccessRights: function (objId, rights) {
    var me = this,
        hasAccess, rightsStr, msg;

    rights = rights || { r: true };
    hasAccess = sol.common.AclUtils.hasEffectiveRights(objId, { rights: rights });
    if (!hasAccess) {
      rightsStr = ((rights.r === true) ? "R" : "") + ((rights.w === true) ? "W" : "") + ((rights.d === true) ? "D" : "") + ((rights.e === true) ? "E" : "") + ((rights.l === true) ? "L" : "") + ((rights.p === true) ? "P" : "");
      msg = "IllegalAccessException: missing permissions (" + rightsStr + ") on '" + objId + "'";
      me.logger.warn(msg);
      throw msg;
    }
  },

  createElementName: function () {
    var me = this,
        sord;
    if (!me._ctx.name) {
      if (me._ctx.objId) {
        sord = sol.common.RepoUtils.getSord(me._ctx.objId, { sordZ: SordC.mbMin });
        me._ctx.name = sord.name;
      } else if (me.$new.name) {
        me._ctx.name = sol.create("sol.common.Template", { source: me.$new.name }).apply({ date: new Date(), actionId: me.actionId });
      }
    }
    return me._ctx.name;
  },

  createWorkflowName: function () {
    var me = this;
    if (!me._ctx.wfName) {
      if (me.$wf.name) {
        me._ctx.wfName = sol.create("sol.common.Template", { source: me.$wf.name }).apply({ date: new Date(), actionId: me.actionId });
      } else {
        me._ctx.wfName = me.createElementName();
      }
    }
    return me._ctx.wfName;
  },

  getTargetId: function () {
    var me = this,
        paramsObj,
        targetId = null;

    if (me.$new && me.$new.target) {
      switch (me.$new.target.mode) {
        case "SELECTED":
          targetId = me.objId || "0";
          break;
        case "FIND":
          paramsObj = JSON.parse(me.$new.target.params);
          targetId = sol.common.RepoUtils.getObjIdByIndex(paramsObj);
          break;
        default:
          targetId = "0";
          break;
      }
    } else if (me.$new) {
      targetId = "0";
    }
    return targetId;
  },

  getMask: function () {
    var me = this;
    return (me.$new.mask) ? me.$new.mask : null;
  },

  getType: function () {
    var me = this,
        type;
    try {
      if (me.$new.type) {
        type = sol.common.SordTypeUtils.getSordTypeId(me.$new.type);
      }
    } catch (ex) {
      me.logger.warn(["could not determine sord type id for name '{0}'", me.$new.type]);
    }
    return (type) ? type : null;
  }

});


/**
 * @member sol.common.ix.actions.Standard
 * @method RF_sol_common_action_Standard
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_common_action_Standard(ec, args) {
  function getTplSord(objId) {
    try {
      if (objId) {
        return sol.common.SordUtils.getTemplateSord(ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO)).sord;
      }
    } catch (ex) {
      // ignore
      // this could be due to a 'dynamic' objId, which will be evaluated later
    }
    return { id: null };
  }
  logger.enter("RF_sol_common_action_Standard", args);
  var config, action, result,
      templatingData;

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  //remove following line as soon as $templating|$sordInTemplating is available in config-app
  config.$templating = config.$templating || {};
  config.$templating.$options = { exposeSord: true, emptyNonRenderedValues: true };
  config._$disableParamsTemplating = config._$disableParamsTemplating === undefined || config._$disableParamsTemplating; // Actionbase will skip standard templating based on this property because we take care of templating here

  templatingData = { objId: config.objId, type: config.$templating.$type, tree: config.$templating.$tree, preconditions: config.$templating.$preconditions };
  if (config.$templating.$options.exposeSord) {
    templatingData.sord = getTplSord(config.objId);
  }
  config = sol.common.TemplateUtils.render(config, templatingData, { emptyNonRendered: config.$templating.$options.emptyNonRenderedValues });

  if (config._$disableParamsTemplating === true) {
    config.$templating = undefined;
  }

  config.ci = ec.ci;
  config.user = ec.user;

  action = sol.create("sol.common.ix.actions.Standard", config);
  result = action.execute();

  logger.exit("RF_sol_common_action_Standard", result);

  return result;
}

