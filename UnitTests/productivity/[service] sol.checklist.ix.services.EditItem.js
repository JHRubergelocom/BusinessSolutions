
describe("[service] sol.checklist.ix.services.EditItem", function () {
  var objTempId, checklistTypes, objCL, originalTimeout,
      configAction, wfInfo, succNodes, succNodesIds;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Services.EditItem", null, null).then(function success(objTempId1) {
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
    describe("RF_sol_checklist_service_EditItem", function () {
      it("additem item1", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_AddItem", {
            objId: objCL,
            item: {
              text: "text1",
              notes: "notes1"
            }
          }).then(function success(result) {
            expect(result.status).toEqual("SUCCESS");
            expect(result.item).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("additem item2", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_AddItem", {
            objId: objCL,
            item: {
              text: "text2",
              notes: "notes2"
            }
          }).then(function success(result) {
            expect(result.status).toEqual("SUCCESS");
            expect(result.item).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_EditItem", {
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
          test.Utils.execute("RF_sol_checklist_service_EditItem", {
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
      it("should not throw if executed without 'item.id'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_EditItem", {
            objId: objCL,
            item: { text: "text" }
          }).then(function success(result) {
            expect(result.status).toEqual("FAILURE");
            expect(result.error).toEqual("checklist.missing.item.id");
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
          test.Utils.execute("RF_sol_checklist_service_EditItem", {
            objId: objCL,
            item: { id: 3 }
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
      it("test edititem", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_checklist_service_EditItem", {
            objId: objCL,
            item: { id: 1, text: "text1 edited", notes: "notes1 edited" }
          }).then(function success(result) {
            expect(result.status).toEqual("SUCCESS");
            expect(result.item).toBeDefined();
            expect(result.item.id).toEqual(1);
            expect(result.item.text).toEqual("text1 edited");
            expect(result.item.notes).toEqual("notes1 edited");
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
            expect(result.items[0].text).toEqual("text1 edited");
            expect(result.items[0].notes).toEqual("notes1 edited");
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