
describe("[function] sol.knowledge.ix.functions.GenerateBoardReference", function () {
  var originalTimeout, sordBoard, boardReferenceFieldName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateBoardReference").then(function success(objGenerateBoardReferenceId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/knowledge [unit tests]/Test data/Board").then(function success2(sordBoard1) {
          sordBoard = sordBoard1;
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
    describe("RF_sol_knowledge_function_generators_GenerateBoardReference", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_generators_GenerateBoardReference", {
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
      it("generate board reference", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_generators_GenerateBoardReference", {
            objId: sordBoard.id,
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
            boardReferenceFieldName = knowledgeConfig.fields.knowledgeBoardReference;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove board reference", function (done) {
        expect(function () {
          test.Utils.setObjKeyValue(sordBoard, boardReferenceFieldName, "");
          test.Utils.checkinSord(sordBoard).then(function success2(checkinSordResult) {
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