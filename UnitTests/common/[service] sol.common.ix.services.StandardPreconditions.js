
describe("[service] sol.common.ix.services.StandardPreconditions", function () {
  var originalTimeout, indexData, mapData, obStandardPreconditionsId,
      objTempTId, conditions, sord, elementServiceCfg, templateData,
      options, message;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      indexData = { UNITTEST_FIELD1: "Unittest", UNITTEST_FIELD2: "ABC" };
      mapData = { UNITTEST_MAP1: "Map" };
      test.Utils.createTempSord("StandardPreconditions", indexData, mapData).then(function success(obStandardPreconditionsId1) {
        obStandardPreconditionsId = obStandardPreconditionsId1;
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
    describe("sol.common.ix.services.StandardPreconditions", function () {
      it("create sord temp", function (done) {
        expect(function () {
          test.Utils.createTempSord("TempT").then(function success(objTempTId1) {
            objTempTId = objTempTId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();    
      });
      it("generateConditions", function (done) {
        expect(function () {
          conditions = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.StandardPreconditions",
            classConfig: { targetId: objTempTId },
            method: "generateConditions",
            params: [conditions]
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
      it("getContext", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.StandardPreconditions",
            classConfig: { targetId: objTempTId },
            method: "getContext",
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
      it("hasConditions", function (done) {
        expect(function () {
          conditions = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.StandardPreconditions",
            classConfig: { targetId: objTempTId },
            method: "hasConditions",
            params: [conditions]
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
      it("isValid", function (done) {
        expect(function () {
          sord = objTempTId;
          conditions = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.StandardPreconditions",
            classConfig: { targetId: objTempTId },
            method: "isValid",
            params: [sord, conditions]
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
      it("performElementService", function (done) {
        expect(function () {
          elementServiceCfg = { 
            name: "RF_sol_common_service_SordProvider", 
            args: { 
              ids: [objTempTId], 
              output: [{ source: { type: "SORD", key: "id" } }] 
            } 
          };
          templateData = {};
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.StandardPreconditions",
            classConfig: { targetId: objTempTId },
            method: "performElementService",
            params: [elementServiceCfg, templateData, options]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.StandardPreconditions",
            classConfig: { targetId: objTempTId },
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
      it("translateNotAllowedMessage", function (done) {
        expect(function () {
          message = "message1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.StandardPreconditions",
            classConfig: { targetId: objTempTId },
            method: "translateNotAllowedMessage",
            params: [message]
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_service_StandardPreconditions", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_StandardPreconditions", {
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
      it("Set an targetId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_StandardPreconditions", {
            targetId: obStandardPreconditionsId
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.targetId).toBeDefined();
            expect(jsonResult.targetId).toEqual(obStandardPreconditionsId);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Set valid conditions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_StandardPreconditions", {
            targetId: obStandardPreconditionsId,
            conditions: [
              { prop: "objKeys.UNITTEST_FIELD1", value: "Unittest" },
              { prop: "objKeys.UNITTEST_FIELD2", value: "A*" },
              { prop: "mapKeys.UNITTEST_MAP1", value: "Map" }              
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.targetId).toBeDefined();
            expect(jsonResult.targetId).toEqual(obStandardPreconditionsId);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Set unvalid conditions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_StandardPreconditions", {
            targetId: obStandardPreconditionsId,
            conditions: [
              { prop: "objKeys.UNITTEST_FIELD1", value: "Unittest" },
              { prop: "objKeys.UNITTEST_FIELD2", value: "B*" }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.targetId).toBeDefined();
            expect(jsonResult.targetId).toEqual(obStandardPreconditionsId);
            expect(jsonResult.msg).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Set unvalid conditions and notAllowedMessage", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_StandardPreconditions", {
            targetId: obStandardPreconditionsId,
            conditions: [
              { prop: "objKeys.UNITTEST_FIELD1", value: "Unittest" },
              { prop: "objKeys.UNITTEST_FIELD2", value: "B*" }
            ],
            notAllowedMessage: "Not Valid"
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.targetId).toBeDefined();
            expect(jsonResult.targetId).toEqual(obStandardPreconditionsId);
            expect(jsonResult.msg).toBeDefined();
            expect(jsonResult.msg).toEqual("Not Valid");
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