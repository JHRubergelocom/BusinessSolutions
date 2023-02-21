
describe("[service] sol.common.ix.services.SordDataCollector", function () {
  var originalTimeout, parentId, result, moreResults, searchId, idx,
      config, maskName, docMaskName, findInfo;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.services.SordDataCollector", function () {
      it("addDocMaskData", function (done) {
        expect(function () {
          maskName = "UnitTest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "addDocMaskData",
            params: [maskName]
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
      it("addLocale", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "addLocale",
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
      it("buildDocMaskData", function (done) {
        expect(function () {
          docMaskName = "UnitTest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "buildDocMaskData",
            params: [docMaskName]
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
      it("buildFindByIndex", function (done) {
        expect(function () {
          findInfo = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "buildFindByIndex",
            params: [findInfo]
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
      it("buildFindDirect", function (done) {
        expect(function () {
          findInfo = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "buildFindDirect",
            params: [findInfo]
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
      it("buildFindInfo", function (done) {
        expect(function () {
          findInfo = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "buildFindInfo",
            params: [findInfo]
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
      it("collectSords", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: { searchId: "1" },
            method: "collectSords",
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
      it("computeSordElementSelector", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "computeSordElementSelector",
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
      it("determinatePageStartIdxByObjId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: { pageOfObjId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions" },
            method: "determinatePageStartIdxByObjId",
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
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "execute",
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
      it("findGuids", function (done) {
        expect(function () {
          findInfo = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "findGuids",
            params: [findInfo]
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
      it("getSordFormatter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "getSordFormatter",
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
      it("getTypeConstants", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
            classConfig: {},
            method: "getTypeConstants",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.SordDataCollector",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_services_SordDataCollector_FindFirst", function () {
      it("should throw if executed without 'parentId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_SordDataCollector_FindFirst", {
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
      it("should return defined result", function (done) {
        expect(function () {
          idx = 0;
          parentId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions";
          test.Utils.execute("RF_sol_common_services_SordDataCollector_FindFirst", {
            parentId: parentId,
            endLevel: -1
          }).then(function success(result1) {
            result = result1;
            moreResults = result.moreResults;
            searchId = result.searchId;
            expect(result).toBeDefined();
            expect(moreResults).toBeDefined();
            expect(searchId).toBeDefined();
            expect(idx).toBeDefined();
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
    describe("RF_sol_common_services_SordDataCollector_FindNext", function () {
      it("should throw if executed without 'searchId', 'idx'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_SordDataCollector_FindNext", {
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
      it("should return defined result", function (done) {
        expect(function () {
          if (moreResults) {
            idx += result.sords.length;
            test.Utils.execute("RF_sol_common_services_SordDataCollector_FindNext", {
              searchId: searchId,
              idx: idx
            }).then(function success(result1) {
              result = result1;
              moreResults = result.moreResults;
              expect(result).toBeDefined();
              expect(moreResults).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }
        }).not.toThrow();
      });
    });
    describe("RF_sol_common_services_SordDataCollector_FindClose", function () {
      it("should throw if executed without 'searchId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_SordDataCollector_FindClose", {
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
      it("should return defined result", function (done) {
        expect(function () {
          if (result) {
            test.Utils.execute("RF_sol_common_services_SordDataCollector_FindClose", {
              searchId: searchId
            }).then(function success(result1) {
              result = result1;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }
        }).not.toThrow();
      });
    });
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});