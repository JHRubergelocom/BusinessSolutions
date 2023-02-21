
describe("[function] sol.visitor.as.functions.CreateVisitorBadge", function () {
  var originalTimeout, content, objCreateVisitorBadgeId, objSingleVisitorId, objVisitorBadgeId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateVisitorBadge").then(function success(objCreateVisitorBadgeId1) {
        objCreateVisitorBadgeId = objCreateVisitorBadgeId1;
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SingleVisitor").then(function success1(sordSingleVisitor) {
          objSingleVisitorId = sordSingleVisitor.id;
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/VisitorBadge").then(function success2(sordVisitorBadge) {
            objVisitorBadgeId = sordVisitorBadge.id;
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
  describe("test CreateVisitorBadge", function () {
    it("start as functions CreateVisitorBadge", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
          objId: objSingleVisitorId,
          action: "sol.visitor.as.functions.CreateVisitorBadge",
          config: {
            objId: objSingleVisitorId,
            parentId: objSingleVisitorId, 
            targetId: objSingleVisitorId,
            template: "Long-term Badge",
            useLongtermBadgeTemplates: true
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