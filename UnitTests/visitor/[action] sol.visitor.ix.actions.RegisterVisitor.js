
describe("[action] sol.visitor.ix.actions.RegisterVisitor", function () {
  var objTempId, checkResult, objIdVs1, objIdVs2,
      visitorTypes, config, wfInfo, succNodes, succNodesIds,
      nowDateTime, keywording, originalTimeout,
      visitorType;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.RegisterVisitor", null, null).then(function success(objTempId1) {
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
  describe("test register visitor", function () {
    it("should throw if executed without 'user' and 'visitorType'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_action_RegisterVisitor", {
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
  describe("Test Lib Functions", function () {
    describe("sol.visitor.ix.actions.RegisterVisitor", function () {
      it("buildElementName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.RegisterVisitor",
            classConfig: {},
            method: "buildElementName",
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
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.RegisterVisitor",
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
      it("getTemplateArcPath", function (done) {
        expect(function () {
          visitorType = "visitorType1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.RegisterVisitor",
            classConfig: {},
            method: "getTemplateArcPath",
            params: [visitorType]
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
          config = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.RegisterVisitor",
            classConfig: {},
            method: "initialize",
            params: [config]
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
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.RegisterVisitor",
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
    });
  });
  describe("test finish registervisitor", function () {
    it("get current date, time", function () {
      expect(function () {
        nowDateTime = test.Utils.getNowDateTime();
      }).not.toThrow();
    });
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_service_CheckVisitorPreconditions", { targetId: objTempId }).then(function success(checkResult1) {
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
    it("visitorTypes must be available", function () {
      visitorTypes = checkResult.types;
      expect(visitorTypes).toBeDefined();
    });
    it("visitorTypes.length must greater than zero", function () {
      expect(visitorTypes.length).toBeGreaterThan(0);
    });
    it("start action create workflow", function (done) {
      expect(function () {
        config = {
          parentId: objTempId,
          visitorType: visitorTypes[0].name,
          templateId: visitorTypes[0].objId
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_visitor_action_RegisterVisitor", config, []).then(function success(jsonResults) {
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
    it("fill visitor sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordVs1) {
          objIdVs1 = wfInfo.objId;
          keywording = {
            VISITOR_FIRSTNAME: "Bernd", VISITOR_LASTNAME: "Stromberg",
            VISITOR_COMPANYNAME: "Capitol Versicherungen",
            VISITOR_STARTDATE: nowDateTime.date,
            VISITOR_STARTTIME: nowDateTime.time,
            VISITOR_ARRIVALDATE: nowDateTime.date,
            VISITOR_ARRIVALTIME: nowDateTime.time
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
    it("set total visitors in visitor sord", function (done) {
      expect(function () {
        test.Utils.updateMapData(objIdVs1, { VISITOR_TOTALVISITORS: 1 }).then(function success(updateMapDataResult) {
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
    it("remove workflow", function (done) {
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
  describe("test cancel registervisitor", function () {
    it("get current date, time", function () {
      expect(function () {
        nowDateTime = test.Utils.getNowDateTime();
      }).not.toThrow();
    });
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_service_CheckVisitorPreconditions", { targetId: objTempId }).then(function success(checkResult1) {
          checkResult = checkResult1;
          visitorTypes = checkResult.types;
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
        config = {
          parentId: objTempId,
          visitorType: visitorTypes[0].name,
          templateId: visitorTypes[0].objId
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_visitor_action_RegisterVisitor", config, []).then(function success(jsonResults) {
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
    it("fill visitor sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordVs2) {
          objIdVs2 = wfInfo.objId;
          keywording = {
            VISITOR_FIRSTNAME: "Nils", VISITOR_LASTNAME: "Armstrong",
            VISITOR_COMPANYNAME: "Freier Astronaut",
            VISITOR_STARTDATE: nowDateTime.date,
            VISITOR_STARTTIME: nowDateTime.time,
            VISITOR_ARRIVALDATE: nowDateTime.date,
            VISITOR_ARRIVALTIME: nowDateTime.time
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
    it("set total visitors in visitor sord", function (done) {
      expect(function () {
        test.Utils.updateMapData(objIdVs2, { VISITOR_TOTALVISITORS: 1 }).then(function success(updateMapDataResult) {
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
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Cancel");
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
          test.Utils.deleteSord(objIdVs1).then(function success2(deleteResult1) {
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