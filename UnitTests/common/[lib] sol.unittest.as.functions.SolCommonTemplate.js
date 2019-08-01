
describe("[lib] sol.unittest.as.functions.SolCommonTemplate", function () {
  var objTemplateId, templateSord, objSmiley1Id, smiley1Sord,
      userName, userInfo, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonTemplate").then(function success(obSolCommonTemplateId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Template").then(function success1(templateSord1) {
          templateSord = templateSord1;
          objTemplateId = templateSord.id;
          test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Smiley1").then(function success2(smiley1Sord1) {
            smiley1Sord = smiley1Sord1;
            objSmiley1Id = smiley1Sord.id;
            userName = test.Utils.getCurrentUserName();
            test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
              userInfo = userInfo1;
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
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("Handlebars Helpers", function () {
      it("base64Barcode 'QR_CODE'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.functions.SolCommonTemplate",
            config: {
              source: "{{base64Barcode type='QR_CODE' content='HELLO'}}",
              params: {}
            }
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