
describe("[function] sol.common.ix.functions.GenerateIdentifier", function () {
  var originalTimeout, identifier, typeDescription, templateName, templateFolderId,
      templateNameField, name, objGenerateIdentifierId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateIdentifier", { UNITTEST_FIELD1: "Template 1" }).then(function success(objGenerateIdentifierId1) {
        objGenerateIdentifierId = objGenerateIdentifierId1;
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
    describe("sol.common.ix.functions.GenerateIdentifier", function () {
      it("checkUpdate", function (done) {
        expect(function () {
          identifier = "identifier1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
            method: "checkUpdate",
            params: [identifier]
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
      it("getIdentifier", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
            method: "getIdentifier",
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
      it("getIdentifierTemplateId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
            method: "getIdentifierTemplateId",
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
      it("getObjIdFromRelativePath", function (done) {
        expect(function () {
          typeDescription = "typeDescription1";
          templateName = "Template 1";
          templateFolderId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/GetTemplates";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
            method: "getObjIdFromRelativePath",
            params: [typeDescription, templateName, templateFolderId]
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
      it("getTemplateId", function (done) {
        expect(function () {
          typeDescription = "typeDescription1";
          templateNameField = "UNITTEST_FIELD1";
          templateFolderId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/GetTemplates";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
            method: "getTemplateId",
            params: [typeDescription, templateNameField, templateFolderId]
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
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
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
      it("readObject", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
            method: "readObject",
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
      it("setIdentifier", function (done) {
        expect(function () {
          identifier = "identifier1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
            method: "setIdentifier",
            params: [identifier]
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
      it("truncateSordName", function (done) {
        expect(function () {
          name = "name1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
            method: "truncateSordName",
            params: [name]
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
      it("updateIdentifier", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.GenerateIdentifier",
            classConfig: { objId: objGenerateIdentifierId },
            method: "updateIdentifier",
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