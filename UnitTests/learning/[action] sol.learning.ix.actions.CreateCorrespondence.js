
describe("[action] sol.learning.ix.actions.CreateCorrespondence", function () {
  var configAction, configTypes, correspondenceTypes, 
      wfInfo, objIdEnr, enrollmentPath, originalTimeout, objIdCo,
      succNodes, succNodesIds;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CreateCorrespondence", null, null).then(function success(objTempId) {
        enrollmentPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Kurs1/Einschreibungen/Administrator";
        test.Utils.getSord(enrollmentPath).then(function success1(sordEnrollement) {
          objIdEnr = sordEnrollement.id;
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
  describe("test create correspondence", function () {
    describe("test create correspondence", function () {
      it("should not throw if executed without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_action_Standard", {
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
    });
    describe("test finish createcorrespondence", function () {
      it("correspondenceTypes must be available", function (done) {
        expect(function () {
          configTypes = {
            $types: { 
              path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning/Configuration/Communication types/Correspondence", 
              shortenDesc: true, 
              maxDescLength: 255 
            } 
          };
          test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(correspondenceTypes1) {
            correspondenceTypes = correspondenceTypes1;
            expect(correspondenceTypes).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start action create workflow", function (done) {
        expect(function () {
          configAction = {
            objId: objIdEnr,
            $new: {
              target: {
                mode: "SELECTED"
              },
              template: {
                base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning/Configuration/Communication types/Correspondence",
                name: correspondenceTypes[0].name
              },
              name: "sol.learning.correspondence.create.prefix-YYYYMMDDHHmmss"
            },
            $name: "CreateCorrespondence",
            $wf: {
              name: "sol.learning.workflow.correspondence.create.message",
              template: {
                name: "sol.learning.enrollment.createCommunication"
              }
            },
            $events: [
              {
                id: "DIALOG",
                onWfStatus: ""
              },
              {
                id: "GOTO",
                onWfStatus: "CREATED"
              },
              {
                id: "FEEDBACK",
                onWfStatus: "SEND",
                message: "sol.learning.client.correspondence.feedback.sendl"
              }
            ],
            $metadata: {
              solType: "COMMUNICATION",
              owner: {
                fromConnection: true
              },
              objKeys: []
            }
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
      it("wfInfo.objId must be available", function () {
        expect(wfInfo.objId).toBeDefined();
      });
      it("fill communication sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordCo) {
            objIdCo = wfInfo.objId;
            test.Utils.updateKeywording(sordCo, { COMMUNICATION_SENDER: "test-business-solutions@elo.local", COMMUNICATION_RECIPIENT: "test-business-solutions@elo.local", COMMUNICATION_SUBJECT: "Solution Subject" }, true).then(function success1(updateKeywordingResult) {
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
      it("finish workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdCo).then(function success2(deleteResult1) {
            test.Utils.getFinishedWorkflows().then(function success3(wfs) {
              test.Utils.removeFinishedWorkflows(wfs).then(function success4(removeFinishedWorkflowsResult) {
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
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
});