
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Blackening" });

/**
 * Imprints annotated areas for blackening into a document.
 *
 * <b>Please note</b> that if blackening should be done irreversible <b>version control must be disabled</b>.
 *
 * If a user is set in the configuration, this user will be used to determine which blackening annotations should be imprinted;
 * If no user is defined, all ACL will be removed from the blackening annotations, which lead to the result that all blackening annotations will be imprinted.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "user": "blacky",
 *       "force": true
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_ix_Blackening", {
 *       objId: "4711",
 *       user: "blacky",
 *       force: true
 *     });
 *
 * # Prerequisites
 *
 * Blackening only supports documents. If function is called from a workflow which is based on a document, nothing can be blacked.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.Blackening", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

  /** @cfg {string} user
   * if a user is set, this user will be used, to determine, which blackening annotations should be imprinted;
   * if no user is defined, all ACL will be removed from the blackening annotations -> all annotations will be imprinted
   */
  user: undefined,

  /** @cfg {Boolean} [force=false]
   * if true, the imprint will be forced, even if the object is locked
   */
  force: false,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Imprint the blackening annotations
   */
  process: function () {
    var me = this,
        lockZ, ed, blackeningConn, inputStream, data;

    lockZ = me.force ? LockC.FORCE : LockC.NO;

    if (me.user) {
      blackeningConn = ixConnectAdmin.createConnectionForUser(me.user);
    } else {
      me.removeBlackeningNoteAcl(me.objId);
      blackeningConn = ixConnectAdmin;
    }

    ed = blackeningConn.ix().checkoutDoc(me.objId, null, EditInfoC.mbSordDoc, lockZ);

    if (!me.isDocument(ed.sord)) {
      me.logger.warn("blackening can only be used on documents");
      return;
    }

    inputStream = blackeningConn.download(ed.document.docs[0].url, 0, -1);
    data = me.byteArrayFromStream(inputStream);

    ed.document = blackeningConn.ix().checkinDocBegin(ed.document);
    ed.document.docs[0].uploadResult = blackeningConn.upload(ed.document.docs[0].url, new ByteArrayInputStream(data), data.length, ed.document.docs[0].contentType);
    ed.document = blackeningConn.ix().checkinDocEnd(ed.sord, SordC.mbAll, ed.document, lockZ);

    inputStream.close();
  },

  isDocument: function (sord) {
    return sord && (sord.type >= SordC.LBT_DOCUMENT) && (sord.type <= SordC.LBT_DOCUMENT_MAX);
  },

  byteArrayFromStream: function (inputStream) {
    var baos = new ByteArrayOutputStream(),
        reads = inputStream.read(),
        data;

    while (reads != -1) {
      baos.write(reads);
      reads = inputStream.read();
    }

    data = baos.toByteArray();

    baos.close();

    return data;
  },

  removeBlackeningNoteAcl: function (objId) {
    var notes = ixConnectAdmin.ix().checkoutNotes(objId, null, NoteC.mbAll, LockC.NO),
        changed = [];

    notes.forEach(function (note) {
      if (note.type == NoteC.TYPE_ANNOTATION_MARKER) {
        note.aclItems = [];
        changed.push(note);
      }
    });

    if (changed.length > 0) {
      ixConnectAdmin.ix().checkinNotes(objId, changed, NoteC.mbAll, LockC.NO);
    }
  }
});


/**
 * @member sol.common.ix.functions.Blackening
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_Blackening", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.Blackening", params);

  module.process();

  logger.exit("onEnterNode_Blackening");
}


/**
 * @member sol.common.ix.functions.Blackening
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_Blackening", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.Blackening", params);

  module.process();

  logger.exit("onExitNode_Blackening");
}


/**
 * @member sol.common.ix.functions.Blackening
 * @method RF_sol_function_Blackening
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_Blackening(iXSEContext, args) {
  logger.enter("RF_sol_function_Blackening", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.common.ix.functions.Blackening", params);

  module.process();

  logger.exit("RF_sol_function_Blackening");
}
