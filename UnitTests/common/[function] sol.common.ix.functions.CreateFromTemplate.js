
describe("[function] sol.common.ix.functions.CreateFromTemplate", function () {
  var originalTimeout, parentId,
      templateStringA, dataA, resultA, strTestA,
      resultB, objIdB, strTestB,
      config, result, saveToRepoConfig, objTempId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateFromTemplate").then(function success(parentId1) {
        templateStringA = "The first with string {{testcase}} generates {{result}}";
        dataA = { testcase: "TestA", result: "ResultA" };
        resultA = "The first with string TestA generates ResultA";
        parentId = parentId1;
        test.Utils.createSord(parentId, null, "SordB", {
          UNITTEST_FIELD1: "Bernd",
          UNITTEST_FIELD2: "Stromberg"
        }).then(function success1(objIdB1) {
          objIdB = objIdB1;
          resultB = "The second with Sord Field1 Bernd and Field2 Stromberg";
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
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.functions.CreateFromTemplate", function () {
      it("create sord temp", function (done) {
        expect(function () {
          test.Utils.createTempSord("Temp").then(function success(objTempId1) {
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateFromTemplate",
            classConfig: { templateString: templateStringA, data: dataA, saveToRepoConfig: { parentId: objTempId, name: "SordT" } },
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateFromTemplate",
            classConfig: { templateString: templateStringA, data: dataA, saveToRepoConfig: { parentId: objTempId, name: "SordT" } },
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
      it("saveResult", function (done) {
        expect(function () {
          result = resultA;
          saveToRepoConfig = { parentId: objTempId, name: "SordT" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateFromTemplate",
            classConfig: { templateString: templateStringA, data: dataA, saveToRepoConfig: { parentId: objTempId, name: "SordT" } },
            method: "saveResult",
            params: [result, saveToRepoConfig]
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
  describe("test cases create from template", function () {
    it("should throw if executed without 'templateObjId' and 'templateString'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_functions_CreateFromTemplate", {
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
    it("TestA", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_functions_CreateFromTemplate", {
          templateString: templateStringA,
          data: dataA,
          saveToRepoConfig: { parentId: parentId, name: "SordA" }
        }).then(function success(objTestAId) {
          objTestAId = objTestAId.objId;
          test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
            objId: objTestAId
          }).then(function success1(jsonData) {
            strTestA = jsonData.content;
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
    it("strTestA should be equal resultA", function () {
      expect(strTestA).toEqual(resultA);
    });
    it("TestB", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_functions_CreateFromTemplate", {
          templateString: "The second with Sord Field1 {{sord.objKeys.UNITTEST_FIELD1}} and Field2 {{sord.objKeys.UNITTEST_FIELD2}}",
          objId: objIdB,
          saveToRepoConfig: { parentId: parentId, name: "SordBResult" }
        }).then(function success(resultObjIdB) {
          resultObjIdB = resultObjIdB.objId;
          test.Utils.execute("RF_sol_common_functions_CreateFromTemplate", {
            templateObjId: resultObjIdB,
            objId: objIdB
          }).then(function success1(jsonResult) {
            test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
              objId: resultObjIdB
            }).then(function success2(jsonData) {
              strTestB = jsonData.content;
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
    it("strTestB should be equal resultB", function () {
      expect(strTestB).toEqual(resultB);
    });
    it("remove workflows", function (done) {
      expect(function () {
        test.Utils.getFinishedWorkflows().then(function success(wfs) {
          test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
            test.Utils.getActiveWorkflows().then(function success2(wfs1) {
              test.Utils.removeActiveWorkflows(wfs1).then(function success3(removeFinishedWorkflowsResult1) {
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