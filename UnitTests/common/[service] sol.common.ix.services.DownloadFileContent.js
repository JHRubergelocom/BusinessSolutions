
describe("[service] sol.common.ix.services.DownloadFileContent", function () {
  var originalTimeout, objTempId, strDownload, strTest,
      config, objSordDocTempId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      strDownload = "Init Document Content";
      test.Utils.createTempSord("DownloadFileContent", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    describe("sol.common.ix.services.DownloadFileContent", function () {
      it("create document", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_functions_CreateFromTemplate", {
            templateString: strDownload,
            saveToRepoConfig: { parentId: objTempId, name: "SordDoc" }
          }).then(function success(objSordDocId) {
            objSordDocTempId = objSordDocId.objId;
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.DownloadFileContent",
            classConfig: { objId: objSordDocTempId },
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.DownloadFileContent",
            classConfig: { objId: objSordDocTempId },
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
  describe("test downloadfilecontent", function () {
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_services_DownloadFileContent", {
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
    it("download file content", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_functions_CreateFromTemplate", {
          templateString: strDownload,
          saveToRepoConfig: { parentId: objTempId, name: "SordDoc" }
        }).then(function success(objSordDocId) {
          objSordDocId = objSordDocId.objId;
          test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
            objId: objSordDocId
          }).then(function success1(jsonData) {
            strTest = jsonData.content;
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
    it("strTest should be equal strDownload", function () {
      expect(strTest).toEqual(strDownload);
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