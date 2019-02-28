
describe("[service] sol.common.ix.services.ChildrenDataCollector", function () {
  var originalTimeout, objTempId, stringData;

  it("should throw if executed without 'parentId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_services_ChildrenDataCollector", {
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
  it("should not throw if executed without 'sordKeys'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_services_ChildrenDataCollector", {
        parentId: "1"
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
  it("should not throw if executed without 'objKeys'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_services_ChildrenDataCollector", {
        parentId: "1",
        sordKey: ["id", "name"]
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
  describe("test childrendatacollector", function () {
    beforeAll(function (done) {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
      expect(function () {
        test.Utils.createTempSord("ChildrenDataCollector").then(function success(objTempId1) {
          objTempId = objTempId1;
          test.Utils.createSord(objTempId, null, "Mitarbeiter 4711",
            { UNITTEST_FIELD1: "Hugo", UNITTEST_FIELD2: "Egon" },
            { UNITTEST_MAP1: "Bemerkung0815", UNITTEST_MAP2: "Bemerkung0816" }).then(function success1(createSordResult) {
              test.Utils.createSord(objTempId, null, "Mitarbeiter 4713",
                { UNITTEST_FIELD1: "Nils", UNITTEST_FIELD2: "Armstrong" },
                { UNITTEST_MAP1: "Bemerkung0817", UNITTEST_MAP2: "Bemerkung0818" }).then(function success2(createSordResult1) {
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
    it("get sord data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_services_ChildrenDataCollector", {
          parentId: objTempId,
          endLevel: -1,
          sordKey: ["ownerName", "name", "maskName", "maskId", "id", "guid", "parentId", "XDateIso", "IDateIso"]
        }).then(function success(jsonData) {
          stringData = JSON.stringify(jsonData);
          test.Utils.getSord(objTempId).then(function success1(sordT) {
            test.Utils.updateSord(sordT, [{ key: "desc", value: stringData }]).then(function success2(updateResult) {
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
});