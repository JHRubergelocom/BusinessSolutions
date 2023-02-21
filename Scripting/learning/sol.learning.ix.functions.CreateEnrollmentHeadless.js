
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_moment.js
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
 * @requires sol.common.WfUtils
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
    _sessionReferenceField: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.sessionReferenceField" }, // ""
    _enrollmentStatusField: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.enrollmentStatusField" }, // ""
    _GRPFieldsFromUser: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.GRPFieldsFromUser" }, // [""]
    _GetMailFromUserUtils: { config: "learning", prop: "entities.enrollment.actions.createheadless.const.getMailFromUserUtils" }, // [""]
    _enrollment: { config: "learning", prop: "entities.enrollment.actions.createheadless.findEnrollment" }, // {}
    _course: { config: "learning", prop: "entities.enrollment.actions.createheadless.findCourse" }, // {}
    _sessionEnrollments: { config: "learning", prop: "entities.enrollment.actions.createheadless.findSessionEnrollments" }, // {}
    _session: { config: "learning", prop: "entities.enrollment.actions.createheadless.findSession" } // {}
  },

  determineCriterion: function (param, key, desc, throws) {
    var me = this, criterionMapping, criterion;
    if (me[param]) {
      criterion = me[param];
    } else if (me.sordMetadata && (me.sordMetadata.objKeys || me.sordMetadata.objKeys)) {
      if (me.sordMetadata.objKeys) {
        criterion = me.sordMetadata.objKeys[key];
      } else if (me.sordMetadata.mapKeys) {
        criterion = me.sordMetadata.objKeys[key];
      }
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

  addUserData: function (metaData, userName, fields, shouldGetMailFromUserUtils) {
    var sord,
        mailAddress,
        mailEntry;
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
    if (shouldGetMailFromUserUtils) {
      mailAddress = sol.common.UserUtils.getMailAddress(userName);
      if (mailAddress) {
        mailEntry = metaData.filter(function (entry) {
          return entry.key == "ELOMAILADDRESS";
        })[0];
        if (mailEntry) {
          mailEntry.value = mailAddress;
        } else {
          metaData.push({ type: "GRP", key: "ELOMAILADDRESS", value: mailAddress });
        }
      }
    }
  },

  createEnrollmentFromScratch: function (cfg, user, entries) {
    var me = this,
        sord;
    me.logger.debug("Trying to create enrollment from scratch using configuration ", cfg);

    sord = me.createSord(cfg.mask);
    me.setSordType(sord, cfg.type);
    me.setObjKeyEntries(sord, entries);
    me.setOwner(sord, user);

    return me.persist(sord, entries);
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

  persist: function (sord, entries) {
    var me = this,
        enrollmentId;
    try {
      enrollmentId = String(ixConnectAdmin.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO));

      me.setMapEntries(enrollmentId, me.getMapEntries(entries));

      return enrollmentId;
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

  setObjKeyEntries: function (sord, entries) {
    var me = this;

    me.getObjKeyEntries(entries)
      .forEach(me.setObjKeys.bind(me, sord));
  },

  getObjKeyEntries: function (entries) {
    var me = this;
    return me.getEntriesOfType(entries, "GRP");
  },

  setObjKeys: function (sord, entry) {
    sol.common.SordUtils.setObjKeyValue(sord, entry.key, entry.value);
  },

  setMapEntries: function (enrollmentId, mapEntries) {
    var me = this;

    if (me.shouldCheckinMap(mapEntries)) {
      ixConnectAdmin.ix().checkinMap(MapDomainC.DOMAIN_SORD, enrollmentId, enrollmentId, mapEntries, LockC.NO);
    }
  },

  shouldCheckinMap: function (mapEntries) {
    return mapEntries && Array.isArray(mapEntries) && mapEntries.length > 0;
  },

  getMapEntries: function (entries) {
    var me = this;
    return me.getEntriesOfType(entries, "MAP")
      .map(me.getKeyValuesFromMapEntry);
  },

  getKeyValuesFromMapEntry: function (entry) {
    return new KeyValue(entry.key, entry.value);
  },

  getEntriesOfType: function (entries, type) {
    return (entries || [])
      .filter(function (entry) {
        return entry.type == type;
      });
  },

  getAndPrepareEntries: function (metadataMapping) {
    function hasTargetValue(mapping) {
      return mapping && mapping.target && mapping.target.value;
    }
    function hasKeyAndValue(keyDefinition) {
      return keyDefinition && keyDefinition.key && keyDefinition.value;
    }
    function getTargetFromMapping(mapping) {
      return (mapping || {}).target;
    }
    function cleanKeyDefinition(keyDefinition) {
      return {
        type: keyDefinition.type || "GRP",
        key: keyDefinition.key || keyDefinition.id || null,
        value: keyDefinition.value
      };
    }

    return (metadataMapping || [])
      .filter(hasTargetValue)
      .map(getTargetFromMapping)
      .map(cleanKeyDefinition)
      .filter(hasKeyAndValue);
  },

  prepareMetaData: function (criteria, metaDataMapping) {
    var me = this,
        metaData;

    metaData = Object.keys(criteria)
      .map(function (key) {
        return { type: "GRP", key: key, value: criteria[key] };
      });

    if (criteria.status) {
      me.metaDataMapping.concat([
        {
          target: {
            key: "STATUS_" + criteria.status + "_ACHIEVED_AT",
            type: "MAP",
            value: moment().format("YYYYMMDDHHmmss")
          }
        }
      ]);
    }

    me.addUserData(metaData, criteria[me._userField], me._GRPFieldsFromUser, me._GetMailFromUserUtils);
    metaData = metaData.concat(me.getAndPrepareEntries(metaDataMapping));
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

  getCourseType: function (course) {
    var me = this;

    me._course.search.push(
      { key: me._courseReferenceField, value: course }
    );

    return (sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._course, me._optimize, "findCourse", ["output"]).sords[0] || {}).courseType;
  },

  rfAsAdm: function (fct, params) {
    var me = this,
        any = new (typeof Any !== "undefined" ? Any : de.elo.ix.client.Any);

    any.type = ixConnect.CONST.ANY.TYPE_STRING;
    any.stringValue = sol.common.JsonUtils.stringifyAll(params);
    any = me.tryGetIxConnectAdminOrNormal().ix().executeRegisteredFunction(fct, any);

    return JSON.parse((any && any.stringValue) ? String(any.stringValue) : "{}");
  },

  startWorkflowAsAdm: function (templFlowId, flowName, objId) {
    var me = this;

    if (!templFlowId) {
      throw "Workflow template ID is empty";
    }

    me.tryGetIxConnectAdminOrNormal().ix().startWorkFlow(templFlowId, me.shortFlowName(flowName), objId);
  },

  shortFlowName: function (flowName) {
    return (flowName && flowName.length > 120)
      ? flowName.substr(0, 120)
      : flowName;
  },

  tryGetIxConnectAdminOrNormal: function () {
    return ((typeof ixConnectAdmin === "undefined") ? ixConnect : ixConnectAdmin);
  },

  isSessionFull: function (session) {
    var me = this,
        sessionParam = { key: "SESSION_REFERENCE", value: [session] },
        maxParticipants,
        participants;

    maxParticipants = me.getMaxParticipants(sessionParam);

    if (!maxParticipants || maxParticipants == 0) {
      return false;
    }

    participants = me.getCurrentNumberOfParticipants(sessionParam);

    return participants >= maxParticipants;
  },

  getMaxParticipants: function (sessionParam) {
    var me = this,
        searchResult,
        maxParticipants;

    me._session.search.push(sessionParam);
    searchResult = sol.common.IxUtils.optimizedExecute(
      "RF_sol_common_service_SordProvider",
      me._session,
      me._optimize,
      "session",
      ["output"]
    );
    maxParticipants = (searchResult.sords[0] || {}).maxParticipants;

    return +(maxParticipants || 0);
  },

  getCurrentNumberOfParticipants: function (sessionParam) {
    var me = this;

    me._sessionEnrollments.search.push(sessionParam);

    return me.rfAsAdm("RF_sol_common_service_SordProvider", me._sessionEnrollments).sords.length;
  },

  process: function () {
    var me = this, enrollmentId, user, course, session, status, metaData, throws = true, courseType;

    user = me.determineCriterion("user", me._userField, "user name", throws);
    course = me.determineCriterion("course", me._courseReferenceField, "course reference", throws);
    session = me.determineCriterion("session", me._sessionReferenceField, "session reference", !throws) || "";
    status = me.determineCriterion("status", me._enrollmentStatusField, "status") || "ENROLLED";

    enrollmentId = me.getEnrollment(user, course);

    if (enrollmentId) { //enrollment already exists
      return { code: "duplicate", data: { objId: enrollmentId }, info: "Enrollment not created: already existed." };
    }

    if (session && !me.allowOverbooking && me.isSessionFull(session)) {
      return { code: "sessionfull", info: "This session has no more free seats!" };
    }

    if ((me.ignoreIfTypeEquals || {}).length && !session) { // usually defined by AddEnrollments batchEnroll call
      courseType = me.getCourseType(course);

      if (~me.ignoreIfTypeEquals.indexOf(courseType)) {
        return { code: "unfit", info: "This course enrollment was ignored because its course type was listed in parameter `ignoreIfTypeEquals`: " + courseType };
      }
    }

    metaData = me.prepareMetaData(
      {
        COURSE_ENROLLMENT_USER: user,
        COURSE_REFERENCE: course,
        SESSION_REFERENCE: session,
        COURSE_ENROLLMENT_STATUS: status,
        COURSE_PRICE: me.determineCriterion("price", "COURSE_PRICE", "course price", false),
        COURSE_PRICE_ENABLED: me.determineCriterion("price", "COURSE_PRICE_ENABLED", "course price", false)
      },
      me.metadataMapping
    );

    if (me.sordMetadata) {
      Object.keys(me.sordMetadata.mapKeys || {})
        .forEach(function (mapKey) {
          function isAccepted() {
            return mapKey.substring(0, "CONFIRMATION_".length) == "CONFIRMATION_"
              || mapKey == "COURSE_PRICE";
          }
          if (isAccepted()) {
            metaData.push({
              type: "MAP",
              key: mapKey,
              value: me.sordMetadata.mapKeys[mapKey]
            });
          }
        });
    }

    enrollmentId = me.createEnrollmentFromScratch(me._newSordDef, user, metaData);

    if (status && enrollmentId) {
      sol.common.IxUtils.execute("RF_sol_function_Set", {
        objId: enrollmentId, entries: [
          {
            key: "STATUS_" + status + "_ACHIEVED_AT",
            type: "MAP",
            value: moment().format("YYYYMMDDHHmmss")
          }
        ]
      });
    }

    me.startWorkflowAsAdm(me._standardWorkflow, me._workflowMessage, enrollmentId);

    return { code: "success", data: { objId: enrollmentId }, info: "Enrollment created successfully" };
  }
});

sol.define("sol.learning.ix.functions.CancelEnrollment", {
  extend: "sol.common.ix.FunctionBase",

  determineCriterion: function (param, key, desc, throws) {
    var me = this,
        criterionMapping,
        criterion;

    if (me[param]) {
      criterion = me[param];
    } else if (me.sordMetadata && (me.sordMetadata.objKeys || me.sordMetadata.objKeys)) {
      if (me.sordMetadata.objKeys) {
        criterion = me.sordMetadata.objKeys[key];
      } else if (me.sordMetadata.mapKeys) {
        criterion = me.sordMetadata.objKeys[key];
      }
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

  rfAsAdm: function (fct, params) {
    var any = new (typeof Any !== "undefined" ? Any : de.elo.ix.client.Any);
    any.type = ixConnect.CONST.ANY.TYPE_STRING;
    any.stringValue = sol.common.JsonUtils.stringifyAll(params);
    any = ((ixConnectAdmin === "undefined") ? ixConnect : ixConnectAdmin).ix().executeRegisteredFunction(fct, any);
    return JSON.parse((any && any.stringValue) ? String(any.stringValue) : "{}");
  },

  process: function () {
    var me = this, guid, user, course, session, throws = true;

    guid = me.determineCriterion("guid", me._userField, "guid", !throws) || "";
    user = me.determineCriterion("user", me._userField, "user name", !throws) || "";
    course = me.determineCriterion("course", me._courseReferenceField, "course reference", !throws) || "";
    session = me.determineCriterion("session", me._sessionReferenceField, "session reference", !throws) || "";

    return me.rfAsAdm("RF_sol_learning_function_ManageEnrollment", { guid: guid, user: user, course: course, session: session, action: "cancelled" });
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
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  if (params.cancel) {
    fun = sol.create("sol.learning.ix.functions.CancelEnrollment", params);
  } else {
    fun = sol.create("sol.learning.ix.functions.CreateEnrollmentHeadless", params);
  }

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

  if (params.cancel) {
    fun = sol.create("sol.learning.ix.functions.CancelEnrollment", params);
  } else {
    fun = sol.create("sol.learning.ix.functions.CreateEnrollmentHeadless", params);
  }

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

/**
 * @member sol.learning.ix.functions.CreateEnrollmentHeadlessStrict
 * @method RF_sol_learning_function_CreateEnrollmentHeadlessStrict
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_CancelEnrollment(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  rfArgs.user = ixConnect.loginResult.user.name;

  fun = sol.create("sol.learning.ix.functions.CancelEnrollment", rfArgs);

  return JSON.stringify(fun.process());
}
