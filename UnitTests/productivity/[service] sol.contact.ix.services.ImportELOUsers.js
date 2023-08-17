/* eslint-disable linebreak-style */

describe("[service] sol.contact.ix.services.ImportELOUsers", function () {
  var originalTimeout, user, contactListData, contactListTemplateSord, params,
      templateSord, result, config, userInfo, objTempId, objId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Services.ImportELOUsers", null, null).then(function success(objTempId1) {
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
  describe("Test Lib Functions", function () {
    describe("sol.contact.ix.services.ImportELOUsers", function () {
      it("createContact", function (done) {
        expect(function () {
          user = {};
          contactListData = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "createContact",
            params: [user, contactListData]
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
      it("findContactById", function (done) {
        expect(function () {
          user = {};
          contactListTemplateSord = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "findContactById",
            params: [user, contactListTemplateSord]
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
      it("findContactLists", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "findContactLists",
            params: [params]
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
      it("getAllUserIds", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getAllUserIds",
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
      it("getContactConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getContactConfig",
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
      it("getContactList", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getContactList",
            params: [params]
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
      it("getContactListConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getContactListConfig",
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
      it("getContactListMetadata", function (done) {
        expect(function () {
          templateSord = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getContactListMetadata",
            params: [templateSord]
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
      it("getContactStatus", function (done) {
        expect(function () {
          user = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getContactStatus",
            params: [user]
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
      it("getImportConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getImportConfig",
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
      it("getImportContactList", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getImportContactList",
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
      it("getImportOptions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getImportOptions",
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
      it("getStatusKeyEntry", function (done) {
        expect(function () {
          user = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getStatusKeyEntry",
            params: [user]
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
      it("getUserDataMappingFields", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getUserDataMappingFields",
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
      it("getUserPropsMapping", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getUserPropsMapping",
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
      it("getUsers", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "getUsers",
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
      it("importUsers", function (done) {
        expect(function () {
          templateSord = {};
          result = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "importUsers",
            params: [templateSord, result]
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
      it("initResultObject", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "initResultObject",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
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
      it("isLockedUser", function (done) {
        expect(function () {
          userInfo = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "isLockedUser",
            params: [userInfo]
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
      it("isUnlistedUser", function (done) {
        expect(function () {
          userInfo = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "isUnlistedUser",
            params: [userInfo]
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
      it("mapUserData", function (done) {
        expect(function () {
          user = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "mapUserData",
            params: [user]
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
      it("mapUserProps", function (done) {
        expect(function () {
          user = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "mapUserProps",
            params: [user]
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
      it("prepareContactData", function (done) {
        expect(function () {
          user = {};
          contactListData = [];
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "prepareContactData",
            params: [user, contactListData]
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
      it("prepareContactList", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "prepareContactList",
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
      it("prepareSetDataForUpdate", function (done) {
        expect(function () {
          userInfo = {};
          contactListData = [];
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "prepareSetDataForUpdate",
            params: [userInfo, contactListData]
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
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
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
      it("setAdditionalMetadata", function (done) {
        expect(function () {
          objId = objTempId;
          user = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "setAdditionalMetadata",
            params: [objId, user]
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
      it("setImportKeyValue", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "setImportKeyValue",
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
      it("skipUser", function (done) {
        expect(function () {
          userInfo = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "skipUser",
            params: [userInfo]
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
      it("updateContactMetadata", function (done) {
        expect(function () {
          objId = objTempId;
          userInfo = {};
          contactListData = [];
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.ImportELOUsers",
            classConfig: {},
            method: "updateContactMetadata",
            params: [objId, userInfo, contactListData]
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
    describe("RF_sol_contact_service_GetAllUserInfos", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_service_GetAllUserInfos", {
          }).then(function success(jsonResult) {
            expect(jsonResult.userIds).toBeDefined();
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
    describe("RF_sol_contact_service_ImportELOUsers", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_service_ImportELOUsers", {
          }).then(function success(jsonResult) {
            expect(jsonResult.contactList).toBeDefined();
            expect(jsonResult.users).toBeDefined();
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