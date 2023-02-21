
describe("[function] sol.knowledge.ix.functions.Reputation", function () {
  var userFolder, reputation1, reputation3,
      statisticPath, reputationFolderId, mapKey, userName, type,
      repcount1, repcount3, originalTimeout,
      config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.getCurrentUserId().then(function success(userId) {
        userName = test.Utils.getCurrentUserName();
        type = "POST_CREATE";
        test.Utils.getUserFolder(userId).then(function success1(userFolder1) {
          userFolder = userFolder1;
          statisticPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/_global/Reputation";
          test.Utils.getSord(statisticPath).then(function success2(reputationFolder) {
            reputationFolderId = reputationFolder.id;
            reputation1 = test.Utils.getObjKeyValueAsNumber(userFolder, "REPUTATION");
            mapKey = "REPUTATION_" + userName + "_" + type;
            test.Utils.getMapValue(reputationFolderId, mapKey).then(function success3(repcount11) {
              repcount1 = repcount11;
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
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.functions.Reputation", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.functions.Reputation",
            classConfig: { objId: "0", type: "type1" },
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
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.functions.Reputation",
            classConfig: { objId: "0", type: "type1" },
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_knowledge_function_Reputation", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_Reputation", {
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
      it("should throw if executed without 'type'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_Reputation", {
            objId: "0"
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
      it("should not throw if executed without 'userId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_Reputation", {
            objId: "0",
            type: type
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
      it("'CURRENT'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_Reputation", {
            objId: "0",
            type: type,
            userId: "CURRENT"
          }).then(function success(jsonResult) {
            test.Utils.getObjKeyValueAsNumber(userFolder, "REPUTATION");
            test.Utils.getMapValue(reputationFolderId, mapKey).then(function success1(getMapValueResult) {
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
    describe("RF_sol_knowledge_function_Reputation countdown", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_Reputation", {
            countDown: true
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
      it("should throw if executed without 'type'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_Reputation", {
            objId: "0",
            countDown: true
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
      it("should not throw if executed without 'userId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_Reputation", {
            objId: "0",
            type: type,
            countDown: true
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
      it("'CURRENT'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_Reputation", {
            objId: "0",
            type: type,
            userId: "CURRENT",
            countDown: true
          }).then(function success(jsonResult) {
            reputation3 = test.Utils.getObjKeyValueAsNumber(userFolder, "REPUTATION");
            test.Utils.getMapValue(reputationFolderId, mapKey).then(function success1(repcount31) {
              repcount3 = repcount31;
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
      it("reputation1 and reputation3 must be equal", function () {
        if (!reputation1) {
          reputation1 = 0;
        }
        if (!reputation3) {
          reputation3 = 0;
        }
        expect(reputation1).toEqual(reputation3);
      });
      it("repcount1 and repcount3 must be equal", function () {
        if (!repcount1) {
          repcount1 = "0";
        }
        if (!repcount3) {
          repcount3 = "0";
        }
        expect(repcount1).toEqual(repcount3);
      });
    });
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
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