
describe("[function] sol.common.ix.functions.Inherit", function () {
  var originalTimeout, parentId, idFolder1, inheritFields,
      objTempId, parentValue, targetValue, override, cfg, config, startId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createSord(null, null, null, {
        UNITTEST_FIELD1: "Bernd",
        UNITTEST_FIELD2: "Stromberg"
      }, {
        UNITTEST_MAP1: "Eintrag1",
        UNITTEST_MAP2: "Eintrag2"
      }).then(function success(parentId1) {
        parentId = parentId1;
        inheritFields = [{ type: "SORD", key: "name", override: true },
          { type: "GRP", key: "UNITTEST_FIELD1", override: true },
          { type: "MAP", key: "UNITTEST_MAP1", override: true }];
        test.Utils.createSord(parentId).then(function success1(idFolder) {
          idFolder1 = idFolder;
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
    describe("sol.common.ix.functions.Inherit", function () {
      it("create sord temp", function (done) {
        expect(function () {
          test.Utils.createTempSord("Temp").then(function success(objTempId1) {
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
      it("checkUpdate", function (done) {
        expect(function () {
          parentValue = "parentValue1";
          targetValue = "targetValue1";
          override = false;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Inherit",
            classConfig: { objId: objTempId },
            method: "checkUpdate",
            params: [parentValue, targetValue, override]
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
      it("inheritField", function (done) {
        expect(function () {
          cfg = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Inherit",
            classConfig: { objId: objTempId },
            method: "inheritField",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Inherit",
            classConfig: { objId: objTempId },
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
            className: "sol.common.ix.functions.Inherit",
            classConfig: { objId: objTempId },
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
      it("startInheritKeywordingJob", function (done) {
        expect(function () {
          startId = objTempId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Inherit",
            classConfig: { objId: objTempId },
            method: "startInheritKeywordingJob",
            params: [startId]
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
  });
  describe("inherit fields", function () {
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Inherit", {
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
    it("should not throw if executed without 'fields'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Inherit", {
          objId: idFolder1
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
    it("inherit some contents from Parent to Folder1", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Inherit", {
          objId: idFolder1,
          fields: inheritFields
        }).then(function success(jsonResult) {
          done();
        }, function error(err) {
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("objValue 'UNITTEST_FIELD1' should be equal in Parent and Folder1", function (done) {
      test.Utils.getSord(parentId).then(function success(sordParent) {
        test.Utils.getSord(idFolder1).then(function success1(sordFolder1) {
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
    });
    it("mapValue 'UNITTEST_MAP1' should be equal in Parent and Folder1", function (done) {
      test.Utils.getMapValue(parentId, "UNITTEST_MAP1").then(function success(mapValue1) {
        test.Utils.getMapValue(idFolder1, "UNITTEST_MAP1").then(function success1(mapValue2) {
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
    });
    it("objValue 'UNITTEST_FIELD2' should not be equal in Parent and Folder1", function (done) {
      test.Utils.getSord(parentId).then(function success(sordParent) {
        test.Utils.getSord(idFolder1).then(function success1(sordFolder1) {
          expect(test.Utils.getObjKeyValue(sordParent, "UNITTEST_FIELD2")).not.toEqual(test.Utils.getObjKeyValue(sordFolder1, "UNITTEST_FIELD2"));
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
    });
    it("mapValue 'UNITTEST_MAP2' should not be defined in Folder1", function (done) {
      test.Utils.getMapValue(idFolder1, "UNITTEST_MAP2").then(function success(mapValue) {
        expect(mapValue).not.toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.deleteSord(parentId).then(function success(deleteResult) {
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
    }).not.toThrow();
  });
});