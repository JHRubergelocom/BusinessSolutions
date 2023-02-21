
describe("[function] sol.common.ix.functions.Delete", function () {
  var originalTimeout, objId,
      config, objDeleteId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Delete").then(function success(objDeleteId1) {
        objDeleteId = objDeleteId1;
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
    describe("sol.common.ix.functions.Delete", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Delete",
            classConfig: { objId: objDeleteId },
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
            className: "sol.common.ix.functions.Delete",
            classConfig: { objId: objDeleteId },
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
  describe("delete reference and element", function () {
    beforeAll(function (done) {
      expect(function () {
        test.Utils.createSord().then(function success(objId1) {
          objId = objId1;
          test.Utils.createRef(objId).then(function success1(jsonResult) {
            test.Utils.getSord(objId).then(function success2(sordA) {
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
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Delete", {
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
    it("should delete reference", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Delete", {
          objId: objId,
          parentId: 1
        }).then(function success(jsonResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
      // check if reference was marked as deleted
    });
    it("shouldn't delete original element", function (done) {
      expect(function () {
        test.Utils.getSord(objId).then(function success(sordA) {
          expect(sordA.deleted).toEqual(false);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("should delete original element", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Delete", {
          objId: objId
        }).then(function success(jsonResult) {
          test.Utils.getSord(objId).then(function success1(sordA) {
            expect(sordA.deleted).toEqual(true);
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
  describe("physically delete reference and element", function () {
    beforeAll(function (done) {
      expect(function () {
        test.Utils.createSord().then(function success(objId1) {
          objId = objId1;
          test.Utils.createRef(objId).then(function success1(jsonResult) {
            test.Utils.getSord(objId).then(function success2(sordA) {
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
    it("should physically delete reference", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Delete", {
          objId: objId,
          parentId: 1,
          deleteFinally: true
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
    it("should not delete original element", function (done) {
      expect(function () {
        test.Utils.getSord(objId).then(function success(sordA) {
          expect(sordA.deleted).toEqual(false);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
      // check if reference was marked as deleted
    });
    it("should physically delete original element", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Delete", {
          objId: objId,
          deleteFinally: true
        }).then(function success(jsonResult) {
          test.Utils.getSord(objId).then(function success1(sordA) {
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
      expect(function () {
      }).not.toThrow();
    });
    afterAll(function () {
    });
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
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