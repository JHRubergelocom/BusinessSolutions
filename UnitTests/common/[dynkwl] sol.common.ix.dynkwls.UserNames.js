/* eslint-disable linebreak-style */

describe("[dynkwl] sol.common.ix.dynkwls.UserNames", function () {
  var originalTimeout, objUserNamesId, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UserNames").then(function success(objUserNamesId1) {
        objUserNamesId = objUserNamesId1;
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
    describe("sol.common.ix.dynkwl.UserNames", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.dynkwl.UserNames",
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
    });
  });
  describe("Tests Dynamic Keyword lists", function () {
    describe("sol.common.ix.dynkwl.UserNames", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
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
      it("should throw if executed without 'dynkwl'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
            objId: objUserNamesId
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
      it("should throw if executed without 'providerConfig'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
            objId: objUserNamesId,
            dynKwl: "sol.unittest.ix.dynkwl.UserNames"
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
      it("should throw if executed without 'inputFieldName'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
            objId: objUserNamesId,
            dynKwl: "sol.unittest.ix.dynkwl.UserNames",
            providerConfig: {}
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
      it("should not throw with providerConfig: {tableTitle: 'Benutzerinfos', tableHeaders: ['ID', 'Name'], userIdFieldName: 'Benutzer-ID'}", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
            objId: objUserNamesId,
            dynKwl: "sol.unittest.ix.dynkwl.UserNames",
            providerConfig: {
              tableTitle: "Benutzerinfos",
              tableHeaders: ["ID", "Name"],
              userIdFieldName: "Benutzer-ID"
            },
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {
            expect(jsonResult.keynames[0]).toEqual("Benutzer-ID");
            expect(jsonResult.keynames[1]).toEqual("UNITTEST_FIELD2");
            expect(jsonResult.header[0]).toEqual("ID");
            expect(jsonResult.header[1]).toEqual("Name");
            expect(jsonResult.title).toEqual("Benutzerinfos");
            expect(jsonResult.data).toBeDefined();
            expect(jsonResult.data.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw with providerConfig: {}", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
            objId: objUserNamesId,
            dynKwl: "sol.unittest.ix.dynkwl.UserNames",
            providerConfig: {},
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {
            expect(jsonResult.keynames[0]).toEqual("UNITTEST_FIELD_ID2");
            expect(jsonResult.keynames[1]).toEqual("UNITTEST_FIELD2");
            expect(jsonResult.header[0]).toEqual(null);
            expect(jsonResult.header[1]).toEqual("Name");
            expect(jsonResult.title).toBeDefined();
            expect(jsonResult.data).toBeDefined();
            expect(jsonResult.data.length).toBeGreaterThan(0);
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