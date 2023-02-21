
describe("[action] sol.knowledge.ix.actions.CreateTestSpace", function () {
  var spaceTypes,
      configTypes, configAction, wfInfo, succNodes, succNodesIds;

  beforeAll(function () {
  });
  it("spaceTypes must be available", function (done) {
    configTypes = {
      $types: {
        path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/knowledge/Configuration/Space types"
      }
    };
    test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(spaceTypes1) {
      spaceTypes = spaceTypes1;
      expect(spaceTypes).toBeDefined();
      done();
    }, function error(err) {
      fail(err);
      console.error(err);
      done();
    }
    );
  });
  it("spaceTypes.length must greater than zero", function () {
    expect(spaceTypes.length).toBeGreaterThan(0);
  });
  describe("test finish createspace", function () {
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: "1",
          $metadata: {
            solType: "KNOWLEDGE_SPACE",
            owner: {
              fromConnection: true
            }
          },
          $wf: {
            template: {
              name: "sol.knowledge.space.create"
            },
            name: "Create Space {{formatDate 'YYYY-MM-DD HH:mm:ss'}}"
          },
          $name: "CreateSpace",
          $events: [
            {
              id: "DIALOG"
            },
            {
              id: "GOTO",
              onWfStatus: "CREATE"
            }
          ],
          $new: {
            target: {
              mode: "SELECTED"
            },
            template: {
              name: "Default",
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/knowledge/Configuration/Space types"
            }
          },
          $permissions: {
            mode: "SET",
            copySource: false,
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
    it("wfInfo.flowId must be available", function () {
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("fill space sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordSP1) {
          test.Utils.updateSord(sordSP1, [{ key: "name", value: "Jans Wissensbereich" }, { key: "desc", value: "Jans Wissensbereich" }]).then(function success1(updateSordResult) {
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
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create space");
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
  afterAll(function () {
  });
});