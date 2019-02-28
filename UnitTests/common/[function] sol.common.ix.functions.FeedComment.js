
describe("[function] sol.common.ix.functions.FeedComment", function () {
  var originalTimeout, objFeedId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("FeedComment", { UNITTEST_FIELD1: "Hugo", UNITTEST_FIELD2: "Egon" }, { UNITTEST_MAP1: "Bemerkung1", UNITTEST_MAP2: "Bemerkung2" }).then(function success(objFeedId1) {
        objFeedId = objFeedId1;
        test.Utils.getSord(objFeedId).then(function success1(sordFeedId) {
          test.Utils.setObjKeyValues(sordFeedId, "UNITTEST_FIELD3", ["Topic1", "Topic2", "Topic3"]);
          test.Utils.checkinSord(sordFeedId).then(function success2(checkinSordResult) {
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
  it("should throw if executed without 'objId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_FeedComment", {
        file: "sol.dev.unittest",
        key: "should throw if executed without 'objId'"
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
  it("should throw if executed without 'key'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_FeedComment", {
        objId: objFeedId,
        file: "sol.dev.unittest"
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
  it("should not throw if executed with 'objId' und 'key'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_FeedComment", {
        objId: objFeedId,
        file: "sol.dev.unittest",
        key: "should not throw if executed with 'objId' und 'key'"
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
  describe("test cases feedcomments with single value data", function () {
    it("simple text", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.SIMPLETEXT"
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
    it("simple text with data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.SIMPLETEXT.DATA",
          data: ["UNITTEST_FIELD1", "UNITTEST_FIELD2"]
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
    it("http text", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT"
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
    it("http text with data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT.DATA",
          data: ["UNITTEST_FIELD1", "UNITTEST_FIELD2"]
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
    it("http text with sord/grp data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT.DATA",
          data: [{ type: "SORD", key: "name" }, { type: "GRP", key: "UNITTEST_FIELD1" }]
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
    it("http text with grp/map data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT.DATA",
          data: [{ type: "GRP", key: "UNITTEST_FIELD1" }, { type: "MAP", key: "UNITTEST_MAP1" }]
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
    it("text without language", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          text: "hat ein Dokument {0} mit Inhalt {1} angelegt",
          data: ["Test", "xyz"]
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
    it("simple text with data in eloFormat 'hashtag'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.SIMPLETEXT.DATA",
          data: [{ type: "GRP", key: "UNITTEST_FIELD1", eloFormat: "hashtag" }, { type: "GRP", key: "UNITTEST_FIELD2", eloFormat: "hashtag" }]
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
  describe("test cases feedcomments with single multiple value data", function () {
    it("simple text", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.SIMPLETEXT"
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
    it("simple text with data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.SIMPLETEXT.DATA",
          data: ["UNITTEST_FIELD1", "UNITTEST_FIELD3"]
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
    it("http text", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT"
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
    it("http text with data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT.DATA",
          data: ["UNITTEST_FIELD1", "UNITTEST_FIELD3"]
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
    it("http text with sord/grp data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT.DATA",
          data: [{ type: "SORD", key: "name" }, { type: "GRP", key: "UNITTEST_FIELD1" }]
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
    it("http text with grp/map data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT.DATA",
          data: [{ type: "GRP", key: "UNITTEST_FIELD1" }, { type: "MAP", key: "UNITTEST_MAP1" }]
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
    it("text without language", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          text: "hat ein Dokument {0} mit Inhalt {1} angelegt",
          data: ["Test", "xyz"]
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
    it("simple text with data in eloFormat 'hashtag'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.SIMPLETEXT.DATA",
          data: [{ type: "GRP", key: "UNITTEST_FIELD1", eloFormat: "hashtag" }, { type: "GRP", key: "UNITTEST_FIELD3", eloFormat: "hashtag" }]
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
  describe("test cases feedcomments with invalid data", function () {
    it("simple text with invalid data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.SIMPLETEXT.DATA",
          data: ["UNITTEST_FIELD4", "UNITTEST_FIELD5"]
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
    it("http text with invalid data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT.DATA",
          data: ["UNITTEST_FIELD4", "UNITTEST_FIELD5"]
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
    it("http text with invalid sord/grp data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT.DATA",
          data: [{ type: "SORD", key: "name4" }, { type: "GRP", key: "UNITTEST_FIELD4" }]
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
    it("http text with invalid grp/map data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FeedComment", {
          objId: objFeedId,
          file: "sol.dev.unittest",
          key: "UNITTEST.HTTPTEXT.DATA",
          data: [{ type: "GRP", key: "UNITTEST_FIELD4" }, { type: "MAP", key: "UNITTEST_MAP4" }]
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