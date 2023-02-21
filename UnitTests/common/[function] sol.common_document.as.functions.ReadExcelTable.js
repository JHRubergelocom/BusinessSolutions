/* eslint-disable linebreak-style */

describe("[function] sol.common_document.as.functions.ReadExcelTable", function () {
  var originalTimeout, ReadExcelTableSord, content;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    test.Utils.createTempSord("ReadExcelTable").then(function success(obExecuteAsActionId) {
      test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/ReadExcelTable").then(function success1(ReadExcelTableSord1) {
        ReadExcelTableSord = ReadExcelTableSord1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
      done();
    }, function error(err) {
      fail(err);
      console.error(err);
      done();
    }
    );
  });
  describe("Tests AS Action", function () {
    describe("sol.common_document.as.functions.ReadExcelTable", function () {
      it("should throw with empty config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.common_document.as.functions.ReadExcelTable",
            config: {}
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") == -1) {
              fail(jsonResult.content);
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
      it("should not throw with Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.common_document.as.functions.ReadExcelTable",
            config: {
              objId: ReadExcelTableSord.id,
              tableConfig: { startRowIndex: 8, startColumnIndex: 0, columns: [{ key: "lastName" }, { key: "firstName" }] }
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
              test.Utils.getActiveWorkflows().then(function success2(wfs1) {
                test.Utils.removeActiveWorkflows(wfs1).then(function success3(removeFinishedWorkflowsResult1) {
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