
describe("[service] sol.dev.ix.services.CreateRepoEntry", function () {
  var originalTimeout, objTempRepoPath, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        objTempRepoPath = test.Utils.TESTTEMPFOLDER + "/CreateRepoEntry";
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
    describe("sol.dev.ix.services.CreateRepoEntry", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.CreateRepoEntry",
            classConfig: {
              saveToRepoConfig: {
                repoPath: objTempRepoPath,
                maskId: elo.CONST.DOC_MASK.GUID_ELOSCRIPTS,
                contentObject: { a: "a", b: "b" }
              }              
            },
            method: "initialize",
            params: [config]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.CreateRepoEntry",
            classConfig: {
              saveToRepoConfig: {
                repoPath: objTempRepoPath,
                maskId: elo.CONST.DOC_MASK.GUID_ELOSCRIPTS,
                contentObject: { a: "a", b: "b" }
              }              
            },
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
    describe("RF_sol_dev_service_CreateRepoEntry", function () {
      it("should throw if executed without Parameter 'saveToRepoConfig'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_dev_service_CreateRepoEntry", {
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
      it("should throw if executed without Parameter 'repoPath'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_dev_service_CreateRepoEntry", {
            saveToRepoConfig: {}
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
      it("should not throw if executed with Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_dev_service_CreateRepoEntry", {
            saveToRepoConfig: {
              repoPath: objTempRepoPath,
              maskId: elo.CONST.DOC_MASK.GUID_ELOSCRIPTS,
              contentObject: { a: "a", b: "b" }
            }
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