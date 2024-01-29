/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonHttpUtils", function () {
  var originalTimeout, url, bytes, str, inputStream, urlConn, urlString, config, resultObj;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonHttpUtils").then(function success(obSolCommonHttpUtilsId) {
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
    describe("sol.common.HttpUtils", function () {
      it("resolveUrl", function (done) {
        expect(function () {
          url = "{{eloWfBaseUrl}}/apps/rest/cmd/refreshicons/";
          config = { params: { method: "post", readTimeout: 30000 }, addTicket: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "resolveUrl",
            params: [url, config]
          }).then(function success(jsonResult) {
            url = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildResultObj", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "buildResultObj",
            params: [url]
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
      it("convertByteArrayToString", function (done) {
        expect(function () {
          bytes = ["72", "64", "101", "77", "108", "50", "108", "66", "111", "77", "120", "122"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "convertByteArrayToString",
            params: [bytes]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("H@eMl2lBoMxz");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("convertStringToByteArray", function (done) {
        expect(function () {
          str = "Hello";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "convertStringToByteArray",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(["72", "101", "108", "108", "111"]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("encodeBase64", function (done) {
        expect(function () {
          str = "Hello";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "encodeBase64",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("SGVsbG8=");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getPasswordAuthentication", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: { user: "Administrator", password: "elo" },
            method: "getPasswordAuthentication",
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
      it("inputStreamToString", function (done) {
        expect(function () {
          inputStream = "FileContent";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "inputStreamToString",
            params: [inputStream]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("FileContent");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("sendRequest", function (done) {
        expect(function () {
          config = {
            url: "{{eloWfBaseUrl}}/apps/rest/cmd/app/deploy",
            method: "post",
            connectTimeout: 10000,
            readTimeout: 60000,
            contentType: "application/json;charset=UTF-8",
            params: { Key2: "Value2" },
            addTicket: true,
            cookies: { Key1: "Value1" },
            addCookieTicket: true
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "sendRequest",
            params: [config]
          }).then(function success(jsonResult) {
            url = jsonResult.url;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("prepareRequest", function (done) {
        expect(function () {
          urlString = url;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "prepareRequest",
            params: [urlString, config]
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
      it("logRequestProperties", function (done) {
        expect(function () {
          urlConn = url;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "logRequestProperties",
            params: [urlConn]
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
      it("sendGet", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "sendGet",
            params: [url, config]
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
      it("readResponse", function (done) {
        expect(function () {
          urlConn = url;
          resultObj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "readResponse",
            params: [urlConn, resultObj]
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
      it("resolveUrl", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "resolveUrl",
            params: [url, config]
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
      it("sendPostPutDelete", function (done) {
        expect(function () {
          urlString = url;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.HttpUtils",
            classConfig: {},
            method: "sendPostPutDelete",
            params: [urlString, config]
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