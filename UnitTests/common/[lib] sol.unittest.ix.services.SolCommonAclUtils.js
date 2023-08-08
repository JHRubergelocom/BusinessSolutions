/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonAclUtils", function () {
  var aclUtilsSord, userName, userInfo, originalTimeout,
      objId, users, rights, config, accessCode, asAdmin,
      andGroup, defaultAccessCode, sord, recursive, rightsConfig,
      params, oldAclList, newAclList, newAclItems, conn, mode, aclItems,
      aclItem, combineAclFunction, ctxSord, inclTplSord, startIds,
      clazz, fieldName, _oldAclList;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonAclUtils").then(function success(obSolCommonAclUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/ActionBase").then(function success1(aclUtilsSord1) {
          aclUtilsSord = aclUtilsSord1;
          userName = test.Utils.getCurrentUserName();
          test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
            userInfo = userInfo1;
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
  describe("Test Lib Functions", function () {
    describe("sol.common.AclUtils", function () {
      it("addRights", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          users = ["baum", "renz"];
          rights = { r: true, w: true, d: false, e: false, l: false, p: true };
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "addRights",
            params: [objId, users, rights, config]
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
      it("addSordRights", function (done) {
        expect(function () {
          oldAclList = [];
          newAclList = [];
          asAdmin = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "addSordRights",
            params: [oldAclList, newAclList, asAdmin]
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
      it("appendAndGroupAcl", function (done) {
        expect(function () {
          newAclItems = [];
          objId = aclUtilsSord.id;
          config = {};
          defaultAccessCode = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "appendAndGroupAcl",
            params: [newAclItems, objId, config, defaultAccessCode]
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
      it("appendInheritedAcl", function (done) {
        expect(function () {
          newAclItems = [];
          objId = aclUtilsSord.id;
          config = {};
          conn = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "appendInheritedAcl",
            params: [newAclItems, objId, config, conn]
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
      it("appendUserAcl", function (done) {
        expect(function () {
          newAclItems = [];
          objId = aclUtilsSord.id;
          config = {};
          defaultAccessCode = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "appendUserAcl",
            params: [newAclItems, objId, config, defaultAccessCode]
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
      it("canExecute", function (done) {
        expect(function () {
          mode = "SET";
          aclItems = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "canExecute",
            params: [mode, aclItems]
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
      it("changeRightsInBackground", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          config = { inherit: true, users: ["baum", { name: "renz", rights: { r: true, w: true, p: true } }], rights: { r: true } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "changeRightsInBackground",
            params: [objId, config]
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("changeRightsInBackground", function (done) {
        objId = aclUtilsSord.id;
        config = { mode: "SET", users: ["renz"], rights: { r: true } };
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "changeRightsInBackground",
            params: [objId, config]
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("changeRightsInBackground", function (done) {
        objId = aclUtilsSord.id;
        config = {
          mode: "SET",
          users: ["baum", { name: "renz", rights: { r: true, w: true } }],
          rights: { r: true },
          andGroups: { groups: ["Buchhaltung", { name: "Consulting" }], rights: { d: true } }
        };
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "changeRightsInBackground",
            params: [objId, config]
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("checkPreconditions", function (done) {
        objId = aclUtilsSord.id;
        config = { inherit: true, users: ["baum", { name: "renz", rights: { r: true, w: true, p: true } }], rights: { r: true } };
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "checkPreconditions",
            params: [objId, config]
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
      it("checkPreconditions", function (done) {
        objId = aclUtilsSord.id;
        config = {
          mode: "SET",
          users: ["renz"],
          rights: { r: true }
        };
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "checkPreconditions",
            params: [objId, config]
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
      it("checkPreconditions", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          config = {
            mode: "SET",
            users: ["baum", { name: "renz", rights: { r: true, w: true } }],
            rights: { r: true },
            andGroups: { groups: ["Buchhaltung", { name: "Consulting" }], rights: { d: true } }
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "checkPreconditions",
            params: [objId, config]
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
      it("containsRights", function (done) {
        expect(function () {
          accessCode = elo.CONST.ACCESS.LUR_READ;
          rights = {
            r: true,
            w: true
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "containsRights",
            params: [accessCode, rights]
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
      it("containsSessionUserAndhasEffectiveRights", function (done) {
        expect(function () {
          rightsConfig = {
            rights: {
              r: true,
              w: true
            },
            users: ["baum", "renz"]
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "containsSessionUserAndhasEffectiveRights",
            params: [rightsConfig]
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
      it("createAccessCode", function (done) {
        expect(function () {
          rights = { r: true, w: true, d: false, e: false, l: false, p: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "createAccessCode",
            params: [rights]
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
      it("createAclItemFromAcl", function (done) {
        expect(function () {
          aclItem = { id: 0, type: 0 };
          accessCode = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "createAclItemFromAcl",
            params: [aclItem, accessCode]
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
      it("createAclItemFromUserInfo", function (done) {
        accessCode = elo.CONST.ACCESS.LUR_READ;
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "createAclItemFromUserInfo",
            params: [userInfo, accessCode]
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("editRights", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          users = [];
          rights = {};
          config = {};
          combineAclFunction = "combineAclFunction";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "editRights",
            params: [objId, users, rights, config, combineAclFunction]
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
      it("editSordRights", function (done) {
        expect(function () {
          sord = aclUtilsSord.id;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "editSordRights",
            params: [sord, params]
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
      it("enrichContextSord", function (done) {
        expect(function () {
          ctxSord = { objId: aclUtilsSord.id };
          inclTplSord = true;
          conn = "conn1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "enrichContextSord",
            params: [ctxSord, inclTplSord, conn]
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
      it("executeBackgroundAclJob", function (done) {
        expect(function () {
          conn = "conn1";
          startIds = [aclUtilsSord.id];
          config = { users: [0], rights: { r: true, w: true, d: false, e: false, l: false, p: true }, mode: "SET" };
          newAclItems = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "executeBackgroundAclJob",
            params: [conn, startIds, config, newAclItems]
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
      it("getAccessCode", function (done) {
        expect(function () {
          sord = aclUtilsSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "getAccessCode",
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
      it("getAccessRights", function (done) {
        expect(function () {
          sord = aclUtilsSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "getAccessRights",
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
      it("getAccessRightsByAccessCode", function (done) {
        expect(function () {
          accessCode = elo.CONST.ACCESS.LUR_READ;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "getAccessRightsByAccessCode",
            params: [accessCode]
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
      it("hasClassField", function (done) {
        expect(function () {
          clazz = "AccessC";
          fieldName = "LUR_PERMISSION";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "hasClassField",
            params: [clazz, fieldName]
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
      it("hasEffectiveRights", function (done) {
        expect(function () {
          sord = aclUtilsSord;
          params = {
            rights: {
              r: true,
              w: true
            }
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "hasEffectiveRights",
            params: [sord, params]
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
      it("initializeRights", function (done) {
        expect(function () {
          newAclItems = [];
          objId = aclUtilsSord.id;
          config = { users: [0] };
          conn = "conn1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "initializeRights",
            params: [newAclItems, objId, config, conn]
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
      it("isAccessCodePermissionAvailable", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "isAccessCodePermissionAvailable",
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
      it("ixExecutesBackgroundJobsSynchronous", function (done) {
        expect(function () {
          conn = "conn1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "ixExecutesBackgroundJobsSynchronous",
            params: [conn]
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
      it("preprocessUsers", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          users = ["baum", { name: "renz", rights: { r: true, w: true, p: true } }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "preprocessUsers",
            params: [objId, users, { flowId: 0 }]
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
      it("preprocessUsers", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          users = ["renz"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "preprocessUsers",
            params: [objId, users, { flowId: 0 }]
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
      it("preprocessUsers", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          users = ["baum", { name: "renz", rights: { r: true, w: true } }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "preprocessUsers",
            params: [objId, users, { flowId: 0 }]
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
      it("removeRights", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          users = ["baum", "renz"];
          rights = { r: true, w: true, d: false, e: false, l: false, p: true };
          config = { recursive: true, storeAcl: { type: "MAP", key: "OLD_ACL" } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "removeRights",
            params: [objId, users, rights, config]
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
      it("removeSordRights", function (done) {
        expect(function () {
          oldAclList = [];
          newAclList = [];
          asAdmin = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "removeSordRights",
            params: [oldAclList, newAclList, asAdmin]
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
      it("replaceUserNamePlaceholders", function (done) {
        expect(function () {
          userName = "$CURRENTUSER";
          ctxSord = {};
          conn = "conn1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "replaceUserNamePlaceholders",
            params: [userName, ctxSord, conn]
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
      it("restoreRights", function (done) {
        objId = aclUtilsSord.id;
        config = { recursive: true, storeAcl: { type: "MAP", key: "OLD_ACL" } };
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "restoreRights",
            params: [objId, config]
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
      it("restoreSordRights", function (done) {
        expect(function () {
          sord = aclUtilsSord;
          params = { storeAcl: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "restoreSordRights",
            params: [sord, params]
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
      it("retrieveAndGroupAcl", function (done) {
        andGroup = { groups: ["Administrators", "Buchhaltung"] };
        defaultAccessCode = elo.CONST.ACCESS.LUR_READ;
        asAdmin = true;
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "retrieveAndGroupAcl",
            params: [andGroup, defaultAccessCode, asAdmin]
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("retrieveElements", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          recursive = true;
          asAdmin = true;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "retrieveElements",
            params: [objId, recursive, asAdmin, config]
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("retrieveSordAcl", function (done) {
        expect(function () {
          sord = aclUtilsSord;
          accessCode = elo.CONST.ACCESS.LUR_READ;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "retrieveSordAcl",
            params: [sord, accessCode]
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("retrieveUserAcl", function (done) {
        expect(function () {
          users = ["baum", "renz"];
          accessCode = elo.CONST.ACCESS.LUR_READ;
          asAdmin = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "retrieveUserAcl",
            params: [users, accessCode, asAdmin]
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setRights", function (done) {
        expect(function () {
          objId = aclUtilsSord.id;
          users = ["baum", "renz"];
          rights = { r: true, w: true, d: false, e: false, l: false, p: true };
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "setRights",
            params: [objId, users, rights, config]
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
      it("setSordRights", function (done) {
        expect(function () {
          _oldAclList = [];
          newAclList = [];
          asAdmin = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "setSordRights",
            params: [_oldAclList, newAclList, asAdmin]
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
      it("sordZ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AclUtils",
            classConfig: {},
            method: "sordZ",
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