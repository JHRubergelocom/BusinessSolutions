
describe("[function] sol.common.ix.functions.RestoreAcl", function () {
  var originalTimeout, obRestoreAclId1, obRestoreAclId2, obRestoreAclId3,
      config, objTempTId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("RestoreAcl", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId) {
        test.Utils.createSord(objTempId).then(function success1(obRestoreAclId11) {
          obRestoreAclId1 = obRestoreAclId11;
          test.Utils.removeRights(obRestoreAclId1, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success2(removeRightsResult) {
            test.Utils.createSord(objTempId).then(function success3(obRestoreAclId21) {
              obRestoreAclId2 = obRestoreAclId21;
              test.Utils.removeRights(obRestoreAclId2, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success4(removeRightsResult1) {
                test.Utils.createSord(objTempId).then(function success5(obRestoreAclId31) {
                  obRestoreAclId3 = obRestoreAclId31;
                  test.Utils.removeRights(obRestoreAclId3, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success6(removeRightsResult2) {
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
    describe("sol.common.ix.functions.RestoreAcl", function () {
      it("create sord temp", function (done) {
        expect(function () {
          test.Utils.createTempSord("TempT").then(function success(objTempTId1) {
            objTempTId = objTempTId1;
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RestoreAcl",
            classConfig: { objId: objTempTId, mapKey: "MAP1" },
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RestoreAcl",
            classConfig: { objId: objTempTId, mapKey: "MAP1" },
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
      it("delete sord temp", function (done) {
        expect(function () {
          test.Utils.deleteSord(objTempTId).then(function success(deleteResult) {
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
  describe("test cases restoreacl", function () {
    it("should throw if executed without 'objId' and 'mapKey'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_RestoreAcl", {
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
    it("should throw if executed without 'mapKey'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_RestoreAcl", {
          objId: "4713"
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
    it("addRights(obRestoreAclId1, ['Unittest'], { r: true, w: true, d: false, e: true, l: false }, true)", function (done) {
      expect(function () {
        test.Utils.addRights(obRestoreAclId1, ["Unittest"], { r: true, w: true, d: false, e: true, l: false }, true).then(function success(addRightsResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("addRights(obRestoreAclId2, ['Unittest'], { r: true, w: true, d: false, e: true, l: false }, true)", function (done) {
      expect(function () {
        test.Utils.addRights(obRestoreAclId2, ["Unittest"], { r: true, w: true, d: false, e: true, l: false }, true).then(function success(addRightsResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("addRights(obRestoreAclId3, ['Unittest'], { r: true }, true)", function (done) {
      expect(function () {
        test.Utils.addRights(obRestoreAclId3, ["Unittest"], { r: true }, true).then(function success(addRightsResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove ACL from obRestoreAclId2 and store", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_RemoveAcl", {
          objId: obRestoreAclId2,
          mapKey: "REMOVED_ACL"
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
    it("compare ACL obRestoreAclId2 obRestoreAclId3 must be equal", function (done) {
      expect(function () {
        test.Utils.compareRights(obRestoreAclId2, obRestoreAclId3).then(function success(res) {
          expect(res).toEqual(10);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("restore ACL to obRestoreAclId2", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_RestoreAcl", {
          objId: obRestoreAclId2,
          mapKey: "REMOVED_ACL"
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