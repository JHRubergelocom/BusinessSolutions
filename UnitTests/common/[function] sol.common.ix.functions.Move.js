
describe("[function] sol.common.ix.functions.Move", function () {
  var originalTimeout, objTempId, targetPath,
      objSourceId1, objSourceId2, objSourceId3, objSourceId4, objSourceId5, pathSourceId6, objTargetId,
      objRefId31, objRefId32, objRefId33,
      refpath31, refpath32, refpath33, refpath51, refpath52, refpath53, refpath54,
      refpathTemp, refpath2, refpath6,
      pathRefId51, pathRefId52, pathRefId53, pathRefId54,
      refpath61, refpath62, refpath63,
      objRefId61, objRefId62, objRefId63,
      objTempT1Id, objTempT2Id, elementServiceCfg, config, path;


  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Move").then(function success(objTempId1) {
        objTempId = objTempId1;
        test.Utils.createSord(objTempId, null, "Source1").then(function success1(objSourceId11) {
          objSourceId1 = objSourceId11;
          test.Utils.createSord(objTempId, null, "Source2").then(function success2(objSourceId21) {
            objSourceId2 = objSourceId21;
            test.Utils.createSord(objTempId, null, "Source3").then(function success3(objSourceId31) {
              objSourceId3 = objSourceId31;
              test.Utils.createSord(objTempId, null, "Source4").then(function success4(objSourceId41) {
                objSourceId4 = objSourceId41;
                test.Utils.createSord(objTempId, null, "Source5").then(function success5(objSourceId51) {
                  objSourceId5 = objSourceId51;
                  test.Utils.createSord(objTempId, null, "Source6").then(function success6(objSourceId6) {
                    pathSourceId6 = test.Utils.TESTTEMPFOLDER + "/Move/Source6";
                    test.Utils.createSord(objTempId, null, "Ref31").then(function success7(objRefId311) {
                      objRefId31 = objRefId311;
                      test.Utils.createSord(objTempId, null, "Ref32").then(function success8(objRefId321) {
                        objRefId32 = objRefId321;
                        test.Utils.createSord(objTempId, null, "Ref33").then(function success9(objRefId331) {
                          objRefId33 = objRefId331;
                          test.Utils.createSord(objTempId, null, "Ref51").then(function success10(objRefId51) {
                            test.Utils.createSord(objTempId, null, "Ref52").then(function success11(objRefId52) {
                              test.Utils.createSord(objTempId, null, "Ref53").then(function success12(objRefId53) {
                                test.Utils.createSord(objTempId, null, "Ref54").then(function success13(objRefId54) {
                                  pathRefId51 = test.Utils.TESTTEMPFOLDER + "/Move/Ref51";
                                  pathRefId52 = test.Utils.TESTTEMPFOLDER + "/Move/Ref52";
                                  pathRefId53 = test.Utils.TESTTEMPFOLDER + "/Move/Ref53";
                                  pathRefId54 = test.Utils.TESTTEMPFOLDER + "/Move/Ref54";
                                  test.Utils.createSord(objTempId, null, "Ref61").then(function success14(objRefId611) {
                                    objRefId61 = objRefId611;
                                    test.Utils.createSord(objTempId, null, "Ref62").then(function success15(objRefId621) {
                                      objRefId62 = objRefId621;
                                      test.Utils.createSord(objTempId, null, "Ref63").then(function success16(objRefId631) {
                                        objRefId63 = objRefId631;
                                        test.Utils.createSord(objTempId, null, "Target").then(function success17(objTargetId1) {
                                          objTargetId = objTargetId1;
                                          targetPath = test.Utils.TESTTEMPFOLDER + "/Move/Target";
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
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.functions.Move", function () {
      it("create sord temp1", function (done) {
        expect(function () {
          test.Utils.createTempSord("Temp1").then(function success(objTempT1Id1) {
            objTempT1Id = objTempT1Id1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("create sord temp2", function (done) {
        expect(function () {
          test.Utils.createTempSord("Temp2").then(function success(objTempT2Id1) {
            objTempT2Id = objTempT2Id1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("findByElementService", function (done) {
        expect(function () {
          elementServiceCfg = { name: "RF_sol_unittest_service_ExecuteLib", args: { className: "sol.common.RepoUtils", classConfig: {}, method: "getSord", params: [objTempT1Id, {}] } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Move",
            classConfig: { objId: objTempT1Id, targetId: objTempT2Id },
            method: "findByElementService",
            params: [elementServiceCfg]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Move",
            classConfig: { objId: objTempT1Id, targetId: objTempT2Id },
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
      it("isValidPath", function (done) {
        expect(function () {
          path = "path1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Move",
            classConfig: { objId: objTempT1Id, targetId: objTempT2Id },
            method: "isValidPath",
            params: [path]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Move",
            classConfig: { objId: objTempT1Id, targetId: objTempT2Id },
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
  describe("move folder contents", function () {
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Move", {
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
    it("should throw if executed without 'path' or 'targetId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Move", {
          objId: 0,
          refOldParentId: true
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
    it("move objSourceId1 to targetPath should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Move", {
          objId: objSourceId1,
          path: targetPath
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
    it("parentId objSourceId1 equal to objTargetId", function (done) {
      expect(function () {
        test.Utils.getSord(objSourceId1).then(function success(sordS1) {
          expect(sordS1.parentId).toEqual(objTargetId);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("move objSourceId4 to objTargetId should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Move", {
          objId: objSourceId4,
          targetId: objTargetId
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
    it("parentId objSourceId4 equal to objTargetId", function (done) {
      expect(function () {
        test.Utils.getSord(objSourceId4).then(function success(sordS4) {
          expect(sordS4.parentId).toEqual(objTargetId);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("move objSourceId2 to targetPath with refOldParentId should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Move", {
          objId: objSourceId2,
          path: targetPath,
          refOldParentId: true
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
    it("parentId objSourceId2 equal to objTargetId", function (done) {
      expect(function () {
        test.Utils.getSord(objSourceId2).then(function success(sordS2) {
          expect(sordS2.parentId).toEqual(objTargetId);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("reference objSourceId2 to objTempId must exist", function (done) {
      expect(function () {
        test.Utils.getSord(objSourceId2).then(function success(sordS2) {
          test.Utils.getSord(objTempId).then(function success1(sordTemp) {
            refpathTemp = sordTemp.refPaths[0].pathAsString;
            refpath2 = sordS2.refPaths[1].pathAsString;
            expect(refpath2).toEqual(refpathTemp + "¶Move");
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
    it("set references to objSourceId3 should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Move", {
          objId: objSourceId3,
          referenceIds: [objRefId31, objRefId32, objRefId33]
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
    it("references objRefId31, objRefId32, objRefId33 to objSourceId3 must exist", function (done) {
      expect(function () {
        test.Utils.getSord(objSourceId3).then(function success(sordS3) {
          test.Utils.getSord(objTempId).then(function success1(sordTemp) {
            refpathTemp = sordTemp.refPaths[0].pathAsString;
            refpath31 = sordS3.refPaths[1].pathAsString;
            refpath32 = sordS3.refPaths[2].pathAsString;
            refpath33 = sordS3.refPaths[3].pathAsString;
            expect(refpath31).toEqual(refpathTemp + "¶Move¶Ref31");
            expect(refpath32).toEqual(refpathTemp + "¶Move¶Ref32");
            expect(refpath33).toEqual(refpathTemp + "¶Move¶Ref33");
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
    it("set references to objSourceId5 should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Move", {
          objId: objSourceId5,
          referencePaths: [pathRefId51, pathRefId52, pathRefId53, pathRefId54]
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
    it("references pathRefId51, pathRefId52, pathRefId53, pathRefId54 to objSourceId5 must exist", function (done) {
      expect(function () {
        test.Utils.getSord(objSourceId5).then(function success(sordS5) {
          test.Utils.getSord(objTempId).then(function success1(sordTemp) {
            refpathTemp = sordTemp.refPaths[0].pathAsString;
            refpath51 = sordS5.refPaths[1].pathAsString;
            refpath52 = sordS5.refPaths[2].pathAsString;
            refpath53 = sordS5.refPaths[3].pathAsString;
            refpath54 = sordS5.refPaths[4].pathAsString;
            expect(refpath51).toEqual(refpathTemp + "¶Move¶Ref51");
            expect(refpath52).toEqual(refpathTemp + "¶Move¶Ref52");
            expect(refpath53).toEqual(refpathTemp + "¶Move¶Ref53");
            expect(refpath54).toEqual(refpathTemp + "¶Move¶Ref54");
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
    it("move objSourceId6 to targetPath with refOldParentId and set references should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Move", {
          objId: pathSourceId6,
          path: targetPath,
          refOldParentId: true,
          referenceIds: [objRefId61, objRefId62, objRefId63]
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
    it("parentId objSourceId6 equal to objTargetId", function (done) {
      expect(function () {
        test.Utils.getSord(pathSourceId6).then(function success(sordS6) {
          expect(sordS6.parentId).toEqual(objTargetId);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("reference objSourceId6 to objTempId must exist", function (done) {
      expect(function () {
        test.Utils.getSord(pathSourceId6).then(function success(sordS6) {
          test.Utils.getSord(objTempId).then(function success1(sordTemp) {
            refpathTemp = sordTemp.refPaths[0].pathAsString;
            refpath6 = sordS6.refPaths[1].pathAsString;
            expect(refpath6).toEqual(refpathTemp + "¶Move¶Ref61");
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
    it("references objRefId61, objRefId62, objRefId63 to objSourceId6 must exist", function (done) {
      expect(function () {
        test.Utils.getSord(pathSourceId6).then(function success(sordS6) {
          test.Utils.getSord(objTempId).then(function success1(sordTemp) {
            refpathTemp = sordTemp.refPaths[0].pathAsString;
            refpath61 = sordS6.refPaths[2].pathAsString;
            refpath62 = sordS6.refPaths[3].pathAsString;
            refpath63 = sordS6.refPaths[4].pathAsString;
            expect(refpath61).toEqual(refpathTemp + "¶Move¶Ref62");
            expect(refpath62).toEqual(refpathTemp + "¶Move¶Ref63");
            expect(refpath63).toEqual(refpathTemp + "¶Move");
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