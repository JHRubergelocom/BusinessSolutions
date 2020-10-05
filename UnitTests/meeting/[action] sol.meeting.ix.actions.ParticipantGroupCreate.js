
describe("[action] sol.meeting.ix.actions.ParticipantGroupCreate", function () {
  var objTempId, configAction, wfInfo, succNodes, succNodesIds, objIdM, objIdPG,
      originalTimeout, configTypes, meetingTypes;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.ParticipantGroupCreate", null, null).then(function success(objTempId1) {
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
  describe("test participant group create", function () {
    it("should not throw if executed without parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_action_Standard", {
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
  describe("create meeting", function () {
    it("meetingTypes must be available", function (done) {
      configTypes = {
        $types: { 
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting types", 
          maxDescLength: 255 
        } 
      };
      test.Utils.execute("RF_sol_meeting_service_GetMeetingTypes", configTypes).then(function success(meetingTypes1) {
        meetingTypes = meetingTypes1;
        expect(meetingTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objTempId,
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: meetingTypes[0].name,
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting types",
              name: meetingTypes[0].specificMeetingType
            }
          },
          $name: "CreateMeeting",
          $metadata: {
            solType: "MEETING",
            owner: {
              fromConnection: true
            }
          },
          $wf: {
            template: {
              name: "sol.meeting.CreateMeeting"
            },
            name: "{{translate 'sol.meeting.create.prefix'}}-{{formatDate 'YYYYMMDDHHmmss'}}"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "GOTO",
              onWfStatus: "CREATED"
            }
          ]
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_common_action_Standard", configAction, []).then(function success(jsonResults) {
          test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
            wfInfo = wfInfo1;
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
    it("fill meeting sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordM1) {
          objIdM = wfInfo.objId;
          test.Utils.updateKeywording(sordM1, { 
            MEETING_NAME: "Testmeeting", 
            MEETING_LOCATION: "Musterstadt",
            MEETING_STARTDATE: "202005051300",
            MEETING_ENDDATE: "202005071800"
          }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordM1, [{ key: "desc", value: "Unittest Testmeeting" }]).then(function success2(updateSordResult) {
              test.Utils.updateMapData(objIdM, { 
                MEETING_TIMESLOT_DAY1: "20200505",
                MEETING_TIMESLOT_START1: "1300", 
                MEETING_TIMESLOT_END1: "1700",
                MEETING_TIMESLOT_DAY2: "20200506",
                MEETING_TIMESLOT_START2: "1400", 
                MEETING_TIMESLOT_END2: "1600",
                MEETING_TIMESLOT_DAY3: "20200507",
                MEETING_TIMESLOT_START3: "1500", 
                MEETING_TIMESLOT_END3: "1800"
              }).then(function success3(updateMapDataResult) {
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
    it("finish input forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
    it("remove workflows", function (done) {
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
  });
  describe("test finish participantgroupcreate", function () {
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objIdM,
          $name: "CreateParticipantGroup",
          $wf: {
            template: {
              name: "sol.meeting.participantGroup.Create"
            },
            name: "Teilnehmerkreis bilden"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "FEEDBACK",
              onWfStatus: "CREATE",
              message: "{{translate 'sol.meeting.client.addParticipants.feedback.create'}}"
            },
            {
              id: "GOTO",
              onWfStatus: ""
            }
          ],
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: "Neuer Teilnehmerkreis",
            template: {
              objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/meeting/Configuration/Participant Group types/Default"
            }
          },
          $metadata: {
            solType: "PARTICIPANT_GROUP"
          }
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_common_action_Standard", configAction, []).then(function success(jsonResults) {
          test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
            wfInfo = wfInfo1;
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
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("wfInfo.flowId must be available", function () {
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("fill participant group", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordPG) {
          objIdPG = wfInfo.objId;
          test.Utils.updateKeywording(sordPG, { 
            MEETING_PARTICIPANTGROUP_NAME: "Teilnehmerkreis Unittest", 
            MEETING_PARTICIPANTGROUP_REFERENCE: "UT9999"
          }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateMapData(objIdPG, { 
              MEETING_PARTICIPANT_LASTNAME1: "Administrator",
              MEETING_PARTICIPANT_FIRSTNAME1: "Administrator",
              MEETING_PARTICIPANT_EMAIL1: "Administrator@elo.com",
              MEETING_PARTICIPANT_ELOUSER1: "0"
            }).then(function success3(updateMapDataResult) {
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
    it("finish input forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
    it("remove workflows", function (done) {
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
  });
  describe("test cancel participantgroupcreate", function () {
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objIdM,
          $name: "CreateParticipantGroup",
          $wf: {
            template: {
              name: "sol.meeting.participantGroup.Create"
            },
            name: "Teilnehmerkreis bilden"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "FEEDBACK",
              onWfStatus: "CREATE",
              message: "{{translate 'sol.meeting.client.addParticipants.feedback.create'}}"
            },
            {
              id: "GOTO",
              onWfStatus: ""
            }
          ],
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: "Neuer Teilnehmerkreis",
            template: {
              objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/meeting/Configuration/Participant Group types/Default"
            }
          },
          $metadata: {
            solType: "PARTICIPANT_GROUP"
          }          
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_common_action_Standard", configAction, []).then(function success(jsonResults) {
          test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
            wfInfo = wfInfo1;
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
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("wfInfo.flowId must be available", function () {
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("cancel input forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.cancel");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest cancel input").then(function success1(forwardWorkflowTaskResult) {
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
    it("remove workflows", function (done) {
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdM).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdPG).then(function success3(deleteResult2) {
              test.Utils.getFinishedWorkflows().then(function success4(wfs) {
                test.Utils.removeFinishedWorkflows(wfs).then(function success5(removeFinishedWorkflowsResult) {
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
});