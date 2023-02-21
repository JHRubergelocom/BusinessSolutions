
//@include lib_Class.js

/**
 * Helper functions for line approval
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 *
 */
sol.define("sol.invoice.ix.LineApprovalMixin", {
  mixin: true,

  loadConfig: function () {
    var lineApprovalConfig;

    lineApprovalConfig = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.LineApproval.config" }).config || {};

    return lineApprovalConfig;
  },

  /**
   * @private
   * Contains the calculation rules.
   */
  fct: {
    EQUALS: function (currentValue, condition) {
      return (currentValue == condition.value);
    },
    GT: function (currentValue, condition) {
      return (currentValue > condition.value);
    },
    GE: function (currentValue, condition) {
      return (currentValue >= condition.value);
    },
    LT: function (currentValue, condition) {
      return (currentValue < condition.value);
    },
    LE: function (currentValue, condition) {
      return (currentValue <= condition.value);
    },
    BETWEEN: function (currentValue, condition) {
      return ((currentValue >= condition.valueStart) && (currentValue <= condition.valueEnd));
    },
    EMPTY: function (currentValue, condition) {
      return sol.common.StringUtils.isEmpty(currentValue);
    }
  },

  setApprovalIds: function () {
    var me = this,
        currentApprovalId, approvalIdKey, index;

    me.approvalData = {
      lines: {},
      approvals: {}
    };

    me.maxApprovalId = me.getMaxApprovalId();

    me.sordMapTable.reset();

    while (me.sordMapTable.hasNextRow()) {
      me.sordMapTable.nextRow();
      index = me.sordMapTable.getDisplayIndex();
      approvalIdKey = me.approvalConfig.keyName.approvalId + index;
      currentApprovalId = me.wfMap.getNumValue(approvalIdKey);
      if (!currentApprovalId) {
        me.maxApprovalId++;
        currentApprovalId = me.maxApprovalId;
        me.wfMap.setNumValue(approvalIdKey, currentApprovalId);
      }
      me.approvalData.lines[me.approvalConfig.keyName.lineNo + index] = {};
      me.approvalData.lines[me.approvalConfig.keyName.lineNo + index].approvalId = currentApprovalId;
      me.approvalData.approvals[me.approvalConfig.keyName.approvalId + currentApprovalId] = {};
      me.approvalData.approvals[me.approvalConfig.keyName.approvalId + currentApprovalId].lineNo = index;
    }
    me.wfMap.write();
  },

  getMaxApprovalId: function () {
    var me = this,
        maxApprovalId = 0,
        currentApprovalId;

    me.sordMapTable.reset();

    while (me.sordMapTable.hasNextRow()) {
      me.sordMapTable.nextRow();
      currentApprovalId = me.wfMap.getNumValue(me.approvalConfig.keyName.approvalId + me.sordMapTable.getDisplayIndex());
      if (maxApprovalId < currentApprovalId) {
        maxApprovalId = currentApprovalId;
      }
    }

    return maxApprovalId;
  },

  setLineApproved: function (wfMap, approvalId, approver) {
    var me = this,
        approvalConfig, approvedPrefix, actualApprovedPrefix, approvedTable, userName;

    if (!wfMap) {
      throw "WF map is empty";
    }

    if (!approvalId) {
      throw "Approval ID is empty";
    }

    if (!approver) {
      throw "Approver is empty";
    }

    approvalConfig = me.loadConfig();

    approvedPrefix = approvalConfig.keyName.approvalId + approvalId + "_" + approvalConfig.keyName.approvedSuffix;
    actualApprovedPrefix = approvalConfig.keyName.approvalId + approvalId + "_" + approvalConfig.keyName.actualApprovedSuffix;

    approvedTable = sol.create("sol.common.MapTable", { map: wfMap, dontRead: true, columnNames: [approvedPrefix, actualApprovedPrefix] });
    approvedTable.appendRow();
    approvedTable.setValue(approvedPrefix, approver);
    userName = ixConnect.loginResult.user.name;
    approvedTable.setValue(actualApprovedPrefix, userName);
    approvedTable.write();

    me.logger.debug(["setLineApproved: approvedPrefix={0}, approver={1}, actualApprovedPrefix={2}, userName={3}", approvedPrefix, approver, actualApprovedPrefix, userName]);
    me.logInvoiceData("setLineApproved: invoice=", wfMap.objId, wfMap.mapId);
  },

  findLineApproverNames: function (lineNo) {
    var me = this,
        lineApproverNames = [],
        approverSetName, approverSet, i, approverEntry, userName, conditionResult, user,
        approvalId;

    approverSetName = me.getApproverSet();

    approverSet = me.approvalConfig.approverSets[approverSetName];
    if (!approverSet) {
      me.logger.warn(["Line approval: Approver set not found: approverSet={0}", approverSetName]);
      return;
    }

    for (i = 0; i < approverSet.length; i++) {
      approverEntry = approverSet[i];
      conditionResult = me.checkConditions(approverEntry.conditions);
      if (conditionResult) {
        user = approverEntry.user;
        if (user.name) {
          userName = user.name;
        } else {
          if (!user) {
            me.logger.warn(["Line approval: User is empty: approverEntry={0}", approverEntry]);
          }
          userObj = sol.common.ObjectUtils.clone(user);
          if ((userObj.type == "MAP") && (userObj.key.indexOf("{i}") > -1)) {
            userObj.key = userObj.key.replace("{i}", lineNo);
          }
          userName = String(sol.common.SordUtils.getValue(me.sord, userObj) || "");
        }
        if (userName) {
          if (lineApproverNames.indexOf(userName) < 0) {
            lineApproverNames.push(userName);
          }
        }
      }
    }

    approvalId = me.approvalData.lines[me.approvalConfig.keyName.lineNo + me.sordMapTable.getDisplayIndex()].approvalId;

    me.approvalData.approvals[me.approvalConfig.keyName.approvalId + approvalId].approvers = lineApproverNames;

    return lineApproverNames;
  },

  getApproverSet: function () {
    var me = this,
        rules, i, rule, approverSet, defaultRule, defaultApproverSet;

    rules = me.approvalConfig.rules;

    for (i = 0; i < rules.length; i++) {
      rule = rules[i];
      if (rule.type == "default") {
        defaultRule = rule;
        me.logger.debug(["Default rule found: {0}", JSON.stringify(rule)]);
        continue;
      }
      approverSet = me.processRule(rule);
      if (approverSet) {
        return approverSet;
      }
    }

    defaultRule = defaultRule || {};
    defaultApproverSet = defaultRule.approverSet;

    me.logger.debug(["Use default approver set '{0}'", defaultApproverSet]);

    return defaultApproverSet;
  },

  processRule: function (rule) {
    var me = this,
        approverSetName = "",
        conditionsResult;

    if (!rule) {
      throw "Rule ist empty";
    }

    approverSetName = rule.approverSet;

    if (!approverSetName) {
      me.logger.debug(["Line approval: Approver set name is empty: rule={0}", JSON.stringify(rule)]);
    }

    me.logger.debug(["Line approval: rule={0}", JSON.stringify(rule)]);

    conditionsResult = me.checkConditions(rule.conditions);

    approverSetName = conditionsResult ? rule.approverSet : "";

    return approverSetName;
  },

  getValue: function (condition) {
    var me = this,
        key, value;

    if (condition.type == "MAP" && (condition.key.indexOf("{i}")) > -1) {
      key = condition.key.replace("{i}", "");
      value = me.sordMapTable.getValue(key);
    } else {
      value = sol.common.SordUtils.getValue(me.sord, { type: condition.type, key: condition.key });
    }

    value = value || "";

    return value;
  },

  convertToNumber: function (value) {
    if (typeof value == "undefined") {
      return;
    }
    if (sol.common.ObjectUtils.isString(value)) {
      value = value || "0";
      value = value.replace(",", ".");
      value = parseFloat(value);
    }
    return value;
  },

  checkConditions: function (conditions) {
    var me = this,
        i, condition, currentValue, conditionResult;

    if (!conditions) {
      me.logger.debug(["Line approval: Check conditions: Conditions are empty -> conditionsResult=true"]);
      return true;
    }

    for (i = 0; i < conditions.length; i++) {
      condition = conditions[i];
      currentValue = me.getValue(condition);
      if (condition.dataType == "number") {
        currentValue = me.convertToNumber(currentValue);
        condition.value = me.convertToNumber(condition.value);
        condition.startValue = me.convertToNumber(condition.startValue);
        condition.endValue = me.convertToNumber(condition.endValue);
      }

      conditionResult = me.fct[condition.relation](currentValue, condition);
      me.logger.debug(["Line approval: Check conditions: condition={0}, value={1}, conditionResult={2}", JSON.stringify(condition, currentValue, conditionResult)]);
      if (!conditionResult) {
        return false;
      }
    }

    me.logger.debug(["Line approval: Check conditions: All conditions meet -> conditionsResult=true"]);
    return true;
  },

  logInvoiceData: function (text, objId, flowId) {
    var me = this,
        sord, templateSord, json;

    if (!me.logger.debugEnabled) {
      return;
    }

    sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);

    templateSord = sol.common.ObjectFormatter.format({
      sord: {
        formatter: "sol.common.ObjectFormatter.TemplateSord",
        data: sord,
        config: {
          sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"],
          allMapFields: true,
          flowId: flowId
        }
      }
    });

    json = JSON.stringify(templateSord);
    me.logger.debug(text + json);
  }
});

