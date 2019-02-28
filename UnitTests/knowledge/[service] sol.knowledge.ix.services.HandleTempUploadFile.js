
describe("[service] sol.knowledge.ix.services.HandleTempUploadFile", function () {
  var objTempId, objFileId, objImageId, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("HandleTempUploadFile", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
  describe("create upload files", function () {
    it("create upload file", function (done) {
      expect(function () {
        test.Utils.copySord("ARCPATH:/Administration/Business Solutions/knowledge [unit tests]/Resources/UploadFile").then(function success(objFileId1) {
          objFileId = objFileId1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create upload image", function (done) {
      expect(function () {
        test.Utils.copySord("ARCPATH:/Administration/Business Solutions/knowledge [unit tests]/Resources/UploadImage").then(function success(objImageId1) {
          objImageId = objImageId1;
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_knowledge_service_HandleTempUploadFile", function () {
      describe("handle temp upload file", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_HandleTempUploadFile", {
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
        it("should throw if executed without 'type'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_HandleTempUploadFile", {
              objId: objFileId
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
        it("upload file", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_HandleTempUploadFile", {
              objId: objFileId,
              type: "file"
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
        it("upload image", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_HandleTempUploadFile", {
              objId: objImageId,
              type: "image"
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objFileId).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objImageId).then(function success3(deleteResult2) {
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