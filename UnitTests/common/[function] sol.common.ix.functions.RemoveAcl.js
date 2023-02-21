
describe("[function] sol.common.ix.functions.RemoveAcl", function () {
  var originalTimeout, obRemoveAclId1, obRemoveAclId2, objTempId,
      config, objTempTId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("RemoveAcl", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    describe("sol.common.ix.functions.RemoveAcl", function () {
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
      it("initRights", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RemoveAcl",
            classConfig: { objId: objTempTId },
            method: "initRights",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RemoveAcl",
            classConfig: { objId: objTempTId },
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
            className: "sol.common.ix.functions.RemoveAcl",
            classConfig: { objId: objTempTId },
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
  describe("test cases removeacl with store old ACL", function () {
    beforeAll(function (done) {
      expect(function () {
        test.Utils.createSord(objTempId).then(function success(obRemoveAclId11) {
          obRemoveAclId1 = obRemoveAclId11;
          test.Utils.removeRights(obRemoveAclId1, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success1(removeRightsResult) {
            test.Utils.createSord(objTempId).then(function success2(obRemoveAclId21) {
              obRemoveAclId2 = obRemoveAclId21;
              test.Utils.removeRights(obRemoveAclId2, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success3(removeRightsResult1) {
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
      expect(function () {
      }).not.toThrow();
    });
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_RemoveAcl", {
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
    it("addRights(obRemoveAclId1, ['Unittest'], { r: true, w: true, d: false, e: true, l: false }, true)", function (done) {
      expect(function () {
        test.Utils.addRights(obRemoveAclId1, ["Unittest"], { r: true, w: true, d: false, e: true, l: false }, true).then(function success(addRightsResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("addRights(obRemoveAclId2, ['Unittest'], { r: true }, true)", function (done) {
      expect(function () {
        test.Utils.addRights(obRemoveAclId2, ["Unittest"], { r: true }, true).then(function success(addRightsResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("with store old ACL", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_RemoveAcl", {
          objId: obRemoveAclId1,
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
    it("compare ACL obRemoveAclId1 obRemoveAclId2 must be equal", function (done) {
      expect(function () {
        test.Utils.compareRights(obRemoveAclId1, obRemoveAclId2).then(function success(res) {
          expect(res).toEqual(0);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    afterAll(function (done) {
      expect(function () {
        test.Utils.deleteSord(obRemoveAclId1).then(function success(deleteResult) {
          test.Utils.deleteSord(obRemoveAclId2).then(function success1(deleteResult1) {
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
  describe("test cases removeacl without store old ACL", function () {
    beforeAll(function (done) {
      expect(function () {
        test.Utils.createSord(objTempId).then(function success(obRemoveAclId11) {
          obRemoveAclId1 = obRemoveAclId11;
          test.Utils.removeRights(obRemoveAclId1, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success1(removeRightsResult) {
            test.Utils.createSord(objTempId).then(function success2(obRemoveAclId21) {
              obRemoveAclId2 = obRemoveAclId21;
              test.Utils.removeRights(obRemoveAclId2, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success3(removeRightsResult1) {
                test.Utils.addRights(obRemoveAclId2, ["Unittest"], { r: true }, true).then(function success4(addRightsResult) {
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
      }).not.toThrow();
    });
    it("addRights(obRemoveAclId1, ['Unittest'], { r: true, w: true, d: false, e: true, l: false }, true)", function (done) {
      expect(function () {
        test.Utils.addRights(obRemoveAclId1, ["Unittest"], { r: true, w: true, d: false, e: true, l: false }, true).then(function success(addRightsResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("addRights(obRemoveAclId2, ['Unittest'], { r: true }, true)", function (done) {
      expect(function () {
        test.Utils.addRights(obRemoveAclId2, ["Unittest"], { r: true }, true).then(function success(addRightsResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("without store old ACL", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_RemoveAcl", {
          objId: obRemoveAclId1
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
    it("compare ACL obRemoveAclId1 obRemoveAclId2 must be equal", function (done) {
      expect(function () {
        test.Utils.compareRights(obRemoveAclId1, obRemoveAclId2).then(function success(res) {
          expect(res).toEqual(0);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    afterAll(function (done) {
      expect(function () {
        test.Utils.deleteSord(obRemoveAclId1).then(function success(deleteResult) {
          test.Utils.deleteSord(obRemoveAclId2).then(function success1(deleteResult1) {
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