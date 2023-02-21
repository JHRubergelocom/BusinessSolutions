
describe("[action] sol.meeting.ix.actions.ProposalRecord", function () {
  var originalTimeout, objProposalId, cfg, proposal,
      objTempId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ProposalRecord").then(function success(objTempId1) {
        objTempId = objTempId1;
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Proposal").then(function success1(objProposalId1) {
          objProposalId = objProposalId1;
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
    describe("sol.meeting.ix.actions.ProposalRecord", function () {
      it("executeFillSord", function (done) {
        expect(function () {
          cfg = {
            source: { objId: objTempId },
            target: { objId: objTempId }
          };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.actions.ProposalRecord",
            classConfig: { itemReference: "UTMI001", workflow: {} },
            method: "executeFillSord",
            params: [cfg]
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
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.actions.ProposalRecord",
            classConfig: { itemReference: "UTMI001", workflow: {} },
            method: "getName",
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
      it("prepareFillSordConfig", function (done) {
        expect(function () {
          proposal = { objId: objProposalId };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.actions.ProposalRecord",
            classConfig: { itemReference: "UTMI001", workflow: {} },
            method: "prepareFillSordConfig",
            params: [proposal]
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.actions.ProposalRecord",
            classConfig: { itemReference: "UTMI001", workflow: {} },
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
    describe("RF_sol_meeting_function_ProposalRecord", function () {
      it("should throw if executed without 'itemReference' ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_ProposalRecord", {
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
      it("should throw if executed without 'workflow' ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_ProposalRecord", {
            itemReference: "UTMI001"
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
      it("should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_ProposalRecord", {
            itemReference: "UTMI001",
            workflow: {}
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
          test.Utils.getFinishedWorkflows().then(function success4(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success5(removeFinishedWorkflowsResult) {
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