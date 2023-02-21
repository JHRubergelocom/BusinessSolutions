
describe("[function] sol.common.ix.functions.CopySordData", function () {
  var originalTimeout, source, objId, sordA,
      arr, config, srcMapItem,
      objTemp1Id, objTemp2Id;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createSord().then(function success(source1) {
        source = source1;
        test.Utils.getSord(source).then(function success1(sordA1) {
          sordA = sordA1;
          test.Utils.createSord().then(function success2(objId1) {
            objId = objId1;
            test.Utils.getSord(objId).then(function success3(sordB1) {
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
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.functions.CopySordData", function () {
      it("create sord temp1", function (done) {
        expect(function () {
          test.Utils.createTempSord("Temp1").then(function success(objTemp1Id1) {
            objTemp1Id = objTemp1Id1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("create sord temp2", function (done) {
        expect(function () {
          test.Utils.createTempSord("Temp2").then(function success(objTemp2Id1) {
            objTemp2Id = objTemp2Id1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("convertStringArrayToObject", function (done) {
        expect(function () {
          arr = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopySordData",
            classConfig: { source: objTemp1Id, objId: objTemp2Id },
            method: "convertStringArrayToObject",
            params: [arr]
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
            className: "sol.common.ix.functions.CopySordData",
            classConfig: { source: objTemp1Id, objId: objTemp2Id },
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
      it("prepareMapItem", function (done) {
        expect(function () {
          srcMapItem = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopySordData",
            classConfig: { source: objTemp1Id, objId: objTemp2Id },
            method: "prepareMapItem",
            params: [srcMapItem]
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
            className: "sol.common.ix.functions.CopySordData",
            classConfig: { source: objTemp1Id, objId: objTemp2Id },
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
  describe("test cases copysorddata", function () {
    it("set objKey in SordA should not throw", function (done) {
      expect(function () {
        test.Utils.updateKeywording(sordA, {
          UNITTEST_FIELD1: "Bernd",
          UNITTEST_FIELD2: "Stromberg"
        }, true).then(function success(updateKeywordingResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("set MapValues in SordA should not throw", function (done) {
      expect(function () {
        test.Utils.updateMapData(source, {
          UNITTEST_MAP1: "Eintrag1",
          UNITTEST_MAP2: "Eintrag2"
        }).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("copy Data from SordA to SordB should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CopySordData", {
          source: source,
          objId: objId
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
    it("objValue 'UNITTEST_FIELD1' should be equal in SordA and SordB", function (done) {
      test.Utils.getSord(source).then(function success(sordA1) {
        test.Utils.getSord(objId).then(function success1(sordB1) {
          expect(test.Utils.getObjKeyValue(sordA1, "UNITTEST_FIELD1")).toEqual(test.Utils.getObjKeyValue(sordB1, "UNITTEST_FIELD1"));
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
    it("objValue 'UNITTEST_FIELD2' should be equal in SordA and SordB", function (done) {
      test.Utils.getSord(source).then(function success(sordA1) {
        test.Utils.getSord(objId).then(function success1(sordB1) {
          expect(test.Utils.getObjKeyValue(sordA1, "UNITTEST_FIELD2")).toEqual(test.Utils.getObjKeyValue(sordB1, "UNITTEST_FIELD2"));
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
    it("mapValue 'UNITTEST_MAP1' should be equal in SordA and SordB", function (done) {
      test.Utils.getMapValue(source, "UNITTEST_MAP1").then(function success(mapValueA) {
        test.Utils.getMapValue(objId, "UNITTEST_MAP1").then(function success1(mapValueB) {
          expect(mapValueA).toEqual(mapValueB);
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
    it("mapValue 'UNITTEST_MAP2' should be equal in SordA and SordB", function (done) {
      test.Utils.getMapValue(source, "UNITTEST_MAP2").then(function success(mapValueA) {
        test.Utils.getMapValue(objId, "UNITTEST_MAP2").then(function success1(mapValueB) {
          expect(mapValueA).toEqual(mapValueB);
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
      test.Utils.deleteSord(source).then(function success(deleteResult) {
        test.Utils.deleteSord(objId).then(function success1(deleteResult1) {
          test.Utils.getTempfolder().then(function success3(tempfolder) {
            test.Utils.deleteSord(tempfolder).then(function success4(deleteResult2) {
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
