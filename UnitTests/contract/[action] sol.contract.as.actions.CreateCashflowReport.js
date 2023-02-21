
describe("[action] sol.contract.as.actions.CreateCashFlowReport", function () {
  var objIdCr1, objIdCr2, contractTypes,
      configAction, succNodes, succNodesIds,
      repTemplates, repTemplateId, params, objId,
      wfInfo, originalTimeout, mapPaymantplan;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL; 
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("As.Actions.CreateCashFlowReport", null, null).then(function success(objTempId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("create contract1", function () {
    it("contractTypes must be available", function (done) {
      test.Utils.execute("RF_sol_contract_service_GetContractTypes", {}).then(function success(contractTypes1) {
        contractTypes = contractTypes1;
        expect(contractTypes).toBeDefined();
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
          contractType: contractTypes[0].name,
          templateId: contractTypes[0].objId
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_contract_action_CreateContract", configAction, []).then(function success(jsonResults) {
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
    it("fill contract sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordCr1) {
          objIdCr1 = wfInfo.objId;
          test.Utils.updateKeywording(sordCr1, { CONTRACT_NAME: "Unittest CONTRACT_NAME1", CONTACT_FIRSTNAME: "Bernd", CONTACT_LASTNAME: "Stromberg", SOL_TYPE: "CONTRACT" }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordCr1, [{ key: "desc", value: "Unittest desc1" }]).then(function success2(updateSordResult) {
              test.Utils.updateMapData(objIdCr1, { CONTRACT_CREATE_PARTNER: "0" }).then(function success3(updateMapDataResult) {
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
    it("Add Paymentplan to Contract", function (done) {
      expect(function () {
        mapPaymantplan = {
          CONTRACT_CASHFLOW_AMOUNT1:	10.00,
          CONTRACT_CASHFLOW_AMOUNT2:	20.00,
          CONTRACT_CASHFLOW_DESC1:	"1 Zahlung",
          CONTRACT_CASHFLOW_DESC2:	"2 Zahlung",
          CONTRACT_CASHFLOW_RECURRING_UNIT1:	"O - einmalig",
          CONTRACT_CASHFLOW_RECURRING_UNIT2:	"O - einmalig",
          CONTRACT_CASHFLOW_SINGLE1:	10.00,
          CONTRACT_CASHFLOW_SINGLE2:	20.00
        };
        test.Utils.updateMapData(objIdCr1, mapPaymantplan).then(function success4(updateMapDataResult) {
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
  describe("create contract2", function () {
    it("contractTypes must be available", function (done) {
      test.Utils.execute("RF_sol_contract_service_GetContractTypes", {}).then(function success(contractTypes1) {
        contractTypes = contractTypes1;
        expect(contractTypes).toBeDefined();
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
          contractType: contractTypes[0].name,
          templateId: contractTypes[0].objId
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_contract_action_CreateContract", configAction, []).then(function success(jsonResults) {
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
    it("fill contract sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordCr2) {
          objIdCr2 = wfInfo.objId;
          test.Utils.updateKeywording(sordCr2, { CONTRACT_NAME: "Unittest CONTRACT_NAME2", CONTACT_FIRSTNAME: "Nils", CONTACT_LASTNAME: "Armstrong", SOL_TYPE: "CONTRACT" }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordCr2, [{ key: "desc", value: "Unittest desc2" }]).then(function success2(updateSordResult) {
              test.Utils.updateMapData(objIdCr2, { CONTRACT_CREATE_PARTNER: "0" }).then(function success3(updateMapDataResult) {
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
    it("Add Paymentplan to Contract", function (done) {
      expect(function () {
        mapPaymantplan = {
          CONTRACT_CASHFLOW_AMOUNT1:	10.00,
          CONTRACT_CASHFLOW_AMOUNT2:	20.00,
          CONTRACT_CASHFLOW_DESC1:	"1 Zahlung",
          CONTRACT_CASHFLOW_DESC2:	"2 Zahlung",
          CONTRACT_CASHFLOW_RECURRING_UNIT1:	"O - einmalig",
          CONTRACT_CASHFLOW_RECURRING_UNIT2:	"O - einmalig",
          CONTRACT_CASHFLOW_SINGLE1:	10.00,
          CONTRACT_CASHFLOW_SINGLE2:	20.00
        };
        test.Utils.updateMapData(objIdCr2, mapPaymantplan).then(function success4(updateMapDataResult) {
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
  describe("test create cashflowreport", function () {
    it("get ReportTemplates should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_contract_service_ReportTemplates", { filter: { type: "cashflow" } }).then(function success(repTemplates1) {
          repTemplates = repTemplates1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("repTemplates.length must greater than zero", function () {
      expect(repTemplates.length).toBeGreaterThan(0);
    });
    it("start as action create cashflowreport", function (done) {
      expect(function () {
        repTemplateId = repTemplates[0].objId;
        test.Utils.getSord(objIdCr1).then(function success(sordCr1) {
          test.Utils.getSord(sordCr1.parentId).then(function success1(sordCr1p) {
            objId = sordCr1p.id;
            params = { templateId: repTemplateId, parentId: objId };
            test.Utils.executeASActionHandler("contract", "sol.contract.as.actions.CreateCashflowReport", params, []).then(function success4(jsonResults) {
              test.Utils.handleAllEvents(jsonResults).then(function success5(evInfo) {
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdCr1).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdCr2).then(function success3(deleteResult2) {
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