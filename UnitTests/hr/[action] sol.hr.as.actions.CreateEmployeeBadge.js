
describe("[action] sol.hr.as.actions.CreateEmployeeBadge", function () {
  var personnelFileTypes, objSmileyBase64Id, base64Content,
      configAction, wfInfo, succNodes, succNodesIds, objIdHr1,
      maskName, pictureName, pictureGuid, pictureId,
      params, dvReport, badgeTypes,
      originalTimeout, interval;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("As.Actions.CreateEmployeeBadge", null, null).then(function success(objTempId) {
        interval = 4000;
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/hr [unit tests]/Test data/SmileyBase64").then(function success1(sordSmileyBase64) {
          objSmileyBase64Id = sordSmileyBase64.id;
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
  describe("create personnelfile hr1", function () {
    it("personnelFileTypes must be available", function (done) {
      test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
        personnelFileTypes = personnelFileTypes1;
        expect(personnelFileTypes).toBeDefined();
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
          typeName: personnelFileTypes[0].name,
          typeObjId: personnelFileTypes[0].objId,
          typeSource: personnelFileTypes[0].source,
          typeSourceName: personnelFileTypes[0].sourceName
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
    it("fill personnelfile sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordHr1) {
          objIdHr1 = wfInfo.objId;
          test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_FIRSTNAME: "Bernd", HR_PERSONNEL_LASTNAME: "Stromberg", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
    it("setTimeout (wait for background job change rights)", function (done) {
      expect(function () {
        test.Utils.setTimeout(interval).then(function success(timeoutResult) {
          done();
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
  describe("capture picture employee", function () {
    it("load employee picture", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
          objId: objSmileyBase64Id
        }).then(function success1(jsonData) {
          base64Content = jsonData.content;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("start action capturepicture workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objIdHr1,
          $name: "CaptureEmployeePicture",
          $wf: {
            name: "{{translate 'sol.hr.personnel.workflow.capturepicture.message'}}",
            template: {
              name: "sol.hr.personnel.capturepicture"
            }
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "REFRESH",
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
    it("get maskName, pictureName", function () {
      expect(function () {
        maskName = "Personnel file document";
        pictureName = "Mitarbeiterfoto";
      }).not.toThrow();
    });
    it("upload employee picture", function (done) {
      expect(function () {
        base64Content = base64Content.replace(/^data:image\/(jpeg|png|gif|bmp);base64,/, "");
        test.Utils.execute("RF_sol_common_document_service_UploadFile", {
          objId: objIdHr1,
          base64Content: base64Content,
          cfg: { maskName: maskName, pictureName: pictureName }
        }).then(function success(jsonResult) {
          pictureGuid = jsonResult.guid;
          pictureId = jsonResult.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("set photoReferenceField", function (done) {
      expect(function () {
        test.Utils.getSord(objIdHr1).then(function success(sordHr1) {
          test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_PHOTO_GUID: pictureGuid }, true).then(function success1(updateKeywordingResult) {
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
    it("set photoReferenceFieldObjId", function (done) {
      expect(function () {
        test.Utils.updateMapData(objIdHr1, { HR_PERSONNEL_PHOTO_OBJID: pictureId }).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Save picture' forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest save picture").then(function success1(forwardWorkflowTaskResult) {
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
  describe("test create employeebadge", function () {
    it("get employeebadge types", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_hr_service_GetEmployeeBadgeTypes", {}).then(function success(badgeTypes1) {
          badgeTypes = badgeTypes1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("badgeTypes must be available", function () {
      expect(badgeTypes).toBeDefined();
    });
    it("badgeTypes.length must greater than zero", function () {
      expect(badgeTypes.length).toBeGreaterThan(0);
    });
    it("start as action create employeebadge", function (done) {
      expect(function () {
        params = { templateId: badgeTypes[0].objId, targetFolderId: objIdHr1, pdfName: "Mitarbeiterausweis", pdfMaskId: "Personnel file document", setKey: "HR_PERSONNEL_SECURITY_CLASSIFICATION", setValue: "N -" };
        wfInfo = {};
        test.Utils.executeASActionHandler("hr", "sol.hr.as.actions.CreatePDFByTemplate", params, []).then(function success(jsonResults) {
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
    it("report must be available", function (done) {
      test.Utils.getSord(wfInfo.objId).then(function success(sordReport) {
        expect(sordReport).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("doc.size report must be available", function (done) {
      test.Utils.getCurrentWorkVersion(wfInfo.objId).then(function success(dvReport1) {
        dvReport = dvReport1;
        expect(dvReport.size).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("doc.size report must greater than zero", function () {
      expect(dvReport.size).toBeGreaterThan(0);
    });
    it("remove workflow", function (done) {
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
          test.Utils.deleteSord(objIdHr1).then(function success2(deleteResult1) {
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
});