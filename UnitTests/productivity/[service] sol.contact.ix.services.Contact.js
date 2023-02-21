/* eslint-disable linebreak-style */

describe("[service] sol.contact.ix.services.Contact", function () {
  var objTempId, companyType, contactType, refValueCL, refValueCo,
      configAction, contactlistTypes, wfInfo, objIdCL,
      succNodes, succNodesIds, originalTimeout, config, reportTemplateSords;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Company").then(function success(objTempId1) {
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
  describe("create contactlist", function () {
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_contact_service_CheckContactListPreconditions", { targetId: objTempId }).then(function success(checkResult) {
          contactlistTypes = checkResult.types;
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
          parentId: objTempId,
          contactlistType: contactlistTypes[0].name,
          templateId: contactlistTypes[0].objId
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_contact_action_CreateContactList", configAction, []).then(function success(jsonResults) {
          test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
            wfInfo = wfInfo1;
            objIdCL = wfInfo.objId;
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
    it("fill contactlist sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordCL) {
          test.Utils.updateKeywording(sordCL, { CONTACTLIST_NAME: "Unittest CONTACT_NAME" }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordCL, [{ key: "desc", value: "Unittest desc" }]).then(function success2(updateSordResult) {
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
    it("finish workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "OK");
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
    it("get contactlist reference", function (done) {
      expect(function () {
        test.Utils.getSord(objIdCL).then(function success(sordCL) {
          refValueCL = test.Utils.getObjKeyValue(sordCL, "CONTACTLIST_REFERENCE");
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
  describe("Test Lib Functions", function () {
    describe("sol.contact.ix.services.CreateContact", function () {
      it("initialize", function (done) {
        expect(function () {
          config = { objId: objTempId };
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.CreateContact",
            classConfig: { objId: objTempId },
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
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.CreateContact",
            classConfig: { objId: objTempId },
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
    });
    describe("sol.contact.ix.services.GetContactTypes", function () {
      it("convert", function (done) {
        expect(function () {
          reportTemplateSords = [];
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.GetContactTypes",
            classConfig: {},
            method: "convert",
            params: [reportTemplateSords]
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
      it("getAllTemplates", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.GetContactTypes",
            classConfig: { objId: objTempId },
            method: "getAllTemplates",
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
            className: "sol.contact.ix.services.GetContactTypes",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.services.GetContactTypes",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_contact_service_GetCompanyTypes", function () {
      it("should receive company types without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_service_GetCompanyTypes", {
          }).then(function success(companyTypes) {
            expect(companyTypes).toBeDefined();
            expect(companyTypes.length).toBeGreaterThan(0);
            companyType = companyTypes[0].name;
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
    describe("RF_sol_contact_service_GetContactTypes", function () {
      it("should receive contact types without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_service_GetContactTypes", {
          }).then(function success(contactTypes) {
            expect(contactTypes).toBeDefined();
            expect(contactTypes.length).toBeGreaterThan(0);
            contactType = contactTypes[0].name;
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
    describe("RF_sol_contact_service_CreateContact", function () {
      it("should throw without Parameter 'contactType'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_service_CreateContact", {
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
      it("should throw without Parameter 'data'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_service_CreateContact", {
            contactType: contactType
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
      it("create company", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_service_CreateCompany", {
            companyType: companyType,
            data: [
              { type: "SORD", key: "name", value: "TMP_SERVICE" },
              { type: "GRP", key: "CONTACTLIST_REFERENCE", value: refValueCL },
              { type: "GRP", key: "COMPANY_NAME", value: "Black Sails" }
            ]
          }).then(function success(jsonResult) {
            test.Utils.getSord(jsonResult.objId).then(function success1(sordCo) {
              refValueCo = test.Utils.getObjKeyValue(sordCo, "COMPANY_REFERENCE");
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
      it("create contact", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_service_CreateContact", {
            contactType: contactType,
            data: [
              { type: "SORD", key: "name", value: "TMP_SERVICE" },
              { type: "GRP", key: "CONTACTLIST_REFERENCE", value: refValueCL },
              { type: "GRP", key: "COMPANY_REFERENCE", value: refValueCo },
              { type: "GRP", key: "CONTACT_FIRSTNAME", value: "Max" },
              { type: "GRP", key: "CONTACT_LASTNAME", value: "Mustermann" }
            ]
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