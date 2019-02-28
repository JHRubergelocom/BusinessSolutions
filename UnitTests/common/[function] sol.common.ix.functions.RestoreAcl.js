
describe("[function] sol.common.ix.functions.RestoreAcl", function () {
  var originalTimeout, obRestoreAclId1, obRestoreAclId2, obRestoreAclId3;

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
  describe("test cases restoreacl", function () {
    beforeAll(function (done) {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
      expect(function () {
        test.Utils.createSord().then(function success(obRestoreAclId11) {
          obRestoreAclId1 = obRestoreAclId11;
          test.Utils.removeRights(obRestoreAclId1, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success1(removeRightsResult) {
            test.Utils.createSord().then(function success2(obRestoreAclId21) {
              obRestoreAclId2 = obRestoreAclId21;
              test.Utils.removeRights(obRestoreAclId2, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success3(removeRightsResult1) {
                test.Utils.createSord().then(function success4(obRestoreAclId31) {
                  obRestoreAclId3 = obRestoreAclId31;
                  test.Utils.removeRights(obRestoreAclId3, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success5(removeRightsResult2) {
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
    it("compare ACL obRestoreAclId1 obRestoreAclId2 must be equal", function (done) {
      expect(function () {
        test.Utils.compareRights(obRestoreAclId1, obRestoreAclId2).then(function success(res) {
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
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      expect(function () {
        test.Utils.deleteSord(obRestoreAclId1).then(function success(deleteResult) {
          test.Utils.deleteSord(obRestoreAclId2).then(function success1(deleteResult1) {
            test.Utils.deleteSord(obRestoreAclId3).then(function success2(deleteResult2) {
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
  });
});