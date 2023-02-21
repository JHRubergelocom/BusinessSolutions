
describe("[function] sol.common.ix.functions.ChangeGroup", function () {
  var originalTimeout, objTempId,
      names, targetGroups, config,
      entry, userDef, list;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ChangeGroup").then(function success(objTempId1) {
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
    describe("sol.common.ix.functions.ChangeGroup", function () {
      it("addUsersToGroups", function (done) {
        expect(function () {
          names = ["Administrator"];
          targetGroups = ["Unittest Group"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "addUsersToGroups",
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
      it("checkConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "checkConfig",
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
      it("extractUsers", function (done) {
        expect(function () {
          entry = { type: "type1", key: "key1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "extractUsers",
            params: [entry]
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
      it("getAccessor", function (done) {
        expect(function () {
          entry = { type: "type1", key: "key1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "getAccessor",
            params: [entry]
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
      it("getGroupName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "getGroupName",
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
      it("hasAccesssorKey", function (done) {
        expect(function () {
          entry = { type: "type1", key: "key1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "hasAccesssorKey",
            params: [entry]
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
            className: "sol.common.ix.functions.ChangeGroup",
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
      it("prepareUserList", function (done) {
        expect(function () {
          userDef = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "prepareUserList",
            params: [userDef]
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
            className: "sol.common.ix.functions.ChangeGroup",
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
      it("removeUsersFromGroups", function (done) {
        expect(function () {
          names = ["Administrator"];
          targetGroups = ["Unittest Group"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "removeUsersFromGroups",
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
      it("shouldAddMembers", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "shouldAddMembers",
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
      it("shouldRemoveMembers", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "shouldRemoveMembers",
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
      it("uniqueList", function (done) {
        expect(function () {
          list = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeGroup",
            classConfig: {},
            method: "uniqueList",
            params: [list]
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
  describe("test cases change group", function () {
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
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeGroup", {
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
    it("should throw if executed without 'groupName'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeGroup", {
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
    it("Change group", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeGroup", {
          objId: objTempId,
          groupName: "Unittest Group"
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
    it("Change group, addMembers", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeGroup", {
          objId: objTempId,
          groupName: "Unittest Group",
          addMembers: ["Administrator"]
        }).then(function success(jsonResult) {
          expect(jsonResult.name).toBeDefined();
          expect(jsonResult.name).toEqual("Unittest Group");
          expect(jsonResult.addMembers[0]).toBeDefined();
          expect(jsonResult.addMembers[0]).toEqual("Administrator");
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("Change group, addMembers, removeMembers", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeGroup", {
          objId: objTempId,
          groupName: "Unittest Group",
          addMembers: ["Administrator"],
          removeMembers: ["Administrator"]
        }).then(function success(jsonResult) {
          expect(jsonResult.name).toBeDefined();
          expect(jsonResult.name).toEqual("Unittest Group");
          expect(jsonResult.addMembers[0]).toBeDefined();
          expect(jsonResult.addMembers[0]).toEqual("Administrator");
          expect(jsonResult.removeMembers[0]).toBeDefined();
          expect(jsonResult.removeMembers[0]).toEqual("Administrator");
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