importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js

/**
*
*
* @author ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.AclUtils
* @requires sol.common.Injection
* @requires sol.common.ObjectUtils
* @requires sol.common.ix.FunctionBase
* @requires sol.meeting.mixins.Configuration
* @requires sol.common.Injection
*/
sol.define("sol.meeting.ix.functions.StartWorkflow", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "id", "name", "title"],

  mixins: [
    "sol.meeting.mixins.Configuration"
  ],

  inject: {
    sord: { sordIdFromProp: "objId", optional: true },
    elementService: { prop: "elementService", template: true, optional: true }
  },

  process: function () {
    var me = this,
        elements = [];

    if (me.id) {
      elements = [{ id: me.id }];
      me.logger.debug(["start workflow on id", me.id]);
    } else if (me.elementService) {
      elements = me.performElementService(me.elementService) || [];
      me.logger.info([
        "start workflow on sords from element service: length={0} ids: {1}",
        elements.length,
        elements.map(function (element) {
          return element.id;
        })
      ]);
    } else if (me.sord) {
      elements = [me.sord];
      me.logger.info(["start workflow on sord", me.sord.id]);
    }

    return elements
      .map(function (element) {
        return me.startWorkflow(
          sol.common.TemplateUtils.render(
            {
              id: element.id,
              name: me.name,
              title: me.title
            },
            {
              sord: me.sord,
              element: element
            }
          )
        );
      });
  },


  /**
  * @private
  * TODO: refactor to mixin class `sol.common.mixins.ElementService`
  * @param {*} elementServiceCfg
  * @returns {*} elementServiceResult
  * @returns {TemplateSord[]} elementServiceResult.sords
  */
  performElementService: function (elementServiceCfg) {
    var me = this;

    if (!elementServiceCfg) {
      return null;
    }

    return me.executeElementService(
      me.sanitizeElementServiceConfig(elementServiceCfg)
    );
  },

  startWorkflow: function (template) {
    var me = this;
    me.logger.info(["starting workflow: name={0} title={1} id={2}", template.name, template.title, template.id]);
    return sol.common.WfUtils.startWorkflow(template.name, template.title, template.id);
  }
});

/**
 * @member sol.meeting.ix.functions.StartWorkflow
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(client, userId, diagram, nodeId) {
  var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.StartWorkflow" }),
      params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  logger.enter("onEnterNode_StartWorkflow", { flowId: diagram.id, nodeId: nodeId });

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.StartWorkflow", params);

  generator.process();

  logger.exit("onEnterNode_StartWorkflow");
}

/**
 * @member sol.meeting.ix.functions.StartWorkflow
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wFDiagram, nodeId) {
  var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.StartWorkflow" }),
      params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      generator;

  logger.enter("onExitNode_StartWorkflow", { flowId: wFDiagram.id, nodeId: nodeId });

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  generator = sol.create("sol.meeting.ix.functions.StartWorkflow", params);

  generator.process();

  logger.exit("onExitNode_StartWorkflow");
}

/**
* @member sol.meeting.ix.functions.StartWorkflow
* @method RF_sol_meeting_function_StartWorkflow
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_FunctionBaseName
*/
function RF_sol_meeting_function_StartWorkflow(iXSEContext, args) {
  var params,
      result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  result = sol.create("sol.meeting.ix.functions.StartWorkflow", params).process();
  return sol.common.JsonUtils.stringifyQuick(result);
}