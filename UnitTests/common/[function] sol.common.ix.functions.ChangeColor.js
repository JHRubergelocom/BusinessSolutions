
describe("[function] sol.common.ix.functions.ChangeColor", function () {
  var originalTimeout, objId, sordA, sordB, sordC;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  it("should throw if executed without 'objId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_ChangeColor", {
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
  describe("change color", function () {
    beforeAll(function (done) {
      expect(function () {
        test.Utils.createSord().then(function success(objId1) {
          objId = objId1;
          test.Utils.getSord(objId).then(function success1(sordA1) {
            sordA = sordA1;
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
    it("should change color", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeColor", {
          objId: objId,
          color: "red"
        }).then(function success(jsonResult) {
          test.Utils.getSord(objId).then(function success1(sordB1) {
            sordB = sordB1;
            expect(sordA.kind).not.toEqual(sordB.kind);
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
    afterAll(function (done) {
      expect(function () {
        test.Utils.deleteSord(objId).then(function success(deleteResult) {
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
  describe("change color, remember and restore", function () {
    beforeAll(function (done) {
      expect(function () {
        test.Utils.createSord().then(function success(objId1) {
          objId = objId1;
          test.Utils.getSord(objId).then(function success1(sordA1) {
            sordA = sordA1;
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
    it("should change and store color", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeColor", {
          objId: objId,
          color: "red",
          save: "COLOR_BACKUP"
        }).then(function success(jsonResult) {
          test.Utils.getSord(objId).then(function success1(sordB1) {
            sordB = sordB1;
            expect(sordA.kind).not.toEqual(sordB.kind);
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
    it("should restore color", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeColor", {
          objId: objId,
          restore: "COLOR_BACKUP"
        }).then(function success(jsonResult) {
          test.Utils.getSord(objId).then(function success1(sordC1) {
            sordC = sordC1;
            expect(sordA.kind).toEqual(sordC.kind);
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
    afterAll(function (done) {
      expect(function () {
        test.Utils.deleteSord(objId).then(function success(deleteResult) {
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});