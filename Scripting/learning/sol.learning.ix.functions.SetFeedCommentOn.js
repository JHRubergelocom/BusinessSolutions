importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 *
 * @author PB, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.functions.SetFeedCommentOn", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  mixins: ["sol.common.mixins.Inject"],

  inject: {
    sord: { sordIdFromProp: "objId" }
  },

  getFeedObjectId: function () {
    var me = this,
        value = sol.common.ObjectUtils.getProp(me, me.on.path, me.on.customPropName),
        searchResult,
        feedObjectId;

    if (!!value) {
      searchResult = sol.common.IxUtils.execute("RF_sol_common_service_SordProvider",
        {
          masks: [""],
          search: [
            { key: "SOL_TYPE", value: [me.on.type] },
            { key: me.on.key, value: value }
          ],
          output: [
            {
              source: { type: "SORD", key: "id" }
            }
          ]
        }
      );
      if (!searchResult) {
        throw "SordProvider did not return search result";
      }

      feedObjectId = me.getObjectId(searchResult);
      if (!feedObjectId) {
        throw "Search result does not contain feedObjectId";
      }
      return feedObjectId;
    }
    throw "property '" + me.on.path + "' not found.";
  },

  hasObjectId: function (searchResult) {
    return searchResult
      && searchResult.sords
      && searchResult.sords[0]
      && (typeof searchResult.sords[0] === 'string' || searchResult.sords[0].objId);
  },

  getObjectId: function (searchResult) {
    var me = this;

    return me.hasObjectId(searchResult)
      ? typeof searchResult.sords[0] === 'string'
        ? searchResult.sords[0]
        : searchResult.sords[0].objId
      : null;
  },


  process: function () {
    var me = this,
        feedObjectId;

    if (!me.file) {
      throw "Parameter file is empty";
    }
    if (!me.key) {
      throw "Parameter file is empty";
    }

    if (!me.on) {
      // write feed comment on current object
      feedObjectId = me.objId;
    } else {
      if (!me.on.type) {
        throw "Parameter on.type is empty";
      }
      if (!me.on.key) {
        throw "Parameter on.key is empty";
      }
      if (!me.on.path) {
        throw "Parameter on.path is empty";
      }
      // write feed comment on provided object
      feedObjectId = me.getFeedObjectId();
    }

    feedObjectId && sol.common.IxUtils.execute(
      "RF_sol_function_FeedComment",
      {
        objId: feedObjectId,
        file: me.file,
        key: me.key
      });

    if (!feedObjectId) {
      throw "could not get feedObjectId";
    }
  }
});

/**
 * @member sol.recruiting.ix.functions.SetFeedCommentOn
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.wfOwnerName = String(wfDiagram.ownerName);
  fun = sol.create("sol.learning.ix.functions.SetFeedCommentOn", params);

  fun.process();
}

/**
 * @member sol.recruiting.ix.functions.SetFeedCommentOn
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.wfOwnerName = String(wfDiagram.ownerName);
  fun = sol.create("sol.learning.ix.functions.SetFeedCommentOn", params);

  fun.process();
}


/**
 * @member sol.learning.ix.functions
 * @method RF_sol_learning_function_SetFeedCommentOn
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_SetFeedCommentOn(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  fun = sol.create("sol.learning.ix.functions.SetFeedCommentOn", rfArgs);

  return JSON.stringify(fun.process());
}