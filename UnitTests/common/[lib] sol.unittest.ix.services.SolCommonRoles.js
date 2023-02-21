
describe("[lib] sol.unittest.ix.services.SolCommonRoles", function () {
  var RolesSord, originalTimeout, param1, param2, userDef, userName, sord, rule, role, config, originalConfig, sordMap, condition, rolesConfig;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonRoles").then(function success(obSolCommonRolesId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/ActionBase").then(function success1(RolesSord1) {
          RolesSord = RolesSord1;
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
    describe("sol.common.Roles", function () {
      it("EQUALS (1000, 1000) => true", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "EQUALS",
            params: [param1, param2]
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
      it("EQUALS (1000, 1001) => false", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1001;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "EQUALS",
            params: [param1, param2]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("GE (1000, 1000) => true", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "GE",
            params: [param1, param2]
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
      it("GE (1001, 1000) => true", function (done) {
        expect(function () {
          param1 = 1001;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "GE",
            params: [param1, param2]
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
      it("GE (1000, 1001) => false", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1001;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "GE",
            params: [param1, param2]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("GT (1000, 1000) => false", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "GT",
            params: [param1, param2]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("GT (1001, 1000) => true", function (done) {
        expect(function () {
          param1 = 1001;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "GT",
            params: [param1, param2]
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
      it("GT (1000, 1001) => false", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1001;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "GT",
            params: [param1, param2]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("LE (1000, 1000) => true", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "LE",
            params: [param1, param2]
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
      it("LE (1001, 1000) => false", function (done) {
        expect(function () {
          param1 = 1001;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "LE",
            params: [param1, param2]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("LE (1000, 1001) => true", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1001;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "LE",
            params: [param1, param2]
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
      it("LT (1000, 1000) => false", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "LT",
            params: [param1, param2]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("LT (1001, 1000)  => false", function (done) {
        expect(function () {
          param1 = 1001;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "LT",
            params: [param1, param2]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("LT (1000, 1001) => true", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1001;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "LT",
            params: [param1, param2]
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
      it("NOT (1000, 1000) => false", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "NOT",
            params: [param1, param2]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("NOT (1000, 1001) => true", function (done) {
        expect(function () {
          param1 = 1000;
          param2 = 1001;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "NOT",
            params: [param1, param2]
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
      it("STARTSWITH ('ABCDE', 'AB') => true", function (done) {
        expect(function () {
          param1 = "ABCDE";
          param2 = "AB";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "STARTSWITH",
            params: [param1, param2]
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
      it("STARTSWITH ('ABCDE', 'CD') => false", function (done) {
        expect(function () {
          param1 = "ABCDE";
          param2 = "CD";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "STARTSWITH",
            params: [param1, param2]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getSupervisor", function (done) {
        expect(function () {
          userDef = {
            name: "FORMAL_CHECKER",
            users: [
              {
                user: "Administrator"
              }
            ]
          };
          userName = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getSupervisor",
            params: [userDef, userName]
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
      it("getUserName", function (done) {
        expect(function () {
          sord = RolesSord;
          rule = {
            user: "Administrator"
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getUserName",
            params: [sord, rule]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Administrator");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getUsers", function (done) {
        expect(function () {
          role = "FORMAL_CHECKER";
          sord = RolesSord;
          config = [
            {
              name: "FORMAL_CHECKER",
              users: [
                {
                  user: "sol.accounting"
                }
              ]
            },
            {
              name: "APPROVAL",
              users: [
                {
                  user: {
                    type: "GRP",
                    key: "PO_PURCHASE_USER"
                  },
                  mandatory: true
                },
                {
                  user: "sol.management",
                  conditions: [
                    {
                      type: "GRP",
                      key: "INVOICE_NET_AMOUNT_LOCAL_CURR",
                      rel: "GT",
                      val: 100,
                      dataType: "number"
                    }
                  ],
                  mandatory: true
                }
              ]
            },
            {
              name: "ACCOUNTING",
              users: [
                {
                  user: "sol.accounting"
                }
              ]
            },
            {
              name: "CLEARING",
              users: [
                {
                  user: "sol.clearing"
                }
              ]
            }
          ];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getUsers",
            params: [role, sord, config]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(["sol.accounting"]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getUsers2", function (done) {
        expect(function () {
          role = "FORMAL_CHECKER";
          sord = RolesSord;
          originalConfig = [
            {
              name: "FORMAL_CHECKER",
              users: [
                {
                  user: "sol.accounting"
                }
              ]
            },
            {
              name: "APPROVAL",
              users: [
                {
                  user: {
                    type: "GRP",
                    key: "PO_PURCHASE_USER"
                  },
                  mandatory: true
                },
                {
                  user: "sol.management",
                  conditions: [
                    {
                      type: "GRP",
                      key: "INVOICE_NET_AMOUNT_LOCAL_CURR",
                      rel: "GT",
                      val: 100,
                      dataType: "number"
                    }
                  ],
                  mandatory: true
                }
              ]
            },
            {
              name: "ACCOUNTING",
              users: [
                {
                  user: "sol.accounting"
                }
              ]
            },
            {
              name: "CLEARING",
              users: [
                {
                  user: "sol.clearing"
                }
              ]
            }
          ];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getUsers2",
            params: [role, sord, originalConfig]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual([{ name: "sol.accounting" }]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getUsersByRole", function (done) {
        expect(function () {
          role = "FORMAL_CHECKER";
          config = [
            {
              name: "FORMAL_CHECKER",
              users: [
                {
                  user: "sol.accounting"
                }
              ]
            },
            {
              name: "APPROVAL",
              users: [
                {
                  user: {
                    type: "GRP",
                    key: "PO_PURCHASE_USER"
                  },
                  mandatory: true
                },
                {
                  user: "sol.management",
                  conditions: [
                    {
                      type: "GRP",
                      key: "INVOICE_NET_AMOUNT_LOCAL_CURR",
                      rel: "GT",
                      val: 100,
                      dataType: "number"
                    }
                  ],
                  mandatory: true
                }
              ]
            },
            {
              name: "ACCOUNTING",
              users: [
                {
                  user: "sol.accounting"
                }
              ]
            },
            {
              name: "CLEARING",
              users: [
                {
                  user: "sol.clearing"
                }
              ]
            }
          ];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getUsersByRole",
            params: [role, config]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual([{ user: "sol.accounting" }]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get sordmap of RolesSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.SordMap",
            classConfig: { objId: RolesSord.id },
            method: "read",
            params: []
          }).then(function success(jsonResult) {
            sordMap = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getValue", function (done) {
        expect(function () {
          sord = RolesSord;
          sordMap = sordMap;
          condition = { type: "GRP", key: "UNITTEST_FIELD1", rel: "EQUALS", val: "Value1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getValue",
            params: [sord, sordMap, condition]
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
      it("retrieveRole", function (done) {
        expect(function () {
          role = "FORMAL_CHECKER";
          rolesConfig = [
            {
              name: "FORMAL_CHECKER",
              users: [
                {
                  user: "sol.accounting"
                }
              ]
            },
            {
              name: "APPROVAL",
              users: [
                {
                  user: {
                    type: "GRP",
                    key: "PO_PURCHASE_USER"
                  },
                  mandatory: true
                },
                {
                  user: "sol.management",
                  conditions: [
                    {
                      type: "GRP",
                      key: "INVOICE_NET_AMOUNT_LOCAL_CURR",
                      rel: "GT",
                      val: 100,
                      dataType: "number"
                    }
                  ],
                  mandatory: true
                }
              ]
            },
            {
              name: "ACCOUNTING",
              users: [
                {
                  user: "sol.accounting"
                }
              ]
            },
            {
              name: "CLEARING",
              users: [
                {
                  user: "sol.clearing"
                }
              ]
            }
          ];
          sord = RolesSord;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib3", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "retrieveRole",
            params: [role, rolesConfig, sord]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("FORMAL_CHECKER");
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