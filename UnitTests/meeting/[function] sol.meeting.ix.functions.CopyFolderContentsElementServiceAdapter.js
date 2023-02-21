
describe("[function] sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter", function () {
  var objTempId, idFolder1, idFolder2, originalTimeout,
      idFoldert1, idFoldert2, elementServiceCfg, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CopyFolderContentsElementServiceAdapter").then(function success(objTempId1) {
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
    describe("sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter", function () {
      it("create foldert1", function (done) {
        expect(function () {
          test.Utils.createSord(objTempId).then(function success(idFoldert11) {
            idFoldert1 = idFoldert11;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("create foldert2", function (done) {
        expect(function () {
          test.Utils.createSord(objTempId).then(function success(idFoldert21) {
            idFoldert2 = idFoldert21;
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
          elementServiceCfg = null;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter",
            classConfig: { objId: idFoldert1, source: idFoldert2, copySourceAcl: false, inheritDestinationAcl: true, asAdmin: true },
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
          config = { objId: idFoldert1, source: idFoldert2, copySourceAcl: false, inheritDestinationAcl: true, asAdmin: true };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter",
            classConfig: { objId: idFoldert1, source: idFoldert2, copySourceAcl: false, inheritDestinationAcl: true, asAdmin: true },
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter",
            classConfig: { objId: idFoldert1, source: idFoldert2, copySourceAcl: false, inheritDestinationAcl: true, asAdmin: true },
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
    describe("RF_sol_meeting_function_CopyFolderContentsElementServiceAdapter", function () {
      it("create folder1", function (done) {
        expect(function () {
          test.Utils.createSord(objTempId).then(function success(idFolder11) {
            idFolder1 = idFolder11;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("create folder2", function (done) {
        expect(function () {
          test.Utils.createSord(objTempId).then(function success(idFolder21) {
            idFolder2 = idFolder21;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_CopyFolderContentsElementServiceAdapter", {
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
      it("copy folder contents", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_CopyFolderContentsElementServiceAdapter", {
            objId: idFolder1,
            source: idFolder2,
            copySourceAcl: false,
            inheritDestinationAcl: true     
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