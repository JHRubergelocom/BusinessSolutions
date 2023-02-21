
describe("[action] sol.datev.accounting.ix.actions.SendPostingProposal", function () {
  var objCSId,
      config, wfInfo, succNodes, succNodesIds,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.SendPostingProposal", null, null).then(function success(objTempId) {
        test.Utils.createSord(objTempId, "Company Search", "TestCompanySearch").then(function success1(objCSId1) {
          objCSId = objCSId1;
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
  describe("test send posting proposals", function () {
    it("should not throw if executed without parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_datev_accounting_actions_SendPostingProposals", {
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
  describe("test lock lock and unlock Invoice", function () {
    it("start action send posting proposals", function (done) {
      expect(function () {
        config = {
          sordIds: objCSId 
        };
        test.Utils.execute("RF_datev_accounting_actions_SendPostingProposals", config).then(function success(jsonResult) {
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