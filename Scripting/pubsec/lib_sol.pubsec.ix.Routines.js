
//@include lib_Class.js

/**
 * Encapsulation of routines.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @requires sol.common.JsonUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.IxUtils
 * @requires sol.pubsec.ix.ProcessUtils
 */

sol.define("sol.pubsec.ix.Routines", {

  requiredConfig: ["objId", "isTemplate"],

  /**
   * @private
   * @property {Object[]} routines
   */

  initialize: function (config) {
    var me = this;

    me.config = sol.pubsec.ix.ProcessUtils.loadConfig();
    me.objId = me.normalizeObjId(config.objId);
    me.isTemplate = config.isTemplate;
    me.multipleRoutinesSupported = sol.pubsec.ix.ProcessUtils.useMapForRoutines();

    me.initRoutines();
  },

  /**
   * @private
   * Ensures, that the objId is not a GUID for the usage with map functions (`checkoutMap` and `checkinMap`).
   * @param {String} objId
   * @return {String}
   */
  normalizeObjId: function (objId) {
    return ixConnect.ix().checkoutSord(objId, SordC.mbOnlyId, LockC.NO).id;
  },

  /**
   * @private
   */
  initRoutines: function () {
    var me = this;
    me.routines = me.retrieveRoutines();
  },

  /**
   * @return {Boolean}
   */
  isMultipleRoutinesSupported: function () {
    var me = this;
    return me.multipleRoutinesSupported;
  },

  /**
   * @return {String}
   */
  getExternalRoutineObjId: function () {
    var me = this,
        externalRoutineObjId = null,
        processSord;


    if (me.isTemplate) {
      externalRoutineObjId = me.getProcessSord().id;
    } else if (!me.isMultipleRoutinesSupported()) {
      processSord = me.getProcessSord();
      externalRoutineObjId = sol.common.SordUtils.getObjKeyValue(processSord, me.config.fields.routineReference);
    }

    return String(externalRoutineObjId);
  },

  /**
   * @return {de.elo.ix.client.Sord}
   */
  getProcessSord: function () {
    var me = this;
    if (!me.processSord) {
      me.processSord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
    }
    return me.processSord;
  },

  /**
   * @return {Object[]}
   */
  getRoutines: function () {
    var me = this;
    return me.routines;
  },

  /**
   * @param {Number} id
   * @return {Object}
   */
  getRoutine: function (id) {
    var me = this,
        routine = null;

    if (typeof id === "number") {
      me.routines.some(function (currentRoutine) {
        if ((currentRoutine.id == id) || (!currentRoutine.id && id == 0)) {
          routine = currentRoutine;
          return true;
        }
      });
      routine = routine || {};
    }

    routine = routine || me.routines[0]; // TODO search for first "active" routine as fallback if there is no id defined

    me.enrichWithDirectiveData(routine);
    me.enrichWithSigningData(routine);

    return routine;
  },

  /**
   * @param {String} flowId
   * @return {Object}
   */
  getRoutineByFlowId: function (flowId) {
    var me = this,
        routine = null;

    me.routines.some(function (currentRoutine) {
      if (currentRoutine.flowId == flowId) {
        routine = currentRoutine;
        return true;
      }
    });

    if (!routine && (me.routines.length > 1) && (me.routines[0].flowId === undefined)) {
      // fallback for old routine definitions
      routine = me.routines[0];
    }

    if (routine) {
      me.enrichWithDirectiveData(routine);
      me.enrichWithSigningData(routine);
    }

    return routine;
  },

  /**
   * @param {String} name
   * @param {Object} routine (optional)
   * @param {Object} routine.definition (optional)
   * @param {Object} routine.templateName (optional)
   * @return {Number}
   */
  addRoutine: function (name, routine) {
    var me = this,
        newId, routineTpl;

    newId = me.getNextId();

    if (routine && routine.definition) {
      routineTpl = routine.definition;
    } else if (routine && routine.templateName) {
      routineTpl = sol.common.IxUtils.execute("RF_sol_pubsec_service_GetRoutineDefinition", { templateName: routine.templateName });
    } else {
      routineTpl = { steps: [] };
    }

    if (me.multipleRoutinesSupported && !me.isTemplate) {
      routineTpl.name = name;
      routineTpl.id = newId;
    }

    if (me.multipleRoutinesSupported) {
      me.routines.push(routineTpl);
    } else {
      me.routines = [routineTpl];
    }

    return newId;
  },

  /**
   * @param {Object} routine
   * @param {Number} id (optional)
   */
  updateRoutine: function (routine, id) {
    var me = this,
        i, current;
    for (i = 0; i < me.routines.length; i++) {
      current = me.routines[i];
      if (current.id === id || (!current.id && id === 0) || (!current.id && !id)) {
        me.routines[i].steps = routine.steps || me.routines[i].steps;
        me.routines[i].name = routine.name || me.routines[i].name;
        break;
      }
    }
  },

  /**
   * @return {Object[]}
   */
  getMinimizedRoutineData: function () {
    var me = this;
    return me.routines.map(function (routine) {
      return {
        id: routine.id,
        name: routine.name
      };
    });
  },

  /**
   * @return {Object[]}
   */
  getActiveSteps: function () {
    var me = this,
        routines = me.getRoutines(),
        activeSteps = [];

    if (routines && routines.length > 0) {
      routines.forEach(function (routine) {
        var activeStep;
        (activeStep = me.retrieveActiveStep(routine)) && activeSteps.push({ definition: activeStep, routineId: routine.id });
      });
    }

    return activeSteps;
  },

  /**
   * Reloads the routines.
   */
  refresh: function () {
    var me = this;
    me.initRoutines();
  },

  /**
   * Updates/writes the routine definition to an routine object or the map (see {@link #useMapForRoutines}).
   *
   * Uses either the reference field (config: `fields.routineReference`) or the BLOB map to determine the routine definition.
   *
   */
  save: function () {
    var me = this,
        routineForExternal, mapitems;

    if (me.routines.length > 0) {
      if (!me.multipleRoutinesSupported || me.isTemplate) {
        routineForExternal = me.getRoutine();
        me.saveExternalRoutine(routineForExternal.name, routineForExternal);
      } else {
        mapitems = [];
        me.routines.forEach(function (routine) {
          var routineString = sol.common.JsonUtils.stringifyAll(routine),
              mapKey = me.config.mapFields.routineDescription + ((routine && routine.id) ? routine.id : "");
          mapitems.push(new MapValue(mapKey, "text", new java.lang.String(routineString).getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        });
        ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.objId, me.objId, mapitems, LockC.NO);
      }
    }
  },

  /**
   * Sets the status of a routine
   * @param {String} status
   * @param {String} routineId
   */
  setRoutineStatus: function (status, routineId) {
    var me = this,
        routine, routineSord;

    routine = me.getRoutine(routineId);
    routine.status = status;

    if (!me.isMultipleRoutinesSupported()) {
      routineSord = ixConnectAdmin.ix().checkoutSord(me.getExternalRoutineObjId(), SordC.mbLean, LockC.NO);
      sol.common.SordUtils.setObjKeyValue(routineSord, me.config.fields.routineStatus, status);
      ixConnectAdmin.ix().checkinSord(routineSord, SordC.mbLean, LockC.NO);
    }
  },

  /**
   * @private
   * @return {Number}
   */
  getNextId: function () {
    var me = this,
        highestId = -1;

    me.routines.forEach(function (routine) {
      var checkId = (typeof routine.id === "number") ? routine.id : 0;
      if (checkId > highestId) {
        highestId = checkId;
      }
    });

    highestId++;
    return highestId;
  },

  /**
   * @private
   * Retrieves the routine definitions from an object.
   *
   * Uses either the reference field (config: `fields.routineReference`) to determine the routine object or loads it from the BLOB map (see {@link #useMapForRoutines}).
   *
   * Routine definitions will be enhanced with additional info:
   *
   * - name of the routine: object name of the element, which holds the definition
   * - status of the routine: read from the status field (configuration: `fields.routineStatus`) of the element which holds the definition
   *
   * @return {Object[]} The routine definitions
   */
  retrieveRoutines: function () {
    var me = this,
        mapcontent, entriesIterator, entry, routineSord, routines, blobStream;

    if (me.shouldRetrieveRoutinesFromDesc()) {
      routineSord = me.getRoutineSord();
      if (routineSord) {
        routines = me.enhanceRoutinesFromDesc(
          me.getRoutinesFromDesc(routineSord),
          routineSord
        );
      }
    } else {
      mapcontent = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.objId, [me.config.mapFields.routineDescription + "*"], LockC.NO).mapItems;
      if (mapcontent && (mapcontent.size() > 0)) {
        routines = [];
        entriesIterator = mapcontent.entrySet().iterator();
        while (entriesIterator.hasNext()) {
          entry = entriesIterator.next();
          if (entry.value && entry.value.blobValue && entry.value.blobValue.stream) {
            blobStream = entry.value.blobValue.stream;
            routines.push(JSON.parse(Packages.org.apache.commons.io.IOUtils.toString(blobStream, java.nio.charset.StandardCharsets.UTF_8)));
            blobStream.close();
          }
        }
      }
    }

    return routines || [];
  },

  /**
   *
   * @private
   * @returns {boolean} shouldRetrieveRoutinesFromDesc
   */
  shouldRetrieveRoutinesFromDesc: function () {
    var me = this;
    return !me.multipleRoutinesSupported || me.isTemplate;
  },

  /**
   *
   * @private
   * @returns {de.elo.ix.client.Sord} routineSord
   */
  getRoutineSord: function () {
    var me = this,
        routineObjId;

    routineObjId = me.getExternalRoutineObjId();

    return sol.common.StringUtils.isBlank(routineObjId)
      ? me.getProcessSord()
      : me.hasReadRightsOnProcessSord()
        ? ixConnectAdmin.ix().checkoutSord(routineObjId, SordC.mbAllIndex, LockC.NO)
        : null;
  },

  /**
   *
   * @private
   * @returns {boolean} hasReadRightsOnProcessSord
   */
  hasReadRightsOnProcessSord: function () {
    var me = this;

    return sol.common.AclUtils.hasEffectiveRights(me.getProcessSord(), { rights: { r: true } });
  },

  /**
   *
   * @private
   * @param {de.elo.ix.client.Sord} sord sord containing routine desc
   * @returns {Object} routines
   */
  getRoutinesFromDesc: function (sord) {
    return !sol.common.StringUtils.isBlank((sord || {}).desc)
      ? [JSON.parse(sord.desc)]
      : null;
  },

  /**
   *
   * @private
   * @param {Object} routines routines to enhance
   * @param {de.elo.ix.client.Sord} sord sord to enhance routines with
   */
  enhanceRoutinesFromDesc: function (routines, sord) {
    var me = this;

    if (routines) {
      routines[0].name = sord.name;
      routines[0].status = sol.common.SordUtils.getObjKeyValue(sord, me.config.fields.routineStatus);
    }
  },

  /**
   * @private
   *
   * @param {String} name Name of the process (but can be an arbitary string), will be used as routine name (if external element is used, see {@link #useMapForRoutines})
   * @param {Object} routineTpl
   */
  saveExternalRoutine: function (name, routineTpl) {
    var me = this,
        isNewRoutine = false,
        routineObjId, targetId, maskName, routineSord, rightsConfig;

    routineObjId = me.getExternalRoutineObjId();

    if (me.isTemplate) {
      // if template mode, use sord itself instead
      routineSord = me.getProcessSord();
    } else if (sol.common.StringUtils.isBlank(routineObjId)
        && sol.common.AclUtils.hasEffectiveRights(me.getProcessSord(), { rights: { r: true, w: true } })) {
      // create an external element if there is not already an objId and the user has sufficient permissions
      targetId = sol.common.RepoUtils.preparePath(me.config.routine.folderId, { data: {} });
      maskName = me.config.routine.maskName;
      routineSord = ixConnect.ix().createSord(targetId, maskName, EditInfoC.mbSord).sord;
      routineSord.name = name + " - " + me.objId;
      isNewRoutine = true;
    } else {
      routineSord = ixConnectAdmin.ix().checkoutSord(routineObjId, SordC.mbAllIndex, LockC.NO);
    }

    routineSord.desc = sol.common.JsonUtils.stringifyAll(routineTpl, { tabStop: 2 });
    ixConnectAdmin.ix().checkinSord(routineSord, SordC.mbAllIndex, LockC.NO);

    if (isNewRoutine && me.config.routine.initialRoutineRights && me.config.routine.initialRoutineRights.users && (me.config.routine.initialRoutineRights.users.length > 0)) {
      rightsConfig = JSON.parse(JSON.stringify(me.config.routine.initialRoutineRights)); // copy to avoid altering the original
      rightsConfig.dontWait = false; // make sure this call is synchronous
      rightsConfig.mode = "SET"; // make sure inherited rights will be overridden
      sol.common.AclUtils.changeRightsInBackground(routineSord.id, rightsConfig);
    }

    if (me.getProcessSord().id != routineSord.id) {
      sol.common.SordUtils.setObjKeyValue(me.getProcessSord(), me.config.fields.routineReference, routineSord.id);
      ixConnect.ix().checkinSord(me.getProcessSord(), SordC.mbAllIndex, LockC.NO);
    }
  },

  /**
   * Retrieves the active step of a routine
   * @param {Number|Object} routine If this is an Object, it will be used directly, if it is a Number, {@link #getRoutine} will be used to load the routine definition
   * @return {Object}
   */
  retrieveActiveStep: function (routine) {
    var me = this,
        i, max;

    if (!sol.common.ObjectUtils.isObject(routine)) {
      routine = me.getRoutine(routine);
    }

    if (routine && routine.steps) {
      for (i = 0, max = routine.steps.length; i < max; i++) {
        if (sol.pubsec.ix.ProcessUtils.isActive(routine.steps[i])) {
          return routine.steps[i];
        }
      }
    }

    return null;
  },

  /**
   * @private
   * @param {Object} routine
   */
  enrichWithSigningData: function (routine) {
    var signingTemplateSord, wfDiagram;

    if (routine && routine.steps) {
      routine.steps.forEach(function (step) {
        if (step.signing && step.signing.signings) {
          step.signing.signings.forEach(function (signing) {

            if (signing.signingType) {
              signingTemplateSord = sol.common.RepoUtils.getSord(signing.signingType);
              signing.glyphClass = sol.common.SordUtils.getObjKeyValue(signingTemplateSord, "SIGNPROCESS_ICON");
            }

            if (signing.flowId) {
              wfDiagram = sol.common.WfUtils.getWorkflow(signing.flowId, { inclFinished: true, connection: ixConnectAdmin });
              signing.documentTitle = wfDiagram.objName;
              signing.status = sol.common.WfUtils.getWorkflowStatus(wfDiagram);
            }
          });
        }
      });
    }
  },

  /**
   * @private
   * @param {Object} routine
   */
  enrichWithDirectiveData: function (routine) {
    var directiveTemplateSord, wfDiagram;

    if (routine && routine.steps) {
      routine.steps.forEach(function (step) {
        if (step.directive && step.directive.directives) {
          step.directive.directives.forEach(function (directive) {

            if (directive.type) {
              directiveTemplateSord = sol.common.RepoUtils.getSord(directive.type);
              directive.glyphClass = sol.common.SordUtils.getObjKeyValue(directiveTemplateSord, "DIRECTIVE_ICON");
            }

            if (directive.flowId) {
              wfDiagram = sol.common.WfUtils.getWorkflow(directive.flowId, { inclFinished: true, connection: ixConnectAdmin });
              directive.documentTitle = wfDiagram.objName;
              directive.status = sol.common.WfUtils.getWorkflowStatus(wfDiagram);
            }
          });
        }
      });
    }
  }

});
