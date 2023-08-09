
describe("[action] sol.hr.ix.actions.EmployeeCorrespondenceTemplate", function () {
  var objIdCt, objTempId,
      configAction, wfInfo,
      succNodes, succNodesIds, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.EmployeeCorrespondenceTemplate", null, null).then(function success(objTempId1) {
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
  describe("test employee correspondence template", function () {
    it("should not throw if executed without 'objId'", function (done) {
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
      describe("test finish employeecorrespondence template", function () {
        it("start action employeecorrespondencetemplate workflow", function (done) {
          expect(function () {
            configAction = {
              $name: "EmployeeCorrespondenceTemplate",
              objId: objTempId,
              $metadata: {
                solType: "HR_COMMUNICATION_TEMPLATE",
                owner: {
                  fromConnection: true
                },
                objKeys: [],
                mapItems: [
                  {
                    key: "HR_PERSONNEL_FILE",
                    value: "{{sord.guid}}"
                  }
                ]
              },
              $wf: {
                template: {
                  name: "sol.hr.personnel.correspondence.template"
                },
                name: "{{translate 'sol.hr.form.correspondence.createTemplate.title'}}"
              },
              $events: [
                {
                  id: "DIALOG"
                },
                {
                  id: "GOTO",
                  onWfStatus: "CREATED",
                  message: ""
                }
              ],
              $new: {
                target: {
                  mode: "DEFAULT"
                },
                template: {
                  objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/hr/Configuration/Communication Templates/Base"
                }
              },
              $permissions: {
                mode: "SET",
                copySource: false,
                inherit: {
                  fromDirectParent: true
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
        it("fill corrospondence template sord", function (done) {
          expect(function () {
            objIdCt = wfInfo.objId;
            test.Utils.getSord(wfInfo.objId).then(function success(sordCt) {
              test.Utils.updateKeywording(sordCt, {
                COMMUNICATION_SENDER: "test-business-solutions@elo.local",
                COMMUNICATION_RECIPIENT: "test-business-solutions@elo.local",
                COMMUNICATION_SUBJECT: "Subject Employee Correspondence"
              }, true).then(function success1(updateKeywordingResult) {
                test.Utils.updateSord(sordCt, [{ key: "name", value: "Unittest" }, { key: "desc", value: "Content Employee Correspondence" }]).then(function success2(updateSordResult) {
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
        it("remove corrospondence template object", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdCt).then(function success(deleteResult) {
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
    });
    describe("'Cancel'", function () {
      describe("test cancel employeecorrespondencetemplate", function () {
        it("start action employeecorrespondencetemplate workflow", function (done) {
          expect(function () {
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
        it("remove workflows", function (done) {
          expect(function () {
            test.Utils.getActiveWorkflows().then(function success(wfs) {
              test.Utils.removeActiveWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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