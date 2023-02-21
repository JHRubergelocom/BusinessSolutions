
describe("[function] sol.common.ix.functions.SetPrivacyFields", function () {
  var originalTimeout, objSetPrivacyFieldsId, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SetPrivacyFields").then(function success(objSetPrivacyFieldsId1) {
        objSetPrivacyFieldsId = objSetPrivacyFieldsId1;
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
    describe("sol.common.ix.functions.SetPrivacyFields", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.SetPrivacyFields",
            classConfig: {},
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
            className: "sol.common.ix.functions.SetPrivacyFields",
            classConfig: {},
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
  describe("test cases setprivacyfields", function () {
    it("should not throw if executed without parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_SetPrivacyFields", {
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
    it("should not throw if executed with 'objId' and 'personalReference' and 'deletionDate'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_SetPrivacyFields", {
          objId: objSetPrivacyFieldsId,
          personalReference: {
            mode: "SET",
            template: "{{{sord.objKeys.VISITOR_FIRSTNAME}}} {{{sord.objKeys.VISITOR_LASTNAME}}}"
          },
          deletionDate: {
            mode: "SET",
            baseDateFields: [{ type: "GRP", key: "VISITOR_DEPARTUREDATE" }, { type: "GRP", key: "VISITOR_STARTDATE" }],
            deletionPeriodNumber: 4,
            deletionPeriodUnit: "w"
          }
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