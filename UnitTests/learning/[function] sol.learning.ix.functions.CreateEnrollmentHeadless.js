/* eslint-disable linebreak-style */

describe("[function] sol.learning.ix.functions.CreateEnrollmentHeadless", function () {
  var objIdEnr1, objIdEnr2, originalTimeout, interval,
      courseRef1, coursePath1, courseRef2, coursePath2,
      objIdEnr4, objIdEnr3, param, key, desc, t1, fct, params,
      metaData, userName, fields, shouldGetMailFromUserUtils, cfg,
      user, entries, mask, metadataMapping, course, type, entry,
      session, sord, criteria, metaDataMapping, enrollmentId,
      mapEntries, flowName, templFlowId, objId, objIdEnr5,
      sessionParam, courseRef;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateEnrollmentHeadless").then(function success(objTempId) {
        interval = 4000;
        coursePath1 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Business Logic Provider";
        test.Utils.getSord(coursePath1).then(function success1(sordCourse1) {
          courseRef1 = test.Utils.getObjKeyValue(sordCourse1, "COURSE_REFERENCE");
          coursePath2 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course1";
          test.Utils.getSord(coursePath2).then(function success2(sordCourse2) {
            courseRef2 = test.Utils.getObjKeyValue(sordCourse2, "COURSE_REFERENCE");
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
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.functions.CancelEnrollment", function () {
      it("determineCriterion", function (done) {
        expect(function () {
          param = "param1";
          key = "key1";
          desc = "desc1";
          t1 = false;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CancelEnrollment",
            classConfig: {},
            method: "determineCriterion",
            params: [param, key, desc, t1]
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
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CancelEnrollment",
            classConfig: { guid: objIdEnr4 },
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
      it("rfAsAdm", function (done) {
        expect(function () {
          fct = "RF_unittest";
          params = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CancelEnrollment",
            classConfig: {},
            method: "rfAsAdm",
            params: [fct, params]
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
    describe("sol.learning.ix.functions.CreateEnrollmentHeadless", function () {
      it("addUserData", function (done) {
        expect(function () {
          metaData = [];
          userName = "Administrator";
          fields = [];
          shouldGetMailFromUserUtils = false;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "addUserData",
            params: [metaData, userName, fields, shouldGetMailFromUserUtils]
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
      it("createEnrollmentFromScratch", function (done) {
        expect(function () {
          cfg = { mask: "Course enrollment", type: "sol.Enrollment" };
          user = 0;
          entries = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "createEnrollmentFromScratch",
            params: [cfg, user, entries]
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
      it("createSord", function (done) {
        expect(function () {
          mask = "UnitTest";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "createSord",
            params: [mask]
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
      it("determineCriterion", function (done) {
        expect(function () {
          param = "param1";
          key = "key1";
          desc = "desc1";
          t1 = false;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "determineCriterion",
            params: [param, key, desc, t1]
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
      it("getAndPrepareEntries", function (done) {
        expect(function () {
          metadataMapping = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getAndPrepareEntries",
            params: [metadataMapping]
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
      it("getCourse", function (done) {
        expect(function () {
          courseRef = "courseRef1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getCourse",
            params: [courseRef]
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
      it("getCoursePrice", function (done) {
        expect(function () {
          courseRef = "courseRef1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getCoursePrice",
            params: [courseRef]
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
      it("getCourseType", function (done) {
        expect(function () {
          course = "course1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getCourseType",
            params: [course]
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
      it("getCurrentNumberOfParticipants", function (done) {
        expect(function () {
          sessionParam = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getCurrentNumberOfParticipants",
            params: [sessionParam]
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
      it("getEnrollment", function (done) {
        expect(function () {
          user = "Daniel Cooper";
          course = courseRef1;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {
              template: { name: "Default" },
              sordMetadata: {
                objKeys: {
                  COURSE_REFERENCE: courseRef1,
                  COURSE_ENROLLMENT_DURATION: "4",
                  COURSE_ENROLLMENT_USER: "Daniel Cooper"
                }
              }
            },
            method: "getEnrollment",
            params: [user, course]
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
      it("getEntriesOfType", function (done) {
        expect(function () {
          entries = [];
          type = "type1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getEntriesOfType",
            params: [entries, type]
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
      it("getKeyValuesFromMapEntry", function (done) {
        expect(function () {
          entry = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getKeyValuesFromMapEntry",
            params: [entry]
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
      it("getMapEntries", function (done) {
        expect(function () {
          entries = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getMapEntries",
            params: [entries]
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
      it("getMaxParticipants", function (done) {
        expect(function () {
          sessionParam = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getMaxParticipants",
            params: [sessionParam]
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
      it("getObjKeyEntries", function (done) {
        expect(function () {
          entries = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "getObjKeyEntries",
            params: [entries]
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
      it("isMailMandatory", function (done) {
        expect(function () {
          courseRef = "courseRef1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "isMailMandatory",
            params: [courseRef]
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
      it("isSessionFull", function (done) {
        expect(function () {
          session = "S99";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "isSessionFull",
            params: [session]
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
      it("persist", function (done) {
        expect(function () {
          sord = objIdEnr5;
          entries = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "persist",
            params: [sord, entries]
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
      it("prepareMetaData", function (done) {
        expect(function () {
          criteria = {
            COURSE_ENROLLMENT_USER: 0,
            COURSE_REFERENCE: "C99",
            SESSION_REFERENCE: "S99",
            COURSE_ENROLLMENT_STATUS: "S1"
          };
          metaDataMapping = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "prepareMetaData",
            params: [criteria, metaDataMapping]
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
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {
              template: { name: "Default" },
              sordMetadata: {
                objKeys: {
                  COURSE_REFERENCE: courseRef1,
                  COURSE_ENROLLMENT_DURATION: "4",
                  COURSE_ENROLLMENT_USER: "Bodo Kraft"
                }
              }
            },
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
      it("rfAsAdm", function (done) {
        expect(function () {
          fct = "RF_unittest";
          params = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "rfAsAdm",
            params: [fct, params]
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
      it("setMapEntries", function (done) {
        expect(function () {
          enrollmentId = "enrollmentId1";
          mapEntries = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "setMapEntries",
            params: [enrollmentId, mapEntries]
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
      it("setObjKeyEntries", function (done) {
        expect(function () {
          sord = {};
          entries = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "setObjKeyEntries",
            params: [sord, entries]
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
      it("setObjKeys", function (done) {
        expect(function () {
          sord = objIdEnr5;
          entry = { key: "COURSE_STATUS", value: "S1" };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "setObjKeys",
            params: [sord, entry]
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
      it("setOwner", function (done) {
        expect(function () {
          sord = {};
          user = 0;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "setOwner",
            params: [sord, user]
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
      it("setSordType", function (done) {
        expect(function () {
          sord = {};
          type = "sol.Enrollment";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "setSordType",
            params: [sord, type]
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
      it("shortFlowName", function (done) {
        expect(function () {
          flowName = "flowName1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "shortFlowName",
            params: [flowName]
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
      it("shouldCheckinMap", function (done) {
        expect(function () {
          mapEntries = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "shouldCheckinMap",
            params: [mapEntries]
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
      it("startWorkflowAsAdm", function (done) {
        expect(function () {
          templFlowId = "sol.learning.enrollment.createHeadless";
          flowName = "flowName1";
          objId = objIdEnr5;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "startWorkflowAsAdm",
            params: [templFlowId, flowName, objId]
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
      it("tryGetIxConnectAdminOrNormal", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateEnrollmentHeadless",
            classConfig: {},
            method: "tryGetIxConnectAdminOrNormal",
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_learning_function_CreateEnrollmentHeadless", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateEnrollmentHeadless", {
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
      it("create enrollment headless", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateEnrollmentHeadless", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                COURSE_REFERENCE: courseRef1,
                COURSE_ENROLLMENT_DURATION: "4",
                COURSE_ENROLLMENT_USER: "Bodo Kraft"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
            objIdEnr1 = jsonResult.data.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
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
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
      it("remove enrollment", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdEnr1).then(function success2(deleteResult) {
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
    describe("RF_sol_learning_function_CreateEnrollmentHeadlessStrict", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateEnrollmentHeadlessStrict", {
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
      it("create enrollment headless strict", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateEnrollmentHeadlessStrict", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                COURSE_REFERENCE: courseRef2,
                COURSE_ENROLLMENT_DURATION: "7"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
            objIdEnr2 = jsonResult.data.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
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
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
      it("remove enrollment", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdEnr2).then(function success2(deleteResult) {
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
    describe("RF_sol_learning_function_CancelEnrollment", function () {
      it("create enrollment headless", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateEnrollmentHeadless", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                COURSE_REFERENCE: courseRef1,
                COURSE_ENROLLMENT_DURATION: "4",
                COURSE_ENROLLMENT_USER: "Jan Eichner"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
            objIdEnr3 = jsonResult.data.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without 'guid'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CancelEnrollment", {
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
      it("cancel enrollment headless", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CancelEnrollment", {
            guid: objIdEnr3
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
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
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
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
      it("remove enrollment", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdEnr3).then(function success2(deleteResult) {
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