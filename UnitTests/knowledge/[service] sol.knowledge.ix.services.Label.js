
describe("[service] sol.knowledge.ix.services.Label", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Label", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_knowledge_service_Label_Insert", function () {
      describe("knowledge Label", function () {
        it("should throw if executed without 'label'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Insert", {
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
        it("insert label UNITTEST1 first", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Insert", {
              label: {
                key: "UNITTEST1",
                locale: "sol.knowledge.UNITTEST1",
                contentTypes: ["IDEA"],
                color: "#F2F2F2"
              }
            }).then(function success(result) {
              expect(result.success).toEqual(true);
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("insert label UNITTEST1 second", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Insert", {
              label: {
                key: "UNITTEST1",
                locale: "sol.knowledge.UNITTEST1",
                contentTypes: ["IDEA"],
                color: "#F2F2F2"
              }
            }).then(function success(result) {
              expect(result.success).toEqual(true);
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
    describe("RF_sol_knowledge_service_Label_Select", function () {
      describe("knowledge Label", function () {
        it("should throw if executed without 'label'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Select", {
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
        it("select label UNITTEST1", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Select", {
              label: {
                key: "UNITTEST1"
              }
            }).then(function success(result) {
              expect(result.success).toEqual(true);
              expect(result.label).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("select label UNITTEST2", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Select", {
              label: {
                key: "UNITTEST2"
              }
            }).then(function success(result) {
              expect(result.success).toEqual(false);
              expect(result.label).not.toBeDefined();
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
    describe("RF_sol_knowledge_service_Label_Update", function () {
      describe("knowledge Label", function () {
        it("should throw if executed without 'label'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Update", {
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
        it("update label UNITTEST1", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Update", {
              label: {
                key: "UNITTEST1",
                locale: "sol.knowledge.UNITTEST11",
                contentTypes: ["IDEA1"],
                color: "#F2F2F3"
              }
            }).then(function success(result) {
              expect(result.success).toEqual(true);
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("update label UNITTEST2", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Update", {
              label: {
                key: "UNITTEST2",
                locale: "sol.knowledge.UNITTEST21",
                contentTypes: ["IDEA2"],
                color: "#F2F2F1"
              }
            }).then(function success(result) {
              expect(result.success).toEqual(true);
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
    describe("RF_sol_knowledge_service_Label_GetAll", function () {
      describe("knowledge Label", function () {
        it("getall labels", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_GetAll", {
            }).then(function success(result) {
              expect(result.success).toEqual(true);
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
    describe("RF_sol_knowledge_service_Label_Delete", function () {
      describe("knowledge Label", function () {
        it("should throw if executed without 'label'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Delete", {
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
        it("delete label UNITTEST1", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Delete", {
              label: {
                key: "UNITTEST1"
              }
            }).then(function success(result) {
              expect(result.success).toEqual(true);
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("delete label UNITTEST2", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Label_Delete", {
              label: {
                key: "UNITTEST2"
              }
            }).then(function success(result) {
              expect(result.success).toEqual(true);
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