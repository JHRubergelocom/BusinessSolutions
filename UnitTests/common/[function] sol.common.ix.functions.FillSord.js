/* eslint-disable linebreak-style */

describe("[function] sol.common.ix.functions.FillSord", function () {
  var originalTimeout, objFillSordId,
      tgt, opts, target, entries, src, config,
      fieldDef, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("FillSord").then(function success(objFillSordId1) {
        objFillSordId = objFillSordId1;
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
    describe("sol.common.ix.functions.FillSord", function () {
      it("determineTarget", function (done) {
        expect(function () {
          tgt = { objId: objFillSordId };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.FillSord",
            classConfig: {},
            method: "determineTarget",
            params: [tgt]
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
      it("finalizeGeneratorParams", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.FillSord",
            classConfig: {},
            method: "finalizeGeneratorParams",
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
      it("parseOptions", function (done) {
        expect(function () {
          opts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.FillSord",
            classConfig: {},
            method: "parseOptions",
            params: [opts]
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
      it("pepareSetParams", function (done) {
        expect(function () {
          target = {};
          entries = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.FillSord",
            classConfig: {},
            method: "pepareSetParams",
            params: [target, entries]
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
      it("prepareSource", function (done) {
        expect(function () {
          src = { objId: objFillSordId };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.FillSord",
            classConfig: {},
            method: "prepareSource",
            params: [src]
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
            className: "sol.common.ix.functions.FillSord",
            classConfig: { source: { objId: objFillSordId }, target: { objId: objFillSordId } },
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
      it("renderParams", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.FillSord",
            classConfig: {},
            method: "renderParams",
            params: [params]
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
      it("shouldIgnore", function (done) {
        expect(function () {
          target = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.FillSord",
            classConfig: {},
            method: "shouldIgnore",
            params: [target]
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
      it("startWorkflowOn", function (done) {
        expect(function () {
          config = { workflow: { name: "UnittestStandardWF", title: "Workflow Unittest" }, objId: objFillSordId };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.FillSord",
            classConfig: {},
            method: "startWorkflowOn",
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
      it("storeResult", function (done) {
        expect(function () {
          target = { objId: objFillSordId };
          fieldDef = { type: "GRP", key: "UNITTEST_FIELD1", value: "T1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.FillSord",
            classConfig: { objId: objFillSordId },
            method: "storeResult",
            params: [target, fieldDef]
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
  describe("test cases fillsord", function () {
    it("should throw if executed without 'source' ", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FillSord", {
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
    it("should throw if executed without 'target'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FillSord", {
          source: { objId: objFillSordId }
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
    it("should not throw if executed with 'source' and 'target'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FillSord", {
          source: { objId: objFillSordId },
          target: { objId: objFillSordId }
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