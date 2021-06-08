
describe("[action] sol.meeting.ix.actions.MeetingApproval", function () {
  var objTempId, configAction, wfInfo, succNodes, succNodesIds, objIdM, objIdMI,
      originalTimeout, configTypes, meetingTypes, meetingItemTypes;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.MeetingApproval", null, null).then(function success(objTempId1) {
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
  describe("test item withdraw", function () {
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
  describe("create meeting item", function () {
    it("meetingItemTypes must be available", function (done) {
      configTypes = {
        $types: { 
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting item types", 
          maxDescLength: 255 
        } 
      };
      test.Utils.execute("RF_sol_meeting_service_GetMeetingItemTypes", configTypes).then(function success(meetingItemTypes1) {
        meetingItemTypes = meetingItemTypes1;
        expect(meetingItemTypes).toBeDefined();
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
          objId: objIdM,
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: meetingItemTypes[0].name,
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting item types",
              name: meetingItemTypes[0].specificMeetingItemType
            }
          },
          $name: "CreateMeetingItem",
          $metadata: {
            solType: "MEETING_ITEM",
            owner: {
              fromConnection: true
            },
            objKeys: [
              {
                key: "MEETING_REFERENCE",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_REFERENCE}}}{{/ifCond}}"
              },
              {
                key: "MEETING_NAME",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_NAME}}}{{/ifCond}}"
              }
            ],
            mapItems: [
              {
                key: "MEETING_GUID",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.guid}}}{{/ifCond}}"
              }
            ]
          },
          $wf: {
            template: {
              name: "sol.meeting.item.create"
            },
            name: "{{translate 'sol.meeting.item.create.prefix'}}-{{formatDate 'YYYYMMDDHHmmss'}}"
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
    it("fill meeting item", function (done) {
      expect(function () {
        objIdMI = wfInfo.objId;
        test.Utils.getSord(wfInfo.objId).then(function success(sordMI1) {
          test.Utils.updateKeywording(sordMI1, { 
            MEETING_ITEM_TITLE: "Tagesordnungspunkt Unittest",
            MEETING_ITEM_DURATION: "30",
            MEETING_ITEM_RESPONSIBLE_PERSON: "Administrator",
            MEETING_ITEM_SPEAKER: "Administrator"
          }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordMI1, [{ key: "desc", value: "Unittest Tagesordnungspunkt" }]).then(function success2(updateSordResult) {
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
        done();
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
  describe("test finish meetingapproval", function () {
    it("check precondition meeting approval", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_meeting_service_MeetingApprovalPreCondition", { targetId: objIdMI }).then(function success(checkResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objIdMI,
          $name: "MeetingApproval",
          $wf: {
            template: {
              name: "sol.meeting.ApproveMeetings"
            },
            name: "{{translate 'sol.meeting.client.ribbon.btnApproveMeetings'}}"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "REFRESH",
              onWfStatus: ""
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
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("wfInfo.flowId must be available", function () {
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("fill withdraw item", function (done) {
      expect(function () {
        objIdMI = wfInfo.objId;
        test.Utils.updateWfMapData(wfInfo.flowId, wfInfo.objId, { 
          MEETING_PARTICIPANT_LASTNAME1: "Administrator",
          MEETING_PARTICIPANT_FIRSTNAME1: "Administrator",
          MEETING_PARTICIPANT_EMAIL1: "Administrator@elo.com",
          MEETING_PARTICIPANT_ROLE1: "Administrator Role",
          MEETING_PARTICIPANT_INVITATIONS_STATUS1: "INVITED"
        }).then(function success(updateWfMapDataResult) {
          done();
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
  describe("test cancel meetingapproval", function () {
    it("check precondition  meeting approval", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_meeting_service_MeetingApprovalPreCondition", { targetId: objIdMI }).then(function success(checkResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objIdMI,
          $name: "MeetingApproval",
          $wf: {
            template: {
              name: "sol.meeting.ApproveMeetings"
            },
            name: "{{translate 'sol.meeting.client.ribbon.btnApproveMeetings'}}"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "REFRESH",
              onWfStatus: ""
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
            test.Utils.deleteSord(objIdMI).then(function success3(deleteResult2) {
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