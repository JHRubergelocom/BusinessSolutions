
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CopyFolderContents" });

/**
 * Copies whole folder recursively.
 *
 * # As IX function call
 *
 *     sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
 *       objId: 123,
 *       source: 1233,
 *       copySourceAcl: false,
 *       inheritDestinationAcl: true
 *     });
 *
 * # Node configuration example:
 *
 *     {
 *       "source": "ARCPATH:/MyTemplates/MyTemplate1"
 *     }
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @requires  sol.Logger
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.AsyncUtils
 * @requires  sol.common.ObjectUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.CopyFolderContents", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "source"],

  /**
   * @cfg {Number} objId (required)
   * ObjectId of destination folder
   */

  /**
   * @cfg {Number} source (required)
   * ObjectId of source folder which content should be copied
   */

  /**
   * @cfg {Boolean} [copySourceAcl=false]
   * Copies the ACL of parent element when set
   */
  copySourceAcl: false,

  /**
   * @cfg {Boolean} [inheritDestinationAcl=true]
   * Inherits the ACL of the destination element when set
   */
  inheritDestinationAcl: true,

  /**
   * @cfg {Boolean} [copyOnlyWorkversion=true]
   * Copy only the work version
   */
  copyOnlyWorkversion: true,

  /**
   * @cfg {Boolean} [copyOnlyBaseElement=false]
   * Copy only the base element
   */
  copyOnlyBaseElement: false,

  /**
   * @cfg {Boolean} [copyOnlyChildrenElements=false]
   * Copy only children elements of the base element
   * This options is currently only supported if function is called in {@link #useQuickCopy} mode
   */
  copyOnlyChildrenElements: false,

  /**
   * @cfg {String} [targetMask]
   * Change the base element mask to another mask finally. When `copyOnlyChildrenElements` is
   * set to true the mask change will be performed on the already existing target sord object
   */
  targetMask: undefined,

  /**
   * @cfg {String} name
   * If set, the new elements name will set to this, instead of the sources name
   */

  /**
   * @cfg {Boolean} [useQuickCopy=false]
   * If `true` the copy process will be executed asynchronous. The first element will be created as fast as possible and the children will be copied in a background job.
   */
  useQuickCopy: false,

  /**
   * @cfg {Boolean} [useTemplate=false]
   * If `true` only `source` prop with a handlebar string will be resolved by a templateSord object
   * The passed `objId` will be checkout in this case and will act as data provider
   */
  useTemplate: false,

  /**
   * @cfg {Boolean} [waitUntilFinished=false]
   * If `true` the function is waiting until the background copy process is finished
   *
   * This property is only working in combination with {@link #useQuickCopy}=`true`
   * This has the effect that {@link #useQuickCopy} is working sychronously. Use this setting with caution, as this has
   * an impact on performance
   */
  waitUntilFinished: false,

  /**
   * @cfg {Object[]} metadata Only applied if {@link #useQuickCopy} is `true`.
   * Set additional metadata on the root element after copying the element.
   * For syntax of the see {@link sol.common.SordUtils#updateSord updateSord}.
   */

  /**
   * @cfg {Object[]} acl Only applied if {@link #useQuickCopy} is `true`.
   * @cfg {String} [acl.mode="ADD"] Supported are `SET` and `ADD`
   * @cfg {Object[]} acl.entries Definition which ACL should be set/added
   * @cfg {String} acl.entries.userId Either userId or userName has to be defined
   * @cfg {String} acl.entries.userName Either userId or userName has to be defined. `userName` can be "$CURRENTUSER" to use the current user.
   * @cfg {String} [acl.entries.type="USER"] Defines if the ACL item is for a user or a group (`USER` or `GROUP`).
   * @cfg {Object} acl.entries.rights Definition of access
   * Change access in addition to `copySourceAcl` and `inheritDestinationAcl`.
   */

  /**
   * @private
   * @cfg {Number} [sleepTime=200]
   * The time in ms to recheck, if the process has finished.
   * For longer running copy processes this value can be increased to reduce the number of polling requests.
   * Not used when `useQuickCopy = true`.
   */


  initialize: function (config) {
    var me = this;

    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.sleepTime = (sol.common.ObjectUtils.isNumber(config.sleepTime)) ? config.sleepTime : 200;
  },

  /**
   * Copies whole folder recursively.
   * @returns {String} The objId of the copied folder
   */
  process: function () {
    var me = this, resolvedSource = me.source,
        ixConn, newObjId;

    me.checkSource(resolvedSource);
    ixConn = (me.asAdmin === true) ? ixConnectAdmin : ixConnect;

    if (!sol.common.RepoUtils.isObjId(me.source)) {
      // resolve handlebars if necessary
      me.useTemplate && (resolvedSource = me.resolveTemplate(me.source));
      me.checkSource(resolvedSource);
      me.source = sol.common.RepoUtils.getObjId(resolvedSource, { resolveGuid: true });
    }

    if (!sol.common.RepoUtils.isObjId(me.objId)) {
      me.objId = sol.common.RepoUtils.getObjId(me.objId, { resolveGuid: true });
    }

    me.logger.info(["CopyFolderContents: source={0}, newParent={1}", me.source, me.objId]);

    if (me.useQuickCopy === true) {
      newObjId = me.executeQuickCopy(ixConn);
    } else {
      me.logger.debug("Use old synchronous copy process.");
      newObjId = me.executeBackgroundCopy(ixConn, [me.source], me.objId, me.name, true);
    }

    // change mask of the root object
    if (me.targetMask && newObjId) {
       me.changeBaseElementMask(newObjId, ixConn);
    }

    return newObjId;
  },

  checkSource: function (source) {
      var str = String(source);
      if (str.trim() === "") {
          throw Error("InvalidArgument: 'source' parameter can not be empty");
      }
  },

  resolveTemplate: function (source) {
    var me = this,
      templateSord = me.provideTemplateSord();
    return sol.create("sol.common.Template", { source: source }).apply(templateSord);
  },

  provideTemplateSord: function () {
    var me = this;
    return sol.common.SordUtils.getTemplateSord(me.getSord(me.objId));
  },

  getSord: function (objId) {
    return sol.common.RepoUtils.getSord(objId);
  },

  /**
   * @param {objId} newObjId
   * @param {de.elo.ix.client.IXConnection} ixConnection current ixConnection
   * @private
   */
  changeBaseElementMask: function (newObjId, ixConnection) {
    var me = this, rootSord, changedSord;

    if (sol.common.SordUtils.docMaskExists(me.targetMask)) {
      me.logger.info(["switch mask of objId={0} to {1}", newObjId, me.targetMask]);
      rootSord = sol.common.RepoUtils.getSord(newObjId, { sordZ: SordC.mbLean });
      changedSord = sol.common.SordUtils.changeMask(rootSord, me.targetMask, ixConnection);
      ixConnect.ix().checkinSord(changedSord, SordC.mbLean, LockC.NO);
    } else {
      me.logger.warn(["mask {1} doesn't exist", me.targetMask]);
    }
  },

  executeQuickCopy: function (ixConn) {
    var me = this,
        sordProperties, detailProperties, srcSord, newSord, newAclItems, currentIxVersion,
        additionalMapItems, mapItems, blobItems, children, childrenIds;

    sordProperties = ["name", "desc", "kind", "objKeys", "type", "aclItems"];
    detailProperties = ["sortOrder"];

    srcSord = ixConn.ix().checkoutSord(me.source, SordC.mbAllIndex, LockC.NO);

    if (sol.common.SordUtils.isDocument(srcSord)) {
      me.logger.debug("Use old synchronous copy process for documents.");
      return me.executeBackgroundCopy(ixConn, [me.source], me.objId, me.name, true);
    }

    // when copyOnlyChildrenElements is true then checkout already existing sord object
    // each option will be ignored regarding the base element
    if (!me.copyOnlyChildrenElements) {
      newSord = sol.common.SordUtils.cloneSord(srcSord, {
        dstParentId: me.objId,
        memberNames: sordProperties,
        detailMemberNames: detailProperties,
        inheritDestinationAcl: me.inheritDestinationAcl,
        conn: ixConn
      });

      if (me.name) {
        newSord.name = me.name;
      }

      if (me.acl && me.acl.entries && (me.acl.entries.length > 0)) {
        newAclItems = (me.acl.mode == "SET") ? [] : Array.prototype.slice.call(newSord.aclItems);

        me.acl.entries.forEach(function (aclEntry) {
          var accessCode, userId, userName, type;

          accessCode = sol.common.AclUtils.createAccessCode(aclEntry.rights);
          userId = (typeof aclEntry.userId !== "undefined") ? aclEntry.userId : "";
          userName = (typeof aclEntry.userName !== "undefined") ? aclEntry.userName : "";
          type = (aclEntry.type == "GROUP") ? AclItemC.TYPE_GROUP : AclItemC.TYPE_USER;

          if (userName == "$CURRENTUSER") {
            userName = String(ixConnect.loginResult.user.name);
          }

          newAclItems.push(new AclItem(accessCode, userId, userName, type));
        });

        newSord.aclItems = newAclItems;
      }

      if (me.metadata && (me.metadata.length > 0)) {
        additionalMapItems = sol.common.SordUtils.updateSord(newSord, me.metadata);
      }

      ixConn.ix().checkinSord(newSord, SordC.mbAllIndex, LockC.NO);

      mapItems = ixConn.ix().checkoutMap(MapDomainC.DOMAIN_SORD, srcSord.id, null, LockC.NO).items || [];
      if (additionalMapItems) {
        mapItems = mapItems.concat(additionalMapItems);
      }

      if (mapItems.length > 0) {
        ixConn.ix().checkinMap(MapDomainC.DOMAIN_SORD, newSord.id, newSord.id, mapItems, LockC.NO);
      }

      try {
        currentIxVersion = ixConnect.version;
      } catch (_) {
        currentIxVersion = "10.00.000";
      }

      if ((blobItems = ixConn.ix().checkoutMap("formdata", srcSord.id, null, LockC.NO).items || []).length) {
        if (!sol.common.RepoUtils.checkVersion(currentIxVersion, "11.00.000")) {
          blobItems = [].slice.call(blobItems).map(me.cloneBlobItem);
        }
        ixConn.ix().checkinMap("formdata", newSord.id, newSord.id, blobItems, LockC.NO);
      }
    } else {
      // newSord is here the target sord object
      // we only need the sord id for the background job
      newSord = sol.common.RepoUtils.getSord(me.objId, { sordZ: SordC.mbOnlyId, connection: ixConn });
    }


    children = sol.common.RepoUtils.findChildren(srcSord.id, {
      includeFolders: true,
      includeDocuments: true,
      includeReferences: true,
      sordZ: SordC.mbMin
    }, ixConn);

    if (children && (children.length > 0)) {
      childrenIds = children.map(function (child) {
        return String(child.id);
      });

      me.copySourceAcl = (me.copySourceAcl !== undefined) ? me.copySourceAcl : false;
      me.inheritDestinationAcl = (me.inheritDestinationAcl === undefined) ? true : me.inheritDestinationAcl;

      me.logger.debug(["waitUntilFinished {0}", me.waitUntilFinished]);
      // client has the ability to decide whether {@link #useQuickCopy} works async or synchronized
      me.executeBackgroundCopy(ixConn, childrenIds, newSord.id, null, me.waitUntilFinished);
    }

    return newSord.id;
  },

  cloneBlobItem: function (item) {
    var blob, stream;

    blob = Packages.org.apache.commons.io.IOUtils.toString(
        stream = item.getBlobValue().getStream(),
        java.nio.charset.StandardCharsets.UTF_8
      )
      .getBytes(java.nio.charset.StandardCharsets.UTF_8);
    stream.close();

    return new MapValue(item.key, new FileData("text/plain", blob));
  },

  executeBackgroundCopy: function (ixConn, startIds, parentId, name, wait) {
    var me = this,
        dstObjId = null,
        navInfo, procInfo, jobState;

    navInfo = new NavigationInfo();
    navInfo.startIDs = startIds;

    procInfo = new ProcessInfo();
    procInfo.desc = "sol.common.ix.functions.CopyFolderContents";
    procInfo.errorMode = ProcessInfoC.ERRORMODE_CRITICAL_ONLY;

    procInfo.procCopyElements = new ProcessCopyElements();
    procInfo.procCopyElements.copyOptions = new CopyOptions();
    if (me.name) {
      procInfo.procCopyElements.copyOptions.targetName = name;
    }

    if (me.copyOnlyWorkversion) {
      procInfo.procCopyElements.copyOptions.copyOnlyWorkversion = true;
    }

    if (me.copyOnlyBaseElement) {
      procInfo.procCopyElements.copyOptions.copyOnlyBaseElement = true;
    } else {
      procInfo.procCopyElements.copyOptions.copyStructuresAndDocuments = true;
    }

    procInfo.procCopyElements.copyOptions.newParentId = parentId;
    procInfo.procCopyElements.createMapping = wait;

    // Set permissions
    if (me.copySourceAcl != me.inheritDestinationAcl) {
      if (me.copySourceAcl) {
        procInfo.procCopyElements.copyOptions.keepOriginalPermissions = true;
      }
      if (me.inheritDestinationAcl) {
        procInfo.procCopyElements.copyOptions.takeTargetPermissions = true;
      }
    }

    me.logger.debug(["start copy process: startIds={0}, parentId={1}", startIds, parentId]);
    jobState = ixConn.ix().processTrees(navInfo, procInfo);

    if (wait) {
      me.logger.info(["wait for job: startIds={0}, parentId={1}", startIds, parentId]);
      jobState = sol.common.AsyncUtils.waitForJob(jobState.getJobGuid(), { connection: ixConn, interval: me.sleepTime });
      dstObjId = jobState.procInfo.procCopyElements.copyResult.mapIdsSource2Copy.get(new java.lang.Integer(me.source));
    }

    return dstObjId;
  }

});

/**
 * @member sol.common.ix.functions.CopyFolderContents
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_sol.common.ix.functions.CopyFolderContents", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;

  module = sol.create("sol.common.ix.functions.CopyFolderContents", params);
  module.process();

  logger.exit("onEnterNode_sol.common.ix.functions.CopyFolderContents");
}

/**
 * @member sol.common.ix.functions.CopyFolderContents
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_sol.common.ix.functions.CopyFolderContents", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;

  module = sol.create("sol.common.ix.functions.CopyFolderContents", params);
  module.process();

  logger.exit("onExitNode_sol.common.ix.functions.CopyFolderContents");
}

/**
 * @member sol.common.ix.functions.CopyFolderContents
 * @method RF_sol_function_CopyFolderContents
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_CopyFolderContents(iXSEContext, args) {
  var params, module, objId;
  logger.enter("RF_sol_function_CopyFolderContents", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "source", "copySourceAcl", "inheritDestinationAcl");

  try {
    sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, params);
  } catch (e) {
    params.asAdmin = false;
  }

  module = sol.create("sol.common.ix.functions.CopyFolderContents", params);
  objId = module.process();
  logger.exit("RF_sol_function_CopyFolderContents");
  return sol.common.JsonUtils.stringifyAll(objId);
}
