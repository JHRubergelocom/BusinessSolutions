
describe("[function] sol.meeting.ix.functions.CreateInvitationHeadless", function () {
  var objIdI, meetingGuid, meetingReference, originalTimeout,
      metaData, objKeys, fields, objTempId, sordId, cfg, mask,
      param, key, desc, throws, m1, meeting, sord, criteria,
      fct, params, type;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateInvitationHeadless").then(function success(objTempId1) {
        objTempId = objTempId1;
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Meeting").then(function success1(objMeetingId) {
          test.Utils.getSord(objMeetingId).then(function success2(sordMeeting) {
            meetingGuid = sordMeeting.guid;
            meetingReference = test.Utils.getObjKeyValue(sordMeeting, "MEETING_REFERENCE");
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
    describe("sol.meeting.ix.functions.CreateInvitationHeadless", function () {
      it("addParticipantData", function (done) {
        expect(function () {
          metaData = [];
          objKeys = [];
          fields = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
            classConfig: {},
            method: "addParticipantData",
            params: [metaData, objKeys, fields]
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
      it("attachMapMetaData", function (done) {
        expect(function () {
          sordId = objTempId;
          metaData = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
            classConfig: {},
            method: "attachMapMetaData",
            params: [sordId, metaData]
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
      it("createInvitationFromScratch", function (done) {
        expect(function () {
          cfg = { mask: "UnitTest", type: "" };
          metaData = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
            classConfig: {},
            method: "createInvitationFromScratch",
            params: [cfg, metaData]
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
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
          throws = null;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
            classConfig: {},
            method: "determineCriterion",
            params: [param, key, desc, throws]
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
      it("getParticipant", function (done) {
        expect(function () {
          m1 = "mail1";
          meeting = "meeting1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
            classConfig: {},
            method: "getParticipant",
            params: [m1, meeting]
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
          sord = objTempId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
            classConfig: {},
            method: "persist",
            params: [sord]
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
          criteria = { SOL_TYPE: "PARTICIPANT" };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
            classConfig: { participantData: { 
              objKeys: {
                MEETING_PARTICPANT_FIRSTNAME: "Bodo",
                MEETING_PARTICPANT_LASTNAME: "Kraft",
                MEETING_PERSON_EMAIL: "Bodo.Kraft@elo.com"
              }
            } 
            },
            method: "prepareMetaData",
            params: [criteria]
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
            classConfig: {},
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
          fct = "RF_sol_unittest_meeting_service_Test";
          params = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
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
      it("setMetaData", function (done) {
        expect(function () {
          sord = objTempId;
          metaData = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
            classConfig: {},
            method: "setMetaData",
            params: [sord, metaData]
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
          type = "";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CreateInvitationHeadless",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_function_CreateInvitationHeadless", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_CreateInvitationHeadless", {
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
      it("create Invitation", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_CreateInvitationHeadless", {
            MEETING_REFERENCE: meetingReference,      
            MEETING_GUID: meetingGuid,
            participantData: { 
              objKeys: {
                MEETING_PARTICPANT_FIRSTNAME: "Bodo",
                MEETING_PARTICPANT_LASTNAME: "Kraft",
                MEETING_PERSON_EMAIL: "Bodo.Kraft@elo.com"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            expect(jsonResult.data).toBeDefined();
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            expect(jsonResult.data.metaData).toBeDefined();
            expect(jsonResult.info).toBeDefined();
            expect(jsonResult.info).toEqual("Invitation created");
            objIdI = jsonResult.data.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(objIdI).then(function success(wfs) {
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
      it("remove invitation object", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdI).then(function success(deleteResult) {
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
    describe("RF_sol_learning_function_CreateInvitationHeadlessStrict", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_CreateInvitationHeadlessStrict", {
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
      it("create Invitation", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateInvitationHeadlessStrict", {
            MEETING_REFERENCE: meetingReference,      
            MEETING_GUID: meetingGuid,
            participantData: { 
              objKeys: {
                MEETING_PARTICPANT_FIRSTNAME: "Adrian",
                MEETING_PARTICPANT_LASTNAME: "Smith",
                MEETING_PERSON_EMAIL: "Adrian.Smith@elo.com"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            expect(jsonResult.data).toBeDefined();
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            expect(jsonResult.data.metaData).toBeDefined();
            expect(jsonResult.info).toBeDefined();
            expect(jsonResult.info).toEqual("Invitation created");
            objIdI = jsonResult.data.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(objIdI).then(function success(wfs) {
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
      it("remove invitation object", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdI).then(function success(deleteResult) {
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