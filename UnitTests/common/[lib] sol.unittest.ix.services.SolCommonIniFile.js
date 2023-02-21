
describe("[lib] sol.unittest.ix.services.SolCommonIniFile", function () {
  var IniFileSord, originalTimeout, sectionName, line, key, config, content, value;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonIniFile").then(function success(obSolCommonIniFileId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/IniFile").then(function success1(IniFileSord1) {
          IniFileSord = IniFileSord1;
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
    describe("sol.common.IniFile", function () {
      it("parse", function (done) {
        expect(function () {
          content = IniFileSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.IniFile",
            classConfig: {},
            method: "parse",
            params: [content]
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
      it("getSectionName", function (done) {
        expect(function () {
          line = "[Section]";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.IniFile",
            classConfig: {},
            method: "getSectionName",
            params: [line]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Section");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getSection", function (done) {
        expect(function () {
          sectionName = "Section1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.IniFile",
            classConfig: { sections: [["Section1", [{ key1: "value1" }, { key2: "value2" }]], ["Section2", [{ key22: "value22" }]]] },
            method: "getSection",
            params: [sectionName]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual([{ key1: "value1" }, { key2: "value2" }]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getValue", function (done) {
        expect(function () {
          sectionName = "Section1";
          key = "key1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.IniFile",
            classConfig: { sections: [["Section1", [{ key1: "value1" }, { key2: "value2" }]], ["Section2", [{ key22: "value22" }]]] },
            method: "getValue",
            params: [sectionName, key]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.IniFile",
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
      it("setValue", function (done) {
        expect(function () {
          sectionName = "Section1";
          key = "key2";
          value = "value21";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.IniFile",
            classConfig: { sections: [["Section1", [{ key1: "value1" }, { key2: "value2" }]], ["Section2", [{ key22: "value22" }]]] },
            method: "setValue",
            params: [sectionName, key, value]
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
      it("stringify", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.IniFile",
            classConfig: { sections: [["Section1", [{ key1: "value1" }, { key2: "value2" }]], ["Section2", [{ key22: "value22" }]]] },
            method: "stringify",
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