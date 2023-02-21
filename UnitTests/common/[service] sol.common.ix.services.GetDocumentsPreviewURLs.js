
describe("[service] sol.common.ix.services.GetDocumentsPreviewURLs", function () {
  var originalTimeout, objId1, objId2,
      classContext, render, data, only, startPage, endPage,
      size, idProperty, flatten, pii, acc, id, procDoc,
      opts, s;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetDocumentsPreviewURLs").then(function success(obGetDocumentsPreviewURLsId) {
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
    describe("sol.common.ix.services.GetDocumentsPreviewURLs", function () {
      it("PreviewImageInfoGenerator", function (done) {
        expect(function () {
          classContext = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "PreviewImageInfoGenerator",
            params: [classContext]
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
      it("addAnnOpts", function (done) {
        expect(function () {
          render = {};
          data = {};
          only = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "addAnnOpts",
            params: [render, data, only]
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
      it("addPageSelection", function (done) {
        expect(function () {
          startPage = 1;
          endPage = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "addPageSelection",
            params: [startPage, endPage]
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
      it("addPreviewSize", function (done) {
        expect(function () {
          size = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "addPreviewSize",
            params: [size]
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
      it("addPreviewUrlsOf", function (done) {
        expect(function () {
          idProperty = "idProperty1";
          flatten = "flatten1";
          pii = "pii1";
          acc = { id1: "" };
          id = "id1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "addPreviewUrlsOf",
            params: [idProperty, flatten, pii, acc, id]
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
      it("addProcessDocument", function (done) {
        expect(function () {
          procDoc = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "addProcessDocument",
            params: [procDoc]
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
      it("buildPreviewImageInfo", function (done) {
        expect(function () {
          opts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "buildPreviewImageInfo",
            params: [opts]
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
      it("flattenActive", function (done) {
        expect(function () {
          opts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "flattenActive",
            params: [opts]
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
      it("getPreviewURLs", function (done) {
        expect(function () {
          pii = "pii1";
          id = "id1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "getPreviewURLs",
            params: [pii, id]
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
      it("jsStr", function (done) {
        expect(function () {
          s = "s1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: {},
            method: "jsStr",
            params: [s]
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
      it("get objId smiley1", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/Smiley1"
          ).then(function success(sordSmiley1) {
            objId1 = sordSmiley1.id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get objId smiley2", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/Smiley2"
          ).then(function success(sordSmiley2) {
            objId2 = sordSmiley2.id;
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetDocumentsPreviewURLs",
            classConfig: { objIds: [objId1, objId2],
              previewSize: "tiny",
              startPage: 1,
              endPage: 2,
              flatten: true },
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
    describe("RF_sol_common_service_GetDocumentsPreviewURLs", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetDocumentsPreviewURLs", {
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
      it("get objId smiley1", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/Smiley1"
          ).then(function success(sordSmiley1) {
            objId1 = sordSmiley1.id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get objId smiley2", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/Smiley2"
          ).then(function success(sordSmiley2) {
            objId2 = sordSmiley2.id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Get a document's URL", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetDocumentsPreviewURLs", {
            objId: objId1
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Get URLs for multiple documents", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetDocumentsPreviewURLs", {
            objIds: [objId1, objId2],
            previewSize: "tiny",
            startPage: 1,
            endPage: 2,
            flatten: true
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
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