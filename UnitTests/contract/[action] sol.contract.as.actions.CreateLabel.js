
describe("[action] sol.contract.as.actions.CreateLabel", function () {
  var objIdCr, contractTypes,
      succNodes, succNodesIds,
      params, targetId, templateId,
      configAction, labelTypes, dvReport,
      wfInfo, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("As.Actions.CreateLabel", null, null).then(function success(objTempId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("create contract", function () {
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
        test.Utils.getSord(wfInfo.objId).then(function success(sordCr) {
          objIdCr = wfInfo.objId;
          test.Utils.updateKeywording(sordCr, { CONTRACT_NAME: "Unittest CONTRACT_NAME1", CONTACT_FIRSTNAME: "Bernd", CONTACT_LASTNAME: "Stromberg", CONTRACT_CASHFLOW_SUM_LOCAL_CURR: "2000" }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordCr, [{ key: "desc", value: "Unittest desc1" }]).then(function success2(updateSordResult) {
              test.Utils.updateMapData(objIdCr, { CONTRACT_CREATE_PARTNER: "0" }).then(function success3(updateMapDataResult) {
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
  describe("test create label from template", function () {
    it("labelTypes must be available", function (done) {
      test.Utils.execute("RF_sol_contract_service_PrepareContractLabel", { targetId: objIdCr }).then(function success(prepareResult) {
        expect(prepareResult.valid).toBeDefined();
        expect(prepareResult.types).toBeDefined();
        labelTypes = prepareResult.types;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("labelTypes.length must greater than zero", function () {
      expect(labelTypes.length).toBeGreaterThan(0);
    });
    it("start as action create label", function (done) {
      expect(function () {
        targetId = objIdCr;
        templateId = labelTypes[0].objId;

        params = { templateId: templateId, targetId: targetId };
        test.Utils.executeASActionHandler("contract", "sol.contract.as.actions.CreateLabel", params, []).then(function success(jsonResults) {
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdCr).then(function success2(deleteResult1) {
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