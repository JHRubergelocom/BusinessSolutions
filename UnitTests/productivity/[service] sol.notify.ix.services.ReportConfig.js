
describe("[service] sol.notify.ix.services.ReportConfig", function () {
  var userName, userId, originalTimeout, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      userName = "Unittest";
      test.Utils.getUserInfo(userName).then(function success(userInfo) {
        userId = userInfo.id;
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
    describe("sol.notify.ix.services.ReportConfig", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.notify.ix.services.ReportConfig",
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
      it("read", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.notify.ix.services.ReportConfig",
            classConfig: {},
            method: "read",
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
      it("write", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.notify.ix.services.ReportConfig",
            classConfig: {},
            method: "write",
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_notify_service_ReportConfig_Read", function () {
      describe("get options notify mail", function () {
        it("should not throw if executed without 'userId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Read", {
            }).then(function success(result) {
              expect(result.reportConfig).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("with user 'Unittest'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Read", {
              userId: userId
            }).then(function success(result) {
              expect(result.reportConfig).toBeDefined();
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
    describe("RF_sol_notify_service_ReportConfig_Write", function () {
      describe("set options notify mail", function () {
        it("should throw if executed without 'reportConfig'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Write", {
            }).then(function success(result) {
              fail(result);
              done();
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("should not throw if executed without 'userId' set onlyOnce", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Write", {
              reportConfig: { onlyOnce: true }
            }).then(function success(result) {
              test.Utils.execute("RF_sol_notify_service_ReportConfig_Read", {
              }).then(function success1(result1) {
                expect(result1.reportConfig.onlyOnce).toEqual(true);
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
        it("should not throw if executed without 'userId' reset onlyOnce", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Write", {
              reportConfig: { onlyOnce: false }
            }).then(function success(result) {
              test.Utils.execute("RF_sol_notify_service_ReportConfig_Read", {
              }).then(function success1(result1) {
                expect(result1.reportConfig.onlyOnce).toEqual(false);
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
        it("should throw with user 'Unittest' without 'reportConfig'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Write", {
              userId: userId
            }).then(function success(result) {
              fail(result);
              done();
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("with user 'Unittest' set onlyOnce", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Write", {
              userId: userId,
              reportConfig: { onlyOnce: true }
            }).then(function success(result) {
              test.Utils.execute("RF_sol_notify_service_ReportConfig_Read", {
                userId: userId
              }).then(function success1(result1) {
                expect(result1.reportConfig.onlyOnce).toEqual(true);
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
        it("with user 'Unittest' reset onlyOnce", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Write", {
              userId: userId,
              reportConfig: { onlyOnce: false }
            }).then(function success(result) {
              test.Utils.execute("RF_sol_notify_service_ReportConfig_Read", {
                userId: userId
              }).then(function success1(result1) {
                expect(result1.reportConfig.onlyOnce).toEqual(false);
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
        it("with user 'Unittest' set language='de'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Write", {
              userId: userId,
              reportConfig: { language: "de" }
            }).then(function success(result) {
              test.Utils.execute("RF_sol_notify_service_ReportConfig_Read", {
                userId: userId
              }).then(function success1(result1) {
                expect(result1.reportConfig.language).toEqual("de");
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
        it("with user 'Unittest' set language='en'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_notify_service_ReportConfig_Write", {
              userId: userId,
              reportConfig: { language: "en" }
            }).then(function success(result) {
              test.Utils.execute("RF_sol_notify_service_ReportConfig_Read", {
                userId: userId
              }).then(function success1(result1) {
                expect(result1.reportConfig.language).toEqual("en");
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
    });
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});