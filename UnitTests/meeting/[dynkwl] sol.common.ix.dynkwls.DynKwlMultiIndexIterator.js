
describe("[dynkwl] sol.common.ix.dynkwls.DynKwlMultiIndexIterator", function () {
  var originalTimeout, objDynKwlMultiIndexIteratorId,
      fieldName, currentInput, multiIndexValue, fieldConfig,
      grpFieldValue, config, ec, sord, focusName, map;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DynKwlMultiIndexIterator").then(function success(objDynKwlMultiIndexIteratorId1) {
        objDynKwlMultiIndexIteratorId = objDynKwlMultiIndexIteratorId1;
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
    describe("sol.common.ix.DynKwlMultiIndexIterator", function () {
      it("buildKeyNames", function (done) {
        expect(function () {
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            method: "buildKeyNames",
            params: [fieldName]
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
      it("getData", function (done) {
        expect(function () {
          currentInput = "currentInput1";
          multiIndexValue = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            method: "getData",
            params: [currentInput, multiIndexValue]
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
      it("getFullFieldName", function (done) {
        expect(function () {
          fieldConfig = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            method: "getFullFieldName",
            params: [fieldConfig]
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
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
      it("getKeyNames", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            method: "getKeyNames",
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
      it("getMessage", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            method: "getMessage",
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
      it("getMultiIndexAsTable", function (done) {
        expect(function () {
          grpFieldValue = "grpFieldValue1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            method: "getMultiIndexAsTable",
            params: [grpFieldValue]
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
      it("getNextRow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" }, index: 1, resultSet: [0, 1, 2] },
            method: "getNextRow",
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
      it("getTitle", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            method: "getTitle",
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
      it("hasMoreRows", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" }, index: 1, resultSet: [0, 1, 2] },
            method: "hasMoreRows",
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
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
      it("open", function (done) {
        expect(function () {
          ec = {};
          sord = {};
          focusName = "focusName1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            method: "open",
            params: [ec, sord, focusName]
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
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
      it("splitMultiIndexField", function (done) {
        expect(function () {
          grpFieldValue = "grpFieldValue1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.common.ix.DynKwlMultiIndexIterator",
            classConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            method: "splitMultiIndexField",
            params: [grpFieldValue]
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
    describe("sol.common.ix.DynKwlMultiIndexIterator", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objDynKwlMultiIndexIteratorId
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objDynKwlMultiIndexIteratorId,
            dynKwl: "sol.common.ix.DynKwlMultiIndexIterator"
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objDynKwlMultiIndexIteratorId,
            dynKwl: "sol.common.ix.DynKwlMultiIndexIterator",
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objDynKwlMultiIndexIteratorId,
            dynKwl: "sol.common.ix.DynKwlMultiIndexIterator",
            providerConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {   
            if (jsonResult.error) {
              fail(jsonResult.error);
            } else {
              expect(jsonResult.keynames).toBeDefined();
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