
describe("[function] sol.invoice.as.functions.ExtractElectronicDataUnitTest", function () {
  var originalTimeout, content;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("test ExtractElectronicDataUnitTest", function () {
    it("start as functions ExtractElectronicDataUnitTest", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
          action: "sol.invoice_electronic.ExtractDataUnitTest",
          config: {
          }
        }).then(function success(jsonResult) {
          content = jsonResult.content;
          if (content.indexOf("exception") != -1) {
            fail(jsonResult.content);
          }
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});