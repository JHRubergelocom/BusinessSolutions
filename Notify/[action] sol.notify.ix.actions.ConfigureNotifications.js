
describe("[action] sol.notify.ix.actions.ConfigureNotifications", function () {
  var jsonResults, i,
      wfInfo, workflow, succNodes, succNodesIds, wfs;

  beforeAll(function () {
  });
  
  describe("test finish configurenotifications", function () {
    
    it("start action create workflow", function () {
      expect(function () {
        jsonResults = [];
        wfInfo = {};
        jsonResults = test.Utils.executeIxActionHandler("RF_sol_notify_action_ConfigureNotifications", {}, jsonResults);
        for (i = 0; i < jsonResults.length; i++) {
          wfInfo = test.Utils.handleEvents(jsonResults[i].events);
        }                        
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
    
    it("finish input forwarding workflow", function () {
      expect(function () {
        workflow = test.Utils.getWorkflow(wfInfo.flowId);
        succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "OK");
        succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
        test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input");
      }).not.toThrow();
    });
        
    it("remove workflows", function () {
      expect(function () {
        wfs = test.Utils.getFinishedWorkflows(wfInfo.objId);
        test.Utils.removeFinishedWorkflows(wfs);      
      }).not.toThrow();
    });

  });
    
  describe("test cancel configurenotifications", function () {
  
    it("start action create workflow", function () {
      expect(function () {        
        jsonResults = [];
        wfInfo = {};
        jsonResults = test.Utils.executeIxActionHandler("RF_sol_notify_action_ConfigureNotifications", {}, jsonResults);
        for (i = 0; i < jsonResults.length; i++) {
          wfInfo = test.Utils.handleEvents(jsonResults[i].events);
        }                        
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
    
    it("cancel input forwarding workflow", function () {
      expect(function () {
        workflow = test.Utils.getWorkflow(wfInfo.flowId);
        succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Cancel");
        succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
        test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest cancel input");
      }).not.toThrow();
    });

    it("remove workflows", function () {
      expect(function () {
        wfs = test.Utils.getFinishedWorkflows(wfInfo.objId);
        test.Utils.removeFinishedWorkflows(wfs);      
      }).not.toThrow();
    });
    
  });

  afterAll(function () {
    expect(function () {
      test.Utils.deleteSord(test.Utils.getTempfolder());
    }).not.toThrow();
  });

});