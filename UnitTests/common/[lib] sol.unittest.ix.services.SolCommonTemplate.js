
describe("[lib] sol.unittest.ix.services.SolCommonTemplate", function () {
  var objTemplateId, templateSord, objSmiley1Id, smiley1Sord,
      userName, userInfo, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonTemplate").then(function success(obSolCommonTemplateId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Template").then(function success1(templateSord1) {
          templateSord = templateSord1;
          objTemplateId = templateSord.id;
          test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Smiley1").then(function success2(smiley1Sord1) {
            smiley1Sord = smiley1Sord1;
            objSmiley1Id = smiley1Sord.id;
            userName = test.Utils.getCurrentUserName();
            test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
              userInfo = userInfo1;
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
  describe("Test Lib Functions", function () {
    describe("sol.common.Template", function () {
      it("apply", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "Hello {{name}}.",
            method: "apply",
            params: { name: "Marcus" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Hello Marcus.");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("applySord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "Name: {{sord.name}} Mapfield: {{sord.mapKeys.MAP_FIELD}}",
            method: "applySord",
            params: objTemplateId
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Name: Template Mapfield: 123");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("load", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: objTemplateId,
            method: "load",
            params: { name: "Marcus" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Hello Marcus.");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setSource", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/{{sord.mapKeys.FULLNAMESPACE}}/Configuration/{{sord.mapKeys.PACKAGE}}",
            method: "setSource",
            params: true
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:¶Business Solutions¶¶Configuration¶");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("registerCustomHelper", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{custom 'hello' name}}",
            method: "registerCustomHelper",
            params: { name: "Hans" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("hello Hans");
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

// TODO
    describe("Handlebars Helpers", function () {
      it("formatDate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{formatDate 'DD.MM.YYYY HH:mm:ss' 20001015120030}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("15.10.2000 12:00:30");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("count", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{count 'MY_COUNTER' '0000'}}",
            method: "apply",
            params: {}
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
      it("padLeft", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{padLeft 1234 '0000000000'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("0000001234");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("eachObjKey", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#eachObjKey sord.objKeys}}{{key}}: {{value}}{{/eachObjKey}}",
            method: "apply",
            params: { sord: templateSord }
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
      it("mapTable", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#mapTable sord.mapKeys indicatorKey='UNITTEST_POS_NO'}}{{UNITTEST_POS_NO}} {{UNITTEST_POS_DATA}}{{/mapTable}}",
            method: "applySord",
            params: objTemplateId
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
      it("mapFieldSum", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{mapFieldSum sord.mapKeys field='UNITTEST_POS_DATA' decimals=2}}",
            method: "applySord",
            params: objTemplateId
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("30,00");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("substring", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{substring stringProperty 0 4}}",
            method: "apply",
            params: { stringProperty: "LangerText" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Lang");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("replace", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{replace stringProperty 'Langer' 'Kurzer'}}",
            method: "apply",
            params: { stringProperty: "LangerText" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("KurzerText");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("translate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{translate 'sol.common.client.jc.webcamUtils.dialog.webcamTitle'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Take webcam picture");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("ifCond", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#ifCond 'ABC' '!=' 'DEF'}}XXX{{/ifCond}}YYY",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("XXXYYY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("ifCond", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#ifCond 'ABC' '==' 'DEF'}}XXX{{/ifCond}}YYY",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("YYY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("base64Image", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{base64Image objId='" + objSmiley1Id + "'}}",
            method: "apply",
            params: {}
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
      it("ifContains", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#ifContains 'ABCDEF' 'BC'}}XXX{{/ifContains}}YYY",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("XXXYYY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("ifContains", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#ifContains 'ABCDEF' 'XYZ'}}XXX{{/ifContains}}YYY",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("YYY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("ifKey", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#ifKey 'ABCDEF' 'ABCDEF'}}XXX{{/ifKey}}YYY",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("XXXYYY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("ifKey", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#ifKey 'ABCDEF' 'XYZ'}}XXX{{/ifKey}}YYY",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("YYY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("ifNegative", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#ifNegative '-1000'}}XXX{{/ifNegative}}YYY",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("XXXYYY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("ifNegative", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{#ifNegative '1000'}}XXX{{/ifNegative}}YYY",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("YYY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("doublecurly", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{doublecurly open}}XXX{{doublecurly}}YYY",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("{{XXX}}YYY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("text", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{text '{{XXX}}'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("{{XXX}}");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("currentUser name", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{currentUser}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(userName);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("currentUser id", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{currentUser 'id'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(String(userInfo.id));
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("currentUser guid", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{currentUser 'guid'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(userInfo.guid);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("currentUser desc", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{currentUser 'desc'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(userInfo.desc);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("userFolder name", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH:/" + userInfo.name).then(function success(userFolder) {
            test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
              source: "{{userFolder}}",
              method: "apply",
              params: {}
            }).then(function success1(jsonResult) {
              expect(jsonResult).toEqual(userFolder.guid);
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
      it("userFolder private", function (done) {
        expect(function () {
          test.Utils.getSord("OKEY:ELOINDEX=/users/private#" + userInfo.guid).then(function success(userFolder) {
            test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
              source: "{{userFolder 'private'}}",
              method: "apply",
              params: {}
            }).then(function success1(jsonResult) {
              expect(jsonResult).toEqual(userFolder.guid);
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
      it("userFolder data", function (done) {
        expect(function () {
          test.Utils.getSord("OKEY:ELOINDEX=/users/data#" + userInfo.guid).then(function success(userFolder) {
            test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
              source: "{{userFolder 'data'}}",
              method: "apply",
              params: {}
            }).then(function success1(jsonResult) {
              expect(jsonResult).toEqual(userFolder.guid);
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
      it("userFolder inbox", function (done) {
        expect(function () {
          test.Utils.getSord("OKEY:ELOINDEX=/users/inbox#" + userInfo.guid).then(function success(userFolder) {
            test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
              source: "{{userFolder 'inbox'}}",
              method: "apply",
              params: {}
            }).then(function success1(jsonResult) {
              expect(jsonResult).toEqual(userFolder.guid);
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
      it("number", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{number '10,99'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("10.99");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("abs", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{abs '2000.11'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("2000.11");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("debitCreditIndicator", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{debitCreditIndicator '-1099' 'S' 'H'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("S");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("debitCreditIndicator", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "{{debitCreditIndicator '1099' 'S' 'H'}}",
            method: "apply",
            params: {}
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("H");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });

/*
      minDate

      maxDate

      externalLink

      math

      monthName

*/


    });

// TODO
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