
describe("[action] sol.learning.as.actions.CreateCertificate", function () {
  var configTypes,
      wfInfo, objIdEnr, enrollmentPath,
      params, dvReport, certificateTypes,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("As.Actions.CreateCertificate", null, null).then(function success(objTempId) {
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
  describe("test create certificate", function () {
    it("certificateTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning/Configuration/Certificate types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(certificateTypes1) {
        certificateTypes = certificateTypes1;
        expect(certificateTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("certificateTypes.length must greater than one", function () {
      expect(certificateTypes.length).toBeGreaterThan(1);
    });
    xdescribe("create PDF certificate", function () {
      it("start as action create certificate", function (done) {
        expect(function () {
          params = { templateId: certificateTypes[0].objId, targetId: objIdEnr };
          test.Utils.executeASActionHandler("learning", "sol.learning.as.actions.CreateCertificate", params, []).then(function success(jsonResults) {
            test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
              wfInfo = wfInfo1;
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
      it("wfInfo.objId must be available", function () {
        expect(wfInfo.objId).toBeDefined();
      });
      it("report must be available", function (done) {
        test.Utils.getSord(wfInfo.objId).then(function success(sordReport) {
          expect(sordReport).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("doc.size report must be available", function (done) {
        test.Utils.getCurrentWorkVersion(wfInfo.objId).then(function success(dvReport1) {
          dvReport = dvReport1;
          expect(dvReport.size).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("doc.size report must greater than zero", function () {
        expect(dvReport.size).toBeGreaterThan(0);
      });
      it("remove workflow", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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
      it("remove certificate", function (done) {
        expect(function () {
          test.Utils.deleteSord(wfInfo.objId).then(function success2(deleteResult) {
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
    xdescribe("create Office certificate", function () {
      it("start as action create certificate", function (done) {
        expect(function () {
          params = { templateId: certificateTypes[1].objId, targetId: objIdEnr };
          test.Utils.executeASActionHandler("learning", "sol.learning.as.actions.CreateCertificate", params, []).then(function success(jsonResults) {
            test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
              wfInfo = wfInfo1;
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
      it("wfInfo.objId must be available", function () {
        expect(wfInfo.objId).toBeDefined();
      });
      it("report must be available", function (done) {
        test.Utils.getSord(wfInfo.objId).then(function success(sordReport) {
          expect(sordReport).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("doc.size report must be available", function (done) {
        test.Utils.getCurrentWorkVersion(wfInfo.objId).then(function success(dvReport1) {
          dvReport = dvReport1;
          expect(dvReport.size).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("doc.size report must greater than zero", function () {
        expect(dvReport.size).toBeGreaterThan(0);
      });
      it("remove workflow", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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
      it("remove certificate", function (done) {
        expect(function () {
          test.Utils.deleteSord(wfInfo.objId).then(function success2(deleteResult) {
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