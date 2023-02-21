importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ObjectUtils.js


sol.define("sol.meeting.ruleengine.mixins.NodeFactory", {
  singleton: true,

  classMap: {
    EQUALS: "sol.meeting.ruleengine.EqualsOperatorNode",
    NOT_EQUALS: "sol.meeting.ruleengine.NotEqualsOperatorNode",
    EXIST: "sol.meeting.ruleengine.PropertyExistNode",
    NOT_EXIST: "sol.meeting.ruleengine.PropertyNotExistNode",
    EACH: "sol.meeting.ruleengine.EachOperatorNode",
    STARTS_WITH: "sol.meeting.ruleengine.StartsWithsOperatorNode"
  },

  createPropertyPathNode: function (prop, context) {
    return sol.create("sol.meeting.ruleengine.PropertyPathNode", {
      prop: prop,
      context: context
    });
  },

  createValueNode: function (staticValue) {
    // TODO: check if staticValue is handlebar string in that case
    // we should create sol.meeting.ruleengine.HandlebarValueNode
    return sol.create("sol.meeting.ruleengine.StaticValueNode", {
      value: staticValue
    });
  },

  createEachOperator: function (children) {
    return sol.create("sol.meeting.ruleengine.EachOperatorNode", {
      children: children
    });
  },

  createOperator: function (mode, lhs, rhs) {
    var me = this;

    return sol.create(me.classMap[mode], {
      lhs: lhs,
      rhs: rhs
    });
  },

  registerOperator: function (key, className) {
    var me = this;
    // DO not override existing operators
    me.classMap[key] = me.classMap[key] || className;
  }
});

/**
 * Access Nodes
 */
sol.define("sol.meeting.ruleengine.mixins.Props", {
  mixin: true,

  initialize: function () {
    var me = this;
    me.prop = me.prepare(me.prop);
  },

  prepare: function (propKey) {
    return sol.common.ObjectUtils.isString(propKey)
      ? propKey.trim()
      : "";
  }
});
sol.define("sol.meeting.ruleengine.PropertyPathNode", {
  requiredConfig: ["prop", "context"],
  mixins: ["sol.meeting.ruleengine.mixins.Props"],

  process: function () {
    var me = this;
    return me.getProp();
  },

  getProp: function () {
    var me = this;
    return sol.common.ObjectUtils.getProp(me.context, me.prop);
  }
});

sol.define("sol.meeting.ruleengine.StaticValueNode", {
  requiredConfig: ["value"],

  process: function () {
    var me = this;
    return me.value;
  }
});

sol.define("sol.meeting.ruleengine.HandlebarValueNode", {
  requiredConfig: ["value", "context"],

  process: function () {
    var me = this,
        result;

    result = sol.common.TemplateUtils.render(me.value, me.context, me.options || {});

    me.options = null;

    return result;
  }
});

/**
 * Comparison Nodes
 */
sol.define("sol.meeting.ruleengine.PropertyExistNode", {
  requiredConfig: ["lhs"],

  process: function () {
    var me = this,
        // TODO: check child typeof Node?
        value = me.lhs.process();

    return !!value;
  }
});

sol.define("sol.meeting.ruleengine.PropertyNotExistNode", {
  requiredConfig: ["lhs"],

  process: function () {
    var me = this;
    return !me.lhs.process();
  }
});

// TODO: abstract class BinaryOperatorNode?
sol.define("sol.meeting.ruleengine.EqualsOperatorNode", {
  requiredConfig: ["lhs", "rhs"],

  process: function () {
    var me = this, lhsResult, rhsResult,
        options = me.options || {};

    lhsResult = me.lhs.process();
    rhsResult = me.rhs.process();

    if (options.strict) {
      return lhsResult === rhsResult;
    } else {
      return lhsResult == rhsResult;
    }

  }
});

sol.define("sol.meeting.ruleengine.NotEqualsOperatorNode", {
  extends: "sol.meeting.ruleengine.EqualsOperatorNode",

  process: function () {
    var me = this;

    return !me.$super("sol.meeting.ruleengine.EqualsOperatorNode", "process", []);
  }
});

sol.define("sol.meeting.ruleengine.StartsWithsOperatorNode", {
  requiredConfig: ["lhs", "rhs"],

  process: function () {
    var me = this, lhsResult, rhsResult;

    lhsResult = me.lhs.process();
    rhsResult = me.rhs.process();

    if (!lhsResult) {
      return false;
    }

    return lhsResult.indexOf(rhsResult) == 0;
  }
});

sol.define("sol.meeting.ruleengine.EachOperatorNode", {
  requiredConfig: ["children"],

  process: function () {
    var me = this,
        result;

    if (Array.isArray(me.children)) {
      result = me.children.every(function (child) {
        return child.process();
      });

      // do not cache children after use
      me.children = null;

      return result;
    } else {
      // operator is always true when no conditions passed
      return true;
    }
  }
});