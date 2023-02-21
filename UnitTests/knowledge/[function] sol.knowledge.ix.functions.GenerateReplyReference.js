
describe("[function] sol.knowledge.ix.functions.GenerateReplyReference", function () {
  var originalTimeout, sordReply, replyReferenceFieldName,
      params, replyReference;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateReplyReference").then(function success(objGenerateReplyReferenceId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/knowledge [unit tests]/Test data/Reply").then(function success2(sordReply1) {
          sordReply = sordReply1;
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
    describe("sol.knowledge.ix.functions.generators.GenerateReplyReference", function () {
      it("getIdentifier", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.functions.generators.GenerateReplyReference",
            classConfig: { objId: sordReply.id, updateExisting: true },
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
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.functions.generators.GenerateReplyReference",
            classConfig: { objId: sordReply.id, updateExisting: true, sord: sordReply, optionalIdentifier: true },
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
      it("initialize", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.functions.generators.GenerateReplyReference",
            classConfig: { objId: sordReply.id, updateExisting: true },
            method: "initialize",
            params: [params]
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
          replyReference = "X99";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.functions.generators.GenerateReplyReference",
            classConfig: { objId: sordReply.id, updateExisting: true, sord: sordReply },
            method: "setIdentifier",
            params: [replyReference]
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
            replyReferenceFieldName = knowledgeConfig.fields.knowledgeReplyReference;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove reply reference", function (done) {
        expect(function () {
          test.Utils.setObjKeyValue(sordReply, replyReferenceFieldName, "");
          test.Utils.checkinSord(sordReply).then(function success2(checkinSordResult) {
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
    describe("RF_sol_knowledge_function_generators_GenerateReplyReference", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_generators_GenerateReplyReference", {
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
      it("generate reply reference", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_function_generators_GenerateReplyReference", {
            objId: sordReply.id,
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
            replyReferenceFieldName = knowledgeConfig.fields.knowledgeReplyReference;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove reply reference", function (done) {
        expect(function () {
          test.Utils.setObjKeyValue(sordReply, replyReferenceFieldName, "");
          test.Utils.checkinSord(sordReply).then(function success2(checkinSordResult) {
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