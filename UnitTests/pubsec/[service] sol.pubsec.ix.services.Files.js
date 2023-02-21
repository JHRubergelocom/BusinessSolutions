/* eslint-disable linebreak-style */

describe("[service] sol.pubsec.ix.services.Files", function () {
  var originalTimeout, sordFile, sordFileplan,
      config, sord, array, string, reportTemplateSords,
      fileTemplates, targetSord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Files").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/pubsec [unit tests]/Test data/Fileplan/File").then(function success2(sordFile1) {
          sordFile = sordFile1;
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/pubsec [unit tests]/Test data/Fileplan").then(function success3(sordFileplan1) {
            sordFileplan = sordFileplan1;
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
    describe("sol.pubsec.ix.services.CheckFileFunctionsPreconditions", function () {
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.CheckFileFunctionsPreconditions",
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
    });
    describe("sol.pubsec.ix.services.CheckFileGroupPreconditions", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.CheckFileGroupPreconditions",
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
      it("isFileGroup", function (done) {
        expect(function () {
          sord = { id: sordFile.id };
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.CheckFileGroupPreconditions",
            classConfig: {},
            method: "isFileGroup",
            params: [sord]
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
      it("isFileGroupValid", function (done) {
        expect(function () {
          sord = { id: sordFile.id };
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.CheckFileGroupPreconditions",
            classConfig: {},
            method: "isFileGroupValid",
            params: [sord]
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
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.CheckFileGroupPreconditions",
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
    });
    describe("sol.pubsec.ix.services.GetFileTypes", function () {
      it("arrayContainsString", function (done) {
        expect(function () {
          array = [];
          string = "string1";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.GetFileTypes",
            classConfig: {},
            method: "arrayContainsString",
            params: [array, string]
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
      it("convert", function (done) {
        expect(function () {
          reportTemplateSords = [];
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.GetFileTypes",
            classConfig: {},
            method: "convert",
            params: [reportTemplateSords]
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
      it("filterTemplates", function (done) {
        expect(function () {
          fileTemplates = [];
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.GetFileTypes",
            classConfig: {},
            method: "filterTemplates",
            params: [fileTemplates]
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
      it("getAllTemplates", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.GetFileTypes",
            classConfig: {},
            method: "getAllTemplates",
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
      it("getAllowedFileTypes", function (done) {
        expect(function () {
          targetSord = { id: sordFile.id };
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.GetFileTypes",
            classConfig: {},
            method: "getAllowedFileTypes",
            params: [targetSord]
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
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.GetFileTypes",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.GetFileTypes",
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
    });
    describe("sol.pubsec.ix.services.PrepareCreateFile", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.PrepareCreateFile",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.PrepareCreateFile",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_pubsec_service_PrepareCreateFile", function () {
      it("should not throw if executed without Parameter 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_PrepareCreateFile", {
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.msg).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'targetId': sordFileplan.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_PrepareCreateFile", {
            targetId: sordFileplan.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.types).toBeDefined();
            expect(jsonResult.types.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'targetId': sordFile.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_PrepareCreateFile", {
            targetId: sordFile.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.msg).toBeDefined();
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
    describe("RF_sol_pubsec_service_PrepareCreateSubFile", function () {
      it("should not throw if executed without Parameter 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_PrepareCreateSubFile", {
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.msg).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'targetId': sordFileplan.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_PrepareCreateSubFile", {
            targetId: sordFileplan.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.msg).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'targetId': sordFile.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_PrepareCreateSubFile", {
            targetId: sordFile.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.types).toBeDefined();
            expect(jsonResult.types.length).toEqual(0);
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
    describe("RF_sol_pubsec_service_CheckFileGroupPreconditions", function () {
      it("should throw if executed without Parameter 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckFileGroupPreconditions", {
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
      it("should not throw if executed Parameter {'targetId': sordFileplan.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckFileGroupPreconditions", {
            targetId: sordFileplan.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.msg).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'targetId': sordFile.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckFileGroupPreconditions", {
            targetId: sordFile.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.msg).toBeDefined();
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
    describe("RF_sol_pubsec_service_CheckReclassifyFilePreconditions", function () {
      it("should throw if executed without Parameter 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckReclassifyFilePreconditions", {
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
      it("should not throw if executed Parameter {'targetId': sordFileplan.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckReclassifyFilePreconditions", {
            targetId: sordFileplan.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.msg).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'targetId': sordFile.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckReclassifyFilePreconditions", {
            targetId: sordFile.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
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
    describe("RF_sol_pubsec_service_CheckRestrictionnoteFilePreconditions", function () {
      it("should throw if executed without Parameter 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckRestrictionnoteFilePreconditions", {
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
      it("should not throw if executed Parameter {'targetId': sordFileplan.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckRestrictionnoteFilePreconditions", {
            targetId: sordFileplan.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.msg).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'targetId': sordFile.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckRestrictionnoteFilePreconditions", {
            targetId: sordFile.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflow", function (done) {
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