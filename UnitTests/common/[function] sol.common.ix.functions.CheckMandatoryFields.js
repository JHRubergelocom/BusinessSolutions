
describe("[function] sol.common.ix.functions.CheckMandatoryFields", function () {
  var originalTimeout, objId, config, str;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      objId = test.Utils.createTempSord("CheckMandatoryFields", {
        UNITTEST_FIELD1: "Nils",
        UNITTEST_FIELD2: "Armstrong"
      }).then(function success(objId1) {
        objId = objId1;
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
    describe("sol.common.ix.functions.CheckMandatoryFields", function () {
      it("checkMandatoryFields", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CheckMandatoryFields",
            classConfig: { objId: objId, mandatory: [{ key: "name", type: "SORD" }] },
            method: "checkMandatoryFields",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CheckMandatoryFields",
            classConfig: { objId: objId, mandatory: [{ key: "name", type: "SORD" }] },
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
      it("isEmpty", function (done) {
        expect(function () {
          str = "str1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CheckMandatoryFields",
            classConfig: { objId: objId, mandatory: [{ key: "name", type: "SORD" }] },
            method: "isEmpty",
            params: [str]
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
            className: "sol.common.ix.functions.CheckMandatoryFields",
            classConfig: { objId: objId, mandatory: [{ key: "name", type: "SORD" }] },
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
  describe("test cases check mandatory fields", function () {
    it("should throw if executed without 'objId' and 'mandatory'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
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
    it("should throw if executed without 'mandatory'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          objId: objId
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
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          mandatory: [{ key: "UNITTEST_FIELD1", type: "GRP" }]
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
    it("UNITTEST_FIELD1, UNITTEST_FIELD2 defined should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          objId: objId,
          mandatory: [{ key: "UNITTEST_FIELD1", type: "GRP" }, { key: "UNITTEST_FIELD2", type: "GRP" }]
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
    it("UNITTEST_REFERENCE, not defined should throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          objId: objId,
          mandatory: [{ key: "UNITTEST_REFERENCE", type: "GRP" }]
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
    it("sord.name, defined should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          objId: objId,
          mandatory: [{ key: "name", type: "SORD" }]
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
    it("sord.xyz, not defined should throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          objId: objId,
          mandatory: [{ key: "xyz", type: "SORD" }]
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