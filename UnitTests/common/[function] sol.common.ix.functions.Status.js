
describe("[function] sol.common.ix.functions.Status", function () {
  var originalTimeout, objStatusId,
      objTempTId, sord, maskName, statusPrefix, field, cfg, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Status").then(function success(objStatusId1) {
        objStatusId = objStatusId1;
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
    describe("sol.common.ix.functions.Status", function () {
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
      it("getStatus", function (done) {
        expect(function () {
          sord = objTempTId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Status",
            classConfig: { objId: objTempTId, group: "UNITTEST_STATUS2", status: "2" },
            method: "getStatus",
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
      it("getStatusFromDynKwl", function (done) {
        expect(function () {
          maskName = "UnitTest";
          statusPrefix = "";
          field = "UNITTEST_STATUS1";
          cfg = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Status",
            classConfig: { objId: objTempTId, group: "UNITTEST_STATUS2", status: "2" },
            method: "getStatusFromDynKwl",
            params: [maskName, statusPrefix, field, cfg]
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
      it("getStatusFromKwl", function (done) {
        expect(function () {
          statusPrefix = "";
          field = "UNITTEST_STATUS1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Status",
            classConfig: { objId: objTempTId, group: "UNITTEST_STATUS2", status: "2" },
            method: "getStatusFromKwl",
            params: [statusPrefix, field]
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
            className: "sol.common.ix.functions.Status",
            classConfig: { objId: objTempTId, group: "UNITTEST_STATUS2", status: "2" },
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
            className: "sol.common.ix.functions.Status",
            classConfig: { objId: objTempTId, group: "UNITTEST_STATUS2", status: "2" },
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
  describe("test cases status", function () {
    it("should throw if executed without 'objId' and 'group' and 'status'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Status", {
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
    it("should throw if executed without 'group' and 'status'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Status", {
          objId: objStatusId
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
    it("should throw if executed without 'status'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Status", {
          objId: objStatusId,
          group: "UNITTEST_STATUS1"
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
    it("should not throw if executed with 'objId' and 'group' and 'status'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Status", {
          objId: objStatusId,
          group: "UNITTEST_STATUS1",
          status: "1"
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
    it("set status1 to 1", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Status", {
          objId: objStatusId,
          group: "UNITTEST_STATUS1",
          status: "1"
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
    it("objValue 'UNITTEST_STATUS1' should be equal to '1'", function (done) {
      test.Utils.getSord(objStatusId).then(function success(sordStatus) {
        expect(test.Utils.getObjKeyValue(sordStatus, "UNITTEST_STATUS1")).toEqual("1");
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("set status2 to 3 with Kwl", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Status", {
          objId: objStatusId,
          group: "UNITTEST_STATUS2",
          status: "3",
          useKwl: true
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
    it("objValue 'UNITTEST_STATUS2' should be equal to '3 Zustand'", function (done) {
      test.Utils.getSord(objStatusId).then(function success(sordStatus) {
        expect(test.Utils.getObjKeyValue(sordStatus, "UNITTEST_STATUS2")).toEqual("3 Zustand");
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
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