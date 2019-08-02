
describe("[lib] sol.unittest.ix.services.SolCommonAclUtils", function () {
  var aclUtilsSord, userName, userInfo, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonAclUtils").then(function success(obSolCommonAclUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/AclUtils").then(function success1(aclUtilsSord1) {
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
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "addRights",
            params: {
              objId: aclUtilsSord.id,
              users: ["baum", "renz"],
              rights: { r: true, w: true, d: false, e: false, l: false, p: true },
              config: {}
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
      it("removeRights", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "removeRights",
            params: {
              objId: aclUtilsSord.id,
              users: ["baum", "renz"],
              rights: { r: true, w: true, d: false, e: false, l: false, p: true },
              config: { recursive: true, storeAcl: { type: "MAP", key: "OLD_ACL" } }
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
      it("restoreRights", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "restoreRights",
            params: {
              objId: aclUtilsSord.id,
              config: { recursive: true, storeAcl: { type: "MAP", key: "OLD_ACL" } }
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
      it("retrieveUserAcl", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "retrieveUserAcl",
            params: {
              users: ["baum", "renz"],
              accessCode: elo.CONST.ACCESS.LUR_READ,
              asAdmin: true
            }
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
      it("retrieveAndGroupAcl", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "retrieveAndGroupAcl",
            params: {
              andGroup: { groups: ["Administrators", "Buchhaltung"] },
              defaultAccessCode: elo.CONST.ACCESS.LUR_READ,
              asAdmin: true
            }
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
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "retrieveSordAcl",
            params: {
              sord: aclUtilsSord,
              accessCode: elo.CONST.ACCESS.LUR_READ
            }
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
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "retrieveElements",
            params: {
              objId: aclUtilsSord.id,
              recursive: true,
              asAdmin: true
            }
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
      it("createAclItemFromUserInfo", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "createAclItemFromUserInfo",
            params: {
              userInfo: userInfo,
              accessCode: elo.CONST.ACCESS.LUR_READ
            }
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
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "changeRightsInBackground",
            params: {
              objId: aclUtilsSord.id,
              config: { inherit: true, users: ["baum", { name: "renz", rights: { r: true, w: true, p: true } }], rights: { r: true } }
            }
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
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "changeRightsInBackground",
            params: {
              objId: aclUtilsSord.id,
              config: {
                mode: "SET",
                users: ["renz"],
                rights: { r: true }
              }
            }
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
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "changeRightsInBackground",
            params: {
              objId: aclUtilsSord.id,
              config: {
                mode: "SET",
                users: ["baum", { name: "renz", rights: { r: true, w: true } }],
                rights: { r: true },
                andGroups: { groups: ["Buchhaltung", { name: "Consulting" }], rights: { d: true } }
              }
            }
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
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "checkPreconditions",
            params: {
              objId: aclUtilsSord.id,
              config: { inherit: true, users: ["baum", { name: "renz", rights: { r: true, w: true, p: true } }], rights: { r: true } }
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
      it("checkPreconditions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "checkPreconditions",
            params: {
              objId: aclUtilsSord.id,
              config: {
                mode: "SET",
                users: ["renz"],
                rights: { r: true }
              }
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
      it("checkPreconditions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "checkPreconditions",
            params: {
              objId: aclUtilsSord.id,
              config: {
                mode: "SET",
                users: ["baum", { name: "renz", rights: { r: true, w: true } }],
                rights: { r: true },
                andGroups: { groups: ["Buchhaltung", { name: "Consulting" }], rights: { d: true } }
              }
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
      it("preprocessUsers", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "preprocessUsers",
            params: {
              objId: aclUtilsSord.id,
              users: ["baum", { name: "renz", rights: { r: true, w: true, p: true } }]
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
      it("preprocessUsers", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "preprocessUsers",
            params: {
              objId: aclUtilsSord.id,
              users: ["renz"]
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
      it("preprocessUsers", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "preprocessUsers",
            params: {
              objId: aclUtilsSord.id,
              users: ["baum", { name: "renz", rights: { r: true, w: true } }]
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

      it("containsSessionUserAndhasEffectiveRights", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "containsSessionUserAndhasEffectiveRights",
            params: {
              rightsConfig: {
                rights: {
                  r: true,
                  w: true
                },
                users: ["baum", "renz"]
              }
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

      it("hasEffectiveRights", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "hasEffectiveRights",
            params: {
              sord: aclUtilsSord,
              params: {
                rights: {
                  r: true,
                  w: true
                }
              }
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

      it("containsRights", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonAclUtils", {
            method: "containsRights",
            params: {
              accessCode: elo.CONST.ACCESS.LUR_READ,
              rights: {
                r: true,
                w: true
              }
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