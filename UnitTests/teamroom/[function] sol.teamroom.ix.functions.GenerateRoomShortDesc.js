/* eslint-disable linebreak-style */

describe("[function] sol.teamroom.ix.functions.GenerateRoomShortDesc", function () {
  var originalTimeout, sordTeamroom, shortDescription;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateRoomShortDesc").then(function success(objGenerateRoomShortDescId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/teamroom [unit tests]/Test data/Teamroom").then(function success2(sordTeamroom1) {
          sordTeamroom = sordTeamroom1;
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
    describe("sol.teamroom.ix.functions.generators.GenRoomShortDesc", function () {
      it("getIdentifier", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.generators.GenRoomShortDesc",
            classConfig: {},
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
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.generators.GenRoomShortDesc",
            classConfig: {},
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
      it("setIdentifier", function (done) {
        expect(function () {
          shortDescription = "shortDescription1";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.generators.GenRoomShortDesc",
            classConfig: {},
            method: "setIdentifier",
            params: [shortDescription]
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
    describe("RF_sol_teamroom_function_generateRoomShortDesc", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_function_generateRoomShortDesc", {
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
      it("generate teamroom short desc", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_function_generateRoomShortDesc", {
            objId: sordTeamroom.id,
            updateExisting: true
          }).then(function success(jsonResult) {
            expect(jsonResult.identifier).toBeDefined();
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