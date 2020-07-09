
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Move" });

/**
 * Moves an archive element to a new location. Alternatively only references can be created without moving.
 *
 * The path string can contain static parts as well as dynamic parts.
 * Dynamic parts are in [handlebars] (http://handlebarsjs.com/) syntax (see also {@link sol.common.Template})
 * and have access to the sord object in form of a {@link sol.common.ObjectFormatter.TemplateSord TemplateSord}.
 *
 * Please note that handlebars does html-escaping by default if used double-curlies {{ sord.name }}. Therefore trippe-curlies should be used {{{ sord.name }}} since that prevents escaping strings.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "path": "¶Invoice¶Archive¶{{{substring sord.objKeys.INVOICE_DATE 0 4}}}¶{{{substring sord.objKeys.VENDOR_NAME 0 1}}}¶{{{sord.objKeys.VENDOR_NAME}}}",
 *       "rightsConfig": { "mode": "ADD", "inherit": true }
 *     }
 *
 *     {
 *       "path": "¶Invoice¶{{formatDate 'YYYY-MM-DD' sord.IDateIso}}"
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Move", {
 *       "objId": "4711",
 *       "path": "¶Invoice¶Archive¶{{{substring sord.objKeys.INVOICE_DATE 0 4}}}¶{{{substring sord.objKeys.VENDOR_NAME 0 1}}}¶{{{sord.objKeys.VENDOR_NAME}}}",
 *       "adjustRights": true
 *     });
 *
 * Move move object and keep reference on old location
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Move", {
 *       "objId": "4711",
 *       "path": "¶Invoice¶Archive¶{{{substring sord.objKeys.INVOICE_DATE 0 4}}}¶{{{substring sord.objKeys.VENDOR_NAME 0 1}}}¶{{{sord.objKeys.VENDOR_NAME}}}",
 *       "refOldParentId": true
 *     });
 *
 * Set multiple references without moving
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Move", {
 *       "objId": "4711",
 *       "referenceIds": ["1815", "1816", "1817"]
 *     });
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Move", {
 *       "objId": "4711",
 *       "referencePaths": ["¶Invoice¶Archive¶{{substring sord.objKeys.INVOICE_DATE 0 4}}¶{{substring sord.objKeys.VENDOR_NAME 0 1}}¶{{sord.objKeys.VENDOR_NAME}}",
 *                         "¶Invoice¶Backup¶{{substring sord.objKeys.INVOICE_DATE 0 4}}¶{{substring sord.objKeys.VENDOR_NAME 0 1}}¶{{sord.objKeys.VENDOR_NAME}}"]
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 *
 * @requires  sol.common.SordUtils
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.ObjectFormatter
 * @requires  sol.common.Template
 * @requires  sol.common.WfUtils
 * @requires  sol.common.UserUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.Map
 * @requires  sol.common.ix.FunctionBase
 */
sol.define("sol.common.ix.functions.Move", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required) ObjId, GUID or ARCPATH
   */
  objId: undefined,

  /**
   * @cfg {String} path Either `path` or `targetId` has to be defined; `targetId` has priority; exception: if there are `referenceIds` or `referencePaths` are defined, in that case the original will not be moved;
   */
  path: undefined,

  /**
   * @cfg {Boolean} deleteIfPathNotFound If set, and the path does not exists, the sord will be deleted instead of being moved. This is only possible, if the sord is in the chaos cabinet.
   */
  deleteIfPathNotFound: false,

  /**
   * @cfg {String} targetId Either `path` or `targetId` has to be defined; `targetId` has priority; exception: if there are `referenceIds` or `referencePaths` are defined, in that case the original will not be moved;
   */
  targetId: undefined,

  /**
   * @cfg {String} targetIdFromMap reads the targetId from a MAP-field. Priority: targetIdFromMap > targetId > path
   */
  targetIdFromMap: undefined,

  /**
   * @cfg {Boolean} refOldParentId If set, a reference to original position will be created after move
   */
  refOldParentId: undefined,

  /**
   * @cfg {String[]} referenceIds If set, references will be created
   */
  referenceIds: undefined,

  /**
   * @cfg {String[]} referencePaths If set, references will be created
   */
  referencePaths: undefined,

  /**
   * @cfg {Object} rightsConfig
   * Rights that will be set to the workflow object and it's children
   *
   * Example:
   *
   *     { "inherit": true, "users": ["user1"], "rights": { "r": true } }
   *
   * The ACL will be inherited from the parent object and in addition the read right for the user "user1" will be set.
   */
  rightsConfig: undefined,

  /**
   * @cfg {Boolean} adjustRights
   * If true, the rights will be inherited from the parent
   */

  /**
   * @cfg {String|Number} sordType
   * Name or ID of a sord type for the newly created elements. Fallback is the IX standard behaviour.
   */

  /**
   * @since 1.05.000
   * @cfg {Boolean} [ignoreInvalidRefPaths=false]
   * If this is `true`, there will be no error if one of the {@link #referencePaths} is invalid and the invalid paths will just be ignored.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    if (!me.targetId && !me.targetIdFromMap && !me.path && !me.refOldParentId && !me.referenceIds && !me.referencePaths) {
      me.logger.error("IllegalArgumentException: either 'targetId' or 'targetIdFromMap' or 'path' or 'refOldParentId' or 'referenceIds' or 'referencePaths' has to be defined");
      throw "IllegalArgumentException: either 'targetId' or 'targetIdFromMap' or 'path' or 'refOldParentId' or 'referenceIds' or 'referencePaths' has to be defined";
    }
  },

  /**
   * Moves the element to a new location or set references.
   */
  process: function () {
    var me = this,
        conn, sord, oldParentId, newParentId, i, refId, sordMap, mapValue,
        deleteIfPathNotFound, target;

    conn = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;

    sord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbSord, LockC.NO).sord;

    oldParentId = sord.parentId;

    deleteIfPathNotFound = (me.deleteIfPathNotFound === true) && (+(oldParentId) === 0); // only allow sords in chaos cabinet for now.

    if (me.wFDiagram) {
      me.logger.debug(["templateName={0}", me.wFDiagram.templateName]);
    }

    if (typeof me.targetIdFromMap === "string" && me.targetIdFromMap) {
      sordMap = sol.create("sol.common.SordMap", {
        objId: me.objId
      });
      sordMap.read();
      mapValue = sordMap.getValue(me.targetIdFromMap);

      if (mapValue) {
        mapValue = String(mapValue);
        if (mapValue) {
          me.targetId = mapValue;
          me.logger.info(["using targetId {0} from map-field `{1}`.", me.targetId, me.targetIdFromMap]);
        }
      }
    }

    if (me.path) {
      me.logger.debug(["path={0}", me.path]);
      if (!me.targetId) {
        target = sol.common.RepoUtils.preparePath(me.path, { data: sord, sordType: me.sordType, mask: me.mask, skipIfNotExists: deleteIfPathNotFound, returnDetails: true });
        if (target.objId) {
          me.targetId = target.objId;
          me.logger.info(["target path OK {0}.", target.path]);
        } else if (deleteIfPathNotFound && target.skipped) {
          me.logger.info(["deleteIfPathNotFound is defined. target path not found {0}. Deleting sord {1}", target.path, me.objId]);
          ixConnect.ix().deleteSord(oldParentId, me.objId, LockC.NO, (new DeleteOptions()));
          return;
        }
      }
    }
    if (!me.referenceIds && !me.referencePaths) {
      if (!me.targetId) {
        me.logger.error(["could not resolve path: {0}", me.path]);
        throw "could not resolve path: " + me.path;
      }
    }

    if (me.targetId) {
      newParentId = conn.ix().checkoutSord(me.targetId, EditInfoC.mbOnlyId, LockC.NO).sord.id; // make sure, newParentId is a number (targetId might be an arcpath)
      me.logger.info(["move sord (objId={0}, name={1}): {2} -> {3}", sord.id, sord.name, oldParentId, newParentId]);
      conn.ix().refSord(oldParentId, newParentId, sord.id, -1);

      if (me.refOldParentId) {
        conn.ix().refSord("", oldParentId, sord.id, -1);
      }
    }
    if (!me.referenceIds) {
      me.referenceIds = [];
      if (me.referencePaths instanceof Array) {
        for (i = 0; i < me.referencePaths.length; i++) {
          if (me.ignoreInvalidRefPaths !== true || me.isValidPath(me.referencePaths[i])) {
            refId = sol.common.RepoUtils.preparePath(me.referencePaths[i], { data: sord, sordType: me.sordType });
          }
          if (refId) {
            me.referenceIds.push(refId);
          }
        }
      }
    }
    for (i = 0; i < me.referenceIds.length; i++) {
      conn.ix().refSord("", me.referenceIds[i], sord.id, -1);
    }
    if ((me.rightsConfig || me.adjustRights) && (me.targetId)) {
      if (!me.rightsConfig && me.adjustRights) {
        me.rightsConfig = { mode: "SET", inherit: true };
      } else {
        me.rightsConfig = JSON.parse(JSON.stringify(me.rightsConfig));
      }
      sol.common.AclUtils.changeRightsInBackground(sord.id, me.rightsConfig);
    }
  },

  /**
   * @private
   * Checks if a Path is valid.
   * @param {String} path
   * @return {Boolean}
   */
  isValidPath: function (path) {
    var separator, regex;

    separator = path.charAt(0);
    regex = new RegExp(separator + separator + "|" + separator + "$"); // checks for duplicated separators or if the string ends with the separator

    return !regex.test(path);
  }

});


/**
 * @member sol.common.ix.functions.Move
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_Move", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.wFDiagram = wFDiagram;

  module = sol.create("sol.common.ix.functions.Move", params);
  module.process();

  logger.exit("onEnterNode_Move");
}


/**
 * @member sol.common.ix.functions.Move
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_Move", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.wFDiagram = wFDiagram;

  module = sol.create("sol.common.ix.functions.Move", params);
  module.process();

  logger.exit("onExitNode_Move");
}


/**
 * @member sol.common.ix.functions.Move
 * @method RF_sol_function_Move
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_Move(iXSEContext, args) {
  var params, module;
  logger.enter("RF_sol_function_Move", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId");
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, params);

  module = sol.create("sol.common.ix.functions.Move", params);
  module.process();

  logger.exit("RF_sol_function_Move");
}

