
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Creates a enrollment based on the passed templateSord or by defining user, course and optionally a status.
 * Returns the created enrollment's objId.
 *
 * Only objKeys can be set using the sordMetadata variant!
 *
 * ### Example
 *
 * #### Arguments
 *     {
 *       "sordMetadata": {
 *         "objKeys": {
 *           "COURSE_REFERENCE": "1234",
 *           "COURSE_ENROLLMENT_USER": "Bodo Kraft",
 *           "COURSE_ENROLLMENT_STATUS": "Bodo Kraft"
 *         }
 *       }
 *     }
 *
 * #### Returns
 *
 *     { code: "success", data: { objId: "12345", flowId: "33" }, info: "Enrollment created successfully" }
 *
 * @author ESt, ELO Digital Office GmbH
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
sol.define("sol.learning.ix.functions.CreateEnrollmentHeadless", {
  extend: "sol.common.ix.FunctionBase",

  _optimize: {},

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _newSordDef: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.newSordDef" }, // { mask: "Course enrollment", type: "sol.courseEnrollment" }
    _standardWorkflow: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.standardWorkflow" }, // ""
    _workflowMessage: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.workflowMessage", template: true }, // ""
    _userField: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.userField" }, // ""
    _courseReferenceField: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.courseReferenceField" }, // ""
    _enrollmentStatusField: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.enrollmentStatusField" }, // ""
    _GRPFieldsFromUser: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.GRPFieldsFromUser" }, // [""]
    _enrollment: { config: "learning", prop: "entities.enrollment.actions.createheadless.findEnrollment" } // {}
  },

  determineCriterion: function (param, key, desc, throws) {
    var me = this, criterionMapping, criterion;
    if (me[param]) {
      criterion = me[param];
    } else if (me.sordMetadata && me.sordMetadata.objKeys) {
      criterion = me.sordMetadata.objKeys[key];
    } else if (me.metadataMapping) {
      me.metadataMapping
        .some(function (mapping) {
          return (mapping.target && (mapping.target.id === key)) && (criterionMapping = mapping);
        });
      if (criterionMapping) {
        criterion = criterionMapping.target.value;
      }
    }

    if (throws && !criterion) {
      throw "Call did not contain a " + desc + "! (`" + param + "` paramenter)";
    }

    return criterion;
  },

  addUserData: function (metaData, userName, fields) {
    var sord;
    try {
      sord = sol.common.UserUtils.getUserFolder(userName);
    } catch (e) {
      throw "getUserData: user folder for `" + userName + "` does not exist" + e;
    }
    if (fields && fields.length) {
      [].slice.call(sord.objKeys)
        .forEach(function (objKey) {
          var key = String(objKey.name), value = String(objKey.data[0] || "");
          ~fields.indexOf(key) && metaData.push({ type: "GRP", key: key, value: value });
        });
    }
  },

  createEnrollmentFromScratch: function (cfg, user, metaData) {
    var me = this, sord;
    me.logger.debug("Trying to create enrollment from scratch using configuration ", cfg);

    sord = me.createSord(cfg.mask);
    me.setSordType(sord, cfg.type);
    me.setMetaData(sord, metaData);
    me.setOwner(sord, user);
    return me.persist(sord);
  },

  createSord: function (mask) {
    var me = this;
    try {
      return ixConnectAdmin.ix().createSord("0", mask, EditInfoC.mbSord).sord;
    } catch (e) {
      me.logger.debug("could not create enrollment sord", e);
      throw "CreateEnrollmentHeadless: could not create sord in chaos cabinet. Mask not available or insufficient permissions? mask:`" + mask + "`";
    }
  },

  setSordType: function (sord, type) {
    var me = this;
    if (type) {
      try {
        sord.type = sol.common.SordTypeUtils.getSordTypeId(type);
      } catch (e) {
        me.logger.debug("could not retrieve sordtype via id", e);
        throw "CreateEnrollmentHeadless: could not retrieve sordtype via id `" + type + "`";
      }
    }
  },

  persist: function (sord) {
    var me = this;
    try {
      return String(ixConnectAdmin.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO));
    } catch (e) {
      me.logger.debug("creating the sord failed during checkin", e);
      throw "CreateEnrollmentHeadless: creating the sord failed during checkin.";
    }
  },

  setOwner: function (sord, user) {
    if (user) {
      sord.ownerId = sol.common.UserUtils.getUserInfo(user).id;
    }
  },

  setMetaData: function (sord, metaData) {
    metaData.forEach(function (entry) {
      sol.common.SordUtils.setObjKeyValue(sord, entry.key, entry.value);
    });
  },

  prepareMetaData: function (criteria) {
    var me = this, metaData;
    metaData = Object.keys(criteria)
      .map(function (key) {
        return { type: "GRP", key: key, value: criteria[key] };
      });

    me.addUserData(metaData, criteria[me._userField], me._GRPFieldsFromUser);
    return metaData;
  },

  getEnrollment: function (user, course) {
    var me = this;

    me._enrollment.search.push(
      { key: me._userField, value: user },
      { key: me._courseReferenceField, value: course }
    );

    return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._enrollment, me._optimize, "findExistingEnrollment", ["output"]).sords[0];
  },

  process: function () {
    var me = this, enrollmentId, user, course, metaData, throws = true;

    user = me.determineCriterion("user", me._userField, "user name", throws);
    course = me.determineCriterion("course", me._courseReferenceField, "course reference", throws);

    enrollmentId = me.getEnrollment(user, course);

    if (enrollmentId) { //enrollment already exists
      return { code: "duplicate", data: { objId: enrollmentId }, info: "Enrollment not created: already existed." };
    }

    metaData = me.prepareMetaData({
      COURSE_ENROLLMENT_USER: user,
      COURSE_REFERENCE: course,
      COURSE_ENROLLMENT_STATUS: me.determineCriterion("status", me._enrollmentStatusField, "status") || "ENROLLED"
    });

    enrollmentId = me.createEnrollmentFromScratch(me._newSordDef, user, metaData);

    sol.common.WfUtils.startWorkflow(me._standardWorkflow, me._workflowMessage, enrollmentId);

    return { code: "success", data: { objId: enrollmentId }, info: "Enrollment created successfully" };
  }
});

/**
 * @member sol.learning.ix.functions.CreateEnrollmentHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.functions.CreateEnrollmentHeadless", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.CreateEnrollmentHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.learning.ix.functions.CreateEnrollmentHeadless", params);

  fun.process();
}


/**
 * @member sol.learning.ix.functions.CreateEnrollmentHeadless
 * @method RF_sol_learning_function_CreateEnrollmentHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_CreateEnrollmentHeadless(iXSEContext, args) {
  var rfArgs, fun, logger = sol.create("sol.Logger", { scope: "sol.learning.ix.functions.CreateEnrollmentHeadless" });
  logger.enter("RF_sol_learning_function_CreateEnrollmentHeadless");

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  fun = sol.create("sol.learning.ix.functions.CreateEnrollmentHeadless", rfArgs);

  logger.exit("RF_sol_learning_function_CreateEnrollmentHeadless");
  return JSON.stringify(fun.process());
}

/**
 * @member sol.learning.ix.functions.CreateEnrollmentHeadlessStrict
 * @method RF_sol_learning_function_CreateEnrollmentHeadlessStrict
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_CreateEnrollmentHeadlessStrict(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  rfArgs.user = ixConnect.loginResult.user.name;

  fun = sol.create("sol.learning.ix.functions.CreateEnrollmentHeadless", rfArgs);

  return JSON.stringify(fun.process());
}
