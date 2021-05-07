
describe("[function] sol.knowledge.ix.functions.GenerateSpaceReference", function () {
  var originalTimeout, sordSpace, spaceReferenceFieldName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateSpaceReference").then(function success(objGenerateSpaceReferenceId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/knowledge [unit tests]/Test data/Space").then(function success2(sordSpace1) {
          sordSpace = sordSpace1;
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
    describe("RF_sol_knowledge_function_generators_GenerateSpaceReference", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_generators_GenerateSpaceReference", {
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
      it("generate space reference", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_generators_GenerateSpaceReference", {
            objId: sordSpace.id,
            updateExisting: true
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
      it("loadKnowledgeConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib", {
            className: "sol.knowledge.ix.KnowledgeUtils",
            classConfig: {},
            method: "loadKnowledgeConfig",
            params: []
          }).then(function success(knowledgeConfig) {
            spaceReferenceFieldName = knowledgeConfig.fields.knowledgeSpaceReference;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove space reference", function (done) {
        expect(function () {
          test.Utils.setObjKeyValue(sordSpace, spaceReferenceFieldName, "");
          test.Utils.checkinSord(sordSpace).then(function success2(checkinSordResult) {
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