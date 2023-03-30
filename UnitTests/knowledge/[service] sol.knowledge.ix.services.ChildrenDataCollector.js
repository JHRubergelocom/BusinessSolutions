
describe("[service] sol.knowledge.ix.services.ChildrenDataCollector", function () {
  var originalTimeout,
      formatter, sord, params, maskName;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.ChildrenDataCollector", function () {
      it("getFormattedJson", function (done) {
        expect(function () {
          formatter = {};
          sord = {};
          maskName = "maskName1";
          params = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.ChildrenDataCollector",
            classConfig: {},
            method: "getFormattedJson",
            params: [formatter, sord, maskName, params]
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
    describe("RF_sol_knowledge_service_ChildrenDataCollector", function () {
      it("should with no Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_ChildrenDataCollector", {
          }).then(function success(result) {
            fail(result);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("result should return version, formatter, locale, sord, sords, docMasks", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_ChildrenDataCollector", {
            parentId: 1
          }).then(function success(result) {
            expect(result.version).toBeDefined();
            expect(result.formatter).toBeDefined();
            expect(result.locale).toBeDefined();
            expect(result.sord).toBeDefined();
            expect(result.sords).toBeDefined();
            expect(result.docMasks).toBeDefined();
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