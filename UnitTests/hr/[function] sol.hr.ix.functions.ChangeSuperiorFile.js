
describe("[function] sol.hr.ix.functions.ChangeSuperiorFile", function () {
  var objIdHr1, objIdHr2, objIdHr3,
      s1UserId, s1ObjId, s1Guid, s1Name,
      s2UserId, s2ObjId, s2Guid, s2Name, s2Superior, s2EloUserId,
      objIdHrA, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    s1UserId = "Administrator";
    s2UserId = "Jasmin Stamm";
    expect(function () {
      test.Utils.createTempSord("ChangeSuperiorFile").then(function success(objChangeSuperiorFileId) {
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
    describe("Create personal file test data", function () {
      it("create personnnel file Administrator", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_CreatePersonnelFileHeadless", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_FIRSTNAME: "Administrator",
                HR_PERSONNEL_LASTNAME: "Administrator",
                HR_PERSONNEL_ELOUSERID: "Administrator"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            objIdHrA = jsonResult.data.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get personalfile with userId: s1UserId ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetUsersPersonnelFile", {
            userId: s1UserId
          }).then(function success(jsonResult) {
            expect(jsonResult.objId).toBeDefined();
            s1ObjId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get guid, name userId: s1UserId ", function (done) {
        expect(function () {
          test.Utils.getSord(s1ObjId).then(function success(sordS1) {
            s1Guid = sordS1.guid;
            s1Name = sordS1.name;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get personalfile with userId: s2UserId ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetUsersPersonnelFile", {
            userId: s2UserId
          }).then(function success(jsonResult) {
            expect(jsonResult.objId).toBeDefined();
            s2ObjId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get guid, name userId: s2UserId ", function (done) {
        expect(function () {
          test.Utils.getSord(s2ObjId).then(function success(sordS2) {
            s2Guid = sordS2.guid;
            s2Name = sordS2.name;
            s2Superior = test.Utils.getObjKeyValue(sordS2, "HR_PERSONNEL_FIRSTNAME") + ", " + test.Utils.getObjKeyValue(sordS2, "HR_PERSONNEL_LASTNAME");
            s2EloUserId = test.Utils.getObjKeyValue(sordS2, "HR_PERSONNEL_ELOUSERID");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("create personnnel file hr1", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_CreatePersonnelFileHeadless", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_FIRSTNAME: "Hr1",
                HR_PERSONNEL_LASTNAME: "Hr1",
                HR_PERSONNEL_SUPERIOR_GUID: s1Guid,
                HR_PERSONNEL_SUPERIOR: s1Name
              },
              mapKeys: {
                HR_PERSONNEL_SUPERIORUSERID: s1UserId
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
      it("create personnnel file hr2", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_CreatePersonnelFileHeadless", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_FIRSTNAME: "Hr2",
                HR_PERSONNEL_LASTNAME: "Hr2",
                HR_PERSONNEL_SUPERIOR_GUID: s1Guid,
                HR_PERSONNEL_SUPERIOR: s1Name
              },
              mapKeys: {
                HR_PERSONNEL_SUPERIORUSERID: s1UserId
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
      it("create personnnel file hr3", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_CreatePersonnelFileHeadless", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_FIRSTNAME: "Hr3",
                HR_PERSONNEL_LASTNAME: "Hr3",
                HR_PERSONNEL_SUPERIOR_GUID: s2Guid,
                HR_PERSONNEL_SUPERIOR: s2Name
              },
              mapKeys: {
                HR_PERSONNEL_SUPERIORUSERID: s2UserId
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            objIdHr3 = jsonResult.data.objId;
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
    describe("RF_sol_hr_function_ChangeSuperiorFile", function () {
      it("should throw if executed without 'sourceSuperior'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_ChangeSuperiorFile", {
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
      it("should throw if executed without 'targetSuperior'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_ChangeSuperiorFile", {
            sourceSuperior: s1Guid
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
      it("change superior file", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_ChangeSuperiorFile", {
            sourceSuperior: s1Guid,
            targetSuperior: s2Guid
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
      it("Compare Values hr1", function (done) {
        expect(function () {
          test.Utils.getSord(objIdHr1).then(function success(sordHr1) {
            expect(test.Utils.getObjKeyValue(sordHr1, "HR_PERSONNEL_SUPERIOR_GUID")).toEqual(s2Guid);
            expect(test.Utils.getObjKeyValue(sordHr1, "HR_PERSONNEL_SUPERIOR")).toEqual(s2Superior);
            test.Utils.getMapValue(objIdHr1, "HR_PERSONNEL_SUPERIORUSERID").then(function success2(mapValue) {
              expect(mapValue).toEqual(s2EloUserId);
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Compare Values hr2", function (done) {
        expect(function () {
          test.Utils.getSord(objIdHr2).then(function success(sordHr2) {
            expect(test.Utils.getObjKeyValue(sordHr2, "HR_PERSONNEL_SUPERIOR_GUID")).toEqual(s2Guid);
            expect(test.Utils.getObjKeyValue(sordHr2, "HR_PERSONNEL_SUPERIOR")).toEqual(s2Superior);
            test.Utils.getMapValue(objIdHr2, "HR_PERSONNEL_SUPERIORUSERID").then(function success2(mapValue) {
              expect(mapValue).toEqual(s2EloUserId);
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
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
    describe("Remove personal file test data", function () {
      it("remove workflow personnnel file hr1", function (done) {
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
      it("remove object personnnel file hr1", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdHr1).then(function success2(deleteResult1) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflow personnnel file hr2", function (done) {
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
      it("remove object personnnel file hr2", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdHr2).then(function success2(deleteResult1) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflow personnnel file hr3", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(objIdHr3).then(function success(wfs) {
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
      it("remove object personnnel file hr3", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdHr3).then(function success2(deleteResult1) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflow personnnel file Administrator", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(objIdHrA).then(function success(wfs) {
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
      it("remove object personnnel file Administrator", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdHrA).then(function success2(deleteResult1) {
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