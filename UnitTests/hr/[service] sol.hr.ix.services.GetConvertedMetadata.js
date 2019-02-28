
describe("[service] sol.hr.ix.services.GetConvertedMetadata", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetConvertedMetadata").then(function success(objTempId) {
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
    describe("RF_sol_hr_service_GetConvertedMetadata", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetConvertedMetadata", {
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
      it("should not throw if executed with Parameter { 'mapping': [{ 'source': { 'id': 'MY_FIELD', 'type': 'GRP' }, 'target': { 'id': 'YOUR_FIELD', 'type': 'GRP' }}] }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetConvertedMetadata", {
            mapping: [{
              source: {
                id: "MY_FIELD",
                type: "GRP"
              },
              target: {
                id: "YOUR_FIELD",
                type: "GRP"
              }
            }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.id).toBeDefined();
            expect(jsonResult.id).toEqual("dataMapping");
            expect(jsonResult.dataMapping).toBeDefined();
            expect(jsonResult.dataMapping.length).toEqual(1);
            expect(jsonResult.dataMapping[0].id).toEqual("YOUR_FIELD");
            expect(jsonResult.dataMapping[0].type).toEqual("GRP");
            expect(jsonResult.dataMapping[0].value).toEqual("{{sord.objKeys.MY_FIELD}}");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter { 'mapping': [{ 'source': { 'id': 'MY_FIELD', 'type': 'GRP' }, 'target': { 'id': 'YOUR_FIELD', 'type': 'GRP', value: '{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}' }}] }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetConvertedMetadata", {
            mapping: [{
              source: {
                id: "MY_FIELD",
                type: "GRP"
              },
              target: {
                id: "YOUR_FIELD",
                type: "GRP",
                value: "{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}"
              }
            }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.id).toBeDefined();
            expect(jsonResult.id).toEqual("dataMapping");
            expect(jsonResult.dataMapping).toBeDefined();
            expect(jsonResult.dataMapping.length).toEqual(1);
            expect(jsonResult.dataMapping[0].id).toEqual("YOUR_FIELD");
            expect(jsonResult.dataMapping[0].type).toEqual("GRP");
            expect(jsonResult.dataMapping[0].value).toEqual("{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter { 'mapping': [{ 'source': { 'id': 'MY_FIELD', 'type': 'GRP' }, 'target': { 'id': 'YOUR_FIELD', 'type': 'GRP', value: '{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}' }}], 'returnRendered' : true, 'emptyNonRendered': true }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetConvertedMetadata", {
            mapping: [{
              source: {
                id: "MY_FIELD",
                type: "GRP"
              },
              target: {
                id: "YOUR_FIELD",
                type: "GRP",
                value: "{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}"
              }
            }
            ],
            returnRendered: true,
            emptyNonRendered: true
          }).then(function success(jsonResult) {
            expect(jsonResult.id).toBeDefined();
            expect(jsonResult.id).toEqual("dataMapping");
            expect(jsonResult.dataMapping).toBeDefined();
            expect(jsonResult.dataMapping.length).toEqual(1);
            expect(jsonResult.dataMapping[0].id).toEqual("YOUR_FIELD");
            expect(jsonResult.dataMapping[0].type).toEqual("GRP");
            expect(jsonResult.dataMapping[0].value).toEqual("{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}");
            expect(jsonResult.rendered).toBeDefined();
            expect(jsonResult.rendered).toEqual(true);
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