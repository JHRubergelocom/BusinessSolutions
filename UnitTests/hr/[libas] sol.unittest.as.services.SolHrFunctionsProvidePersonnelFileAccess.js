/* eslint-disable linebreak-style */

describe("[libas] sol.unittest.as.services.SolHrFunctionsProvidePersonnelFileAccess", function () {
  var obSolHrFunctionsProvidePersonnelFileAccessId, originalTimeout, content, instructions, target, setInstructions, fieldConfig, template, findInfo,
      targetRoot, sourceRoot, security, copyConfigs, sord, map, objId, customConn, mapItems, objKeys, fieldNames,
      MAPTemplate, option, name, mbs, overwrite, sourceId, soltype, securitylevel, maskId, hashMap, templateKeys,
      targetConfig, modifyConfig, cfg, inquirerUserId, pfSord, origin, created, sourceSord, targetSord, targetMap, targetId,
      encryptedSord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolHrFunctionsProvidePersonnelFileAccess").then(function success(obSolHrFunctionsProvidePersonnelFileAccessId1) {
        obSolHrFunctionsProvidePersonnelFileAccessId = obSolHrFunctionsProvidePersonnelFileAccessId1;
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
    describe("sol.hr.as.functions.ProvidePersonnelFileAccess", function () {
      it("applyInstructions", function (done) {
        expect(function () {
          instructions = {};
          target = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "applyInstructions",
              params: [instructions, target]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildInstructions", function (done) {
        expect(function () {
          setInstructions = {};
          fieldConfig = {};
          target = "target1";
          template = "template1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "buildInstructions",
              params: [setInstructions, fieldConfig, target, template]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("copyTreeElements", function (done) {
        expect(function () {
          findInfo = {};
          targetRoot = obSolHrFunctionsProvidePersonnelFileAccessId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "copyTreeElements",
              params: [findInfo, targetRoot]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("copyTreeTo", function (done) {
        expect(function () {
          sourceRoot = obSolHrFunctionsProvidePersonnelFileAccessId;
          security = [];
          copyConfigs = [];
          targetRoot = { id: obSolHrFunctionsProvidePersonnelFileAccessId };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: { accessConfig: {}, flowId: "flowId1", objId: obSolHrFunctionsProvidePersonnelFileAccessId },
              method: "copyTreeTo",
              params: [sourceRoot, security, copyConfigs, targetRoot]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("decryptDocument", function (done) {
        expect(function () {
          encryptedSord = obSolHrFunctionsProvidePersonnelFileAccessId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "decryptDocument",
              params: [encryptedSord]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("emptyMapAndObjKeys", function (done) {
        expect(function () {
          sord = {};
          map = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "emptyMapAndObjKeys",
              params: [sord, map]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("emptyMapAndObjKeysById", function (done) {
        expect(function () {
          objId = obSolHrFunctionsProvidePersonnelFileAccessId;
          customConn = null;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "emptyMapAndObjKeysById",
              params: [objId, customConn]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("emptyMapItems", function (done) {
        expect(function () {
          mapItems = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "emptyMapItems",
              params: [mapItems]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("emptyObjKeys", function (done) {
        expect(function () {
          objKeys = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "emptyObjKeys",
              params: [objKeys]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("excludeAllOptionHandler", function (done) {
        expect(function () {
          setInstructions = {};
          target = "target1";
          template = "template1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "excludeAllOptionHandler",
              params: [setInstructions, target, template]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("excludeGRPFields", function (done) {
        expect(function () {
          setInstructions = {};
          fieldNames = {};
          objKeys = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "excludeGRPFields",
              params: [setInstructions, fieldNames, objKeys]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("excludeMAPFields", function (done) {
        expect(function () {
          setInstructions = {};
          fieldNames = [];
          mapItems = {};
          MAPTemplate = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "excludeMAPFields",
              params: [setInstructions, fieldNames, mapItems, MAPTemplate]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("excludeOptionHandler", function (done) {
        expect(function () {
          setInstructions = {};
          option = {};
          target = "target1";
          template = "template1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "excludeOptionHandler",
              params: [setInstructions, option, target, template]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("genSordZ", function (done) {
        expect(function () {
          name = "name1";
          mbs = [];
          overwrite = "overwrite1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "genSordZ",
              params: [name, mbs, overwrite]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("generateFindInfo", function (done) {
        expect(function () {
          sourceId = "sourceId1";
          soltype = "soltype1";
          securitylevel = "securitylevel1";
          maskId = "maskId1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "generateFindInfo",
              params: [sourceId, soltype, securitylevel, maskId]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "getName",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getSearchId", function (done) {
        expect(function () {
          findInfo = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "getSearchId",
              params: [findInfo]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("hashMapToArray", function (done) {
        expect(function () {
          hashMap = null;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "hashMapToArray",
              params: [hashMap]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("includeAllOptionHandler", function (done) {
        expect(function () {
          setInstructions = {};
          template = { sord: { mapKeys: {}, objKeys: {} } };
          target = { sord: { objKeys: [] } };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "includeAllOptionHandler",
              params: [setInstructions, template, target]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("includeGRPFields", function (done) {
        expect(function () {
          setInstructions = {};
          templateKeys = [];
          objKeys = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "includeGRPFields",
              params: [setInstructions, templateKeys, objKeys]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("includeMAPFields", function (done) {
        expect(function () {
          setInstructions = {};
          templateKeys = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "includeMAPFields",
              params: [setInstructions, templateKeys]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("mkdir", function (done) {
        expect(function () {
          targetConfig = { id: obSolHrFunctionsProvidePersonnelFileAccessId };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "mkdir",
              params: [targetConfig]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("modifyOptionHandler", function (done) {
        expect(function () {
          setInstructions = {};
          modifyConfig = [];
          target = "target1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "modifyOptionHandler",
              params: [setInstructions, modifyConfig, target]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("prepareTemporaryPersonnelFile", function (done) {
        expect(function () {
          cfg = { fieldConfigs: [] };
          inquirerUserId = "Administrator";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: { securityLevels: "", accessConfig: {}, flowId: "flowId1", objId: obSolHrFunctionsProvidePersonnelFileAccessId },
              method: "prepareTemporaryPersonnelFile",
              params: [cfg, inquirerUserId]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
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
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "process",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("refineCreatedStructure", function (done) {
        expect(function () {
          pfSord = {};
          origin = [];
          created = [];
          cfg = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "refineCreatedStructure",
              params: [pfSord, origin, created, cfg]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setByConfig", function (done) {
        expect(function () {
          fieldConfig = {};
          sourceSord = obSolHrFunctionsProvidePersonnelFileAccessId;
          targetSord = obSolHrFunctionsProvidePersonnelFileAccessId;
          targetMap = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "setByConfig",
              params: [fieldConfig, sourceSord, targetSord, targetMap]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setByConfigById", function (done) {
        expect(function () {
          fieldConfig = {};
          sourceId = obSolHrFunctionsProvidePersonnelFileAccessId;
          targetId = obSolHrFunctionsProvidePersonnelFileAccessId;
          customConn = null;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "setByConfigById",
              params: [fieldConfig, sourceId, targetId, customConn]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setGRPFieldValues", function (done) {
        expect(function () {
          setInstructions = {};
          sord = { objKeys: [] };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "setGRPFieldValues",
              params: [setInstructions, sord]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setMAPFieldValues", function (done) {
        expect(function () {
          setInstructions = {};
          map = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.ProvidePersonnelFileAccess",
              classConfig: {},
              method: "setMAPFieldValues",
              params: [setInstructions, map]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
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