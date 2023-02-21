
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.meeting.ix.RuleEngineNode.js

/**
 * 
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 */
sol.define("sol.meeting.ix.RuleEngineJsonParser", {
  requiredConfig: ["conditions", "context"],

  NodeFactory: sol.meeting.ruleengine.mixins.NodeFactory,

  parse: function () {
     var me = this, expressions,
      NodeFactory = sol.meeting.ruleengine.mixins.NodeFactory;

     if (Array.isArray(me.conditions.searchParams)) {
        expressions = me.conditions.searchParams.map(function (param) {
          me.logger.info(["param {0}", JSON.stringify(param)]);
          return me.createExpression(param);
        });

        return NodeFactory.createEachOperator(expressions);
     } else {
       throw Error("searchParams must be an array in json params");
     }
  },

  createExpression: function (param) {
    // lhs = left hand side, left node
    // rhs = right hand side, right node
    var me = this, operator, lhs, rhs,
      NodeFactory = sol.meeting.ruleengine.mixins.NodeFactory;

    if (param.prop && param.mode) {
      lhs = NodeFactory.createPropertyPathNode(param.prop, me.context);

      if (param.value) {
        rhs = NodeFactory.createValueNode(param.value);
      }

      // rhs is undefined in case of operator with only lhs
      operator = NodeFactory.createOperator(param.mode, lhs, rhs);
    };
    // TODO create node regex expression
    return operator;
  }

});