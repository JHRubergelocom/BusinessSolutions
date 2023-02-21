
describe("[lib] sol.unittest.ix.services.SolRecruitingRatingUtils", function () {
  var objRatingUtilsId, originalTimeout, candidate, ratingTable, wfInfo,
      questionnaires, flowId, objId, ratingFlowId, key, userId, params, q1, q2,
      questionnaireConfigs, wfMapValues, questionnairesTypes, configAction,
      succNodes, succNodesIds, subWfs, subWorkflows, subWf, subWfFlowId,
      i, j, nodes, userNode, userNodeId, questionnaire;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolRecruitingRatingUtils").then(function success(obSolRecruitingRatingUtilsId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.recruiting.RatingUtils", function () {
      it("copysord", function (done) {
        expect(function () {
          test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting [unit tests]/Resources/RatingUtils").then(function success(objRatingUtilsId1) {
            objRatingUtilsId = objRatingUtilsId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("calculateAverageRating", function (done) {
        expect(function () {
          candidate = objRatingUtilsId;
          ratingTable = "ratingTable1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "calculateAverageRating",
            params: [candidate, ratingTable]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("calculateRatingScore", function (done) {
        expect(function () {
          questionnaires = [{ id: 1, status: "FINISHED", questions: [{ score: 3 }, { score: 5 }] }, { id: 2, status: "FINISHED", questions: [{ score: 11 }, { score: 2 }] }];
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "calculateRatingScore",
            params: [questionnaires]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ questionnaireId: 2, score: 5.25, completeness: "2 / 2" });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("questionnairesTypes must be available", function (done) {
        test.Utils.execute("RF_sol_recruiting_service_GetQuestionnaires", {}).then(function success(questionnairesTypes1) {
          questionnairesTypes = questionnairesTypes1;
          expect(questionnairesTypes).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("start action rate candidate workflow", function (done) {
        expect(function () {
          configAction = {
            $name: "RateCandidate",
            objId: objRatingUtilsId,
            $metadata: {
              solType: "RECRUITING_CANDIDATE",
              owner: {
                fromConnection: true
              },
              objKeys: [],
              mapItems: [
                {
                  key: "RATING_CURRENT_QUESTIONNAIRE",
                  value: questionnairesTypes[0].id
                }
              ]
            },
            $wf: {
              template: {
                name: "sol.recruiting.Candidate.Rating"
              },
              name: "sol.recruiting.candidate.workflow.rating.message"
            },
            $events: [
              {
                id: "DIALOG"
              }
            ]
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_common_action_Standard", configAction, []).then(function success(jsonResults) {
            test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
              wfInfo = wfInfo1;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("wfInfo.flowId must be available", function () {
        expect(wfInfo.flowId).toBeDefined();
      });
      it("wfInfo.nodeId must be available", function () {
        expect(wfInfo.nodeId).toBeDefined();
      });
      it("Prepare Rating", function (done) {
        expect(function () {
          test.Utils.updateWfMapData(wfInfo.flowId, objRatingUtilsId, { RATING_QUESTION1: "Administrator", USER1: "Administrator", USER_ID1: "0" }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("'Start rating' forwarding Workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest 'Start rating'").then(function success1(forwardWorkflowTaskResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get active node 'Rate candidate' (id = 4) of Subworkflow 'sol.recruiting.Candidate.Rating.Sub'", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            subWfs = [];
            subWorkflows = workflow.subWorkflows;
            for (key in subWorkflows) {
              subWfs.push(subWorkflows[key]);
            }
            for (i = 0; i < subWfs.length; i++) {
              if (subWfs[i].templateName == "sol.recruiting.Candidate.Rating.Sub") {
                subWf = subWfs[i];
                subWfFlowId = subWf.id;
                nodes = test.Utils.getActiveUserNodes(subWf);
                if (nodes.length > 0) {
                  for (j = 0; j < nodes.length; j++) {
                    if (nodes[j].nameTranslationKey == "sol.recruiting.wf.user.candidate.rating.sub.rate") {
                      userNode = nodes[j];
                      userNodeId = userNode.id;
                    }
                  }
                  // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
                } else {
                  // alert("no userNodes available");
                }
              }
            }
            expect(userNodeId).toEqual(4);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Rate Candidate", function (done) {
        expect(function () {
          test.Utils.updateWfMapData(subWfFlowId, objRatingUtilsId, { RATING_SCORE1: 7 }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("concludeQuestionnaire", function (done) {
        expect(function () {
          candidate = objRatingUtilsId;
          flowId = subWfFlowId;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "concludeQuestionnaire",
            params: [candidate, flowId]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("prepareQuestionnaires", function (done) {
        expect(function () {
          candidate = objRatingUtilsId;
          flowId = subWfFlowId;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "prepareQuestionnaires",
            params: [candidate, flowId]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("prepareRatingSubflow", function (done) {
        expect(function () {
          objId = objRatingUtilsId;
          flowId = subWfFlowId;
          questionnaire = { id: 1, status: "FINISHED", questions: [{ score: 3 }, { score: 5 }] };
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "prepareRatingSubflow",
            params: [objId, flowId, questionnaire]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("prepareRatingWorkflow", function (done) {
        expect(function () {
          objId = objRatingUtilsId;
          flowId = wfInfo.flowId;
          questionnaire = { id: 1, status: "FINISHED", questions: [{ score: 3 }, { score: 5 }] };
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "prepareRatingWorkflow",
            params: [objId, flowId, questionnaire]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("readAllQuestionnaires", function (done) {
        expect(function () {
          objId = objRatingUtilsId;
          ratingFlowId = wfInfo.flowId;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "readAllQuestionnaires",
            params: [objId, ratingFlowId]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("readBlobValues", function (done) {
        expect(function () {
          objId = objRatingUtilsId;
          key = "RATING_SCORE1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "readBlobValues",
            params: [objId, key]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("readQuestionnaireData", function (done) {
        expect(function () {
          objId = objRatingUtilsId;
          ratingFlowId = wfInfo.flowId;
          userId = 0;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "readQuestionnaireData",
            params: [objId, ratingFlowId, userId]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("saveRatingData", function (done) {
        expect(function () {
          candidate = objRatingUtilsId;
          ratingFlowId = wfInfo.flowId;
          questionnaires = [{ id: 1, questions: [{ score: 3 }, { score: 5 }] }];
          params = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "saveRatingData",
            params: [candidate, ratingFlowId, questionnaires, params]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("sortQuestionnairesByUserId", function (done) {
        expect(function () {
          q1 = { userId: 3 };
          q2 = { userId: 1 };
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "sortQuestionnairesByUserId",
            params: [q1, q2]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("updateCandidateRatings", function (done) {
        expect(function () {
          candidate = objRatingUtilsId;
          ratingFlowId = wfInfo.flowId;
          questionnaires = [{ id: 1, questions: [{ score: 3 }, { score: 5 }] }];
          questionnaireConfigs = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "updateCandidateRatings",
            params: [candidate, ratingFlowId, questionnaires, questionnaireConfigs]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("writeQuestionnaireToWfMap", function (done) {
        expect(function () {
          objId = objRatingUtilsId;
          flowId = wfInfo.flowId;
          questionnaire = { id: 1, questions: [{ score: 3 }, { score: 5 }] };
          wfMapValues = { key: "key1", value: "value1" };
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib", {
            className: "sol.recruiting.RatingUtils",
            classConfig: {},
            method: "writeQuestionnaireToWfMap",
            params: [objId, flowId, questionnaire, wfMapValues]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("'Submit rating' forwarding Subworkflow 'sol.recruiting.Candidate.Rating.Sub'", function (done) {
        expect(function () {
          test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Rating forward'", true).then(function success1(forwardWorkflowTaskResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
              done();
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
    });
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
});