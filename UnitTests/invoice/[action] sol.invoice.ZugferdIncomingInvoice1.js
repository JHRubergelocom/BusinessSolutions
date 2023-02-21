
describe("[action] sol.invoice.ZugferdIncomingInvoice1", function () {
  var objIncomingInvoiceId, entryFolder, targetId,
      containerMode, invoiceConfig, maskId, intrayDocumentSord,
      dstMaskId, addToFullTextDatabase, archiveTargetId,
      sourceId, i, invoiceMask, templFlowId, flowName,
      invoiceFlowId, userNode, nodes, userNodeId,
      succNodes, succNodesIds, interval,
      subWorkflows, subWfs, key, subWf, subWfFlowId,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.ZugferdIncomingInvoice1", null, null).then(function success(objTempId) {
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
  describe("Rename Folder 'connector_dx' to '_connector_dx'", function () {
    it("get connector_dx folder", function (done) {
      test.Utils.getSord("ARCPATH:/Administration/Business Solutions/connector_dx").then(function success1(SordCdx) {
        test.Utils.updateSord(SordCdx, [{ key: "name", value: "_connector_dx" }]).then(function success2(updateSordResult) {
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
    });
  });
  describe("prepare incoming invoice", function () {
    it("get entry folder", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/invoice/Configuration/sol.invoice.config",
          forceReload: true
        }).then(function success(invoiceConfig1) {
          invoiceConfig = invoiceConfig1;
          expect(invoiceConfig.config).toBeDefined();
          expect(invoiceConfig.config.paths.entry.value).toBeDefined();
          entryFolder = invoiceConfig.config.paths.entry.value;
          test.Utils.getSord("ARCPATH:" + entryFolder).then(function success1(targetSord1) {
            if (!targetSord1) {
              test.Utils.createPath("ARCPATH:" + entryFolder, "Folder").then(function success2(createPathResult) {
                test.Utils.getSord("ARCPATH:" + entryFolder).then(function success3(targetSord2) {
                  targetId = targetSord2.id;
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
            } else {
              targetId = targetSord1.id;
              done();
            }
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
    it("get intray document", function (done) {
      expect(function () {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/invoice [unit tests]/Resources/ZugferdInvoiceUnittest").then(function success(intrayDocumentSord1) {
          intrayDocumentSord = intrayDocumentSord1;
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
  describe("test incoming invoice -> 'Forward for approval' -> 'Approve Cost Object' -> 'Forward to ERP'", function () {
    it("create incoming invoice container", function (done) {
      expect(function () {
        containerMode = (invoiceConfig.config.useInvoiceContainer.value === true);
        invoiceMask = invoiceConfig.config.invoiceMaskName.value;
        test.Utils.getDocMask(invoiceMask).then(function success(docMask) {
          maskId = docMask.id;
          archiveTargetId = targetId;
          if (containerMode) {
            test.Utils.createSord(targetId, invoiceMask, intrayDocumentSord.name, null, null, {
              sortOrder: "MANUAL",
              documentContainer: true
            }).then(function success1(archiveTargetId1) {
              archiveTargetId = archiveTargetId1;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          } else {
            done();
          }
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create incoming invoice document", function (done) {
      expect(function () {
        dstMaskId = containerMode ? 0 : maskId;
        addToFullTextDatabase = (invoiceConfig.config.addToFullTextDatabase && invoiceConfig.config.addToFullTextDatabase.value) ? invoiceConfig.config.addToFullTextDatabase.value : false;
        test.Utils.changeMask(intrayDocumentSord, dstMaskId).then(function success(intrayDocumentSord1) {
          intrayDocumentSord1.details.documentContainer = containerMode;
          test.Utils.checkinSord(intrayDocumentSord1).then(function success1(checkinSordResult) {
            sourceId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/invoice [unit tests]/Resources/ZugferdInvoiceUnittest";
            test.Utils.execute("RF_sol_function_CopyFolderContents", {
              objId: archiveTargetId,
              source: sourceId,
              copySourceAcl: false,
              inheritDestinationAcl: true
            }).then(function success2(jsonResult) {
              test.Utils.findChildren("ARCPATH:" + entryFolder).then(function success3(sords) {
                for (i = 0; i < sords.length; i++) {
                  if ((sords[i].name == intrayDocumentSord1.name) && (sords[i].mask == maskId)) {
                    objIncomingInvoiceId = sords[i].id;
                  }
                }
                test.Utils.getSord(objIncomingInvoiceId).then(function success4(IncomingInvoiceSord) {
                  IncomingInvoiceSord.details.fulltext = addToFullTextDatabase;
                  test.Utils.checkinSord(IncomingInvoiceSord).then(function success5(checkinSordResult1) {
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
      }).not.toThrow();
    });
    it("start invoice workflow", function (done) {
      expect(function () {
        test.Utils.getSord(objIncomingInvoiceId).then(function success(IncomingInvoiceSord) {
          templFlowId = "sol.invoice.Base";
          flowName = IncomingInvoiceSord.name;
          test.Utils.startWorkflow(templFlowId, flowName, objIncomingInvoiceId).then(function success1(flowId) {
            invoiceFlowId = flowId;
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("get active node 'Formal check/manuel recording' (id = 1) of Subworkflow 'sol.invoice.Base.FormalCheck'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(invoiceFlowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.invoice.Base.FormalCheck") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);
              if (nodes.length > 0) {
                userNode = nodes[0];
                userNodeId = userNode.id;
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 1;
          expect(userNodeId).toEqual(1);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("set invoice date, invoice number, purchase user", function (done) {
      expect(function () {
        test.Utils.getSord(objIncomingInvoiceId).then(function success(IncomingInvoiceSord) {
          test.Utils.updateKeywording(IncomingInvoiceSord, { INVOICE_DATE: "20080101", INVOICE_NUMBER: "99999", PO_PURCHASE_USER: "Administrator" }, true).then(function success1(updateKeywordingResult) {
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
    it("'Forward for approval' forwarding Subworkflow 'sol.invoice.Base.FormalCheck'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.invoice.wf.node.passOnApproval");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Forward for approval'", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("get active node 'Cost object approval' (id = 12) of Subworkflow 'sol.invoice.Base.Approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(invoiceFlowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.invoice.Base.Approval") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);
              if (nodes.length > 0) {
                userNode = nodes[0];
                userNodeId = userNode.id;
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 12;
          expect(userNodeId).toEqual(12);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Approve' forwarding Subworkflow 'sol.invoice.Base.Approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.approve");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Approve'", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("get active node 'Booking data entry' (id = 1) of Subworkflow 'sol.invoice.Base.Accounting'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(invoiceFlowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.invoice.Base.Accounting") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);
              if (nodes.length > 0) {
                userNode = nodes[0];
                userNodeId = userNode.id;
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 1;
          expect(userNodeId).toEqual(1);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Forward to ERP' forwarding Subworkflow 'sol.invoice.Base.Accounting'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.invoice.wf.node.passOntoErp");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Forward to ERP'", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("'Set Status 'booked' ('INVOICE_STATUS' = '7')", function (done) {
      expect(function () {
        test.Utils.getSord(objIncomingInvoiceId).then(function success(IncomingInvoiceSord) {
          test.Utils.updateKeywording(IncomingInvoiceSord, { INVOICE_STATUS: "7" }, true).then(function success1(updateKeywordingResult) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("setTimeout (wait for elo as)", function (done) {
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
    it("remove incoming invoice", function (done) {
      expect(function () {
        test.Utils.deleteSord(objIncomingInvoiceId).then(function success2(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove invoice workflow", function (done) {
      expect(function () {
        test.Utils.removeFinishedWorkflows([{ id: invoiceFlowId }]).then(function success2(removeFinishedWorkflowsResult) {
          done();
        }, function error(err) {
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove invoice workflow", function (done) {
      expect(function () {
        test.Utils.removeActiveWorkflows([{ id: invoiceFlowId }]).then(function success2(removeFinishedWorkflowsResult) {
          done();
        }, function error(err) {
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
  });
  describe("Rename Folder '_connector_dx' to 'connector_dx'", function () {
    it("get _connector_dx folder", function (done) {
      test.Utils.getSord("ARCPATH:/Administration/Business Solutions/_connector_dx").then(function success1(SordCdx) {
        test.Utils.updateSord(SordCdx, [{ key: "name", value: "connector_dx" }]).then(function success2(updateSordResult) {
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