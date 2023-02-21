
describe("Create Meetingitempool data", function () {
  var objTempId, configAction,
      originalTimeout, meetingItemPoolDataConfig, RFs, RFfunction, RFparams,
      RFresults, i, meetingItemPools;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("create rootfolder", function () {
    it("get configuration from meetingItemPoolData.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Configuration/meetingItemPoolData.config"
        }).then(function success(configResult) {
          meetingItemPoolDataConfig = configResult.config;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("meetingItemPoolDataConfig.rootFolder must be available", function () {
      expect(meetingItemPoolDataConfig.rootFolder).toBeDefined();
    });
    it("meetingItemPoolDataConfig.meetingItemPools must be available", function () {
      expect(meetingItemPoolDataConfig.meetingItemPools).toBeDefined();
    });
    it("create rootfolder", function (done) {
      expect(function () {
        test.Utils.createPath(meetingItemPoolDataConfig.rootFolder).then(function success(objTempId1) {
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
  });
  describe("create meeting item pools", function () {
    it("start action create workflow for all meetingitempools", function (done) {
      RFs = [];
      meetingItemPools = [];
      meetingItemPoolDataConfig.meetingItemPools.forEach(function (meetingItemPool) {
        configAction = {
          $new: {
            target: {
              mode: "SELECTED"
            },
            name: "New Meeting Item Pool",
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting item pool types",
              name: "Default"
            }
          },
          $name: "CreateMeetingItemPool",
          $metadata: {
            solType: "MEETING_ITEM_POOL",
            owner: {
              fromConnection: true
            },
            objKeys: [
              {
                key: "SOL_TYPE",
                value: "MEETING_ITEM_POOL"
              },
              {
                key: "MEETING_PRODUCT_LINE",
                value: meetingItemPool.objKeys.MEETING_PRODUCT_LINE
              }
            ],
            mapItems: []
          },
          $wf: {
            template: {
              name: "sol.meeting.item.CreatePool"
            },
            name: "{{translate 'sol.meeting.itemPool.create.prefix'}}"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "REFRESH",
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
              fromDirectParent: true
            }
          },
          objId: objTempId
        };
        meetingItemPools.push(meetingItemPool);
        RFfunction = "RF_sol_common_action_Standard";
        RFparams = configAction;
        RFs.push({ function: RFfunction, params: RFparams });
      });
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteRFs", {
          RFs: RFs
        }).then(function success(jsonResult) {
          RFresults = jsonResult;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("fill meeting item pool sords", function (done) {
      i = 0;
      RFresults.forEach(function (result) {
        meetingItemPools[i].objId = result.RFresult.events[2].obj.objId;
        meetingItemPools[i].flowId = result.RFresult.events[0].obj.flowId;
        i++;
      });
      RFs = [];
      i = 0;
      meetingItemPools.forEach(function (meetingItemPool) {
        RFfunction = "RF_sol_function_Set";
        RFparams = {
          objId: meetingItemPool.objId,
          entries: [{
            type: "SORD",
            key: "desc",
            value: meetingItemPool.desc
          }, {
            type: "GRP",
            key: "MEETING_BOARD_NAME",
            value: meetingItemPool.objKeys.MEETING_BOARD_NAME
          }, {
            type: "GRP",
            key: "MEETING_BOARD_CODE",
            value: meetingItemPool.objKeys.MEETING_BOARD_CODE
          }, {
            type: "GRP",
            key: "MEETING_ITEM_POOL_NAME",
            value: meetingItemPool.objKeys.MEETING_ITEM_POOL_NAME
          }]
        };
        RFs.push({ function: RFfunction, params: RFparams });
      });
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteRFs", {
          RFs: RFs
        }).then(function success(jsonResult) {
          RFresults = jsonResult;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("finish input forwarding workflows", function (done) {
      RFs = [];
      meetingItemPools.forEach(function (meetingItemPool) {
        RFfunction = "RF_sol_unittest_meeting_service_ExecuteLib1";
        RFparams = {
          className: "sol.common.WfUtils",
          classConfig: {},
          method: "forwardWorkflow",
          params: [meetingItemPool.flowId, 2, [5]]
        };
        RFs.push({ function: RFfunction, params: RFparams });
      });
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteRFs", {
          RFs: RFs
        }).then(function success(jsonResult) {
          RFresults = jsonResult;
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});