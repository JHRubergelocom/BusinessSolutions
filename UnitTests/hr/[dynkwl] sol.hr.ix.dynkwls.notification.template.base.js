/* eslint-disable linebreak-style */

describe("[dynkwl] sol.hr.ix.dynkwls.notification.template.base", function () {
  var originalTimeout,
      ec1, sord, fieldName, map,
      focusName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("NotificationTemplateBase").then(function success(objConfigBaseId) {
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
    describe("sol.hr.ix.dynkwl.notification.template.base", function () {
      it("getDataField", function (done) {
        expect(function () {
          sord = {};
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.dynkwl.notification.template.base",
            classConfig: {},
            method: "getDataField",
            params: [sord, fieldName]
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
      it("getHeader", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.dynkwl.notification.template.base",
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
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.dynkwl.notification.template.base",
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
          ec1 = {};
          sord = {};
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.dynkwl.notification.template.base",
            classConfig: {},
            method: "open",
            params: [ec1, sord, fieldName]
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
          ec1 = {};
          map = {};
          focusName = "focusName1";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.dynkwl.notification.template.base",
            classConfig: {},
            method: "openMap",
            params: [ec1, map, focusName]
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