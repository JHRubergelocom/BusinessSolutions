//@include lib_Class.js

sol.define("sol.recruiting.RatingUtils", {
  singleton: true,

  ratingMapKeyTemplate: "RATING_{{ratingFlowId}}_{{questionnaire.userId}}",
  completenessTemplate: "{{completed}} / {{all}}",

  /**
   * @property {Object}
   * String constants for the questionnaire status.
   */
  STATUS: {
    INITIALIZED: "INITIALIZED",
    STARTED: "STARTED",
    FINISHED: "FINISHED"
  },

  /**
   * Prepares the wf map for the rating workflow.
   * @param {String} objId
   * @param {String} flowId
   * @param {Object} questionnaire
   */
  prepareRatingWorkflow: function (objId, flowId, questionnaire) {
    var me = this,
        additionalWfMapData;

    additionalWfMapData = {
      QUESTIONNAIRE_ID: questionnaire.id
    };

    me.writeQuestionnaireToWfMap(objId, flowId, questionnaire, additionalWfMapData);
  },

  /**
   * Prepares the wf map for the questionnaire workflow (subworkflow of the rating workflow).
   * @param {String} objId
   * @param {String} flowId
   * @param {Object} questionnaire
   */
  prepareRatingSubflow: function (objId, flowId, questionnaire) {
    var me = this,
        additionalWfMapData;

    additionalWfMapData = {
      QUESTIONNAIRE_ID: questionnaire.id,
      QUESTIONNAIRE_USER: questionnaire.userId
    };

    me.writeQuestionnaireToWfMap(objId, flowId, questionnaire, additionalWfMapData);
  },

  /**
   * Reads the questionnaires from the wf map (rating workflow) and transforms them into questionnaire objects.
   * @param {Object} candidate
   * @param {String} flowId
   * @return {Object[]}
   */
  prepareQuestionnaires: function (candidate, flowId) {
    var me = this,
        ratingEntries = [],
        questions = [],
        wfMap, questionTable, userTable;

    wfMap = sol.create("sol.common.WfMap", { flowId: flowId, objId: candidate.id });
    questionTable = sol.create("sol.common.MapTable", { map: wfMap, columnNames: ["RATING_QUESTION"] });
    userTable = sol.create("sol.common.MapTable", { map: wfMap, columnNames: ["USER", "USER_ID"] });

    if ((questionTable.getLength() <= 0) || (userTable.getLength() <= 0)) {
      me.logger.warn("No users or questions specified for the rating process");
      return ratingEntries;
    }

    while (questionTable.hasNextRow()) {
      questionTable.nextRow();
      questions.push({
        text: questionTable.getValue("RATING_QUESTION")
      });
    }

    while (userTable.hasNextRow()) {
      userTable.nextRow();
      ratingEntries.push({
        id: wfMap.getValue("QUESTIONNAIRE_ID"),
        userName: userTable.getValue("USER"),
        userId: userTable.getValue("USER_ID"),
        questions: questions
      });
    }

    ratingEntries.sort(me.sortQuestionnairesByUserId);

    return ratingEntries;
  },

  /**
   * Reads the questionnaire from the wf map (questionnaire workflow) and transforms them into a questionnaire object.
   * @param {Object} candidate
   * @param {String} flowId
   * @return {Object}
   */
  concludeQuestionnaire: function (candidate, flowId) {
    var questions = [],
        wfMap, questionTable, questionnaire;

    wfMap = sol.create("sol.common.WfMap", { flowId: flowId, objId: candidate.id });
    questionTable = sol.create("sol.common.MapTable", { map: wfMap, columnNames: ["RATING_QUESTION", "RATING_SCORE"] });

    while (questionTable.hasNextRow()) {
      questionTable.nextRow();
      questions.push({
        text: questionTable.getValue("RATING_QUESTION"),
        score: questionTable.getNumValue("RATING_SCORE")
      });
    }

    questionnaire = {
      id: wfMap.getValue("QUESTIONNAIRE_ID"),
      userName: wfMap.getValue("CURRENT_USER"),
      userId: wfMap.getValue("QUESTIONNAIRE_USER"),
      questions: questions
    };

    return questionnaire;
  },

  /**
   * Saves the questionnaire objects to the map of the candidate.
   * @param {Object} candidate
   * @param {String} ratingFlowId
   * @param {Object[]} questionnaires
   * @param {Object} params (optional)
   * @param {String} [params.status="INITIALIZED"] See {@link #STATUS}
   */
  saveRatingData: function (candidate, ratingFlowId, questionnaires, params) {
    var me = this,
        mapitems = [],
        keyTemplate;

    keyTemplate = sol.create("sol.common.Template", {
      source: me.ratingMapKeyTemplate
    });

    questionnaires.forEach(function (questionnaire) {
      var key = keyTemplate.apply({
        ratingFlowId: ratingFlowId,
        questionnaire: questionnaire
      });

      if (params && params.status) {
        questionnaire.status = params.status;
      } else {
        questionnaire.status = questionnaire.status || me.STATUS.INITIALIZED;
      }

      mapitems.push(new MapValue(
        key,
        "text",
        new java.lang.String(sol.common.JsonUtils.stringifyAll(questionnaire)).getBytes(java.nio.charset.StandardCharsets.UTF_8)
      ));
    });

    if (mapitems.length > 0) {
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, candidate.id, candidate.id, mapitems, LockC.NO);
    }
  },

  /**
   * Reads all questionnaires (for all users) from the candidate for a specifed rating (rating workflow id).
   * @param {String} objId
   * @param {String} ratingFlowId
   * @return {Object[]}
   */
  readAllQuestionnaires: function (objId, ratingFlowId) {
    var me = this,
        mapKey, questionnaires;

    mapKey = sol.create("sol.common.Template", {
      source: me.ratingMapKeyTemplate
    }).apply({
      ratingFlowId: ratingFlowId,
      questionnaire: { userId: "*" }
    });

    questionnaires = me.readBlobValues(objId, mapKey);

    questionnaires.sort(me.sortQuestionnairesByUserId);

    return questionnaires;
  },

  /**
   * Reads a questionnaire (for a spacified user) from the candidate for a specifed rating (rating workflow id).
   * @param {String} objId
   * @param {String} ratingFlowId
   * @param {String} userId
   * @return {Object}
   */
  readQuestionnaireData: function (objId, ratingFlowId, userId) {
    var me = this,
        mapKey, questionnaire;

    mapKey = sol.create("sol.common.Template", {
      source: me.ratingMapKeyTemplate
    }).apply({
      ratingFlowId: ratingFlowId,
      questionnaire: { userId: userId }
    });

    questionnaire = me.readBlobValues(objId, mapKey);

    return (questionnaire && questionnaire.length > 0) ? questionnaire[0] : null;
  },

  /**
   * Writes / updates the average score of a rating to the candidate map.
   * @param {Object} candidate
   * @param {String} ratingFlowId
   * @param {Object[]} questionnaires
   * @param {Object[]} questionnaireConfigs
   */
  updateCandidateRatings: function (candidate, ratingFlowId, questionnaires, questionnaireConfigs) {
    var me = this,
        candidateMap, ratingTable, rating, ratingUpdated, questionnaireCfg, questionnaireName;

    candidateMap = sol.create("sol.common.SordMap", { objId: candidate.id });
    ratingTable = sol.create("sol.common.MapTable", { map: candidateMap, columnNames: ["RATING_ID", "RATING_NAME", "RATING_SCORE", "RATING_COMPLETENESS"] });

    rating = me.calculateRatingScore(questionnaires);

    while (ratingTable.hasNextRow()) {
      ratingTable.nextRow();
      if (ratingTable.getValue("RATING_ID") == ratingFlowId) {
        ratingUpdated = true;
        ratingTable.setNumValue("RATING_SCORE", rating.score);
        ratingTable.setValue("RATING_COMPLETENESS", rating.completeness);
      }
    }

    if (!ratingUpdated) {

      if (rating.questionnaireId) {
        questionnaireCfg = sol.common.ObjectUtils.getProp(questionnaireConfigs, rating.questionnaireId);
      }
      questionnaireName = (questionnaireCfg && questionnaireCfg.name) ? questionnaireCfg.name : "-";

      ratingTable.appendRow();
      ratingTable.setValue("RATING_ID", ratingFlowId);
      ratingTable.setValue("RATING_NAME", questionnaireName);
      ratingTable.setNumValue("RATING_SCORE", rating.score);
      ratingTable.setValue("RATING_COMPLETENESS", rating.completeness);
    }

    ratingTable.reset();
    me.calculateAverageRating(candidate, ratingTable);

    ratingTable.write();

  },

  /**
   * @private
   * Calculates the average score rating of all questions of all users
   * @param {Object[]} questionnaires
   * @return {Number}
   */
  calculateRatingScore: function (questionnaires) {
    var me = this,
        result = {},
        completedCount = 0,
        sum = 0,
        count = 0;

    questionnaires.forEach(function (questionnaire) {
      result.questionnaireId = questionnaire.id;
      if (questionnaire.status === me.STATUS.FINISHED) {
        completedCount++;
        questionnaire.questions.forEach(function (question) {
          if (question.score) {
            sum += question.score;
            count++;
          }
        });
      }
    });

    result.score = (count > 0) ? (sum / count) : 0;
    result.completeness = sol.create("sol.common.Template", {
      source: me.completenessTemplate
    }).apply({
      completed: completedCount,
      all: questionnaires.length
    });

    return result;
  },

  /**
   * @private
   * Calculates the candidates average score from all ratings.
   * @param {Object} candidate
   * @param {sol.common.MapTable} ratingTable
   */
  calculateAverageRating: function (candidate, ratingTable) {
    var count = 0,
        sum = 0,
        sord, currentScore, average;

    sord = ixConnectAdmin.ix().checkoutSord(candidate.id, SordC.mbAllIndex, LockC.NO);

    while (ratingTable.hasNextRow()) {
      ratingTable.nextRow();
      currentScore = ratingTable.getNumValue("RATING_SCORE");
      if (currentScore > 0) {
        sum += currentScore;
        count++;
      }
    }

    average = (count > 0) ? (sum / count) : 0;
    sol.common.SordUtils.setObjKeyValueAsNumber(sord, "RECRUITING_CANDIDATE_SCORE", average, { lang: String(ixConnectAdmin.loginResult.clientInfo.language) });

    ixConnectAdmin.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
  },

  /**
   * @private
   * Reads the map blob values.
   * @param {String} objId
   * @param {String} key
   * @return {Object[]}
   */
  readBlobValues: function (objId, key) {
    var results = [],
        mapcontent, entries, entry, blobStream;

    mapcontent = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, objId, [key], LockC.NO).mapItems;
    if (mapcontent && (mapcontent.size() > 0)) {
      entries = mapcontent.entrySet().iterator();
      while (entries.hasNext()) {
        entry = entries.next();
        if (entry && entry.value && entry.value.blobValue && entry.value.blobValue.stream) {
          blobStream = entry.value.blobValue.stream;
          results.push(JSON.parse(Packages.org.apache.commons.io.IOUtils.toString(blobStream, java.nio.charset.StandardCharsets.UTF_8)));
          blobStream.close();
        }
      }
    }
    return results;
  },

  /**
   * @private
   * Writes the questionnaire data to the wf map so it can be used in the form.
   * @param {String} objId
   * @param {String} flowId
   * @param {Object} questionnaire
   * @param {Object} wfMapValues
   */
  writeQuestionnaireToWfMap: function (objId, flowId, questionnaire, wfMapValues) {
    var wfMap, wfMapTable, key;

    wfMap = sol.create("sol.common.WfMap", { flowId: flowId, objId: objId });
    wfMapTable = sol.create("sol.common.MapTable", { map: wfMap, columnNames: ["RATING_QUESTION"] });

    for (key in wfMapValues) {
      if (wfMapValues.hasOwnProperty(key)) {
        wfMap.setValue(key, wfMapValues[key]);
      }
    }

    questionnaire.questions.forEach(function (question) {
      wfMapTable.appendRow();
      wfMapTable.setValue("RATING_QUESTION", question.text);
    });

    wfMapTable.write();
  },

  /**
   * @private
   * Sorts objects (questionnaires) by the property userId.
   * @param {Object} q1
   * @param {Object} q2
   * @return {Number}
   */
  sortQuestionnairesByUserId: function (q1, q2) {
    if (q1.userId > q2.userId) {
      return 1;
    }
    if (q1.userId < q2.userId) {
      return -1;
    }
    return 0;
  }

});