
describe("[lib] sol.unittest.ix.services.SolCommonXmlBuilder", function () {
  var originalTimeout, parentElement, tagName,
      content, attribObj, data, dataDefintion,
      rootTagName, obj, node, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonXmlBuilder").then(function success(obSolCommonXmlBuilderId) {
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
    describe("sol.common.XmlBuilder", function () {
      it("addElement", function (done) {
        expect(function () {
          parentElement = "xmlDoc";
          tagName = "tagName1";
          content = null;
          attribObj = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlBuilder",
            classConfig: {},
            method: "addElement",
            params: [parentElement, tagName, content, attribObj]
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
      it("buildFromJson", function (done) {
        expect(function () {
          data = { tag: "tag1" };
          dataDefintion = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlBuilder",
            classConfig: {},
            method: "buildFromJson",
            params: [data, dataDefintion]
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
      it("createXml", function (done) {
        expect(function () {
          rootTagName = "rootTagName1";
          attribObj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlBuilder",
            classConfig: {},
            method: "createXml",
            params: [rootTagName, attribObj]
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
      it("getFirstPropName", function (done) {
        expect(function () {
          obj = { tag: "tag1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlBuilder",
            classConfig: {},
            method: "getFirstPropName",
            params: [obj]
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
      it("getNamespaceUri", function (done) {
        expect(function () {
          node = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlBuilder",
            classConfig: {},
            method: "getNamespaceUri",
            params: [node]
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
      it("getXmlDoc", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlBuilder",
            classConfig: {},
            method: "getXmlDoc",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlBuilder",
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
      it("processObj", function (done) {
        expect(function () {
          obj = { tag: "tag1" };
          parentElement = "xmlDoc";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlBuilder",
            classConfig: {},
            method: "processObj",
            params: [obj, parentElement]
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
      it("toString", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlBuilder",
            classConfig: {},
            method: "toString",
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