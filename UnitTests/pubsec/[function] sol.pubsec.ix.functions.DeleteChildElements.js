/* eslint-disable linebreak-style */

describe("[function] sol.pubsec.ix.functions.DeleteChildElements", function () {
  var originalTimeout, objDeleteChildElementsId,
      sord, config, nameTemplate, requestId, objId, template;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DeleteChildElements").then(function success(objDeleteChildElementsId1) {
        objDeleteChildElementsId = objDeleteChildElementsId1;
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
    describe("sol.pubsec.ix.functions.DeleteChildElements", function () {
      it("checkFilePreconditions", function (done) {
        expect(function () {
          sord = { id: objDeleteChildElementsId };
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.DeleteChildElements",
            classConfig: {},
            method: "checkFilePreconditions",
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
      it("createWorkflowName", function (done) {
        expect(function () {
          nameTemplate = "nameTemplate1";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.DeleteChildElements",
            classConfig: {},
            method: "createWorkflowName",
            params: [nameTemplate]
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
      it("findChildElements", function (done) {
        expect(function () {
          requestId = 1;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.DeleteChildElements",
            classConfig: {},
            method: "findChildElements",
            params: [requestId]
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
      it("getDeleteFileNameTemplate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.DeleteChildElements",
            classConfig: {},
            method: "getDeleteFileNameTemplate",
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
      it("getDeleteFileWfTemplate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.DeleteChildElements",
            classConfig: {},
            method: "getDeleteFileWfTemplate",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.DeleteChildElements",
            classConfig: {},
            method: "initialize",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.DeleteChildElements",
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
      it("setPermissionFlag", function (done) {
        expect(function () {
          objId = objDeleteChildElementsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.DeleteChildElements",
            classConfig: {},
            method: "setPermissionFlag",
            params: [objId]
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
      it("startDeleteWorkflow", function (done) {
        expect(function () {
          objId = objDeleteChildElementsId;
          template = "template1";
          nameTemplate = "nameTemplate1";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.DeleteChildElements",
            classConfig: {},
            method: "startDeleteWorkflow",
            params: [objId, template, nameTemplate]
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