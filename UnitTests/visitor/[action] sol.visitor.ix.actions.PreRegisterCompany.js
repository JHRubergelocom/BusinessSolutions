
describe("[action] sol.visitor.ix.actions.PreRegisterCompany", function () {
  var objTempId, objIdGr1,
      visitorCompanyTypes, wfInfo, succNodes, succNodesIds,
      keywording, mapdata, nowDateTime,
      configTypes, configAction,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.PreRegisterCompany", null, null).then(function success(objTempId1) {
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
  describe("test preregister company", function () {
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
  describe("test finish preregistercompany", function () {
    it("get current date, time", function () {
      expect(function () {
        nowDateTime = test.Utils.getNowDateTime();
      }).not.toThrow();
    });
    it("visitorCompanyTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/Visitor Company Types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(visitorCompanyTypes1) {
        visitorCompanyTypes = visitorCompanyTypes1;
        expect(visitorCompanyTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("visitorCompanyTypes.length must greater than zero", function () {
      expect(visitorCompanyTypes.length).toBeGreaterThan(0);
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objTempId,
          $metadata: {
            solType: "VISITOR_COMPANY",
            owner: {
              fromConnection: true
            }
          },
          $wf: {
            template: {
              name: "sol.visitor.visitor.preregistercompany"
            },
            name: "{{translate 'sol.visitor.workflow.preRegisterCompany'}}"
          },
          $name: "PreRegisterCompany",
          $events: [
            {
              id: "DIALOG"
            },
            {
              id: "GOTO",
              onWfStatus: "CREATE"
            }
          ],
          $new: {
            target: {
              mode: "DEFAULT"
            },
            template: {
              name: visitorCompanyTypes[0].name,
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/Visitor Company Types"
            }
          },
          $permissions: {
            mode: "SET",
            copySource: true,
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
    it("fill group sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordGr1) {
          objIdGr1 = wfInfo.objId;
          keywording = {
            VISITOR_COMPANYNAME: "Bremer Stadtmusikanten",
            VISITOR_VISITPURPOSE: "Platzkonzert",
            VISITOR_STARTDATE: nowDateTime.date,
            VISITOR_STARTTIME: nowDateTime.time
          };
          test.Utils.updateKeywording(sordGr1, keywording, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordGr1, [{ key: "desc", value: "Unittest desc1" }]).then(function success2(updateSordResult) {
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
    it("set number of visitors to 1 in group sord", function (done) {
      expect(function () {
        mapdata = {
          VISITOR_GROUPRESPONSIBLE1: 1,
          NUMBER_OF_VISITORS:	1,
          VISITOR_TOTALVISITORS: 1
        };
        test.Utils.updateMapData(objIdGr1, mapdata).then(function success(updateMapDataResult) {
          done();
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
  describe("test cancel preregistercompany", function () {
    it("get current date, time", function () {
      expect(function () {
        nowDateTime = test.Utils.getNowDateTime();
      }).not.toThrow();
    });
    it("visitorCompanyTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/Visitor Company Types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(visitorCompanyTypes1) {
        visitorCompanyTypes = visitorCompanyTypes1;
        expect(visitorCompanyTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("visitorCompanyTypes.length must greater than zero", function () {
      expect(visitorCompanyTypes.length).toBeGreaterThan(0);
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objTempId,
          $metadata: {
            solType: "VISITOR_COMPANY",
            owner: {
              fromConnection: true
            }
          },
          $wf: {
            template: {
              name: "sol.visitor.visitor.preregistercompany"
            },
            name: "{{translate 'sol.visitor.workflow.preRegisterCompany'}}"
          },
          $name: "PreRegisterCompany",
          $events: [
            {
              id: "DIALOG"
            },
            {
              id: "GOTO",
              onWfStatus: "CREATE"
            }
          ],
          $new: {
            target: {
              mode: "DEFAULT"
            },
            template: {
              name: visitorCompanyTypes[0].name,
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/Visitor Company Types"
            }
          },
          $permissions: {
            mode: "SET",
            copySource: true,
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
    it("fill group sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordGr2) {
          keywording = {
            VISITOR_COMPANYNAME: "Einzelkämpfer",
            VISITOR_VISITPURPOSE: "Sport",
            VISITOR_STARTDATE: nowDateTime.date,
            VISITOR_STARTTIME: nowDateTime.time
          };
          test.Utils.updateKeywording(sordGr2, keywording, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordGr2, [{ key: "desc", value: "Unittest desc2" }]).then(function success2(updateSordResult) {
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
    it("set number of visitors to 1 in group sord", function (done) {
      expect(function () {
        mapdata = {
          VISITOR_GROUPRESPONSIBLE1: 1,
          NUMBER_OF_VISITORS:	1,
          VISITOR_TOTALVISITORS: 1
        };
        test.Utils.updateMapData(objIdGr1, mapdata).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
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
          test.Utils.deleteSord(objIdGr1).then(function success2(deleteResult1) {
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