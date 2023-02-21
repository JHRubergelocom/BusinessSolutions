
describe("[function] sol.common.ix.functions.CreateGroup", function () {
  var originalTimeout, objTempId,
      names, targetGroups, n1, groupConfig, config,
      createdGroupId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateGroup").then(function success(objTempId1) {
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
    describe("sol.common.ix.functions.CreateGroup", function () {
      it("addMemberToGroup", function (done) {
        expect(function () {
          names = ["Administrator"];
          targetGroups = ["Unittest Group"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateGroup",
            classConfig: {},
            method: "addMemberToGroup",
            params: [names, targetGroups]
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
      it("createGroup", function (done) {
        expect(function () {
          n1 = "name1";
          groupConfig = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateGroup",
            classConfig: {},
            method: "createGroup",
            params: [n1, groupConfig]
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
            className: "sol.common.ix.functions.CreateGroup",
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
      it("prepareGroupConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateGroup",
            classConfig: {},
            method: "prepareGroupConfig",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateGroup",
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
      it("shouldSaveGroupToField", function (done) {
        expect(function () {
          createdGroupId = 12345;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateGroup",
            classConfig: {},
            method: "shouldSaveGroupToField",
            params: [createdGroupId]
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
  describe("test cases create group", function () {
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateGroup", {
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
    it("should throw if executed without 'name'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateGroup", {
          objId: objTempId
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
    it("Create group", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateGroup", {
          objId: objTempId,
          name: "Unittest Group"
        }).then(function success(jsonResult) {
          expect(jsonResult.name).toBeDefined();
          expect(jsonResult.name).toEqual("Unittest Group");
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("Create group, memberOf", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateGroup", {
          objId: objTempId,
          name: "Unittest Group",
          memberOf: ["Administrators"]
        }).then(function success(jsonResult) {
          expect(jsonResult.name).toBeDefined();
          expect(jsonResult.name).toEqual("Unittest Group");
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("Create group, memberOf, addMembers", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateGroup", {
          objId: objTempId,
          name: "Unittest Group",
          memberOf: ["Administrators"],
          addMembers: ["Administrator"]
        }).then(function success(jsonResult) {
          expect(jsonResult.name).toBeDefined();
          expect(jsonResult.name).toEqual("Unittest Group");
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getFinishedWorkflows().then(function success(wfs) {
        test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
          test.Utils.getTempfolder().then(function success2(tempfolder) {
            test.Utils.deleteSord(tempfolder).then(function success3(deleteResult) {
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