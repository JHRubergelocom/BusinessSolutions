
describe("[service] sol.checklist.ix.services.AddItem", function () {
  var objTempId, checklistTypes, objCL, originalTimeout,
      configAction, wfInfo, succNodes, succNodesIds,
      s1, item, e1, check, user, checklist, id, sord,
      config, dst, src, items, fromIdx, toIdx;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Services.AddItem", null, null).then(function success(objTempId1) {
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
  describe("Test Lib Functions", function () {
    describe("sol.checklist.ix.services.Checklist", function () {
      it("addItem", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "addItem",
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
      it("buildResponse", function (done) {
        expect(function () {
          s1 = "status1";
          item = {};
          e1 = "error1";
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "buildResponse",
            params: [s1, item, e1]
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
      it("checkItem", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "checkItem",
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
      it("checkItemObject", function (done) {
        expect(function () {
          item = {};
          check = true;
          user = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "checkItemObject",
            params: [item, check, user]
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
      it("createUser", function (done) {
        expect(function () {
          user = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "createUser",
            params: [user]
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
      it("editChecklist", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "editChecklist",
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
      it("editItem", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "editItem",
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
      it("getItemIndex", function (done) {
        expect(function () {
          checklist = {};
          id = 0;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "getItemIndex",
            params: [checklist, id]
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
      it("hasWriteAccess", function (done) {
        expect(function () {
          sord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "hasWriteAccess",
            params: [sord]
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
          config = { objId: objTempId };
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
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
      it("markItem", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "markItem",
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
      it("mergeItem", function (done) {
        expect(function () {
          dst = {};
          src = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "mergeItem",
            params: [dst, src]
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
      it("moveItem", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "moveItem",
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
      it("moveItemInArray", function (done) {
        expect(function () {
          items = [];
          fromIdx = 0;
          toIdx = 1;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "moveItemInArray",
            params: [items, fromIdx, toIdx]
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
      it("readChecklist", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "readChecklist",
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
      it("removeItem", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "removeItem",
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
      it("saveChecklist", function (done) {
        expect(function () {
          checklist = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "saveChecklist",
            params: [checklist]
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
      it("validateItem", function (done) {
        expect(function () {
          item = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.checklist.ix.services.Checklist",
            classConfig: { objId: objTempId },
            method: "validateItem",
            params: [item]
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
  describe("create checklist", function () {
    it("checklistTypes must be available", function (done) {
      test.Utils.execute("RF_sol_checklist_service_GetChecklistTypes", {}).then(function success(checklistTypes1) {
        checklistTypes = checklistTypes1;
        expect(checklistTypes).toBeDefined();
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
          checklistType: checklistTypes[0].name,
          checklistTemplateId: checklistTypes[0].objId
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_checklist_action_CreateChecklist", configAction, []).then(function success(jsonResults) {
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
    it("fill checklist sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordCL) {
          objCL = wfInfo.objId;
          test.Utils.updateKeywording(sordCL, { CHECKLIST_DESC: "Unittest CHECKLIST_DESC" }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordCL, [{ key: "name", value: "Unittest checklist" }]).then(function success2(updateSordResult) {
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
    it("finish workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "OK");
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_checklist_service_AddItem", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_AddItem", {
          }).then(function success(result) {
            fail(result);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed without 'item'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_AddItem", {
            objId: objCL
          }).then(function success(result) {
            expect(result.status).toEqual("FAILURE");
            expect(result.error).toEqual("checklist.item.invalid");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed without 'item.text'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_AddItem", {
            objId: objCL,
            item: "item"
          }).then(function success(result) {
            expect(result.status).toEqual("FAILURE");
            expect(result.error).toEqual("checklist.item.invalid");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("test additem", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_AddItem", {
            objId: objCL,
            item: { text: "text1", notes: "notes1" }
          }).then(function success(result) {
            expect(result.status).toEqual("SUCCESS");
            expect(result.item).toBeDefined();
            expect(result.item.id).toBeDefined();
            expect(result.item.text).toEqual("text1");
            expect(result.item.notes).toEqual("notes1");
            expect(result.item.checked).toEqual(false);
            expect(result.item.marked).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("test readchecklist", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_ReadChecklist", {
            objId: objCL
          }).then(function success(result) {
            expect(result.items).toBeDefined();
            expect(result.items[0].text).toEqual("text1");
            expect(result.items[0].notes).toEqual("notes1");
            expect(result.writable).toBeDefined();
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