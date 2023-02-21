
describe("[function] sol.common.ix.functions.ChangeColor", function () {
  var originalTimeout, objId, sordA, sordB, sordC, color, config;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  it("should throw if executed without 'objId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_ChangeColor", {
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
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.functions.ChangeColor", function () {
      it("getColor", function (done) {
        expect(function () {
          color = "red";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeColor",
            classConfig: { objId: 1 },
            method: "getColor",
            params: [color]
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
      it("getColors", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeColor",
            classConfig: { objId: 1 },
            method: "getColors",
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
            className: "sol.common.ix.functions.ChangeColor",
            classConfig: { objId: 1 },
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
      it("create sord", function (done) {
        expect(function () {
          test.Utils.createSord().then(function success(objId1) {
            objId = objId1;
            test.Utils.getSord(objId).then(function success1(sordA1) {
              sordA = sordA1;
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeColor",
            classConfig: { objId: objId },
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
      it("delete sord", function (done) {
        expect(function () {
          test.Utils.deleteSord(objId).then(function success(deleteResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("restoreFromMap", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeColor",
            classConfig: { objId: 1 },
            method: "restoreFromMap",
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
      it("saveToMap", function (done) {
        expect(function () {
          color = "red";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeColor",
            classConfig: { objId: 1 },
            method: "saveToMap",
            params: [color]
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
  describe("change color", function () {
    beforeAll(function (done) {
      expect(function () {
        test.Utils.createSord().then(function success(objId1) {
          objId = objId1;
          test.Utils.getSord(objId).then(function success1(sordA1) {
            sordA = sordA1;
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
    it("should change color", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeColor", {
          objId: objId,
          color: "red"
        }).then(function success(jsonResult) {
          test.Utils.getSord(objId).then(function success1(sordB1) {
            sordB = sordB1;
            expect(sordA.kind).not.toEqual(sordB.kind);
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
    afterAll(function (done) {
      expect(function () {
        test.Utils.deleteSord(objId).then(function success(deleteResult) {
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
  describe("change color, remember and restore", function () {
    beforeAll(function (done) {
      expect(function () {
        test.Utils.createSord().then(function success(objId1) {
          objId = objId1;
          test.Utils.getSord(objId).then(function success1(sordA1) {
            sordA = sordA1;
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
    it("should change and store color", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeColor", {
          objId: objId,
          color: "red",
          save: "COLOR_BACKUP"
        }).then(function success(jsonResult) {
          test.Utils.getSord(objId).then(function success1(sordB1) {
            sordB = sordB1;
            expect(sordA.kind).not.toEqual(sordB.kind);
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
    it("should restore color", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeColor", {
          objId: objId,
          restore: "COLOR_BACKUP"
        }).then(function success(jsonResult) {
          test.Utils.getSord(objId).then(function success1(sordC1) {
            sordC = sordC1;
            expect(sordA.kind).toEqual(sordC.kind);
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
    afterAll(function (done) {
      expect(function () {
        test.Utils.deleteSord(objId).then(function success(deleteResult) {
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});