
describe("[service] sol.meeting.ix.services.ActionCheck", function () {
  var objTempId, meetingBoardTypes, configTypes, configAction, wfInfo, succNodes, succNodesIds,
      objIdMB, objIdM, objIdMI, originalTimeout, meetingItemTypes,
      param1, param2, action, meeting, rules, mode,
      source, data;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ActionCheck").then(function success(objTempId1) {
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
  describe("create meeting item 'default'", function () {
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
              },
              {
                key: "MEETING_BOARD_NAME",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_BOARD_NAME}}}{{else}}{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{{sord.objKeys.MEETING_BOARD_NAME}}}{{/ifCond}}{{/ifCond}}"
              },
              {
                key: "MEETING_BOARD_REFERENCE",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.guid}}}{{/ifCond}}"
              },
              {
                key: "MEETING_PROVIDED_PROPOSALTYPES",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_PROVIDED_PROPOSALTYPES}}}{{/ifCond}}"
              },
              {
                key: "MEETING_ENDDATE",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_ENDDATE}}}{{/ifCond}}"
              },
              {
                key: "MEETING_STARTDATE",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_STARTDATE}}}{{/ifCond}}"
              },
              {
                key: "MEETING_BOARD_CODE",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_BOARD_CODE}}}{{else}}{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{{sord.objKeys.MEETING_BOARD_CODE}}}{{/ifCond}}{{/ifCond}}"
              },
              {
                key: "MEETING_PRODUCT_LINE",
                value: "Default"
              }
            ],
            mapItems: [
              {
                key: "MEETING_GUID",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.guid}}}{{/ifCond}}"
              },
              {
                key: "MEETING_ASSIGNMENT_CHECKED",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}1{{/ifCond}}"
              },
              {
                key: "MEETING_ITEM_POOL_NAME",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{{sord.objKeys.MEETING_ITEM_POOL_NAME}}}{{/ifCond}}"
              },
              {
                key: "MEETING_ITEM_POOL_GUID",
                value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{sord.guid}}{{/ifCond}}"
              }
            ]
          },
          $wf: {
            template: {
              name: "sol.meeting.item.Create"
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
        test.Utils.getSord(wfInfo.objId).then(function success(sordMI1) {
          objIdMI = wfInfo.objId;
          test.Utils.updateKeywording(sordMI1, {
            MEETING_ITEM_TITLE: "Thema Unittest",
            MEETING_ITEM_DURATION: "30",
            MEETING_ITEM_RESPONSIBLE_PERSON: "Administrator",
            MEETING_ITEM_SPEAKER: "Administrator"
          }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordMI1, [{ key: "desc", value: "Unittest Thema" }]).then(function success2(updateSordResult) {
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
  describe("Test Lib Functions", function () {
    describe("sol.meeting.ix.services.ActionCheck", function () {
      it("CONTAINS", function (done) {
        expect(function () {
          param1 = "param1";
          param2 = "param2";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "CONTAINS",
            params: [param1, param2]
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
      it("EQUALS", function (done) {
        expect(function () {
          param1 = "param1";
          param2 = "param2";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "EQUALS",
            params: [param1, param2]
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
      it("NOT_CONTAINS", function (done) {
        expect(function () {
          param1 = "param1";
          param2 = "param2";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "NOT_CONTAINS",
            params: [param1, param2]
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
      it("NOT_EQUALS", function (done) {
        expect(function () {
          param1 = "param1";
          param2 = "param2";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "NOT_EQUALS",
            params: [param1, param2]
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
      it("NOT_STARTSWITH", function (done) {
        expect(function () {
          param1 = "param1";
          param2 = "param2";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "NOT_STARTSWITH",
            params: [param1, param2]
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
      it("STARTSWITH", function (done) {
        expect(function () {
          param1 = "param1";
          param2 = "param2";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "STARTSWITH",
            params: [param1, param2]
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
      it("getAllowedByStatus", function (done) {
        expect(function () {
          action = {
            meeting: {
              key: "SOL_TYPE",
              value: [
                "MEETING"
              ],
              message: "{{translate 'sol.meeting.item.withdraw.meeting.missing'}}"
            },
            allowed: [
              {
                key: "{{meeting.objKeys.MEETING_STATUS}}",
                mode: "STARTSWITH",
                value: [
                  "A - ",
                  "D - "
                ],
                rules: [
                  {
                    mode: "AND",
                    rules: [
                      {
                        mode: "OR",
                        rules: [
                          {
                            key: "{{sord.ownerName}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          },
                          {
                            key: "{{sord.objKeys.MEETING_ITEM_RESPONSIBLE_PERSON}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          },
                          {
                            key: "{{sord.objKeys.MEETING_ITEM_SPEAKER}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          },
                          {
                            key: "{{meetingBoard.objKeys.MEETING_BOARD_ORGANIZER}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          }
                        ]
                      },
                      {
                        key: "{{proposal.objKeys.MEETING_PROPOSAL_STATUS}}",
                        mode: "NOT_STARTSWITH",
                        value: "I -"
                      }
                    ]
                  }
                ],
                message: "{{translate 'sol.meeting.item.withdraw.responsible'}}"
              },
              {
                key: "{{meeting.objKeys.MEETING_STATUS}}",
                mode: "STARTSWITH",
                value: "S - ",
                rules: [
                  {
                    mode: "AND",
                    rules: [
                      {
                        mode: "OR",
                        rules: [
                          {
                            key: "{{meeting.owner}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          },
                          {
                            key: "{{meetingBoard.objKeys.MEETING_BOARD_ORGANIZER}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          }
                        ]
                      },
                      {
                        key: "{{proposal.objKeys.MEETING_PROPOSAL_STATUS}}",
                        mode: "NOT_STARTS_WITH",
                        value: "I -"
                      }
                    ]
                  }
                ],
                message: "{{translate 'sol.meeting.item.withdraw.meeting.started'}}"
              }
            ]
          };
          meeting = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "getAllowedByStatus",
            params: [action, meeting]
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
      it("getMeetingBoard", function (done) {
        expect(function () {
          meeting = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "getMeetingBoard",
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
      it("getMeetingData", function (done) {
        expect(function () {
          action = {
            meeting: {
              key: "SOL_TYPE",
              value: [
                "MEETING"
              ],
              message: "{{translate 'sol.meeting.item.withdraw.meeting.missing'}}"
            }
          };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "getMeetingData",
            params: [action]
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
      it("getProposal", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "getProposal",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
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
      it("register", function (done) {
        expect(function () {
          action = {
            meeting: {
              key: "SOL_TYPE",
              value: [
                "MEETING"
              ],
              message: "{{translate 'sol.meeting.item.withdraw.meeting.missing'}}"
            },
            allowed: [
              {
                key: "{{meeting.objKeys.MEETING_STATUS}}",
                mode: "STARTSWITH",
                value: [
                  "A - ",
                  "D - "
                ],
                rules: [
                  {
                    mode: "AND",
                    rules: [
                      {
                        mode: "OR",
                        rules: [
                          {
                            key: "{{sord.ownerName}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          },
                          {
                            key: "{{sord.objKeys.MEETING_ITEM_RESPONSIBLE_PERSON}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          },
                          {
                            key: "{{sord.objKeys.MEETING_ITEM_SPEAKER}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          },
                          {
                            key: "{{meetingBoard.objKeys.MEETING_BOARD_ORGANIZER}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          }
                        ]
                      },
                      {
                        key: "{{proposal.objKeys.MEETING_PROPOSAL_STATUS}}",
                        mode: "NOT_STARTSWITH",
                        value: "I -"
                      }
                    ]
                  }
                ],
                message: "{{translate 'sol.meeting.item.withdraw.responsible'}}"
              },
              {
                key: "{{meeting.objKeys.MEETING_STATUS}}",
                mode: "STARTSWITH",
                value: "S - ",
                rules: [
                  {
                    mode: "AND",
                    rules: [
                      {
                        mode: "OR",
                        rules: [
                          {
                            key: "{{meeting.owner}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          },
                          {
                            key: "{{meetingBoard.objKeys.MEETING_BOARD_ORGANIZER}}",
                            mode: "EQUALS",
                            value: "{{currentUser}}"
                          }
                        ]
                      },
                      {
                        key: "{{proposal.objKeys.MEETING_PROPOSAL_STATUS}}",
                        mode: "NOT_STARTS_WITH",
                        value: "I -"
                      }
                    ]
                  }
                ],
                message: "{{translate 'sol.meeting.item.withdraw.meeting.started'}}"
              }
            ]
          };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "register",
            params: [action]
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
      it("resolve", function (done) {
        expect(function () {
          rules = [];
          mode = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "resolve",
            params: [rules, mode]
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
      it("template", function (done) {
        expect(function () {
          source = {};
          data = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "template",
            params: [source, data]
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
      it("withdraw", function (done) {
        expect(function () {
          action = {
            meeting: {
              key: "SOL_TYPE",
              value: [
                "MEETING"
              ],
              message: "{{translate 'sol.meeting.item.withdraw.meeting.missing'}}"
            }
          };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.ActionCheck",
            classConfig: { targetId: objIdMI, action: "register" },
            method: "withdraw",
            params: [action]
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
    describe("RF_sol_meeting_service_WithdrawMeetingItemPrecondition", function () {
      it("should throw if executed without 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_WithdrawMeetingItemPrecondition", {
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
      it("create precondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_WithdrawMeetingItemPrecondition", {
            targetId: objIdMI
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
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
    describe("RF_sol_meeting_service_RegisterMeetingItemPrecondition", function () {
      it("should throw if executed without 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_RegisterMeetingItemPrecondition", {
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
      it("create precondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_RegisterMeetingItemPrecondition", {
            targetId: objIdMI
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.msg).toBeDefined();
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
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
    }).not.toThrow();
  });
});