
describe("[service] sol.dev.ix.services.IntegrityCheck", function () {
  var originalTimeout, config, biColors, biJsons, biDocMasks, biWfs,
      biSetSordTypes, biSordTypes, sordEloinst, sordsEloinst,
      objTempId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("IntegrityCheck", null, null).then(function success(objTempId1) {
        objTempId = objTempId1;
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
    describe("sol.dev.ix.services.IntegrityCheck", function () {
      it("checkIntegrityColors", function (done) {
        expect(function () {
          biColors = []; 
          biJsons = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "checkIntegrityColors",
            params: [biColors, biJsons]
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
      it("checkIntegrityDocMasks", function (done) {
        expect(function () {
          biDocMasks = []; 
          biJsons = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "checkIntegrityDocMasks",
            params: [biDocMasks, biJsons]
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
      it("checkIntegrityWfs", function (done) {
        expect(function () {
          biWfs = []; 
          biJsons = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "checkIntegrityWfs",
            params: [biWfs, biJsons]
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
      it("checkIntegritySetSordTypes", function (done) {
        expect(function () {
          biSetSordTypes = []; 
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "checkIntegritySetSordTypes",
            params: [biSetSordTypes]
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
      it("checkIntegritySordTypes", function (done) {
        expect(function () {
          biSordTypes = []; 
          biJsons = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "checkIntegritySordTypes",
            params: [biSordTypes, biJsons]
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
      it("findEloinst", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "findEloinst",
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
      it("getbiJson", function (done) {
        expect(function () {
          sordEloinst = objTempId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "getbiJson",
            params: [sordEloinst]
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
      it("getBuildInstallColors", function (done) {
        expect(function () {
          biJsons = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "getBuildInstallColors",
            params: [biJsons]
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
      it("getBuildInstallDocMasks", function (done) {
        expect(function () {
          biJsons = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "getBuildInstallDocMasks",
            params: [biJsons]
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
      it("getBuildInstallJsons", function (done) {
        expect(function () {
          sordsEloinst = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "getBuildInstallJsons",
            params: [sordsEloinst]
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
      it("getBuildInstallSetSordTypes", function (done) {
        expect(function () {
          biJsons = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "getBuildInstallSetSordTypes",
            params: [biJsons]
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
      it("getBuildInstallSordTypes", function (done) {
        expect(function () {
          biJsons = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "getBuildInstallSordTypes",
            params: [biJsons]
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
      it("getBuildInstallWfs", function (done) {
        expect(function () {
          biJsons = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
            classConfig: {},
            method: "getBuildInstallWfs",
            params: [biJsons]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.dev.ix.services.IntegrityCheck",
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
    });
  });
  describe("test IntegrityCheck", function () {
    it("IntegrityCheck", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_dev_service_IntegrityCheck", {
        }).then(function success(jsonResult) {
          expect(jsonResult.workflows).toBeDefined();
          expect(jsonResult.sordTypes).toBeDefined();
          expect(jsonResult.setSordTypes).toBeDefined();
          expect(jsonResult.colors).toBeDefined();
          expect(jsonResult.docMasks).toBeDefined();
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