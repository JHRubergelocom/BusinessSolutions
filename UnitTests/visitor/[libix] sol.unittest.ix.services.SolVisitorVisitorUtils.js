
describe("[libix] sol.unittest.ix.services.SolVisitorVisitorUtils", function () {
  var originalTimeout, wfName, params, objId, obSolVisitorVisitorUtilsId, GroupSord,
      language, key, wfConfig;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolVisitorVisitorUtils").then(function success(obSolVisitorVisitorUtilsId1) {
        obSolVisitorVisitorUtilsId = obSolVisitorVisitorUtilsId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/visitor [unit tests]/Test data/Group").then(function success1(GroupSord1) {
          GroupSord = GroupSord1;
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
  describe("Test Lib Functions", function () {
    describe("sol.visitor.ix.VisitorUtils", function () {
      it("buildWfName", function (done) {
        expect(function () {
          wfName = "wfName1";
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "buildWfName",
            params: [wfName, params]
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
      it("getLocalizedString", function (done) {
        expect(function () {
          language = "de";
          key = "key1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "getLocalizedString",
            params: [language, key]
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
      it("getWfNameFromTemplate", function (done) {
        expect(function () {
          wfConfig = { nameTemplate: "nameTemplate1" };
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "getWfNameFromTemplate",
            params: [wfConfig]
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
      it("getWfNameTemplateData", function (done) {
        expect(function () {
          wfConfig = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "getWfNameTemplateData",
            params: [wfConfig]
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
      it("loadBaseConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "loadBaseConfig",
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
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "loadConfig",
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
      it("startCancelGroupRegistrationWorkflow", function (done) {
        expect(function () {
          objId = obSolVisitorVisitorUtilsId;
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startCancelGroupRegistrationWorkflow",
            params: [objId, wfName]
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
      it("startCancelVisitorRegistrationWorkflow", function (done) {
        expect(function () {
          objId = obSolVisitorVisitorUtilsId;
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startCancelVisitorRegistrationWorkflow",
            params: [objId, wfName]
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
      it("startCaptureVisitorPictureWorkflow", function (done) {
        expect(function () {
          objId = obSolVisitorVisitorUtilsId;
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startCaptureVisitorPictureWorkflow",
            params: [objId, wfName]
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
      it("startCheckInVisitorWorkflow", function (done) {
        expect(function () {
          objId = obSolVisitorVisitorUtilsId;
          wfName = "wfName1";
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startCheckInVisitorWorkflow",
            params: [objId, wfName, params]
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
      it("startCheckOutVisitorWorkflow", function (done) {
        expect(function () {
          objId = obSolVisitorVisitorUtilsId;
          wfName = "wfName1";
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startCheckOutVisitorWorkflow",
            params: [objId, wfName, params]
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
      it("startCreateSignatureDocumentWorkflow", function (done) {
        expect(function () {
          objId = obSolVisitorVisitorUtilsId;
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startCreateSignatureDocumentWorkflow",
            params: [objId, wfName]
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
      it("startEditGroupRegistrationWorkflow", function (done) {
        expect(function () {
          objId = obSolVisitorVisitorUtilsId;
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startEditGroupRegistrationWorkflow",
            params: [objId, wfName]
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
      it("startEditVisitorRegistrationWorkflow", function (done) {
        expect(function () {
          objId = obSolVisitorVisitorUtilsId;
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startEditVisitorRegistrationWorkflow",
            params: [objId, wfName]
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
      it("startPreRegisterGroupWorkflow", function (done) {
        expect(function () {
          objId = GroupSord.id;
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startPreRegisterGroupWorkflow",
            params: [objId, wfName]
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
      it("startReCheckInVisitorWorkflow", function (done) {
        expect(function () {
          objId = obSolVisitorVisitorUtilsId;
          wfName = "wfName1";
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startReCheckInVisitorWorkflow",
            params: [objId, wfName, params]
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
      it("startRegisterGroupWorkflow", function (done) {
        expect(function () {
          objId = GroupSord.id;
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startRegisterGroupWorkflow",
            params: [objId, wfName]
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
      it("startRegisterVisitorWorkflow", function (done) {
        expect(function () {
          objId = GroupSord.id;
          wfName = "wfName1";
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startRegisterVisitorWorkflow",
            params: [objId, wfName, params]
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
      it("startWorkflow", function (done) {
        expect(function () {
          objId = GroupSord.id;
          wfConfig = { templateName: "sol.visitor.visitor.registergroup", name: "name1" };
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.ix.VisitorUtils",
            classConfig: {},
            method: "startWorkflow",
            params: [objId, wfConfig, params]
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
      it("remove workflow", function (done) {
        expect(function () {
          test.Utils.getActiveWorkflows().then(function success(wfs) {
            test.Utils.removeActiveWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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