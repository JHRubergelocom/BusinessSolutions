
describe("[lib] sol.unittest.ix.services.SolTeamroomUtils", function () {
  var UtilsSord, token, originalTimeout, mode, query, ec, o,
      adminGroup, s, system, role, info, cfg, mandatory, param,
      obSolTeamroomUtilsId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolTeamroomUtils").then(function success(obSolTeamroomUtilsId1) {
        obSolTeamroomUtilsId = obSolTeamroomUtilsId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/teamroom [unit tests]/Resources/Utils").then(function success1(UtilsSord1) {
          UtilsSord = UtilsSord1;
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
  describe("Test Lib Functions", function () {
    it("get teamroom.remote.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Remote/Configuration/teamroom.remote.config",
          forceReload: true
        }).then(function success(jsonConfig) {
          token = jsonConfig.config.entities.connection["API_TOKEN"];
          expect(jsonConfig.config).toBeDefined();
          expect(jsonConfig.config.entities).toBeDefined();
          expect(jsonConfig.config.entities.connection).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    describe("sol.teamroom.Utils", function () {
      it("buildQuery", function (done) {
        expect(function () {
          mode = "select";
          query = "";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "buildQuery",
            params: [mode, query]
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
      it("checkIfAdmin", function (done) {
        expect(function () {
          ec = { user: { groupList: ["0"] } };
          adminGroup = { id: "0" };
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "checkIfAdmin",
            params: [ec, adminGroup]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("encode", function (done) {
        expect(function () {
          s = "text";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "encode",
            params: [s]
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
      it("getRoleGroups", function (done) {
        expect(function () {
          system = obSolTeamroomUtilsId;
          role = "role1";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "getRoleGroups",
            params: [system, role]
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
      it("queryDb", function (done) {
        expect(function () {
          query = "select * from documentfeed";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "queryDb",
            params: [query]
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
      it("select", function (done) {
        expect(function () {
          query = "select * from documentfeed";
          info = "";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "select",
            params: [query, info]
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
      it("sendRequest", function (done) {
        expect(function () {
          cfg = {
            service: "serviceUrl",
            token: token,
            guid: UtilsSord.guid,
            name: "teamroomName",
            owner: "Administrator",
            cmd: "create"
          };
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "sendRequest",
            params: [cfg]
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
      it("undefinedParams", function (done) {
        expect(function () {
          mandatory = [];
          o = {};
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "undefinedParams",
            params: [mandatory, o]
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
      it("update", function (done) {
        expect(function () {
          query = "";
          info = "";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "update",
            params: [query, info]
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
      it("updateDb", function (done) {
        expect(function () {
          query = "";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "updateDb",
            params: [query]
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
      it("useDatabase", function (done) {
        expect(function () {
          query = "select * from documentfeed";
          mode = "select";
          info = "";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "useDatabase",
            params: [query, mode, info]
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
      it("verifySqlParam", function (done) {
        expect(function () {
          param = {};
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib", {
            className: "sol.teamroom.Utils",
            classConfig: {},
            method: "verifySqlParam",
            params: [param]
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