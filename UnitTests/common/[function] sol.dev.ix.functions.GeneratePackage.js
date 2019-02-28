
describe("[function] sol.dev.ix.functions.GeneratePackage", function () {
  var originalTimeout, objGeneratePackageId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GeneratePackage").then(function success(objTempId) {
        test.Utils.execute("RF_sol_dev_service_GetPackageTypes", {}).then(function success1(packageTypes) {
          test.Utils.copySord(packageTypes[0].objId).then(function success2(objGeneratePackageId1) {
            objGeneratePackageId = objGeneratePackageId1;
            test.Utils.updateMapData(objGeneratePackageId, { NAMESPACE: "sol", PACKAGE: "unittest", FULLNAMESPACE: "unittest", DESCRIPTION: "Description Unittest" }).then(function success3(updateMapDataResult) {
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
  describe("test cases generatePackage", function () {
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_dev_function_GeneratePackage", {
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
        test.Utils.execute("RF_sol_dev_function_GeneratePackage", {
          objId: objGeneratePackageId
        }).then(function success(jsonResult) {
          done();
        }, function error(err) {
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
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/unittest").then(function success2(sordPackage) {
            test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/unittest").then(function success3(sordPackageCustom) {
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