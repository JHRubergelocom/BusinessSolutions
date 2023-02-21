
describe("[function] sol.learning.ix.functions.SetCourseCoverImage", function () {
  var coursePath, objIdCourse,
      objCoverImageBase64Id, base64Content,
      maskName, pictureName, pictureGuid,
      originalTimeout,
      photo, course, guid, photoguid;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SetCourseCoverImage").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/TitelbildBase64").then(function success1(sordCoverImageBase64) {
          objCoverImageBase64Id = sordCoverImageBase64.id;
          coursePath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Business Logic Provider";
          test.Utils.getSord(coursePath).then(function success2(sordCourse) {
            objIdCourse = sordCourse.id;
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
  describe("Get Photo", function () {
    it("load course picture", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
          objId: objCoverImageBase64Id
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
    it("get maskname, pictureName form learning.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning/Configuration/learning.config"
        }).then(function success(configResult) {
          maskName = configResult.config.entities.course.workflowMixins.coverimage.set.scriptProperties.entries[0].value.photoConfig.maskName;
          pictureName = configResult.config.entities.course.workflowMixins.coverimage.set.scriptProperties.entries[0].value.photoConfig.pictureName;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("upload course picture", function (done) {
      expect(function () {
        base64Content = base64Content.replace(/^data:image\/(jpeg|png|gif|bmp);base64,/, "");
        test.Utils.execute("RF_sol_common_document_service_UploadFile", {
          objId: objIdCourse,
          base64Content: base64Content,
          cfg: { maskName: maskName, pictureName: pictureName }
        }).then(function success(jsonResult) {
          pictureGuid = jsonResult.guid;
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
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.functions.SetCourseCoverImage", function () {
      it("copyPhotoToCourse", function (done) {
        expect(function () {
          photo = pictureGuid;
          course = objIdCourse;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetCourseCoverImage",
            classConfig: {},
            method: "copyPhotoToCourse",
            params: [photo, course]
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
      it("getObjIdFromGuid", function (done) {
        expect(function () {
          guid = pictureGuid;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetCourseCoverImage",
            classConfig: {},
            method: "getObjIdFromGuid",
            params: [guid]
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
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetCourseCoverImage",
            classConfig: { course: objIdCourse, photoguid: pictureGuid },
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
      it("setCourseCoverImage", function (done) {
        expect(function () {
          course = objIdCourse;
          photoguid = pictureGuid;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetCourseCoverImage",
            classConfig: {},
            method: "setCourseCoverImage",
            params: [course, photoguid]
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
    describe("RF_sol_visitor_function_SetCourseCoverImage", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_SetCourseCoverImage", {
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
      it("Set Photo Guid to Course", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_SetCourseCoverImage", {
            course: objIdCourse,
            photoguid: pictureGuid
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
          test.Utils.deleteSord(pictureGuid).then(function success2(deleteResult1) {
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