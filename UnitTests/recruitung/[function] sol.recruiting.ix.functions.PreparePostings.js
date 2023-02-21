
describe("[function] sol.recruiting.ix.functions.PreparePostings", function () {
  var objIdR, objTempId, metadataMapping, requisitionGuid, mapTable,
      originalTimeout,
      table, columns, map, mapName, key, sord, config, row, int,
      tableRow, mappings, colMap, v, rowNo, results;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("PreparePostings").then(function success(objTempId1) {
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
  describe("Create Requisition", function () {
    it("create Requisition", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_recruiting_function_CreateRequisitionHeadless", {
          objId: objTempId,
          template: {
            name: "Default"
          },
          sordMetadata: {
            objKeys: {
              SOL_TYPE: "RECRUITING_REQUISITION",
              RECRUITING_REQUISITION_NAME: "MSD",
              RECRUITING_REQUISITION_DESC: "Master of Desaster"
            }
          }
        }).then(function success(jsonResult) {
          objIdR = jsonResult.data.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get requisitionGuid", function (done) {
      expect(function () {
        test.Utils.getSord(objIdR).then(function success(sordR) {
          requisitionGuid = sordR.guid;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove workflows", function (done) {
      expect(function () {
        test.Utils.getFinishedWorkflows(objIdR).then(function success(wfs) {
          test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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
  describe("Set mappings postings", function () {
    it("set maptable postings", function (done) {
      expect(function () {
        mapTable = {
          guid1: requisitionGuid,
          RECRUITING_POSTING_NAME1: "Posting1",
          guid2: requisitionGuid,
          RECRUITING_POSTING_NAME2: "Posting2"
        };
        test.Utils.updateMapData(objTempId, mapTable).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get metadataMapping from recruiting.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/recruiting.config"
        }).then(function success(configResult) {
          metadataMapping = configResult.config.entities.requisition.workflowMixins.preparepostings.prepare.scriptProperties.metadataMapping;
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
    describe("sol.recruiting.ix.functions.PreparePostings", function () {
      it("addKeyToTable", function (done) {
        expect(function () {
          table = [];
          columns = [];
          map = {};
          mapName = "mapName1";
          key = "key1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "addKeyToTable",
            params: [table, columns, map, mapName, key]
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
      it("addMapToTable", function (done) {
        expect(function () {
          columns = [];
          sord = { id: objTempId };
          table = [];
          mapName = "mapName1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "addMapToTable",
            params: [columns, sord, table, mapName]
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
      it("adjustConfigForRow", function (done) {
        expect(function () {
          config = {};
          row = 1;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "adjustConfigForRow",
            params: [config, row]
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
      it("arrayOfInt", function (done) {
        expect(function () {
          int = 1;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "arrayOfInt",
            params: [int]
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
      it("buildTable", function (done) {
        expect(function () {
          columns = [];
          sord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "buildTable",
            params: [columns, sord]
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
      it("convertTable", function (done) {
        expect(function () {
          table = [];
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "convertTable",
            params: [table]
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
      it("createPosting", function (done) {
        expect(function () {
          config = {};
          tableRow = 1;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "createPosting",
            params: [config, tableRow]
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
      it("extractColumnsFromConfig", function (done) {
        expect(function () {
          mappings = [];
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "extractColumnsFromConfig",
            params: [mappings]
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
      it("generateEmptyTable", function (done) {
        expect(function () {
          colMap = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "generateEmptyTable",
            params: [colMap]
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
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
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
      it("rowNotEmpty", function (done) {
        expect(function () {
          row = 1;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "rowNotEmpty",
            params: [row]
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
      it("rowToObject", function (done) {
        expect(function () {
          table = [];
          columns = [];
          v = "v1";
          rowNo = 1;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "rowToObject",
            params: [table, columns, v, rowNo]
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
      it("rowToPosting", function (done) {
        expect(function () {
          config = {};
          results = [];
          row = 1;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "rowToPosting",
            params: [config, results, row]
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
      it("sizeOfLargestColumn", function (done) {
        expect(function () {
          table = [];
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PreparePostings",
            classConfig: {},
            method: "sizeOfLargestColumn",
            params: [table]
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
    describe("RF_sol_recruiting_function_PreparePostings", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_PreparePostings", {
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
      it("Move Posting from Requisition1 to Requisition2", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_PreparePostings", {
            objId: objTempId,
            metadataMapping: metadataMapping
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdR).then(function success2(deleteResult1) {
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