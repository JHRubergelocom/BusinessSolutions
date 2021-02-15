
describe("[function] sol.common.ix.functions.Set", function () {
  var originalTimeout, objSetId, sordName, sordDesc, grpField1, grpField2, grpField3, mapValue1, mapValue2, objSetChildId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      sordName = "sordName";
      sordDesc = "sordDesc";
      grpField1 = "grpField1";
      grpField2 = "grpField2";
      grpField3 = "grpField3";
      mapValue1 = "mapValue1";
      mapValue2 = "mapValue2";
      test.Utils.createTempSord("objSet").then(function success(objSetId1) {
        objSetId = objSetId1;
        test.Utils.createSord(objSetId).then(function success1(objSetChildId1) {
          objSetChildId = objSetChildId1;
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
  it("should throw if executed without 'objId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_Set", {
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
  it("should throw if executed without 'entries'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_Set", {
        objId: objSetId
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
  describe("test Set", function () {
    it("Set", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Set", {
          objId: objSetId,
          entries: [{
            type: "SORD",
            key: "name",
            value: sordName
          }, {
            type: "SORD",
            key: "desc",
            value: sordDesc
          }, {
            type: "GRP",
            key: "UNITTEST_FIELD1",
            value: grpField1
          }, {
            type: "GRP",
            key: "UNITTEST_FIELD2",
            value: grpField2
          }, {
            type: "MAP",
            key: "MAP_VALUE1",
            value: mapValue1
          }, {
            type: "MAP",
            key: "MAP_VALUE2",
            value: mapValue2
          }]
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
    it("SetParent", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Set", {
          objId: objSetChildId,
          setParent: true,
          entries: [{
            type: "GRP",
            key: "UNITTEST_FIELD3",
            value: grpField3
          }]
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
    it("Compare Values", function (done) {
      test.Utils.getSord(objSetId).then(function success(sordSet) {
        expect(sordSet.name).toEqual(sordName);
        expect(sordSet.desc).toEqual(sordDesc);
        expect(test.Utils.getObjKeyValue(sordSet, "UNITTEST_FIELD1")).toEqual(grpField1);
        expect(test.Utils.getObjKeyValue(sordSet, "UNITTEST_FIELD2")).toEqual(grpField2);
        expect(test.Utils.getObjKeyValue(sordSet, "UNITTEST_FIELD3")).toEqual(grpField3);
        test.Utils.getMapValue(objSetId, "MAP_VALUE1").then(function success1(mapValue11) {
          test.Utils.getMapValue(objSetId, "MAP_VALUE2").then(function success2(mapValue21) {
            expect(mapValue11).toEqual(mapValue1);
            expect(mapValue21).toEqual(mapValue2);
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