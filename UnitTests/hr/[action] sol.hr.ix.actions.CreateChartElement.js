
describe("[action] sol.hr.ix.actions.CreateChartElement", function () {
  var personnelFileTypes, objIdHr,
      configAction, wfInfo,
      chartTypes, chartRootTypes, objChartRootElement,
      succNodes, succNodesIds, originalTimeout, interval,
      params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CreateChartElement", null, null).then(function success(objTempId) {
        interval = 4000;
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
    describe("sol.hr.ix.actions.CreateChartElement", function () {
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.actions.CreateChartElement",
            classConfig: {},
            method: "getName",
            params: []
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
      it("initialize", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.actions.CreateChartElement",
            classConfig: {},
            method: "initialize",
            params: [params]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.actions.CreateChartElement",
            classConfig: {},
            method: "process",
            params: []
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
  describe("test start create root element", function () {
    it("should not throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_hr_personnel_action_CreateChartElement", {
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
      describe("create personnelfile hr1", function () {
        it("personnelFileTypes must be available", function (done) {
          test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
            personnelFileTypes = personnelFileTypes1;
            expect(personnelFileTypes).toBeDefined();
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
              typeName: personnelFileTypes[0].name,
              typeObjId: personnelFileTypes[0].objId,
              typeSource: personnelFileTypes[0].source,
              typeSourceName: personnelFileTypes[0].sourceName
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
        it("fill personnelfile sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordHr1) {
              objIdHr = wfInfo.objId;
              test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_FIRSTNAME: "Bernd", HR_PERSONNEL_LASTNAME: "Stromberg", HR_PERSONNEL_ELOUSERID: "Administrator", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
        it("setTimeout (wait for background job change rights)", function (done) {
          expect(function () {
            test.Utils.setTimeout(interval).then(function success(timeoutResult) {
              done();
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
      describe("create chartroot element", function () {
        it("get chartroot types", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_hr_service_GetChartRootTypes", {
              targetId: objIdHr
            }).then(function success(jsonResult) {
              chartRootTypes = jsonResult.types;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("start action createchartrootelement workflow", function (done) {
          expect(function () {
            configAction = {
              typeId: chartRootTypes[0].id,
              typeSelectedGuid: chartRootTypes[0].selectedGuid,
              typeName: chartRootTypes[0].name,
              typeDescription: chartRootTypes[0].desc,
              typeShortdesc: chartRootTypes[0].shortdesc,
              typeTargetMaskName: chartRootTypes[0].targetMaskName,
              typeTargetSoltype: chartRootTypes[0].targetSoltype,
              typeTargetSordTypeName: chartRootTypes[0].targetSordTypeName,
              typeStandardAuthorityRoleName: "",
              typeStandardDeputyRoleName: "",
              typeWorkflow: chartRootTypes[0].workflow
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateChartElement", configAction, []).then(function success(jsonResults) {
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
        it("finish input forwarding workflow", function (done) {
          expect(function () {
            test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
              objChartRootElement = wfInfo.objId;
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
      describe("test finish createchartelement", function () {
        it("get chart types", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_hr_service_GetChartElementTypes", {
              targetId: objChartRootElement
            }).then(function success(jsonResult) {
              chartTypes = jsonResult.types;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("chartTypes must be available", function () {
          expect(chartTypes).toBeDefined();
        });
        it("chartTypes.length must greater than zero", function () {
          expect(chartTypes.length).toBeGreaterThan(0);
        });
        it("start action createchartelement workflow", function (done) {
          expect(function () {
            configAction = {
              typeId: chartTypes[0].id,
              typeSelectedGuid: chartTypes[0].selectedGuid,
              typeName: chartTypes[0].name,
              typeDescription: chartTypes[0].desc,
              typeShortdesc: chartTypes[0].shortdesc,
              typeTargetMaskName: chartTypes[0].targetMaskName,
              typeTargetSoltype: chartTypes[0].targetSoltype,
              typeTargetSordTypeName: chartTypes[0].targetSordTypeName,
              typeStandardAuthorityRoleName: "",
              typeStandardDeputyRoleName: "",
              typeWorkflow: chartTypes[0].workflow
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateChartElement", configAction, []).then(function success(jsonResults) {
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
        it("remove hr object", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr).then(function success(deleteResult) {
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
      describe("create personnelfile hr2", function () {
        it("personnelFileTypes must be available", function (done) {
          test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
            personnelFileTypes = personnelFileTypes1;
            expect(personnelFileTypes).toBeDefined();
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
              typeName: personnelFileTypes[0].name,
              typeObjId: personnelFileTypes[0].objId,
              typeSource: personnelFileTypes[0].source,
              typeSourceName: personnelFileTypes[0].sourceName
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
        it("fill personnelfile sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordHr2) {
              objIdHr = wfInfo.objId;
              test.Utils.updateKeywording(sordHr2, { HR_PERSONNEL_FIRSTNAME: "Nils", HR_PERSONNEL_LASTNAME: "Armstrong", HR_PERSONNEL_ELOUSERID: "Administrator", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
        it("setTimeout (wait for background job change rights)", function (done) {
          expect(function () {
            test.Utils.setTimeout(interval).then(function success(timeoutResult) {
              done();
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
      describe("create chartroot element", function () {
        it("get chartroot types", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_hr_service_GetChartRootTypes", {
              targetId: objIdHr
            }).then(function success(jsonResult) {
              chartRootTypes = jsonResult.types;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("start action createchartrootelement workflow", function (done) {
          expect(function () {
            configAction = {
              typeId: chartRootTypes[0].id,
              typeSelectedGuid: chartRootTypes[0].selectedGuid,
              typeName: chartRootTypes[0].name,
              typeDescription: chartRootTypes[0].desc,
              typeShortdesc: chartRootTypes[0].shortdesc,
              typeTargetMaskName: chartRootTypes[0].targetMaskName,
              typeTargetSoltype: chartRootTypes[0].targetSoltype,
              typeTargetSordTypeName: chartRootTypes[0].targetSordTypeName,
              typeStandardAuthorityRoleName: "",
              typeStandardDeputyRoleName: "",
              typeWorkflow: chartRootTypes[0].workflow
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateChartElement", configAction, []).then(function success(jsonResults) {
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
        it("finish input forwarding workflow", function (done) {
          expect(function () {
            test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
              objChartRootElement = wfInfo.objId;
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
      describe("test cancel createchartelement", function () {
        it("get chart types", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_hr_service_GetChartElementTypes", {
              targetId: objChartRootElement
            }).then(function success(jsonResult) {
              chartTypes = jsonResult.types;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("chartTypes must be available", function () {
          expect(chartTypes).toBeDefined();
        });
        it("chartTypes.length must greater than zero", function () {
          expect(chartTypes.length).toBeGreaterThan(0);
        });
        it("start action createchartelement workflow", function (done) {
          expect(function () {
            configAction = {
              typeId: chartTypes[0].id,
              typeSelectedGuid: chartTypes[0].selectedGuid,
              typeName: chartTypes[0].name,
              typeDescription: chartTypes[0].desc,
              typeShortdesc: chartTypes[0].shortdesc,
              typeTargetMaskName: chartTypes[0].targetMaskName,
              typeTargetSoltype: chartTypes[0].targetSoltype,
              typeTargetSordTypeName: chartTypes[0].targetSordTypeName,
              typeStandardAuthorityRoleName: "",
              typeStandardDeputyRoleName: "",
              typeWorkflow: chartTypes[0].workflow
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateChartElement", configAction, []).then(function success(jsonResults) {
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
        it("remove hr object", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr).then(function success(deleteResult) {
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