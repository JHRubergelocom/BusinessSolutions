
describe("[service] sol.common.ix.services.SordDataCollector", function () {
  var originalTimeout, parentId, result, moreResults, searchId, idx, query;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_services_SordDataCollector_FindFirst", function () {
      it("should throw if executed without 'parentId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_SordDataCollector_FindFirst", {
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
      it("should return defined result", function (done) {
        expect(function () {
          idx = 0;
          parentId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions";
          test.Utils.execute("RF_sol_common_services_SordDataCollector_FindFirst", {
            parentId: parentId,
            endLevel: -1
          }).then(function success(result1) {
            result = result1;
            moreResults = result.moreResults;
            searchId = result.searchId;
            expect(result).toBeDefined();
            expect(moreResults).toBeDefined();
            expect(searchId).toBeDefined();
            expect(idx).toBeDefined();
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
    describe("RF_sol_common_services_SordDataCollector_FindNext", function () {
      it("should throw if executed without 'searchId', 'idx'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_SordDataCollector_FindNext", {
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
      it("should return defined result", function (done) {
        expect(function () {
          if (moreResults) {
            idx += result.sords.length;
            test.Utils.execute("RF_sol_common_services_SordDataCollector_FindNext", {
              searchId: searchId,
              idx: idx
            }).then(function success(result1) {
              result = result1;
              moreResults = result.moreResults;
              expect(result).toBeDefined();
              expect(moreResults).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }
        }).not.toThrow();
      });
    });
    describe("RF_sol_common_services_SordDataCollector_FindClose", function () {
      it("should throw if executed without 'searchId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_SordDataCollector_FindClose", {
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
      it("should return defined result", function (done) {
        expect(function () {
          if (result) {
            test.Utils.execute("RF_sol_common_services_SordDataCollector_FindClose", {
              searchId: searchId
            }).then(function success(result1) {
              result = result1;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }
        }).not.toThrow();
      });
    });
/*
    describe("Searchmode DIRECT iSearch", function () {
      it("FindFirst", function (done) {
        expect(function () {
          idx = 0;
          query = "*test*";
          result = undefined;
          searchId = undefined;
          moreResults = undefined;
          test.Utils.execute("RF_sol_common_services_SordDataCollector_FindFirst", {
            query: query,
            searchMode: "DIRECT"
          }).then(function success(result1) {
            result = result1;
            moreResults = result.moreResults;
            searchId = result.searchId;
            expect(result).toBeDefined();
            expect(moreResults).toBeDefined();
            expect(searchId).toBeDefined();
            expect(idx).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("FindNext", function (done) {
        expect(function () {
          if (moreResults) {
            idx += result.searchResults.length;
            test.Utils.execute("RF_sol_common_services_SordDataCollector_FindNext", {
              searchId: searchId,
              idx: idx
            }).then(function success(result1) {
              result = result1;
              moreResults = result.moreResults;
              expect(result).toBeDefined();
              expect(moreResults).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }
        }).not.toThrow();
      });
      it("FindClose", function (done) {
        expect(function () {
          if (result) {
            test.Utils.execute("RF_sol_common_services_SordDataCollector_FindClose", {
              searchId: searchId
            }).then(function success(result1) {
              result = result1;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }
        }).not.toThrow();
      });
    });
*/
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});