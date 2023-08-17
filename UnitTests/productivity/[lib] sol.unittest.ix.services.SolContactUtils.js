/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolContactUtils", function () {
  var originalTimeout, companyType,
      fromService, contactType, params, sord, config, objId, regPrefix,
      CompanySord, ContactSord, ContactListSord, obSolContactUtilsId,
      templateSord, contactListType;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolContactUtils").then(function success(obSolContactUtilsId1) {
        obSolContactUtilsId = obSolContactUtilsId1;
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
    describe("sol.contact.Utils", function () {
      it("buildCompanyTempName", function (done) {
        expect(function () {
          companyType = "companyType1";
          fromService = true;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "buildCompanyTempName",
            params: [companyType, fromService]
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
      it("buildContactListTempName", function (done) {
        expect(function () {
          contactListType = "contactListType1";
          fromService = true;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "buildContactListTempName",
            params: [contactListType, fromService]
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
      it("buildContactTempName", function (done) {
        expect(function () {
          contactType = "contactType1";
          fromService = true;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "buildContactTempName",
            params: [contactType, fromService]
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
      it("createCompany", function (done) {
        expect(function () {
          companyType = "Default";
          params = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "createCompany",
            params: [companyType, params]
          }).then(function success(jsonResult) {
            objId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove company ", function (done) {
        expect(function () {
          test.Utils.deleteSord(objId).then(function success(deleteResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("createContact", function (done) {
        expect(function () {
          contactType = "Default";
          params = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "createContact",
            params: [contactType, params]
          }).then(function success(jsonResult) {
            objId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove contact ", function (done) {
        expect(function () {
          test.Utils.deleteSord(objId).then(function success(deleteResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("createContactList", function (done) {
        expect(function () {
          contactListType = "Default";
          params = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "createContactList",
            params: [contactListType, params]
          }).then(function success(jsonResult) {
            objId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove contactlist ", function (done) {
        expect(function () {
          test.Utils.deleteSord(objId).then(function success(deleteResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get company sord ", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH:/Administration/Business Solutions/productivity [unit tests]/Test data/ContactList/Company").then(function success1(CompanySord1) {
            CompanySord = CompanySord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );

        }).not.toThrow();
      });
      it("getCompanyReference", function (done) {
        expect(function () {
          sord = CompanySord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getCompanyReference",
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
      it("getCompanyTemplateObjId", function (done) {
        expect(function () {
          companyType = "Default";
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getCompanyTemplateObjId",
            params: [companyType]
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
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "loadConfig",
            params: []
          }).then(function success(jsonResult) {
            config = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getConfigPart", function (done) {
        expect(function () {
          sord = CompanySord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getConfigPart",
            params: [config, sord]
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
      it("get contact sord ", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH:/Administration/Business Solutions/productivity [unit tests]/Test data/ContactList/Contact").then(function success1(ContactSord1) {
            ContactSord = ContactSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );

        }).not.toThrow();
      });
      it("getContactListTemplateObjId", function (done) {
        expect(function () {
          contactListType = "Default";
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getContactListTemplateObjId",
            params: [contactListType]
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
      it("getContactReference", function (done) {
        expect(function () {
          sord = ContactSord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getContactReference",
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
      it("getContactTemplateObjId", function (done) {
        expect(function () {
          contactType = "Default";
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getContactTemplateObjId",
            params: [contactType]
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
      it("getIdRegisterFolder", function (done) {
        expect(function () {
          objId = obSolContactUtilsId;
          regPrefix = "A";
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getIdRegisterFolder",
            params: [objId, regPrefix]
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
      it("getParentCompany", function (done) {
        expect(function () {
          objId = CompanySord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getParentCompany",
            params: [objId]
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
      it("getParentContact", function (done) {
        expect(function () {
          objId = ContactSord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getParentContact",
            params: [objId]
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
      it("getParentContactList", function (done) {
        expect(function () {
          objId = CompanySord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getParentContactList",
            params: [objId]
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
      it("getSolType", function (done) {
        expect(function () {
          sord = CompanySord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "getSolType",
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
      it("isCompany", function (done) {
        expect(function () {
          sord = CompanySord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "isCompany",
            params: [sord]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isContact", function (done) {
        expect(function () {
          sord = ContactSord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "isContact",
            params: [sord]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get contactlist sord ", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH:/Administration/Business Solutions/productivity [unit tests]/Test data/ContactList").then(function success1(ContactListSord1) {
            ContactListSord = ContactListSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );

        }).not.toThrow();
      });
      it("isContactList", function (done) {
        expect(function () {
          sord = ContactListSord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "isContactList",
            params: [sord]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isContactManagementObject", function (done) {
        expect(function () {
          sord = ContactListSord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "isContactManagementObject",
            params: [sord]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("mapData", function (done) {
        expect(function () {
          templateSord = { objKeys: ["Field1", "Field2"], mapKeys: ["Map1", "Map2"] };
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.contact.Utils",
            classConfig: {},
            method: "mapData",
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