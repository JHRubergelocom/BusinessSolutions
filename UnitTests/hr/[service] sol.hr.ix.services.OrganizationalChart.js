
describe("[service] sol.hr.ix.services.OrganizationalChart", function () {
  var originalTimeout,
      root, organization, value, nodeObj, conversionCfg, nodeInfo,
      sord, rootObjId, objectType, mappings, cacheProperty, defaultMappings;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("OrganizationalChart").then(function success(objTempId) {
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
    describe("sol.hr.ix.services.OrganizationChart", function () {
      it("buildStructure", function (done) {
        expect(function () {
          root = null;
          organization = [];
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "buildStructure",
            params: [root, organization]
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
      it("convert2Boolean", function (done) {
        expect(function () {
          value = "value1";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "convert2Boolean",
            params: [value]
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
      it("convert2Number", function (done) {
        expect(function () {
          value = 10;
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "convert2Number",
            params: [value]
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
      it("convertTypes", function (done) {
        expect(function () {
          nodeObj = {};
          conversionCfg = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "convertTypes",
            params: [nodeObj, conversionCfg]
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
      it("getAssocObj", function (done) {
        expect(function () {
          nodeInfo = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "getAssocObj",
            params: [nodeInfo]
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
      it("getColors", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "getColors",
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
      it("getCompanies", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "getCompanies",
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
      it("getNodeInfo", function (done) {
        expect(function () {
          sord = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: { objId: 1 },
            method: "getNodeInfo",
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
      it("getNodeObj", function (done) {
        expect(function () {
          nodeInfo = { objKeys: { SOL_TPYE: "Type1" } };
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "getNodeObj",
            params: [nodeInfo]
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
      it("getOrganizationChart", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: { objId: 1 },
            method: "getOrganizationChart",
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
      it("getTranslations", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "getTranslations",
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
      it("lookupCompanies", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "lookupCompanies",
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
      it("lookupOrganization", function (done) {
        expect(function () {
          rootObjId = 1;
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "lookupOrganization",
            params: [rootObjId]
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
      it("prepareAssocTemplate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "prepareAssocTemplate",
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
      it("prepareNodeTemplate", function (done) {
        expect(function () {
          objectType = "objectType1";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "prepareNodeTemplate",
            params: [objectType]
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
      it("prepareTemplate", function (done) {
        expect(function () {
          mappings = [];
          cacheProperty = "cacheProperty1";
          defaultMappings = [];
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.OrganizationChart",
            classConfig: {},
            method: "prepareTemplate",
            params: [mappings, cacheProperty, defaultMappings]
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_hr_service_OrganizationChart_Companies", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_OrganizationChart_Companies", {
          }).then(function success(jsonResult) {
            expect(jsonResult.companies).toBeDefined();
            expect(jsonResult.companies.length).toBeGreaterThan(0);
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
    describe("RF_sol_hr_service_OrganizationChart_Get", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_OrganizationChart_Get", {
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
      it("get organization chart", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_OrganizationChart_Get", {
            objId: "1"
          }).then(function success(jsonResult) {
            expect(jsonResult.organization).toBeDefined();
            expect(jsonResult.organization.length).toBeGreaterThan(0);
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