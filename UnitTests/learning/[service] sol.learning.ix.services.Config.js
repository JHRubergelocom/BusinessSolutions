
describe("[service] sol.learning.ix.services.Config", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_learning_service_GetConfig", function () {
      it("result should return courseTypes, learningPathTypes, courseLocales", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetConfig", {
          }).then(function success(result) {
            expect(result.environment.notify.installed).toEqual(true);
            expect(result.environment.knowledge.installed).toEqual(true);
            expect(result.courseTypes).toBeDefined();
            expect(result.learningPathTypes).toBeDefined();
            expect(result.courseLocales).toBeDefined();
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
          test.Utils.execute("RF_sol_learning_service_GetConfig", {
            requiredConfigProperties: [],
            pageStyle: "standalone",
            lang: "DE"
          }).then(function success(result) {
            expect(result.environment.notify.installed).toEqual(true);
            expect(result.environment.knowledge.installed).toEqual(true);
            expect(result.courseTypes).toBeDefined();
            expect(result.learningPathTypes).toBeDefined();
            expect(result.courseLocales).toBeDefined();
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