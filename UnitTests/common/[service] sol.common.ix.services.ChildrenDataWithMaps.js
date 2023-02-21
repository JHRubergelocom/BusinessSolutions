
describe("[service] sol.common.ix.services.ChildrenDataWithMaps", function () {
  var originalTimeout, objTempId, stringData,
      maskName, resultObj, docMaskName, objId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ChildrenDataWithMaps").then(function success(objTempId1) {
        objTempId = objTempId1;
        test.Utils.createSord(objTempId, null, "Mitarbeiter 4711",
          { UNITTEST_FIELD1: "Hugo", UNITTEST_FIELD2: "Egon" },
          { UNITTEST_MAP1: "Bemerkung0815", UNITTEST_MAP2: "Bemerkung0816" }).then(function success1(createSordResult) {
          test.Utils.createSord(objTempId, null, "Mitarbeiter 4713",
            { UNITTEST_FIELD1: "Nils", UNITTEST_FIELD2: "Armstrong" },
            { UNITTEST_MAP1: "Bemerkung0817", UNITTEST_MAP2: "Bemerkung0818" }).then(function success2(createSordResult1) {
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
    describe("sol.common.ix.services.ChildrenDataWithMaps", function () {
      it("addDocMaskData", function (done) {
        expect(function () {
          maskName = "maskName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataWithMaps",
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
      it("addMapKeys", function (done) {
        expect(function () {
          resultObj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataWithMaps",
            classConfig: {},
            method: "addMapKeys",
            params: [resultObj]
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
          docMaskName = "docMaskName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataWithMaps",
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
      it("collectChildren", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataWithMaps",
            classConfig: { parentId: "1" },
            method: "collectChildren",
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
            className: "sol.common.ix.services.ChildrenDataWithMaps",
            classConfig: { parentId: "1" },
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
      it("getSord", function (done) {
        expect(function () {
          objId = "1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataWithMaps",
            classConfig: {},
            method: "getSord",
            params: [objId]
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
            className: "sol.common.ix.services.ChildrenDataWithMaps",
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
    });
  });
  describe("test childrenDataWithMaps", function () {
    it("should throw if executed without 'parentId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_services_ChildrenDataWithMaps", {
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
    it("should not throw if executed without 'sordKeys'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_services_ChildrenDataWithMaps", {
          parentId: "1"
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
    it("get sord data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_services_ChildrenDataWithMaps", {
          parentId: objTempId,
          sordKey: ["name", "id", "maskName", "guid", "parentId", "type", "desc"]
        }).then(function success(jsonData) {
          stringData = JSON.stringify(jsonData);
          test.Utils.getSord(objTempId).then(function success1(sordT) {
            test.Utils.updateSord(sordT, [{ key: "desc", value: stringData }]).then(function success2(updateResult) {
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