
describe("[service] sol.common.ix.services.GetConfig", function () {
  var jsonConfig1, objTestJsonConfigId, pathConfig1, configJson1,
      pathConfig2, pathConfig3, pathConfig4, pathConfig5, pathConfig6,
      pathConfig7, pathConfig8, pathConfig9, pathConfig10, pathConfig11,
      pathConfig12, pathConfig13, pathConfig14, pathConfig15, pathConfig16,
      pathConfig17, pathConfig18, pathConfig19,
      sourceId, archiveTargetId, objCustomUnitTestFolderId,
      originalTimeout,
      config, compose;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      sourceId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/Business Solutions Custom/common [unit tests]";
      test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom").then(function success(customFolder) {
        archiveTargetId = customFolder.id;
        test.Utils.execute("RF_sol_function_CopyFolderContents", {
          objId: archiveTargetId,
          source: sourceId,
          copySourceAcl: false,
          inheritDestinationAcl: true,
          fallbackToSyncExecution: true
        }).then(function success1(jsonResult) {
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/common [unit tests]").then(function success2(customUnitTestFolder) {
            objCustomUnitTestFolderId = customUnitTestFolder.id;
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
  describe("Test JSON Config helpers", function () {
    jsonConfig1 = {
      testfeld1: "testvalue1",
      testfeld2: "testvalue2",
      testfeld3: "testvalue3"
    },
    pathConfig1 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/testJsonConfig.config";
    it("saveNewConfig should not throw", function (done) {
      expect(function () {
        test.Utils.saveNewConfig(pathConfig1, jsonConfig1).then(function success(objId) {
          objTestJsonConfigId = objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("loadConfig should not throw", function (done) {
      expect(function () {
        test.Utils.loadConfig(objTestJsonConfigId).then(function success(configJson) {
          configJson1 = configJson;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("change configJson should not throw", function () {
      expect(function () {
        configJson1.testfeld3 = "newvalue3";
        configJson1.testfeld4 = "newvalue4";
      }).not.toThrow();
    });
    it("saveConfig should not throw", function (done) {
      expect(function () {
        test.Utils.saveConfig(objTestJsonConfigId, configJson1).then(function success(jsonResult) {
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
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.services.GetConfig", function () {
      it("determineMode", function (done) {
        expect(function () {
          pathConfig1 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/testJsonConfig.config";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetConfig",
            classConfig: { objId: pathConfig1 },
            method: "determineMode",
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
      it("getExplodedConfig", function (done) {
        expect(function () {
          compose = "compose1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetConfig",
            classConfig: { objId: pathConfig1 },
            method: "getExplodedConfig",
            params: [compose]
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
      it("getMergedConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetConfig",
            classConfig: { objId: pathConfig1 },
            method: "getMergedConfig",
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
      it("getMultipleExplodedConfigs", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetConfig",
            classConfig: { objId: pathConfig1, paths: [] },
            method: "getMultipleExplodedConfigs",
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
      it("getSimpleConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetConfig",
            classConfig: { objId: pathConfig1 },
            method: "getSimpleConfig",
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
      it("initialize", function (done) {
        expect(function () {
          config = { objId: pathConfig1 };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetConfig",
            classConfig: { objId: pathConfig1 },
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetConfig",
            classConfig: { objId: pathConfig1 },
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_service_GetConfig", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
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
      describe("within merge hierarchy", function () {
        pathConfig2 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config";
        it("jsonConfig.config should return defined result", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_common_service_GetConfig", {
              objId: pathConfig2,
              forceReload: true
            }).then(function success(jsonConfig) {
              expect(jsonConfig.config).toBeDefined();
              expect(jsonConfig.config.feld1).toEqual("defaultvalue1");
              expect(jsonConfig.config.feld2).toEqual("defaultvalue2");
              expect(jsonConfig.config.feld3).toEqual("defaultvalue3");
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
      describe("outside merge hierarchy", function () {
        pathConfig3 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/testJsonConfig.config";
        it("jsonConfig.config should return defined result", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_common_service_GetConfig", {
              objId: pathConfig3,
              forceReload: true
            }).then(function success(jsonConfig) {
              expect(jsonConfig.config).toBeDefined();
              expect(jsonConfig.config.testfeld1).toEqual("testvalue1");
              expect(jsonConfig.config.testfeld2).toEqual("testvalue2");
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
    describe("RF_sol_common_service_GetMergedConfig", function () {
      it("should throw if executed without 'compose'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetMergedConfig", {
          }).then(function success(jsonConfig) {
            fail(jsonConfig);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      describe("absolute path", function () {
        describe("within merge hierarchy", function () {
          pathConfig4 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config";
          it("jsonConfig.config should return defined result", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetMergedConfig", {
                compose: pathConfig4,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.config).toBeDefined();
                expect(jsonConfig.config.feld1).toEqual("defaultvalue1");
                expect(jsonConfig.config.feld2).toEqual("customvalue2");
                expect(jsonConfig.config.feld3).toEqual("customvalue3");
                expect(jsonConfig.config.feld4).toEqual("customvalue4");
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
        describe("within merge hierarchy only default", function () {
          pathConfig5 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest1.config";
          it("jsonConfig.config should return defined result", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetMergedConfig", {
                compose: pathConfig5,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.config).toBeDefined();
                expect(jsonConfig.config.feld12).toEqual("customvalue12");
                expect(jsonConfig.config.feld13).toEqual("customvalue13");
                expect(jsonConfig.config.feld14).toEqual("customvalue14");
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
        describe("within merge hierarchy only custom", function () {
          pathConfig6 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/common [unit tests]/Test data/unittest2.config";
          it("jsonConfig.config should return defined result", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetMergedConfig", {
                compose: pathConfig6,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.config).toBeDefined();
                expect(jsonConfig.config.feld22).toEqual("customvalue22");
                expect(jsonConfig.config.feld23).toEqual("customvalue23");
                expect(jsonConfig.config.feld24).toEqual("customvalue24");
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
        describe("outside merge hierarchy", function () {
          pathConfig7 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/testJsonConfig.config";
          it("jsonConfig.config shouldn't be defined", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetMergedConfig", {
                compose: pathConfig7,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.config).toBeDefined();
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
      describe("relative path", function () {
        describe("within merge hierarchy", function () {
          pathConfig8 = "/common [unit tests]/Test data/unittest.config";
          it("jsonConfig.config should return defined result", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetMergedConfig", {
                compose: pathConfig8,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.config).toBeDefined();
                expect(jsonConfig.config.feld1).toEqual("defaultvalue1");
                expect(jsonConfig.config.feld2).toEqual("customvalue2");
                expect(jsonConfig.config.feld3).toEqual("customvalue3");
                expect(jsonConfig.config.feld4).toEqual("customvalue4");
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
        describe("within merge hierarchy only default", function () {
          pathConfig9 = "/common [unit tests]/Test data/unittest1.config";
          it("jsonConfig.config should return defined result", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetMergedConfig", {
                compose: pathConfig9,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.config).toBeDefined();
                expect(jsonConfig.config.feld12).toEqual("customvalue12");
                expect(jsonConfig.config.feld13).toEqual("customvalue13");
                expect(jsonConfig.config.feld14).toEqual("customvalue14");
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
        describe("within merge hierarchy only custom", function () {
          pathConfig10 = "/common [unit tests]/Test data/unittest2.config";
          it("jsonConfig.config should return defined result", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetMergedConfig", {
                compose: pathConfig10,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.config).toBeDefined();
                expect(jsonConfig.config.feld22).toEqual("customvalue22");
                expect(jsonConfig.config.feld23).toEqual("customvalue23");
                expect(jsonConfig.config.feld24).toEqual("customvalue24");
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
        describe("outside merge hierarchy", function () {
          pathConfig11 = "/Business Solutions/common [unit tests]/Test data/testJsonConfig.config";
          it("jsonConfig.config shouldn't be defined", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetMergedConfig", {
                compose: pathConfig11,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.config).not.toBeDefined();
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
    });
    describe("RF_sol_common_service_GetConfigHierarchy", function () {
      it("should throw if executed without 'compose'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfigHierarchy", {
          }).then(function success(jsonConfig) {
            fail(jsonConfig);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      describe("absolute path", function () {
        describe("within merge hierarchy", function () {
          pathConfig12 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config";
          it("jsonConfig.defaultConfig and customConfigs[1] should return defined result", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetConfigHierarchy", {
                compose: pathConfig12,
                content: true,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.defaultConfig).toBeDefined();
                expect(jsonConfig.defaultConfig.content.feld1).toEqual("defaultvalue1");
                expect(jsonConfig.defaultConfig.content.feld2).toEqual("defaultvalue2");
                expect(jsonConfig.defaultConfig.content.feld3).toEqual("defaultvalue3");
                expect(jsonConfig.customConfigs).toBeDefined();
                expect(jsonConfig.customConfigs.length).toEqual(1);
                expect(jsonConfig.customConfigs[0].content.feld2).toEqual("customvalue2");
                expect(jsonConfig.customConfigs[0].content.feld3).toEqual("customvalue3");
                expect(jsonConfig.customConfigs[0].content.feld4).toEqual("customvalue4");
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
        describe("within merge hierarchy only default", function () {
          pathConfig13 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest1.config";
          it("jsonConfig.defaultConfig should return defined result and customConfigs should be defined", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetConfigHierarchy", {
                compose: pathConfig13,
                content: true,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.defaultConfig).toBeDefined();
                expect(jsonConfig.defaultConfig.content.feld12).toEqual("customvalue12");
                expect(jsonConfig.defaultConfig.content.feld13).toEqual("customvalue13");
                expect(jsonConfig.defaultConfig.content.feld14).toEqual("customvalue14");
                expect(jsonConfig.customConfigs).toBeDefined();
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
        describe("within merge hierarchy only custom", function () {
          pathConfig14 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/common [unit tests]/Test data/unittest2.config";
          it("jsonConfig.defaultConfig should be defined and customConfigs should be defined", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetConfigHierarchy", {
                compose: pathConfig14,
                content: true,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.defaultConfig).toBeDefined();
                expect(jsonConfig.customConfigs).toBeDefined();
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
        describe("outside merge hierarchy", function () {
          pathConfig15 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/testJsonConfig.config";
          it("jsonConfig.customConfigs[1] should be null and defaultConfig should be defined", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetConfigHierarchy", {
                compose: pathConfig15,
                content: true,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.defaultConfig).toBeDefined();
                expect(jsonConfig.customConfigs).toBeDefined();
                expect(jsonConfig.customConfigs.length).toEqual(1);
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
      describe("relative path", function () {
        describe("within merge hierarchy", function () {
          pathConfig16 = "/common [unit tests]/Test data/unittest.config";
          it("jsonConfig.defaultConfig and customConfigs[1] should return defined result", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetConfigHierarchy", {
                compose: pathConfig16,
                content: true,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.defaultConfig).toBeDefined();
                expect(jsonConfig.defaultConfig.content.feld1).toEqual("defaultvalue1");
                expect(jsonConfig.defaultConfig.content.feld2).toEqual("defaultvalue2");
                expect(jsonConfig.defaultConfig.content.feld3).toEqual("defaultvalue3");
                expect(jsonConfig.customConfigs).toBeDefined();
                expect(jsonConfig.customConfigs.length).toEqual(1);
                expect(jsonConfig.customConfigs[0].content.feld2).toEqual("customvalue2");
                expect(jsonConfig.customConfigs[0].content.feld3).toEqual("customvalue3");
                expect(jsonConfig.customConfigs[0].content.feld4).toEqual("customvalue4");
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
        describe("within merge hierarchy only default", function () {
          pathConfig17 = "/common [unit tests]/Test data/unittest1.config";
          it("jsonConfig.defaultConfig should return defined result and customConfigs should be defined", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetConfigHierarchy", {
                compose: pathConfig17,
                content: true,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.defaultConfig).toBeDefined();
                expect(jsonConfig.defaultConfig.content.feld12).toEqual("customvalue12");
                expect(jsonConfig.defaultConfig.content.feld13).toEqual("customvalue13");
                expect(jsonConfig.defaultConfig.content.feld14).toEqual("customvalue14");
                expect(jsonConfig.customConfigs).toBeDefined();
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
        describe("within merge hierarchy only custom", function () {
          pathConfig18 = "/common [unit tests]/Test data/unittest2.config";
          it("jsonConfig.defaultConfig should be defined result and customConfigs should be defined", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetConfigHierarchy", {
                compose: pathConfig18,
                content: true,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.defaultConfig).toBeDefined();
                expect(jsonConfig.customConfigs).toBeDefined();
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
        describe("outside merge hierarchy", function () {
          pathConfig19 = "/Business Solutions/common [unit tests]/Test data/testJsonConfig.config";
          it("jsonConfig.defaultConfig and customConfigs should be defined", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_common_service_GetConfigHierarchy", {
                compose: pathConfig19,
                content: true,
                forceReload: true
              }).then(function success(jsonConfig) {
                expect(jsonConfig.defaultConfig).toBeDefined();
                expect(jsonConfig.customConfigs).toBeDefined();
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
    });
    describe("RF_sol_common_service_GetConfigHierarchies", function () {
      it("should throw if executed without 'paths'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfigHierarchies", {
          }).then(function success(jsonConfig) {
            fail(jsonConfig);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      describe("multiple paths", function () {
        it("jsonConfig.[pathConfig12] to jsonConfig.[pathConfig19] should return defined result", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_common_service_GetConfigHierarchies", {
              paths: [pathConfig12, pathConfig13, pathConfig14, pathConfig15, pathConfig16, pathConfig17, pathConfig18, pathConfig19],
              content: true,
              forceReload: true
            }).then(function success(jsonConfig) {
              expect(jsonConfig[pathConfig12]).toBeDefined();
              expect(jsonConfig[pathConfig12].defaultConfig).toBeDefined();
              expect(jsonConfig[pathConfig12].defaultConfig.content.feld1).toEqual("defaultvalue1");
              expect(jsonConfig[pathConfig12].defaultConfig.content.feld2).toEqual("defaultvalue2");
              expect(jsonConfig[pathConfig12].defaultConfig.content.feld3).toEqual("defaultvalue3");
              expect(jsonConfig[pathConfig12].customConfigs).toBeDefined();
              expect(jsonConfig[pathConfig12].customConfigs.length).toEqual(1);
              expect(jsonConfig[pathConfig12].customConfigs[0].content.feld2).toEqual("customvalue2");
              expect(jsonConfig[pathConfig12].customConfigs[0].content.feld3).toEqual("customvalue3");
              expect(jsonConfig[pathConfig12].customConfigs[0].content.feld4).toEqual("customvalue4");

              expect(jsonConfig[pathConfig13]).toBeDefined();
              expect(jsonConfig[pathConfig13].defaultConfig).toBeDefined();
              expect(jsonConfig[pathConfig13].defaultConfig.content.feld12).toEqual("customvalue12");
              expect(jsonConfig[pathConfig13].defaultConfig.content.feld13).toEqual("customvalue13");
              expect(jsonConfig[pathConfig13].defaultConfig.content.feld14).toEqual("customvalue14");
              expect(jsonConfig[pathConfig13].customConfigs).toBeDefined();

              expect(jsonConfig[pathConfig14]).toBeDefined();
              expect(jsonConfig[pathConfig14].defaultConfig).toBeDefined();
              expect(jsonConfig[pathConfig14].customConfigs).toBeDefined();

              expect(jsonConfig[pathConfig15]).toBeDefined();
              expect(jsonConfig[pathConfig15].defaultConfig).toBeDefined();
              expect(jsonConfig[pathConfig15].customConfigs).toBeDefined();
              expect(jsonConfig[pathConfig15].customConfigs.length).toEqual(1);

              expect(jsonConfig[pathConfig16]).toBeDefined();
              expect(jsonConfig[pathConfig16].defaultConfig).toBeDefined();
              expect(jsonConfig[pathConfig16].defaultConfig.content.feld1).toEqual("defaultvalue1");
              expect(jsonConfig[pathConfig16].defaultConfig.content.feld2).toEqual("defaultvalue2");
              expect(jsonConfig[pathConfig16].defaultConfig.content.feld3).toEqual("defaultvalue3");
              expect(jsonConfig[pathConfig16].customConfigs).toBeDefined();
              expect(jsonConfig[pathConfig16].customConfigs.length).toEqual(1);
              expect(jsonConfig[pathConfig16].customConfigs[0].content.feld2).toEqual("customvalue2");
              expect(jsonConfig[pathConfig16].customConfigs[0].content.feld3).toEqual("customvalue3");
              expect(jsonConfig[pathConfig16].customConfigs[0].content.feld4).toEqual("customvalue4");

              expect(jsonConfig[pathConfig17]).toBeDefined();
              expect(jsonConfig[pathConfig17].defaultConfig).toBeDefined();
              expect(jsonConfig[pathConfig17].defaultConfig.content.feld12).toEqual("customvalue12");
              expect(jsonConfig[pathConfig17].defaultConfig.content.feld13).toEqual("customvalue13");
              expect(jsonConfig[pathConfig17].defaultConfig.content.feld14).toEqual("customvalue14");
              expect(jsonConfig[pathConfig17].customConfigs).toBeDefined();

              expect(jsonConfig[pathConfig18]).toBeDefined();
              expect(jsonConfig[pathConfig18].defaultConfig).toBeDefined();
              expect(jsonConfig[pathConfig18].customConfigs).toBeDefined();

              expect(jsonConfig[pathConfig19]).toBeDefined();
              expect(jsonConfig[pathConfig19].defaultConfig).toBeDefined();
              expect(jsonConfig[pathConfig19].customConfigs).toBeDefined();

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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.deleteSord(objTestJsonConfigId).then(function success(deleteResult) {
        test.Utils.deleteSord(objCustomUnitTestFolderId).then(function success1(deleteResult1) {
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