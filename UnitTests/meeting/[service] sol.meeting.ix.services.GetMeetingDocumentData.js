
describe("[service] sol.meeting.ix.services.GetMeetingDocumentData", function () {
  var originalTimeout, objTempId, meetingBoardTypes, configTypes, configAction, wfInfo, succNodes, succNodesIds,
      objIdMB, objIdM, flowId, config, meeting,
      response, data, votings, item, wfMap, objId,
      day, itemIndex, settings, key, items;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ServicesGetMeetingDocumentData").then(function success(objTempId1) {
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
  describe("create meeting board 'default'", function () {
    it("meetingboardTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting Board types",
          maxDescLength: 255
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(meetingBoardTypes1) {
        meetingBoardTypes = meetingBoardTypes1;
        expect(meetingBoardTypes).toBeDefined();
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
              mode: "SELECTED"
            },
            name: meetingBoardTypes[0].name,
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting Board types",
              name: meetingBoardTypes[0].name
            }
          },
          $name: "CreateMeetingBoard",
          $metadata: {
            solType: "MEETING_BOARD",
            owner: {
              fromConnection: true
            },
            objKeys: [
              {
                key: "MEETING_BOARD_ORGANIZER",
                value: "{{currentUser}}"
              }
            ]
          },
          $wf: {
            template: {
              name: "sol.meeting.meetingBoard.Create"
            },
            name: "{{translate 'sol.meeting.meetingBoard.create.prefix'}}"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "GOTO",
              onWfStatus: "CREATE"
            },
            {
              id: "REFRESH",
              onWfStatus: ""
            }
          ],
          $permissions: {
            mode: "SET",
            copySource: true,
            inherit: {
              fromDirectParent: true
            }
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
    it("fill meeting Board sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordMB) {
          objIdMB = wfInfo.objId;
          test.Utils.updateKeywording(sordMB, {
            MEETING_BOARD_NAME: "Testmeetingboard",
            MEETING_BOARD_CODE: "TMB1"
          }, true).then(function success1(updateKeywordingResult) {
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
  describe("create meeting 'default'", function () {
    it("find meetingboardTypes", function (done) {
      test.Utils.execute("RF_sol_meeting_function_FindMeetingBoardTypes", {
        objId: objIdMB
      }).then(function success(meetingBoardTypes1) {
        meetingBoardTypes = meetingBoardTypes1;
        expect(meetingBoardTypes).toBeDefined();
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
          objId: objIdMB,
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: "New Meeting",
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meetings",
              name: "Default"
            }
          },
          $name: "CreateMeeting",
          $metadata: {
            solType: "MEETING",
            owner: {
              fromConnection: true
            },
            objKeys: [
              {
                key: "MEETING_BOARD_NAME",
                value: meetingBoardTypes[0].objKeys.MEETING_BOARD_NAME
              },
              {
                key: "MEETING_BOARD_REFERENCE",
                value: meetingBoardTypes[0].guid
              },
              {
                key: "MEETING_PROVIDED_PROPOSALTYPES",
                value: meetingBoardTypes[0].objKeys.MEETING_PROVIDED_PROPOSALTYPES
              },
              {
                key: "MEETING_BOARD_CODE",
                value: meetingBoardTypes[0].objKeys.MEETING_BOARD_CODE
              },
              {
                key: "MEETING_NAME",
                value: meetingBoardTypes[0].mapKeys.MEETING_BOARD_MEETING_DEFAULT_NAME
              },
              {
                key: "MEETING_MINUTE_TAKER",
                value: meetingBoardTypes[0].objKeys.MEETING_BOARD_MINUTE_TAKER
              },
              {
                key: "MEETING_PRODUCT_LINE",
                value: meetingBoardTypes[0].objKeys.MEETING_PRODUCT_LINE
              }
            ],
            mapItems: [
              {
                key: "MEETING_REGISTER_DEADLINE_SHIFT_VALUE",
                value: meetingBoardTypes[0].mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_VALUE
              },
              {
                key: "MEETING_REGISTER_DEADLINE_SHIFT_UNIT",
                value: meetingBoardTypes[0].mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_UNIT
              },
              {
                key: "MEETING_BOARD_SETTING_DEADLINES_ACTIVATE",
                value: meetingBoardTypes[0].mapKeys.MEETING_BOARD_SETTING_DEADLINES_ACTIVATE
              }
            ]
          },
          $wf: {
            template: {
              name: "sol.meeting.Create"
            },
            name: "{{translate 'sol.meeting.create.prefix'}}"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "GOTO",
              onWfStatus: "CREATED"
            },
            {
              id: "FEEDBACK",
              onWfStatus: "REPEATED",
              message: "{{translate 'sol.meeting.client.createMeeting.feedback.repeate'}}"
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
        test.Utils.getSord(wfInfo.objId).then(function success(sordM) {
          objIdM = wfInfo.objId;
          test.Utils.updateKeywording(sordM, {
            MEETING_NAME: "Testmeeting",
            MEETING_LOCATION: "Musterstadt",
            MEETING_STARTDATE: "202005051300",
            MEETING_ENDDATE: "202005071800"
          }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordM, [{ key: "desc", value: "Unittest Testmeeting" }]).then(function success2(updateSordResult) {
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
  describe("Test Lib Functions", function () {
    describe("sol.meeting.ix.services.GetMeetingDocumentData", function () {
      it("appendMeeting", function (done) {
        response = {};
        data = {};
        config = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendMeeting",
            params: [response, data, config]
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
      it("appendMeetingChild", function (done) {
        expect(function () {
          response = {};
          data = {};
          config = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendMeetingChild",
            params: [response, data, config]
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
      it("appendMeetingChildAttachments", function (done) {
        expect(function () {
          item = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendMeetingChildAttachments",
            params: [item]
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
      it("appendMeetingDayInformation", function (done) {
        expect(function () {
          meeting = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendMeetingDayInformation",
            params: [meeting]
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
      it("appendMeetingDocumentInformation", function (done) {
        expect(function () {
          meeting = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendMeetingDocumentInformation",
            params: [meeting]
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
      it("appendMeetingItems", function (done) {
        expect(function () {
          meeting = {};
          data = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendMeetingItems",
            params: [meeting, data]
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
      it("appendMeetingWfMapFields", function (done) {
        expect(function () {
          meeting = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendMeetingWfMapFields",
            params: [meeting]
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
      it("appendProposal", function (done) {
        expect(function () {
          item = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendProposal",
            params: [item]
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
      it("appendProposalAttachments", function (done) {
        expect(function () {
          item = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendProposalAttachments",
            params: [item]
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
      it("appendRenderingOptions", function (done) {
        expect(function () {
          meeting = {};
          day = {};
          itemIndex = 1;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendRenderingOptions",
            params: [meeting, day, itemIndex]
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
      it("appendVotingResult", function (done) {
        expect(function () {
          votings = [];
          meeting = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "appendVotingResult",
            params: [votings, meeting]
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
      it("findMeetingInformation", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "findMeetingInformation",
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
      it("formatFieldsForDocument", function (done) {
        expect(function () {
          item = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "formatFieldsForDocument",
            params: [item]
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "initialize",
            params: [config]
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
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
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
      it("reorderAgenda", function (done) {
        expect(function () {
          items = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "reorderAgenda",
            params: [items]
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
      it("shouldAppendAttachments", function (done) {
        expect(function () {
          settings = [];
          key = "key1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "shouldAppendAttachments",
            params: [settings, key]
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
      it("shouldAppendProposal", function (done) {
        expect(function () {
          settings = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "shouldAppendProposal",
            params: [settings]
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
      it("shouldAppendProposalAttachments", function (done) {
        expect(function () {
          settings = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "shouldAppendProposalAttachments",
            params: [settings]
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
      it("shouldIncludeAttachments", function (done) {
        expect(function () {
          settings = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "shouldIncludeAttachments",
            params: [settings]
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
      it("shouldIncludeMeetingItem", function (done) {
        expect(function () {
          wfMap = {};
          objId = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "shouldIncludeMeetingItem",
            params: [wfMap, objId]
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
      it("splitToMeetingDays", function (done) {
        expect(function () {
          meeting = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "splitToMeetingDays",
            params: [meeting]
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
      it("replaceHtmlTags", function (done) {
        expect(function () {
          data = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingDocumentData",
            classConfig: { objId: objIdM },
            method: "replaceHtmlTags",
            params: [data]
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
    describe("RF_sol_meeting_service_GetMeetingDocumentData", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", objIdM).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_GetMeetingDocumentData", {
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
      it("get meeting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_GetMeetingDocumentData", {
            objId: objIdM,
            flowId: flowId
          }).then(function success(jsonResult) {
            expect(jsonResult.meeting).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow2) {
            succNodes = test.Utils.getSuccessorNodes(workflow2, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
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