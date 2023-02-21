
describe("[action] sol.recruiting.ix.actions.CreatePosting", function () {
  var objTempId, postingTypes, requisitionTypes,
      configTypes, configAction, wfInfo, succNodes, succNodesIds, objIdP1, objIdR,
      requisitionNo, requisitionName, requisitionGuid,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CreatePosting", null, null).then(function success(objTempId1) {
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
  describe("test create posting", function () {
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
    describe("create requisition", function () {
      it("requisitionTypes must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Requisition types"
          }
        };
        test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(requisitionTypes1) {
          requisitionTypes = requisitionTypes1;
          expect(requisitionTypes).toBeDefined();
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
            $name: "CreateRequisition",
            objId: objTempId,
            $metadata: {
              solType: "RECRUITING_REQUISITION",
              owner: {
                fromConnection: true
              },
              objKeys: []
            },
            $wf: {
              template: {
                key: "RECRUITING_WF"
              },
              name: "sol.recruiting.requisition.workflow.create.message"
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
            ],
            $permissions: {
              mode: "SET",
              copySource: false,
              inherit: {
                fromDirectParent: false
              }
            },
            $new: {
              target: {
                mode: "DEFAULT"
              },
              template: {
                base: "ARCPATH:/Administration/Business Solutions/recruiting/Configuration/Requisition types",
                name: requisitionTypes[0].name
              },
              name: "Temporary Requisition"
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
      it("fill requisition sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
            objIdR = wfInfo.objId;
            test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_NO: "R1", RECRUITING_REQUISITION_NAME: "MSD", RECRUITING_REQUISITION_DESC: "Master of Desaster" }, true).then(function success1(updateKeywordingResult) {
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
      it("finish workflow", function (done) {
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
          test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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
      it("get requisitionNo", function (done) {
        expect(function () {
          test.Utils.getSord(objIdR).then(function success(sordR) {
            requisitionNo = test.Utils.getObjKeyValue(sordR, "RECRUITING_REQUISITION_NO");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get requisitionName", function (done) {
        expect(function () {
          test.Utils.getSord(objIdR).then(function success(sordR) {
            requisitionName = test.Utils.getObjKeyValue(sordR, "RECRUITING_REQUISITION_NAME");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get requisitionGuid", function (done) {
        expect(function () {
          test.Utils.getSord(objIdR).then(function success(sordR) {
            requisitionGuid = sordR.guid;
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
  describe("test finish createposting", function () {
    it("postingTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Posting types"
        },
        shortenDesc: true
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(postingTypes1) {
        postingTypes = postingTypes1;
        expect(postingTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("postingTypes.length must greater than zero", function () {
      expect(postingTypes.length).toBeGreaterThan(0);
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          $name: "CreatePosting",
          objId: objTempId,
          $metadata: {
            solType: "RECRUITING_POSTING",
            owner: {
              fromConnection: true
            },
            objKeys: [
              {
                key: "RECRUITING_REQUISITION_NO",
                value: requisitionNo
              },
              {
                key: "RECRUITING_REQUISITION_NAME",
                value: requisitionName
              }
            ],
            mapItems: [
              {
                key: "RECRUITING_REQUISITION_GUID",
                value: requisitionGuid
              }
            ]
          },
          $wf: {
            template: {
              key: "RECRUITING_WF"
            },
            name: "sol.recruiting.posting.workflow.create.message"
          },
          $events: [
            {
              id: "DIALOG"
            },
            {
              id: "GOTO",
              onWfStatus: "CREATED"
            }
          ],
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: postingTypes[0].name,
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Posting types",
              name: postingTypes[0].name
            }
          },
          $permissions: {
            mode: "SET",
            copySource: false,
            inherit: {
              fromDirectParent: false
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
    it("wfInfo.flowId must be available", function () {
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("fill posting sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordP1) {
          objIdP1 = wfInfo.objId;
          test.Utils.updateKeywording(sordP1, { RECRUITING_POSTING_NO: "P1", RECRUITING_POSTING_NAME: "Chaostruppe" }, true).then(function success1(updateKeywordingResult) {
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
        test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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
  describe("test cancel createposting", function () {
    it("postingTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Posting types"
        },
        shortenDesc: true
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(postingTypes1) {
        postingTypes = postingTypes1;
        expect(postingTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("postingTypes.length must greater than zero", function () {
      expect(postingTypes.length).toBeGreaterThan(0);
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          $name: "CreatePosting",
          objId: objTempId,
          $metadata: {
            solType: "RECRUITING_POSTING",
            owner: {
              fromConnection: true
            },
            objKeys: [
              {
                key: "RECRUITING_REQUISITION_NO",
                value: requisitionNo
              },
              {
                key: "RECRUITING_REQUISITION_NAME",
                value: requisitionName
              }
            ],
            mapItems: [
              {
                key: "RECRUITING_REQUISITION_GUID",
                value: requisitionGuid
              }
            ]
          },
          $wf: {
            template: {
              key: "RECRUITING_WF"
            },
            name: "sol.recruiting.posting.workflow.create.message"
          },
          $events: [
            {
              id: "DIALOG"
            },
            {
              id: "GOTO",
              onWfStatus: "CREATED"
            }
          ],
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: postingTypes[0].name,
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Posting types",
              name: postingTypes[0].name
            }
          },
          $permissions: {
            mode: "SET",
            copySource: false,
            inherit: {
              fromDirectParent: false
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
    it("wfInfo.flowId must be available", function () {
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("fill posting sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordP2) {
          test.Utils.updateKeywording(sordP2, { RECRUITING_POSTING_NO: "P2", RECRUITING_POSTING_NAME: "Chaosclub" }, true).then(function success1(updateKeywordingResult) {
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
        test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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
          test.Utils.deleteSord(objIdP1).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdR).then(function success3(deleteResult2) {
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