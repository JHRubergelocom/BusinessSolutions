
describe("Create Testdata", function () {
  var originalTimeout, testdataConfig, deleteData;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("delete rootfolder", function () {
    it("get configuration from testdata.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Configuration/testdata.config"
        }).then(function success(configResult) {
          testdataConfig = configResult.config;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("testdataConfig.rootFolder must be available", function () {
      expect(testdataConfig.rootFolder).toBeDefined();
    });
    it("delete rootfolder", function (done) {
      deleteData = false;
      if (testdataConfig.delete) {
        if (testdataConfig.delete === true) {
          deleteData = true;
        }
      }
      if (!deleteData) {
        done();
      }
      expect(function () {
        test.Utils.getSord(testdataConfig.rootFolder).then(function success(sordRootFolder) {
          if (!sordRootFolder) {
            done();
          }
          test.Utils.deleteSord(sordRootFolder.id).then(function success1(deleteResult) {
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});