/* eslint-disable linebreak-style */

describe("[libix] sol.unittest.ix.services.SolMeetingProposalUtils", function () {
  var originalTimeout, boardService, boardOutput, options,
      templateSordSearchParams, itemObjId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolMeetingProposalUtils").then(function success(obSolMeetingProposalUtilsId) {
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
    describe("sol.meeting.ix.ProposalUtils", function () {
      it("findAllMeetingBoards", function (done) {
        expect(function () {
          boardService = {};
          boardOutput = {};
          options = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ProposalUtils",
            classConfig: {},
            method: "findAllMeetingBoards",
            params: [boardService, boardOutput, options]
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
      it("findProposalByItem", function (done) {
        expect(function () {
          templateSordSearchParams = { objKeys: { MEETING_ITEM_ID: 0 } };
          options = { throwError: false };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ProposalUtils",
            classConfig: {},
            method: "findProposalByItem",
            params: [templateSordSearchParams, options]
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
      it("findProposalInItemChildrenHierarchy", function (done) {
        expect(function () {
          itemObjId = 0;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ProposalUtils",
            classConfig: {},
            method: "findProposalInItemChildrenHierarchy",
            params: [itemObjId]
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