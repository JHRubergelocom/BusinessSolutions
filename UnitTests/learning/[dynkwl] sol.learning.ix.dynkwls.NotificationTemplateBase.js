
describe("[dynkwl] sol.learning.ix.dynkwls.NotificationTemplateBase", function () {
  var originalTimeout, objNotificationTemplateBaseId,
      sord, ec, fieldName, map, focusName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("NotificationTemplateBase").then(function success(objNotificationTemplateBaseId1) {
        objNotificationTemplateBaseId = objNotificationTemplateBaseId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.dynkwl.notification.template.base", function () {
      it("getHeader", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.dynkwl.notification.template.base",
            classConfig: {},
            method: "getHeader",
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
      it("getRowData", function (done) {
        expect(function () {
          sord = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.dynkwl.notification.template.base",
            classConfig: {},
            method: "getRowData",
            params: [sord]
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
      it("open", function (done) {
        expect(function () {
          ec = {};
          sord = {};
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.dynkwl.notification.template.base",
            classConfig: {},
            method: "open",
            params: [ec, sord, fieldName]
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
      it("openMap", function (done) {
        expect(function () {
          ec = {};
          map = {};
          focusName = "focusName1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.dynkwl.notification.template.base",
            classConfig: {},
            method: "openMap",
            params: [ec, map, focusName]
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
  describe("Tests Dynamic Keyword lists", function () {
    describe("sol.learning.ix.dynkwl.notification.template.base", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
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
      it("should throw if executed without 'dynkwl'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
            objId: objNotificationTemplateBaseId
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
      it("should throw if executed without 'providerConfig'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
            objId: objNotificationTemplateBaseId,
            dynKwl: "sol.learning.ix.dynkwl.notification.template.base"
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
      it("should throw if executed without 'inputFieldName'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
            objId: objNotificationTemplateBaseId,
            dynKwl: "sol.learning.ix.dynkwl.notification.template.base",
            providerConfig: {}
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
      it("should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
            objId: objNotificationTemplateBaseId,
            dynKwl: "sol.learning.ix.dynkwl.notification.template.base",
            providerConfig: {},
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {   
            if (jsonResult.error) {
              fail(jsonResult.error);
            } else {
              expect(jsonResult.keynames).toBeDefined();
              expect(jsonResult.header).toBeDefined();
              expect(jsonResult.title).toBeDefined();
              expect(jsonResult.data).toBeDefined();  
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