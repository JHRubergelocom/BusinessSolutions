
describe("[service] sol.common.ix.services.UploadFileContent", function () {
  var originalTimeout, objTempId, strUpload, strTest, strInit;

  it("should throw if executed without 'objId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_service_UploadFileContent", {
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
  describe("test uploadfilecontent", function () {
    beforeAll(function (done) {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
      expect(function () {
        strInit = "Init Document Content";
        strUpload = "Little Document Content";
        test.Utils.createTempSord("UploadFileContent", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    it("upload file content", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_functions_CreateFromTemplate", {
          templateString: strInit,
          saveToRepoConfig: { parentId: objTempId, name: "SordDoc" }
        }).then(function success(objSordDocId) {
          objSordDocId = objSordDocId.objId;
          test.Utils.execute("RF_sol_common_service_UploadFileContent", {
            objId: objSordDocId,
            content: strUpload
          }).then(function success1(jsonResult) {
            test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
              objId: objSordDocId
            }).then(function success2(jsonData) {
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
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("strTest should be equal strUpload", function () {
      expect(strTest).toEqual(strUpload);
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
});