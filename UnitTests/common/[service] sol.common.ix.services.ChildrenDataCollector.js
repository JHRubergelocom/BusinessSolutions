
describe("[service] sol.common.ix.services.ChildrenDataCollector", function () {
  var originalTimeout, objTempId, stringData,
      maskName, docMaskName, formatter, sord, params,
      config, findInfo;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ChildrenDataCollector").then(function success(objTempId1) {
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
    describe("sol.common.ix.services.ChildrenDataCollector", function () {
      it("addDocMaskData", function (done) {
        expect(function () {
          maskName = "maskName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
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
            className: "sol.common.ix.services.ChildrenDataCollector",
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
          docMaskName = "docMaskName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
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
            className: "sol.common.ix.services.ChildrenDataCollector",
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
      it("collectSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
            classConfig: {},
            method: "collectSord",
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
            className: "sol.common.ix.services.ChildrenDataCollector",
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
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
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
      it("getFormattedJson", function (done) {
        expect(function () {
          formatter = "sol.common.ObjectFormatter.StatisticSord";
          sord = "1";
          maskName = "maskName1";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
            classConfig: {},
            method: "getFormattedJson",
            params: [formatter, sord, maskName, params]
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
            className: "sol.common.ix.services.ChildrenDataCollector",
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
            className: "sol.common.ix.services.ChildrenDataCollector",
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
            className: "sol.common.ix.services.ChildrenDataCollector",
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
      it("searchOnlyDocuments", function (done) {
        expect(function () {
          findInfo = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
            classConfig: { onlyDocuments: true },
            method: "searchOnlyDocuments",
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
      it("searchOnlyFolders", function (done) {
        expect(function () {
          findInfo = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
            classConfig: { onlyFolders: true },
            method: "searchOnlyFolders",
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
      it("shouldIncludeSordType", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
            classConfig: {},
            method: "shouldIncludeSordType",
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
      it("shouldSearchOnlyDocuments", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
            classConfig: {},
            method: "shouldSearchOnlyDocuments",
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
      it("shouldSearchOnlyFolders", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ChildrenDataCollector",
            classConfig: {},
            method: "shouldSearchOnlyFolders",
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
  describe("test childrendatacollector", function () {
    it("should throw if executed without 'parentId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_services_ChildrenDataCollector", {
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
        test.Utils.execute("RF_sol_common_services_ChildrenDataCollector", {
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
    it("should not throw if executed without 'objKeys'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_services_ChildrenDataCollector", {
          parentId: "1",
          sordKey: ["id", "name"]
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
        test.Utils.execute("RF_sol_common_services_ChildrenDataCollector", {
          parentId: objTempId,
          endLevel: -1,
          sordKey: ["ownerName", "name", "maskName", "maskId", "id", "guid", "parentId", "XDateIso", "IDateIso"]
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