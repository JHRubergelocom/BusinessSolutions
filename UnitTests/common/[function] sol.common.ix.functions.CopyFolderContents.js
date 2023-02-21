
describe("[function] sol.common.ix.functions.CopyFolderContents", function () {
  var originalTimeout, objId, idFolder1, idFolder2,
      ixConnection, source, item, ixConn, startIds,
      parentId, name, wait, config,
      countFolder1, countFolder2, newObjId, maskNewObjId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CopyFolderContents").then(function success(objId1) {
        objId = objId1;
        test.Utils.createSord(objId).then(function success1(idFolder) {
          idFolder1 = idFolder;
          test.Utils.createSord(idFolder1).then(function success2(createSordResult) {
            test.Utils.createSord(idFolder1).then(function success3(createSordResult1) {
              test.Utils.createSord(objId).then(function success4(idFolder22) {
                idFolder2 = idFolder22;
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
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.functions.CopyFolderContents", function () {
      it("changeBaseElementMask", function (done) {
        expect(function () {
          newObjId = 1;
          ixConnection = "ixConnection1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
            method: "changeBaseElementMask",
            params: [newObjId, ixConnection]
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
      it("checkSource", function (done) {
        expect(function () {
          source = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
            method: "checkSource",
            params: [source]
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
      it("cloneBlobItem", function (done) {
        expect(function () {
          item = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
            method: "cloneBlobItem",
            params: [item]
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
      it("executeBackgroundCopy", function (done) {
        expect(function () {
          ixConn = "ixConn1";
          startIds = [];
          parentId = 1;
          name = "name1";
          wait = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
            method: "executeBackgroundCopy",
            params: [ixConn, startIds, parentId, name, wait]
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
      it("executeQuickCopy", function (done) {
        expect(function () {
          ixConn = "ixConn1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
            method: "executeQuickCopy",
            params: [ixConn]
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
          objId = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
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
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
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
      it("provideTemplateSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
            method: "provideTemplateSord",
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
      it("resolveTemplate", function (done) {
        expect(function () {
          source = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CopyFolderContents",
            classConfig: { objId: 1, source: 1 },
            method: "resolveTemplate",
            params: [source]
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
  describe("test cases copyfoldercontents", function () {
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CopyFolderContents", {
          source: 0,
          copySourceAcl: false,
          inheritDestinationAcl: false,
          fallbackToSyncExecution: true
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
    it("should throw if executed without 'source'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CopyFolderContents", {
          objId: 0,
          copySourceAcl: false,
          inheritDestinationAcl: false,
          fallbackToSyncExecution: true
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
    it("should throw if executed without 'copySourceAcl'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CopyFolderContents", {
          objId: 0,
          source: 0,
          copySourceAcl: false,
          fallbackToSyncExecution: true
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
    it("should throw if executed without 'inheritDestinationAcl'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CopyFolderContents", {
          objId: 0,
          source: 0,
          inheritDestinationAcl: false,
          fallbackToSyncExecution: true
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
    it("count subentries Folder1 equal 2", function (done) {
      expect(function () {
        test.Utils.findChildren(idFolder1).then(function success(childrenFolder) {
          countFolder1 = childrenFolder.length;
          expect(countFolder1).toEqual(2);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("count subentries Folder2 equal 0", function (done) {
      expect(function () {
        test.Utils.findChildren(idFolder2).then(function success(childrenFolder) {
          countFolder2 = childrenFolder.length;
          expect(countFolder2).toEqual(0);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("copy contents Folder1 to Folder2", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CopyFolderContents", {
          objId: idFolder2,
          source: idFolder1,
          copySourceAcl: false,
          inheritDestinationAcl: true,
          fallbackToSyncExecution: true,
          targetMask: "ELOScripts"
        }).then(function success(jsonResult) {
          newObjId = jsonResult;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("count subentries Folder2 equal 3", function (done) {
      expect(function () {
        test.Utils.findChildren(idFolder2).then(function success(childrenFolder) {
          countFolder2 = childrenFolder.length;
          expect(countFolder2).toEqual(3);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get docmask newObjId", function (done) {
      expect(function () {
        test.Utils.getSord(newObjId).then(function success(sordNewObjId) {
          maskNewObjId = sordNewObjId.mask;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("check docmask newObjId is 'ELOScripts' ", function (done) {
      expect(function () {
        test.Utils.getDocMask(maskNewObjId).then(function success(docmaskNewObjId) {
          expect(docmaskNewObjId.name).toEqual("ELOScripts");
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