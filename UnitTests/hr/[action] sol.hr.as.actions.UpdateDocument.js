
describe("[action] sol.hr.as.actions.UpdateDocument", function () {
  var personnelFileTypes,
      configAction, wfInfo, succNodes, succNodesIds, objIdHr1, objIdRep,
      params, templateId, templateFolderId, dvReport,
      originalTimeout, interval;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("As.Actions.UpdateDocument", null, null).then(function success(objTempId) {
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
  describe("test update document", function () {
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
            objIdHr1 = wfInfo.objId;
            test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_FIRSTNAME: "Bernd", HR_PERSONNEL_LASTNAME: "Stromberg", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
    describe("create document", function () {
      it("get document templateId should not throw", function (done) {
        expect(function () {
          templateFolderId = "ARCPATH:/Administration/Business Solutions/hr/Configuration/Document Templates";
          test.Utils.findChildren(templateFolderId).then(function success1(sords) {
            templateId = sords[0].id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start as action create document", function (done) {
        expect(function () {
          params = { parentId: objIdHr1, templateId: templateId, defaultName: "sol.common_monitoring.action.createDocument.name", wfFieldName: "HR_DOCUMENT_WF" };
          wfInfo = {};
          test.Utils.executeASActionHandler("hr", "sol.common_document.as.actions.CreateDocument", params, []).then(function success(jsonResults) {
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
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
              objIdRep = wfInfo.objId;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }, function error(err) {
            // fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflow", function (done) {
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
    describe("test finish 'update document'", function () {
      it("start as action update document", function (done) {
        expect(function () {
          params = { objId: objIdRep, templateId: objIdRep, prepared: true };
          wfInfo = {};
          test.Utils.executeASActionHandler("hr", "sol.common_document.as.actions.CreateDocument", params, []).then(function success(jsonResults) {
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
      it("wfInfo.objId must be available", function () {
        expect(wfInfo.objId).toBeDefined();
      });
      it("report must be available", function (done) {
        test.Utils.getSord(wfInfo.objId).then(function success(sordReport) {
          expect(sordReport).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("doc.size report must be available", function (done) {
        test.Utils.getCurrentWorkVersion(wfInfo.objId).then(function success(dvReport1) {
          dvReport = dvReport1;
          expect(dvReport.size).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("doc.size report must greater than zero", function () {
        expect(dvReport.size).toBeGreaterThan(0);
      });
    });
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdHr1).then(function success2(deleteResult1) {
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
});