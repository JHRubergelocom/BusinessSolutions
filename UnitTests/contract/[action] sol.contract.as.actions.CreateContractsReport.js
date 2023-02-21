
describe("[action] sol.contract.as.actions.CreateContractsReport", function () {
  var objIdCr1, objIdCr2, contractTypes,
      configAction, succNodes, succNodesIds,
      repTemplates, repTemplateId, params, objId,
      wfInfo, objIdRep, dvReport, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("As.Actions.CreateContractsReport", null, null).then(function success(objTempId) {
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
          test.Utils.updateKeywording(sordCr1, { CONTRACT_NAME: "Unittest CONTRACT_NAME1", CONTACT_FIRSTNAME: "Bernd", CONTACT_LASTNAME: "Stromberg", CONTRACT_CASHFLOW_SUM_LOCAL_CURR: "2000" }, true).then(function success1(updateKeywordingResult) {
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
          test.Utils.updateKeywording(sordCr2, { CONTRACT_NAME: "Unittest CONTRACT_NAME2", CONTACT_FIRSTNAME: "Nils", CONTACT_LASTNAME: "Armstrong", CONTRACT_CASHFLOW_SUM_LOCAL_CURR: "2000" }, true).then(function success1(updateKeywordingResult) {
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
  describe("test create contractsreport", function () {
    it("get ReportTemplates should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_contract_service_ReportTemplates", { filter: { type: "contracts" } }).then(function success(repTemplates1) {
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
    it("start as action create contractsreport", function (done) {
      expect(function () {
        repTemplateId = repTemplates[0].objId;
        test.Utils.getSord(objIdCr1).then(function success(sordCr1) {
          test.Utils.getSord(sordCr1.parentId).then(function success1(sordCr1p) {
            test.Utils.getSord(sordCr1p.parentId).then(function success2(sordCr1pp) {
              test.Utils.getSord("ARCPATH:/_TestTemp").then(function success3(sordTemp) {
                objId = sordTemp.id;
                params = { templateId: repTemplateId, parentId: objId };
                test.Utils.executeASActionHandler("contract", "sol.contract.as.actions.CreateContractsReport", params, []).then(function success4(jsonResults) {
                  test.Utils.handleAllEvents(jsonResults).then(function success5(wfInfo1) {
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
    it("wfInfo.objId must be available", function () {
      objIdRep = wfInfo.objId;
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
    it("doc.size must greater than zero", function () {
      expect(dvReport.size).toBeGreaterThan(0);
    });
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdCr1).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdCr2).then(function success3(deleteResult2) {
              test.Utils.deleteSord(objIdRep).then(function success4(deleteResult3) {
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