/* eslint-disable linebreak-style */

describe("[function] sol.visitor.ix.functions.CheckoutSingleVisitor", function () {
  var objGroupId, originalTimeout,
      groupSordId, mapKeys, lineNo, config, guid, sordInfo;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CheckoutSingleVisitor").then(function success(objCheckoutSingleVisitorId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SingleVisitor").then(function success1(sordSingleVisitor) {
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/Group").then(function success2(sordGroup) {
            objGroupId = sordGroup.id;
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
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.visitor.ix.functions.CheckoutSingleVisitor", function () {
      it("checkOutMainSord", function (done) {
        expect(function () {
          groupSordId = objGroupId;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CheckoutSingleVisitor",
            classConfig: {},
            method: "checkOutMainSord",
            params: [groupSordId]
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
      it("getSordInformation", function (done) {
        expect(function () {
          mapKeys = [];
          lineNo = 1;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CheckoutSingleVisitor",
            classConfig: {},
            method: "getSordInformation",
            params: [mapKeys, lineNo]
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
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CheckoutSingleVisitor",
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
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CheckoutSingleVisitor",
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
      it("updateVisitorSord", function (done) {
        expect(function () {
          guid = objGroupId;
          sordInfo = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CheckoutSingleVisitor",
            classConfig: {},
            method: "updateVisitorSord",
            params: [guid, sordInfo]
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
    describe("RF_sol_visitor_function_CheckoutSingleVisitor", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_function_CheckoutSingleVisitor", {
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
      describe("checkout whole group", function () {
        it("set checkout in single visitor1 and visitor2", function (done) {
          expect(function () {
            test.Utils.updateMapData(objGroupId, { VISITOR_CHECKOUTVISITOR1: 1, VISITOR_CHECKOUTVISITOR2: 1 }).then(function success(updateMapDataResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("checkout group ", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_visitor_function_CheckoutSingleVisitor", {
              objId: objGroupId,
              type: "group"
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
        it("reset visitor guids in group sord", function (done) {
          expect(function () {
            test.Utils.updateMapData(objGroupId, { VISITOR_GUID1: "", VISITOR_GUID2: "" }).then(function success(updateMapDataResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("reset visitor checkout in group sord", function (done) {
          expect(function () {
            test.Utils.updateMapData(objGroupId, { VISITOR_CHECKOUTVISITOR1: "", VISITOR_CHECKOUTVISITOR2: "" }).then(function success(updateMapDataResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("rename group sord", function (done) {
          expect(function () {
            test.Utils.getSord(objGroupId).then(function success(sordGroup) {
              test.Utils.updateSord(sordGroup, [{ key: "name", value: "Group" }]).then(function success1(updateResult) {
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