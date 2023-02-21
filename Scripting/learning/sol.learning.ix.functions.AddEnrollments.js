
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
 * Creates enrollments based on a sord containing a MAPTABLE containing the data for the bulk mailing.
 *
 * #### Returns
 *
 *     { code: "success", data: [{ objId: "12345", flowId: "33" }], info: "Bulk mailing initiated successfully" }
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
sol.define("sol.learning.ix.functions.AddEnrollments", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId" },
    _getCourseConfig: { config: "learning", prop: "entities.course.functions.addenrollments.courserefs" }
  },

  _optimize: {},

  pilcrow: String.fromCharCode(182),

  extractColumnsFromConfig: function (mappings) {
    return mappings
      .reduce(function (acc, mapping) {
        (mapping = mapping.target)
          && (
            (mapping.valueFromMapTableRow && acc.map.push(mapping.valueFromMapTableRow))
            || (mapping.valueFromWfMapTableRow && acc.wfMap.push(mapping.valueFromWfMapTableRow))
          );
        return acc;
      }, { wfMap: [], map: [] });
  },

  arrayOfInt: function (int) {
    return Array.apply(null, Array(int));
  },

  sizeOfLargestColumn: function (table) {
    return Object.keys(table) // find size of largest column ...
      .reduce(function (max, col) {
        return (table[col].length >= max) ? table[col].length : max;
      }, 0);
  },

  rowToObject: function (table, columns, _, rowNo) {
    return columns
      .reduce(function (acc, col) {
        acc[col] = table[col][rowNo];
        return acc;
      }, {});
  },

  rowNotEmpty: function (row) {
    return Object.keys(row)
      .some(function (name) {
        return row[name];
      });
  },

  addKeyToTable: function (table, columns, map, mapName, key) {
    var column;
    columns[mapName]
      .some(function (col) {
        return (column = key.indexOf(col) === 0 && col);
      })
      && (table[column][+(key.slice(column.length)) - 1] = (map[key]));
  },

  addMapToTable: function (columns, sord, table, mapName) {
    var me = this, map;
    Object.keys(map = (sord[mapName + "Keys"] || {}))
      .forEach(me.addKeyToTable.bind(null, table, columns, map, mapName));
    return table;
  },

  generateEmptyTable: function (colMap) {
    return Object.keys(colMap)
      .reduce(function (acc, mapName) {
        return colMap[mapName]
          .reduce(function (ac, col) {
            return (ac[col] = []) && ac;
          }, acc);
      }, {});
  },

  buildTable: function (columns, sord) {
    var me = this;
    return Object.keys(columns) // map, wfMap
      .reduce(
        me.addMapToTable.bind(me, columns, sord),
        me.generateEmptyTable(columns)
      );
  },

  convertTable: function (table) {
    var me = this;
    return me.arrayOfInt(me.sizeOfLargestColumn(table))
      .map(me.rowToObject.bind(null, table, Object.keys(table)))
      .filter(me.rowNotEmpty);
  },

  createEnrollment: function (config) {
    var me = this;
    config.allowOverbooking = true;
    try {
      return sol.common.IxUtils.execute("RF_sol_learning_function_CreateEnrollmentHeadless", config);
    } catch (_e) {
      me.logger.debug("AddEnrollments: Creating an enrollment failed. Please review the logs (RF_sol_learning_function_CreateEnrollmentHeadless) for further details.");
    }
  },

  adjustConfigForRow: function (config, row) {
    var me = this;

    config.metadataMapping = config.metadataMapping // set values from maptables in mapping
      .map(function (mapping) {
        if (mapping.target) {
          mapping.target.value = me.shouldGetValueFromTable(mapping.target)
            ? me.getValueFromRow(row, mapping.target)
            : me.getValueFromSord(me.sord, mapping.source);
        }
        return mapping;
      });

    return config;
  },

  shouldGetValueFromTable: function (keyDefinition) {
    return !!(keyDefinition.valueFromMapTableRow || keyDefinition.valueFromWfMapTableRow);
  },

  getValueFromRow: function (row, keyDefinition) {
    var key = keyDefinition.valueFromMapTableRow || keyDefinition.valueFromWfMapTableRow;
    return row[key];
  },

  getValueFromSord: function (sord, keyDefinition) {
    var typeKeyMapping = {
          GRP: "objKeys",
          MAP: "mapKeys"
        },
        typeKey = typeKeyMapping[keyDefinition.type || "GRP"];

    return ((sord || {})[typeKey] || {})[keyDefinition.id];
  },

  rowToEnrollment: function (config, results, row) {
    var me = this;
    results.push(
      (me.createEnrollment(
        me.adjustConfigForRow(JSON.parse(config), row), row) || {}).data
    );
    return results;
  },

  batchEnroll: function (user, courses, results) {
    var me = this;
    courses
      .forEach(function (course) {
        results.push(me.createEnrollment({
          sordMetadata: {
            objKeys: {
              COURSE_ENROLLMENT_USER: user,
              COURSE_REFERENCE: course
            },
            mapKeys: {
              COURSE_ENROLLMENT_CREATED_AUTO: "1" // prevents recursion
            }
          },
          ignoreIfTypeEquals: ["VIRTUAL CLASSROOM", "CLASSROOM"] // do not auto-enroll in these types
          // auto enrollment would be performed, if session is defined!
        }
        ) || {});
      });
  },

  getRefs: function (reference) {
    var me = this;
    me._getCourseConfig.search.push({ key: "COURSE_REFERENCE", value: [reference] });
    return (sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getCourseConfig, me._optimize, "course", ["output"]).sords[0] || {}).courseRefs || [];
  },

  getRelatedCourseRefs: function (reference) {
    var me = this;
    return me.getRefs(reference)
      .filter(function (s) {
        return s;
      });
  },

  manageEnrollment: function (config) {
    sol.common.IxUtils.execute("RF_sol_learning_function_ManageEnrollment", config);
  },

  process: function () {
    var me = this,
        createdEnrollments = [],
        user,
        course,
        session,
        curStatus;

    if (me.enrollRelatedCourses) {
      if (me.sord.mapKeys.COURSE_ENROLLMENT_CREATED_AUTO !== "1") {
        user = me.user || me.sord.objKeys.COURSE_ENROLLMENT_USER || "";
        course = me.course || me.sord.objKeys.COURSE_REFERENCE || "";
        session = me.session || me.sord.objKeys.SESSION_REFERENCE || "";

        me.batchEnroll(
          user,
          me.getRelatedCourseRefs(course),
          createdEnrollments
        );

        if ((curStatus = String(me.sord.objKeys.COURSE_ENROLLMENT_STATUS)) === "RUNNING") {
          me.manageEnrollment({ user: user, course: course, session: session, action: "started" });
        } else if (curStatus === "COMPLETED") {
          me.manageEnrollment({ user: user, course: course, session: session, action: "completed" });
        } else {
          me.manageEnrollment({ user: user, course: course, action: "couldBeALearningPath" });
        }

      } else {
        return { code: "info", data: [], info: "no enrollments created on automatically created enrollment" };
      }
    } else {
      me.convertTable(me.buildTable(me.extractColumnsFromConfig(me.metadataMapping), me.sord))
        .reduce(
          me.rowToEnrollment.bind(
            me,
            sol.common.JsonUtils.stringifyQuick({ // stringify once...gets parsed in rowToEnrollment
              objId: me.objId,
              flowId: me.flowId || "",
              course: me.sord.objKeys.COURSE_REFERENCE,
              session: me.sord.objKeys.SESSION_REFERENCE,
              metadataMapping: me.metadataMapping
            })
          ),
          createdEnrollments
        );

      return { code: "success", data: createdEnrollments, info: "Enrollments added successfully" };
    }
  }
});

/**
 * @member sol.learning.ix.functions.AddEnrollments
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.functions.AddEnrollments", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.AddEnrollments
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.learning.ix.functions.AddEnrollments", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.AddEnrollments
 * @method RF_sol_learning_function_AddEnrollments
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_AddEnrollments(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  fun = sol.create("sol.learning.ix.functions.AddEnrollments", rfArgs);

  return JSON.stringify(fun.process());
}