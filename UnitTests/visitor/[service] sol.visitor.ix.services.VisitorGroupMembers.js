
describe("[service] sol.visitor.ix.services.VisitorGroupMembers", function () {
  var objGroupId, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("VisitorGroupMembers").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/Group").then(function success1(objGroupId1) {
          objGroupId = objGroupId1;
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_visitor_service_WriteVisitorGroupMembers", function () {
      it("should throw if executed without Parameter 'visitorGroupObjId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_WriteVisitorGroupMembers", {
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
      it("should throw if executed without Parameter 'data'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_WriteVisitorGroupMembers", {
            visitorGroupObjId: objGroupId
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
      it("should not throw if executed Parameter {'data': { ... } }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_WriteVisitorGroupMembers", {
            visitorGroupObjId: objGroupId,
            data: [
              { key: "name", type: "SORD", value: "Besucher Gruppe Max M??ller" },
              { key: "VISITOR_FIRSTNAME", type: "GRP", value: "Max" },
              { key: "VISITOR_LASTNAME", type: "GRP", value: "M??ller" },
              { key: "VISITOR_INTERNALVISITOR", type: "MAP", value: true }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
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
    describe("RF_sol_visitor_service_ReadVisitorGroupMembers", function () {
      it("should throw if executed without Parameter 'visitorGroupObjId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_ReadVisitorGroupMembers", {
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
      it("should not throw if executed Parameter {'visitorGroupObjId': objGroupId }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_ReadVisitorGroupMembers", {
            visitorGroupObjId: objGroupId
          }).then(function success(jsonResult) {
            expect(jsonResult.visitorGroupMembers).toBeDefined();
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