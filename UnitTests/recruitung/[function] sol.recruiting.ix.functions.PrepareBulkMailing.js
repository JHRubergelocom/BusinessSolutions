
describe("[function] sol.recruiting.ix.functions.PrepareBulkMailing", function () {
  var originalTimeout,
      config, flattenedArray, arr, recipient, field, recipients,
      availableRecipients, tableType, propsInRecipient, propCounters,
      entries, prop;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("PrepareBulkMailing").then(function success(objTempId) {
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
    describe("sol.recruiting.ix.functions.PrepareBulkMailing", function () {
      it("addRecipientsToFormTable", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "addRecipientsToFormTable",
            params: [config]
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
      it("concatInto", function (done) {
        expect(function () {
          flattenedArray = [];
          arr = [];
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "concatInto",
            params: [flattenedArray, arr]
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
      it("fillEmptyValueInRecipient", function (done) {
        expect(function () {
          recipient = "recipient1";
          field = "field1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "fillEmptyValueInRecipient",
            params: [recipient, field]
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
      it("generateSETConfig", function (done) {
        expect(function () {
          recipients = [];
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "generateSETConfig",
            params: [recipients]
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
      it("generateSearchConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "generateSearchConfig",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "process",
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
      it("searchRecipients", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "searchRecipients",
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
      it("setWfStatus", function (done) {
        expect(function () {
          availableRecipients = [];
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "setWfStatus",
            params: [availableRecipients]
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
      it("toEntries", function (done) {
        expect(function () {
          tableType = "tableType1";
          propsInRecipient = [];
          propCounters = [];
          recipient = "recipient1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "toEntries",
            params: [tableType, propsInRecipient, propCounters, recipient]
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
      it("toEntry", function (done) {
        expect(function () {
          tableType = "tableType1";
          recipient = "recipient1";
          propCounters = [];
          entries = [];
          prop = "prop1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "toEntry",
            params: [tableType, recipient, propCounters, entries, prop]
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
      it("toFilled", function (done) {
        expect(function () {
          recipient = "recipient1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.PrepareBulkMailing",
            classConfig: {},
            method: "toFilled",
            params: [recipient]
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
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
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
});