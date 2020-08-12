
describe("[action] sol.datev.accounting.ix.actions.LockAndUnlockInvoice", function () {
  var objTempId, checkResult,
      config, wfInfo, succNodes, succNodesIds,
      nowDateTime, keywording,
      firstName, lastName, companyName, contactReference,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.LockAndUnlockInvoice", null, null).then(function success(objTempId1) {
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
  describe("test lock and unlock Invoice", function () {
    it("should throw if executed without parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_datev_accounting_action_LockAndUnlockInvoice", {
        }).then(function success(jsonResult) {
          fail(jsonResult);
          done();
        }, function error(err) {
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
  });
  describe("test lock lock and unlock Invoice", function () {
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_accounting_function_CheckLockPreCondition", { targetId: objTempId }).then(function success(checkResult1) {
          checkResult = checkResult1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("checkResult.valid equal true", function () {
      expect(checkResult.valid).toEqual(true);
    });
    it("start action create workflow", function (done) {
      expect(function () {
        config = {
          sordId: objTempId, 
          template: "sol.datev.accounting.Base.SetLock", 
          title: "sol.datev.accounting.action.title", 
          workflowName: "sol.datev.accounting.action.title"
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_datev_accounting_action_LockAndUnlockInvoice", config, []).then(function success(jsonResults) {
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
    xit("fill datev.accounting sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordVs1) {
          keywording = {
            DATEV_ACCOUNTING_FIRSTNAME: firstName,
            DATEV_ACCOUNTING_LASTNAME: lastName,
            DATEV_ACCOUNTING_COMPANYNAME: companyName,
            DATEV_ACCOUNTING_VISITPURPOSE: "Unittest",
            DATEV_ACCOUNTING_STARTDATE: nowDateTime.date,
            DATEV_ACCOUNTING_STARTTIME: nowDateTime.time,
            DATEV_ACCOUNTING_SECURITY_CLEARANCE: "IP"
          };
          test.Utils.updateKeywording(sordVs1, keywording, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordVs1, [{ key: "desc", value: "Unittest desc1" }]).then(function success2(updateSordResult) {
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
    xit("set total datev.accountings and contactreference in datev.accounting sord", function (done) {
      expect(function () {
        test.Utils.updateMapData(objTempId, { DATEV_ACCOUNTING_TOTALDATEV_ACCOUNTINGS: 1, DATEV_ACCOUNTING_CONTACT_REFERENCE: contactReference }).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("lock forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.datev.accounting.base.workflow.lock");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest lock input", true).then(function success1(forwardWorkflowTaskResult) {
            done();
          }, function error(err) {
            // fail(err);
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
    xit("remove workflow", function (done) {
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
  describe("test unlock lock and unlock Invoice", function () {
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_accounting_function_CheckLockPreCondition", { targetId: objTempId }).then(function success(checkResult1) {
          checkResult = checkResult1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("checkResult.valid equal true", function () {
      expect(checkResult.valid).toEqual(true);
    });
    it("start action create workflow", function (done) {
      expect(function () {
        config = {
          sordId: objTempId, 
          template: "sol.datev.accounting.Base.SetLock", 
          title: "sol.datev.accounting.action.title", 
          workflowName: "sol.datev.accounting.action.title"
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_datev_accounting_action_LockAndUnlockInvoice", config, []).then(function success(jsonResults) {
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
    xit("fill datev.accounting sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordVs2) {
          keywording = {
            DATEV_ACCOUNTING_FIRSTNAME: "Nils", DATEV_ACCOUNTING_LASTNAME: "Armstrong",
            DATEV_ACCOUNTING_COMPANYNAME: "Freier Astronaut",
            DATEV_ACCOUNTING_VISITPURPOSE: "Raumflug",
            DATEV_ACCOUNTING_STARTDATE: nowDateTime.date,
            DATEV_ACCOUNTING_STARTTIME: nowDateTime.time,
            DATEV_ACCOUNTING_SECURITY_CLEARANCE: "NC"
          };
          test.Utils.updateKeywording(sordVs2, keywording, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordVs2, [{ key: "desc", value: "Unittest desc2" }]).then(function success2(updateSordResult) {
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
    xit("set total datev.accountings in datev.accounting sord", function (done) {
      expect(function () {
        test.Utils.updateMapData(objTempId, { DATEV_ACCOUNTING_TOTALDATEV_ACCOUNTINGS: 1 }).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("unlock forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.datev.accounting.base.workflow.unlock");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest unlock input").then(function success1(forwardWorkflowTaskResult) {
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
        test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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
  describe("test cancel lock and unlock Invoice", function () {
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_accounting_function_CheckLockPreCondition", { targetId: objTempId }).then(function success(checkResult1) {
          checkResult = checkResult1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("checkResult.valid equal true", function () {
      expect(checkResult.valid).toEqual(true);
    });
    it("start action create workflow", function (done) {
      expect(function () {
        config = {
          sordId: objTempId, 
          template: "sol.datev.accounting.Base.SetLock", 
          title: "sol.datev.accounting.action.title", 
          workflowName: "sol.datev.accounting.action.title"
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_datev_accounting_action_LockAndUnlockInvoice", config, []).then(function success(jsonResults) {
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
    xit("fill datev.accounting sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordVs2) {
          keywording = {
            DATEV_ACCOUNTING_FIRSTNAME: "Nils", DATEV_ACCOUNTING_LASTNAME: "Armstrong",
            DATEV_ACCOUNTING_COMPANYNAME: "Freier Astronaut",
            DATEV_ACCOUNTING_VISITPURPOSE: "Raumflug",
            DATEV_ACCOUNTING_STARTDATE: nowDateTime.date,
            DATEV_ACCOUNTING_STARTTIME: nowDateTime.time,
            DATEV_ACCOUNTING_SECURITY_CLEARANCE: "NC"
          };
          test.Utils.updateKeywording(sordVs2, keywording, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordVs2, [{ key: "desc", value: "Unittest desc2" }]).then(function success2(updateSordResult) {
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
    xit("set total datev.accountings in datev.accounting sord", function (done) {
      expect(function () {
        test.Utils.updateMapData(objTempId, { DATEV_ACCOUNTING_TOTALDATEV_ACCOUNTINGS: 1 }).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("cancel forwarding workflow", function (done) {
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
        test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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