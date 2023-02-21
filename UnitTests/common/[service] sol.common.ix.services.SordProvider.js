
describe("[service] sol.common.ix.services.SordProvider", function () {
  var originalTimeout, objUnittestId, objUnittestField2,
      searchId, objKeysObj, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SordProvider").then(function success(obSordProviderId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_service_SordProvider", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
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
      it("Get UnitTest sord", function (done) {
        expect(function () {
          objKeysObj = { UNITTEST_FIELD1: "Unittest" };
          params = { objKeysObj: objKeysObj };
          test.Utils.findSords(params).then(function success1(sords) {
            expect(sords).toBeDefined();
            expect(sords.length).toBeGreaterThan(0);
            objUnittestId = sords[0].id + "";
            objUnittestField2 = test.Utils.getObjKeyValue(sords[0], "UNITTEST_FIELD2");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Give an objId, get a guid", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            ids: [objUnittestId],
            output: [
              { 
                source: {
                  type: "SORD", key: "guid"
                }
              }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Search with mask, return multiple results", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Search with mask, multiple search criteria", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [
              { key: "UNITTEST_FIELD1", value: "Unittest" },
              { key: "UNITTEST_FIELD2", value: "A*" }
            ],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Search without mask, return a single result", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: [""],
            search: [
              { key: "UNITTEST_FIELD2", value: objUnittestField2 }
            ],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "GRP", key: "UNITTEST_FIELD1" }, target: { prop: "Unittest Feld1" } },
              { source: { type: "GRP", key: "UNITTEST_FIELD2" }, target: { prop: "Unittest Feld2" } }
            ],
            options: {
              allowEmptyMask: true,
              maxResults: 1
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Fuzzy Search (getContextTerms)", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ],
            options: {
              fuzzy: { groupBy: { type: "GRP", key: "UNITTEST_FIELD2" } }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.groups).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("FindDirect Search with mask, multiple search criteria", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ],
            options: {
              findDirect: true
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("FindDirect Search with query, mask, multiple search criteria", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ],
            options: {
              query: "Sordp*"
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Search with multiple masks and paging, return 50 results in batches of 2 (Call 1)", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: [],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ],
            options: {
              maxResults: 50,
              paging: true,
              pageSize: 2
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.moreResults).toBeDefined();
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toEqual(2);
            expect(jsonResult.searchId).toBeDefined();
            searchId = jsonResult.searchId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Fetch the next batch of results", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: [""],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ],
            options: {
              searchId: searchId,
              pageSize: 2
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.moreResults).toBeDefined();
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toEqual(2);
            expect(jsonResult.searchId).toBeDefined();
            searchId = jsonResult.searchId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Define the following, to retrieve 5 search results starting from the 2rd result", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: [""],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ],
            options: {
              searchId: searchId,
              startPagingFrom: 1,
              pageSize: 5
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.moreResults).toBeDefined();
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toEqual(5);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("End a paged search/close a search", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: [""],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ],
            options: {
              searchId: searchId,
              endPaging: true
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toEqual(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Properties with custom values", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } },
              { target: { prop: "myspecialprop", value: "My Fixed Value" } }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toBeGreaterThan(0);
            expect(jsonResult.sords[0].myspecialprop).toEqual("My Fixed Value");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Filtering results", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ],
            filter: [
              { prop: "name", value: "S*" }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Format as TemplateSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "xxxx" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "yyyy" } }
            ],
            options: {
              formatAsTemplateSord: true
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toBeGreaterThan(0);
            expect(jsonResult.sords[0].name).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Format as TemplateSord, not ignore property names", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "xxxx" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "yyyy" } }
            ],
            options: {
              formatAsTemplateSord: true,
              ignorePropertyNames: false
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toBeGreaterThan(0);
            expect(jsonResult.sords[0].yyyy).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Retrieve an unknown amount of MAP fields", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } },
              { source: { type: "MAP", key: "U*" }, target: { prop: "*" } }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Returning sparse results", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: ["UnitTest"],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } },
              { source: { type: "SORD", key: "desc" }, target: { prop: "desc" } }
            ],
            options: { sparse: true }
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Allow empty masks", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: [],
            search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }],
            output: [
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } },
              { source: { type: "SORD", key: "desc" }, target: { prop: "desc" } }
            ],
            options: { allowEmptyMask: true }
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Search for an xDateIso and iDateIso", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_SordProvider", {
            masks: [],
            search: [{ key: "XDATEISO", value: "20180101...20990101" }, { key: "IDATEISO", value: "20180101...20990101" }],
            output: [
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } },
              { source: { type: "SORD", key: "desc" }, target: { prop: "desc" } }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toBeGreaterThan(0);
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