
describe("[service] sol.knowledge.ix.services.Config", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_knowledge_service_GetConfig", function () {
      it("result should return postTypes, replyTypes, spaces, labels, postLocales", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_GetConfig", {
          }).then(function success(result) {
            expect(result.postTypes).toBeDefined();
            expect(result.replyTypes).toBeDefined();
            expect(result.spaces).toBeDefined();
            expect(result.labels).toBeDefined();
            expect(result.postLocales).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("result should return requiredConfigProperties, pageStyle", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_GetConfig", {
            requiredConfigProperties: ["boardView", "updateXDateServices"],
            pageStyle: "standalone",
            lang: "DE"
          }).then(function success(result) {
            expect(result.postTypes).toBeDefined();
            expect(result.replyTypes).toBeDefined();
            expect(result.spaces).toBeDefined();
            expect(result.labels).toBeDefined();
            expect(result.postLocales).toBeDefined();
            expect(result.config.boardView).toBeDefined();
            expect(result.config.updateXDateServices).toBeDefined();
            expect(result.pageStyle).toBeDefined();
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});