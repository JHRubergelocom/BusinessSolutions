
describe("[function] sol.hr.ix.functions.UpdatePersonnelFileMetadata", function () {
  var objIdHr1, objIdHr2, objGuidHr1, objGuidHr2, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UpdatePersonnelFileMetadata").then(function success(objUpdatePersonnelFileMetadataId) {
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
    describe("RF_sol_hr_function_UpdatePersonnelFileMetadata", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdatePersonnelFileMetadata", {
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
      it("create personnnel file headless", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_CreatePersonnelFileHeadless", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_FIRSTNAME: "Max",
                HR_PERSONNEL_LASTNAME: "Mustermann"
              },
              mapKeys: {
                HR_PERSONNEL_STREETADDRESS: "Schwabstrasse"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            objIdHr1 = jsonResult.data.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get guid personnnel file", function (done) {
        expect(function () {
          test.Utils.getSord(objIdHr1).then(function success(sordHr1) {
            objGuidHr1 = sordHr1.guid;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("update personnnel file", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdatePersonnelFileMetadata", {
            file: objGuidHr1,
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_POSTALCODE: "2222",
                HR_PERSONNEL_CITY: "Musterdorf"
              },
              mapKeys: {
                HR_PERSONNEL_STREETADDRESS: "Feinstrasse"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflow", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(objIdHr1).then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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
    describe("RF_sol_hr_function_UpdatePersonnelFileMetadataStrict", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdatePersonnelFileMetadataStrict", {
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
      it("create personnnel file headless strict", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_CreatePersonnelFileHeadlessStrict", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_FIRSTNAME: "Eva",
                HR_PERSONNEL_LASTNAME: "Musterfrau"
              },
              mapKeys: {
                HR_PERSONNEL_STREETADDRESS: "Musterstrasse"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            objIdHr2 = jsonResult.data.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get guid personnnel file", function (done) {
        expect(function () {
          test.Utils.getSord(objIdHr2).then(function success(sordHr2) {
            objGuidHr2 = sordHr2.guid;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("update personnnel file strict", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdatePersonnelFileMetadataStrict", {
            file: objGuidHr2,
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_POSTALCODE: "1111",
                HR_PERSONNEL_CITY: "Musterstadt"
              },
              mapKeys: {
                HR_PERSONNEL_STREETADDRESS: "Hauptstrasse"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflow", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(objIdHr2).then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdHr1).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdHr2).then(function success3(deleteResult2) {
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