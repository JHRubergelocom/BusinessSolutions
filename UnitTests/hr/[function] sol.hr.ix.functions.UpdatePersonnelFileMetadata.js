
describe("[function] sol.hr.ix.functions.UpdatePersonnelFileMetadata", function () {
  var personnelFileTypes, configAction, wfInfo, succNodes, succNodesIds,
      objIdHr1, objIdHr2, objGuidHr1, objGuidHr2, originalTimeout, interval,
      objIdHrT, objGuidHrT, file, rf, config, optimization;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UpdatePersonnelFileMetadata").then(function success(objUpdatePersonnelFileMetadataId) {
        interval = 4000;
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
    describe("sol.hr.ix.functions.UpdatePersonnelFileMetadata", function () {
      describe("create personnelfile hrT", function () {
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
            test.Utils.getSord(wfInfo.objId).then(function success(sordHrT) {
              objIdHrT = wfInfo.objId;
              test.Utils.updateKeywording(sordHrT, { HR_PERSONNEL_FIRSTNAME: "Max", HR_PERSONNEL_LASTNAME: "Mustermann", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
                test.Utils.updateMapData(objIdHrT, { HR_PERSONNEL_STREETADDRESS: "Schwabstrasse" }).then(function success3(updateMapDataResult) {
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
      it("get guid personnnel file", function (done) {
        expect(function () {
          test.Utils.getSord(objIdHrT).then(function success(sordHrT) {
            objGuidHrT = sordHrT.guid;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getTargetConfig", function (done) {
        expect(function () {
          file = objGuidHrT;
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.UpdatePersonnelFileMetadata",
            classConfig: {},
            method: "getTargetConfig",
            params: [file]
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
      it("optimizedExecute", function (done) {
        expect(function () {
          rf = "RF_sol_common_service_SordProvider";
          config = { ids: [objIdHrT], output: [{ source: { type: "SORD", key: "id" } }] };
          optimization = "";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.UpdatePersonnelFileMetadata",
            classConfig: {},
            method: "optimizedExecute",
            params: [rf, config, optimization]
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
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.UpdatePersonnelFileMetadata",
            classConfig: {
              file: objGuidHrT,
              sordMetadata: {
                objKeys: {
                  HR_PERSONNEL_POSTALCODE: "2222",
                  HR_PERSONNEL_CITY: "Musterdorf"
                },
                mapKeys: {
                  HR_PERSONNEL_STREETADDRESS: "Feinstrasse"
                }
              }                          
            },
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
      it("delete sord", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdHrT).then(function success(deleteResult) {
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
          test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_FIRSTNAME: "Max", HR_PERSONNEL_LASTNAME: "Mustermann", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateMapData(objIdHr1, { HR_PERSONNEL_STREETADDRESS: "Schwabstrasse" }).then(function success3(updateMapDataResult) {
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
  describe("create personnelfile hr2", function () {
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
        test.Utils.getSord(wfInfo.objId).then(function success(sordHr2) {
          objIdHr2 = wfInfo.objId;
          test.Utils.updateKeywording(sordHr2, { HR_PERSONNEL_FIRSTNAME: "Eva", HR_PERSONNEL_LASTNAME: "Musterfrau", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateMapData(objIdHr2, { HR_PERSONNEL_STREETADDRESS: "Musterstrasse" }).then(function success3(updateMapDataResult) {
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_hr_function_UpdatePersonnelFileMetadata", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdatePersonnelFileMetadata", {
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
      it("get guid personnnel file", function (done) {
        expect(function () {
          test.Utils.getSord(objIdHr1).then(function success(sordHr1) {
            objGuidHr1 = sordHr1.guid;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("update personnnel file", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdatePersonnelFileMetadata", {
            file: objGuidHr1,
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_POSTALCODE: "2222",
                HR_PERSONNEL_CITY: "Musterdorf"
              },
              mapKeys: {
                HR_PERSONNEL_STREETADDRESS: "Feinstrasse"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
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
    describe("RF_sol_hr_function_UpdatePersonnelFileMetadataStrict", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdatePersonnelFileMetadataStrict", {
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
      it("get guid personnnel file", function (done) {
        expect(function () {
          test.Utils.getSord(objIdHr2).then(function success(sordHr2) {
            objGuidHr2 = sordHr2.guid;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("update personnnel file strict", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdatePersonnelFileMetadataStrict", {
            file: objGuidHr2,
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_POSTALCODE: "1111",
                HR_PERSONNEL_CITY: "Musterstadt"
              },
              mapKeys: {
                HR_PERSONNEL_STREETADDRESS: "Hauptstrasse"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getActiveWorkflows().then(function success(wfs) {
            test.Utils.removeActiveWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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
          test.Utils.deleteSord(objIdHr1).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdHr2).then(function success3(deleteResult2) {
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