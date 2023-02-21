
describe("[function] sol.accounts.ix.functions.CreateUser", function () {
  var objTempId, userid, groups, sord, config,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateUser").then(function success(objTempId1) {
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

  describe("Test Lib Functions", function () {
    describe("sol.accounts.ix.functions.CreateUser", function () {
      it("addUserToGroups", function (done) {
        expect(function () {
          userid = 0;
          groups = [];
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.accounts.ix.functions.CreateUser",
            classConfig: { user: "Administrator" },
            method: "addUserToGroups",
            params: [userid, groups]
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
      it("generateTempPassword", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.accounts.ix.functions.CreateUser",
            classConfig: { user: "Administrator" },
            method: "generateTempPassword",
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
      it("getEMail", function (done) {
        expect(function () {
          sord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.accounts.ix.functions.CreateUser",
            classConfig: { user: "Administrator" },
            method: "getEMail",
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
      it("getGroupNames", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.accounts.ix.functions.CreateUser",
            classConfig: { user: "Administrator" },
            method: "getGroupNames",
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
      it("getRequestSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.accounts.ix.functions.CreateUser",
            classConfig: { user: "Administrator" },
            method: "getRequestSord",
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
      it("getUsername", function (done) {
        expect(function () {
          sord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.accounts.ix.functions.CreateUser",
            classConfig: { user: "Administrator" },
            method: "getUsername",
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
      it("initialize", function (done) {
        expect(function () {
          config = { user: "Administrator" };
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.accounts.ix.functions.CreateUser",
            classConfig: { user: "Administrator" },
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
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.accounts.ix.functions.CreateUser",
            classConfig: { user: "Administrator" },
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