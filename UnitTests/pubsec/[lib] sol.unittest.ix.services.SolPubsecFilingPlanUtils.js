
describe("[lib] sol.unittest.ix.services.SolPubsecFilingPlanUtils", function () {
  var originalTimeout, reference, name,
      parentId, keywording, asAdmin, aclItems, type, sord,
      obSolPubsecFilingPlanUtilsId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolPubsecFilingPlanUtils").then(function success(obSolPubsecFilingPlanUtilsId1) {
        obSolPubsecFilingPlanUtilsId = obSolPubsecFilingPlanUtilsId1;
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
    describe("sol.pubsec.FilingPlanUtils", function () {
      it("buildFullName", function (done) {
        expect(function () {
          reference = "reference1";
          name = "name1";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.FilingPlanUtils",
            classConfig: {},
            method: "buildFullName",
            params: [reference, name]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("reference1 - name1");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("createElement", function (done) {
        expect(function () {
          parentId = obSolPubsecFilingPlanUtilsId;
          name = "name1";
          keywording = {};
          asAdmin = true;
          aclItems = [];
          type = "Folder";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.FilingPlanUtils",
            classConfig: {},
            method: "createElement",
            params: [parentId, name, keywording, asAdmin, aclItems, type]
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
      it("isAclInheritanceApplicable", function (done) {
        expect(function () {
          sord = obSolPubsecFilingPlanUtilsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.FilingPlanUtils",
            classConfig: {},
            method: "isAclInheritanceApplicable",
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