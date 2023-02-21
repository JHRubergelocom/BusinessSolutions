
describe("[function] sol.common.ix.functions.Set", function () {
  var originalTimeout, objSetId, sordName, sordDesc, grpField1, grpField2, mapValue1, mapValue2,
      entries, sord, entry, maskName, fieldName, valuePrefix, config, foreignKeyConfig,
      sordMapEntries, grpEntries, maskEntries, sordEntries, wfEntries, wfMapEntries,
      objTempTId, callback;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      sordName = "sordName";
      sordDesc = "sordDesc";
      grpField1 = "grpField1";
      grpField2 = "grpField2";
      mapValue1 = "mapValue1";
      mapValue2 = "mapValue2";
      test.Utils.createTempSord("objSet").then(function success(objSetId1) {
        objSetId = objSetId1;
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
    describe("sol.common.ix.functions.Set", function () {
      it("create sord temp", function (done) {
        expect(function () {
          test.Utils.createTempSord("TempT").then(function success(objTempTId1) {
            objTempTId = objTempTId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("applyTemplates", function (done) {
        expect(function () {
          entries = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "applyTemplates",
            params: [entries]
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
      it("checkAdminExecutionContext", function (done) {
        expect(function () {
          callback = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "checkAdminExecutionContext",
            params: [callback]
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
      it("filterEntry", function (done) {
        expect(function () {
          sord = { id: objTempTId };
          entry = { type: "SORD", key: "desc", value: "sordDescTemp" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "filterEntry",
            params: [sord, entry]
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
      it("getValueFromDynKwl", function (done) {
        expect(function () {
          maskName = "UnitTest";
          fieldName = "UNITTEST_STATUS1";
          valuePrefix = "";
          config = {};
          foreignKeyConfig = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "getValueFromDynKwl",
            params: [maskName, fieldName, valuePrefix, config, foreignKeyConfig]
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
      it("getValueFromKwl", function (done) {
        expect(function () {
          fieldName = "UNITTEST_STATUS1";
          valuePrefix = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "getValueFromKwl",
            params: [fieldName, valuePrefix]
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
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
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
      it("processTypeFORMBLOB", function (done) {
        expect(function () {
          sordMapEntries = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "processTypeFORMBLOB",
            params: [sordMapEntries]
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
      it("processTypeGRP", function (done) {
        expect(function () {
          grpEntries = [{ type: "GRP", key: "UNITTEST_FIELD3", value: "T3" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [], sordData: [] },
            method: "processTypeGRP",
            params: [grpEntries]
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
      it("processTypeMAP", function (done) {
        expect(function () {
          sordMapEntries = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "processTypeMAP",
            params: [sordMapEntries]
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
      it("processTypeMASK", function (done) {
        expect(function () {
          maskEntries = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "processTypeMASK",
            params: [maskEntries]
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
      it("processTypeSORD", function (done) {
        expect(function () {
          sordEntries = [{ type: "SORD", key: "name", value: "TT" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [], sordData: [] },
            method: "processTypeSORD",
            params: [sordEntries]
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
      it("processTypeWF", function (done) {
        expect(function () {
          wfEntries = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "processTypeWF",
            params: [wfEntries]
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
      it("processTypeWFMAP", function (done) {
        expect(function () {
          wfMapEntries = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "processTypeWFMAP",
            params: [wfMapEntries]
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
      it("saveSordValues", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "saveSordValues",
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
      it("saveWorkflowValues", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Set",
            classConfig: { objId: objTempTId, entries: [] },
            method: "saveWorkflowValues",
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
      it("delete sord temp", function (done) {
        expect(function () {
          test.Utils.deleteSord(objTempTId).then(function success(deleteResult) {
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
  describe("test Set", function () {
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Set", {
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
    it("should throw if executed without 'entries'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Set", {
          objId: objSetId
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
    it("Set", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Set", {
          objId: objSetId,
          entries: [{
            type: "SORD",
            key: "name",
            value: sordName
          }, {
            type: "SORD",
            key: "desc",
            value: sordDesc
          }, {
            type: "GRP",
            key: "UNITTEST_FIELD1",
            value: grpField1
          }, {
            type: "GRP",
            key: "UNITTEST_FIELD2",
            value: grpField2
          }, {
            type: "MAP",
            key: "MAP_VALUE1",
            value: mapValue1
          }, {
            type: "MAP",
            key: "MAP_VALUE2",
            value: mapValue2
          }]
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
    it("Set in admin context", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Set", {
          objId: objSetId,
          asAdmin: true,
          entries: [{
            type: "SORD",
            key: "name",
            value: sordName
          }, {
            type: "SORD",
            key: "desc",
            value: sordDesc
          }, {
            type: "GRP",
            key: "UNITTEST_FIELD1",
            value: grpField1
          }, {
            type: "GRP",
            key: "UNITTEST_FIELD2",
            value: grpField2
          }, {
            type: "MAP",
            key: "MAP_VALUE1",
            value: mapValue1
          }, {
            type: "MAP",
            key: "MAP_VALUE2",
            value: mapValue2
          }]
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
    it("Compare Values", function (done) {
      test.Utils.getSord(objSetId).then(function success(sordSet) {
        expect(sordSet.name).toEqual(sordName);
        expect(sordSet.desc).toEqual(sordDesc);
        expect(test.Utils.getObjKeyValue(sordSet, "UNITTEST_FIELD1")).toEqual(grpField1);
        expect(test.Utils.getObjKeyValue(sordSet, "UNITTEST_FIELD2")).toEqual(grpField2);
        test.Utils.getMapValue(objSetId, "MAP_VALUE1").then(function success1(mapValue11) {
          test.Utils.getMapValue(objSetId, "MAP_VALUE2").then(function success2(mapValue21) {
            expect(mapValue11).toEqual(mapValue1);
            expect(mapValue21).toEqual(mapValue2);
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