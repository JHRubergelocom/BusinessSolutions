
describe("[action] sol.privacy.ix.actions.Create", function () {
  var objTempId, processingActivityTypes,
      configTypes, configAction, wfInfo, objIdP,
      succNodes, succNodesIds, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.Create", null, null).then(function success(objTempId1) {
        objTempId = objTempId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("test start create", function () {
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
    describe("'OK'", function () {
      describe("test finish create", function () {
        it("processingActivityTypes must be available", function (done) {
          configTypes = {
            $types: {
              path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/privacy/Configuration/Processing activity types"
            }
          };
          test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(processingActivityTypes1) {
            processingActivityTypes = processingActivityTypes1;
            expect(processingActivityTypes).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        });
        it("start action create workflow", function (done) {
          expect(function () {
            configAction = {
              objId: objTempId,
              $new: {
                target: {
                  mode: "DEFAULT"
                },
                name: "{{translate 'sol.gdpr.processingactivity.create.workflow.name'}}",
                template: {
                  base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/privacy/Configuration/Processing activity types",
                  name: processingActivityTypes[0].name
                }
              },
              $name: "sol.privacy.gdpr.processingactivity.create",
              $wf: {
                name: "{{translate 'sol.gdpr.processingactivity.create.workflow.name'}}",
                template: {
                  name: "sol.privacy.gdpr.processingactivity.create"
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
                }
              ],
              $permissions: {
                mode: "SET",
                copySource: true,
                inherit: {
                  fromDirectParent: false
                }
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
        it("fill process activity sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordP) {
              objIdP = wfInfo.objId;
              test.Utils.updateKeywording(sordP, { PROC_ACTIVITY_CHANGED_DATE: "20191120", PROC_ACTIVITY_DESCRIPTION: "Activität1", PROC_ACTIVITY_RESPONSIBLE_DEPARTMENT: "15 Abteilung A" }, true).then(function success1(updateKeywordingResult) {
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
        it("finish input forwarding workflow", function (done) {
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
      });
    });
    describe("'Cancel'", function () {
      describe("test cancel create", function () {
        it("processingActivityTypes must be available", function (done) {
          configTypes = {
            $types: {
              path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/privacy/Configuration/Processing activity types"
            }
          };
          test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(processingActivityTypes1) {
            processingActivityTypes = processingActivityTypes1;
            expect(processingActivityTypes).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        });
        it("start action create workflow", function (done) {
          expect(function () {
            configAction = {
              objId: objTempId,
              $new: {
                target: {
                  mode: "DEFAULT"
                },
                name: "{{translate 'sol.gdpr.processingactivity.create.workflow.name'}}",
                template: {
                  base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/privacy/Configuration/Processing activity types",
                  name: processingActivityTypes[0].name
                }
              },
              $name: "sol.privacy.gdpr.processingactivity.create",
              $wf: {
                name: "{{translate 'sol.gdpr.processingactivity.create.workflow.name'}}",
                template: {
                  name: "sol.privacy.gdpr.processingactivity.create"
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
                }
              ],
              $permissions: {
                mode: "SET",
                copySource: true,
                inherit: {
                  fromDirectParent: false
                }
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
        it("cancel input forwarding workflow", function (done) {
          expect(function () {
            test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
              succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.cancel");
              succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
              test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest cancel input").then(function success1(forwardWorkflowTaskResult) {
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
              test.Utils.deleteSord(objIdP).then(function success4(deleteResult1) {
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