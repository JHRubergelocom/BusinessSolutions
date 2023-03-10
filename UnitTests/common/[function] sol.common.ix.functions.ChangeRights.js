
describe("[function] sol.common.ix.functions.ChangeRights", function () {
  var originalTimeout, obChangeRightsId1,
      obChangeRightsId2, sordChangeRights2, aclItems;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ChangeRights").then(function success(obExecuteAsActionId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("test cases changerights", function () {
    it("create sordChangeRights1", function (done) {
      expect(function () {
        test.Utils.createTempSord("ChangeRights1").then(function success(obChangeRightsId11) {
          obChangeRightsId1 = obChangeRightsId11;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove rights", function (done) {
      expect(function () {
        test.Utils.removeRights(obChangeRightsId1, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success(removeRightsResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create sordChangeRights2", function (done) {
      expect(function () {
        test.Utils.createTempSord("ChangeRights2").then(function success(obChangeRightsId21) {
          obChangeRightsId2 = obChangeRightsId21;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get sord", function (done) {
      expect(function () {
        test.Utils.getSord(obChangeRightsId2).then(function success3(sordChangeRights21) {
          sordChangeRights2 = sordChangeRights21;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("update keywording", function (done) {
      expect(function () {
        test.Utils.updateKeywording(sordChangeRights2, { UNITTEST_FIELD2: "Administrator" }, true).then(function success4(updateKeywordingResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove rights", function (done) {
      expect(function () {
        test.Utils.removeRights(obChangeRightsId2, ["9999"], { r: true, w: true, d: true, e: true, l: true }, true).then(function success5(removeRightsResult1) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeRights", {
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
    it("ChangeRights(obChangeRightsId1, ['Unittest'], {r: true, w: true, d: false, e: true, l: false }, 'ADD')", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeRights", {
          objId: obChangeRightsId1,
          users: ["Unittest"],
          rights: { r: true, w: true, d: false, e: true, l: false },
          mode: "ADD"
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
    it("ChangeRights(obChangeRightsId2, ['Unittest'], {r: true}, 'ADD')", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeRights", {
          objId: obChangeRightsId2,
          users: ["Unittest"],
          rights: { r: true },
          mode: "ADD"
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
    it("ChangeRights(obChangeRightsId1, ['Unittest'], {r: true}, 'SET')", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeRights", {
          objId: obChangeRightsId1,
          users: ["Unittest"],
          rights: { r: true },
          mode: "SET"
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
    it("compare ACL obChangeRightsId1 obChangeRightsId2 must be equal", function (done) {
      expect(function () {
        test.Utils.compareRights(obChangeRightsId1, obChangeRightsId2).then(function success(res) {
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
    it("ChangeRights(obChangeRightsId1, andGroups: [{ groups: ['Teamleiter', 'Management'], rights: { r: true, w: true, l: true } }]", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeRights", {
          objId: obChangeRightsId1,
          andGroups: [{ groups: ["Teamleiter", "Management"], rights: { r: true, w: true, l: true } }]
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
    it("ChangeRights(obChangeRightsId2, andGroups: [{ groups: ['Teamleiter', 'Management', { type: 'GRP', key: 'UNITTEST_FIELD2' }], rights: { w: true } }, { groups: ['Bodo Kraft', 'Administrator'], rights: { l: true } }]", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeRights", {
          objId: obChangeRightsId2,
          andGroups: [{ groups: ["Teamleiter", "Management", { type: "GRP", key: "UNITTEST_FIELD2" }], rights: { w: true } },
                      { groups: ["Bodo Kraft", "Administrator"], rights: { l: true } }]
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
    it("ChangeRights(obChangeRightsId1, cleanup: { users: ['Unittest'], rights: { r: true } }", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeRights", {
          objId: obChangeRightsId1,
          cleanup: { users: ["Unittest"], rights: { r: true } }
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
    it("compare aclItems sordChangeRights1", function (done) {
      expect(function () {
        test.Utils.getSord(obChangeRightsId1).then(function success(sordChangeRights1) {
          aclItems = sordChangeRights1.aclItems;
          expect(aclItems[0].access).toEqual(19);
          expect(aclItems[0].andGroups[0].name).toEqual("Management");
          expect(aclItems[0].name).toEqual("Teamleiter");
          expect(aclItems[0].type).toEqual(0);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("compare aclItems sordChangeRights2", function (done) {
      expect(function () {
        test.Utils.getSord(obChangeRightsId2).then(function success(sordChangeRights21) {
          sordChangeRights2 = sordChangeRights21;
          aclItems = sordChangeRights2.aclItems;
          expect(aclItems[0].access).toEqual(2);
          expect(aclItems[0].andGroups[0].name).toEqual("Management");
          expect(aclItems[0].andGroups[1].name).toEqual("Administrator");
          expect(aclItems[0].name).toEqual("Teamleiter");
          expect(aclItems[0].type).toEqual(0);

          expect(aclItems[1].access).toEqual(16);
          expect(aclItems[1].andGroups[0].name).toEqual("Administrator");
          expect(aclItems[1].name).toEqual("Bodo Kraft");
          expect(aclItems[1].type).toEqual(1);

          expect(aclItems[2].access).toEqual(1);
          expect(aclItems[2].name).toEqual("Unittest");
          expect(aclItems[2].type).toEqual(1);
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