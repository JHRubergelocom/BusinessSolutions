
describe("[libas] sol.unittest.as.services.SolLearningFunctionsCreateCertificate", function () {
  var originalTimeout, content, folderId, name, mask, ext, val,
      enrollmentPath, objIdEnr;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolLearningFunctionsCreateCertificate").then(function success(objTempId) {
        enrollmentPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Business Logic Provider/Enrollments/Administrator";
        test.Utils.getSord(enrollmentPath).then(function success1(sordEnrollement) {
          objIdEnr = sordEnrollement.id;
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
    describe("sol.learning.as.functions.CreateCertificate", function () {
      it("docExists", function (done) {
        expect(function () {
          folderId = "folderId1";
          name = "name1";
          mask = "mask1";
          ext = "ext1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.learning.as.services.ExecuteLib",
            config: {
              className: "sol.learning.as.functions.CreateCertificate",
              classConfig: { objId: objIdEnr },
              method: "docExists",
              params: [folderId, name, mask, ext]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.learning.as.services.ExecuteLib",
            config: {
              className: "sol.learning.as.functions.CreateCertificate",
              classConfig: { objId: objIdEnr },
              method: "getName",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isNumber", function (done) {
        expect(function () {
          val = 123;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.learning.as.services.ExecuteLib",
            config: {
              className: "sol.learning.as.functions.CreateCertificate",
              classConfig: { objId: objIdEnr },
              method: "isNumber",
              params: [val]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
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
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.learning.as.services.ExecuteLib",
            config: {
              className: "sol.learning.as.functions.CreateCertificate",
              classConfig: { objId: objIdEnr, targetId: objIdEnr },
              method: "process",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
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