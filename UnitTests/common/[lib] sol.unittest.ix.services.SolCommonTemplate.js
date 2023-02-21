/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonTemplate", function () {
  var objTemplateId, templateSord, objSmiley1Id, smiley1Sord,
      userName, userInfo, originalTimeout,
      source, isRepoPath, config, nowDate;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonTemplate").then(function success(obSolCommonTemplateId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/ActionBase").then(function success1(templateSord1) {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "Hello {{name}}." },
            method: "apply",
            params: [{ name: "Marcus" }]
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
      it("apply with repopath", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/{{sord.mapKeys.FULLNAMESPACE}}/Configuration/{{sord.mapKeys.PACKAGE}}", isRepoPath: true },
            method: "apply",
            params: []
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
      it("applySord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "Name: {{sord.name}} Mapfield: {{sord.mapKeys.MAP_FIELD}}" },
            method: "applySord",
            params: [objTemplateId]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Name: ActionBase Mapfield: 123");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("compile", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "Hello {{name}}." },
            method: "compile",
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
      it("getResult", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: {},
            method: "getResult",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: {},
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
      it("load", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: {},
            method: "load",
            params: [objTemplateId]
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
      it("setSource", function (done) {
        expect(function () {
          source = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/{{sord.mapKeys.FULLNAMESPACE}}/Configuration/{{sord.mapKeys.PACKAGE}}";
          isRepoPath = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: {},
            method: "setSource",
            params: [source, isRepoPath]
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
      it("registerCustomHelper 'hello'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: {},
            method: "registerCustomHelper",
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
      it("apply 'hello'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{custom 'hello' name}}" },
            method: "apply",
            params: [{ name: "Hans" }]
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
    describe("Handlebars Helpers", function () {
      it("formatDate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{formatDate 'DD.MM.YYYY HH:mm:ss' 20001015120030}}" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{count 'MY_COUNTER' '0000'}}" },
            method: "apply",
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
      it("padLeft", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{padLeft 1234 '0000000000'}}" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#eachObjKey sord.objKeys}}{{key}}: {{value}}{{/eachObjKey}}" },
            method: "apply",
            params: [{ sord: templateSord }]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#mapTable sord.mapKeys indicatorKey='UNITTEST_POS_NO'}}{{UNITTEST_POS_NO}} {{UNITTEST_POS_DATA}}{{/mapTable}}" },
            method: "applySord",
            params: [objTemplateId]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{mapFieldSum sord.mapKeys field='UNITTEST_POS_DATA' decimals=2}}" },
            method: "applySord",
            params: [objTemplateId]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{substring stringProperty 0 4}}" },
            method: "apply",
            params: [{ stringProperty: "LangerText" }]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{replace stringProperty 'Langer' 'Kurzer'}}" },
            method: "apply",
            params: [{ stringProperty: "LangerText" }]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{translate 'sol.common.client.jc.webcamUtils.dialog.webcamTitle'}}" },
            method: "apply",
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
      it("ifCond", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#ifCond 'ABC' '!=' 'DEF'}}XXX{{/ifCond}}YYY" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#ifCond 'ABC' '==' 'DEF'}}XXX{{/ifCond}}YYY" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{base64Image objId='" + objSmiley1Id + "'}}" },
            method: "apply",
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
      it("ifContains", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#ifContains 'ABCDEF' 'BC'}}XXX{{/ifContains}}YYY" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#ifContains 'ABCDEF' 'XYZ'}}XXX{{/ifContains}}YYY" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#ifKey 'ABCDEF' 'ABCDEF'}}XXX{{/ifKey}}YYY" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#ifKey 'ABCDEF' 'XYZ'}}XXX{{/ifKey}}YYY" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#ifNegative '-1000'}}XXX{{/ifNegative}}YYY" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{#ifNegative '1000'}}XXX{{/ifNegative}}YYY" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{doublecurly open}}XXX{{doublecurly}}YYY" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{text '{{XXX}}'}}" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{currentUser}}" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{currentUser 'id'}}" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{currentUser 'guid'}}" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{currentUser 'desc'}}" },
            method: "apply",
            params: []
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
            test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
              className: "sol.common.Template",
              classConfig: { source: "{{userFolder}}" },
              method: "apply",
              params: []
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
            test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
              className: "sol.common.Template",
              classConfig: { source: "{{userFolder 'private'}}" },
              method: "apply",
              params: []
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
            test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
              className: "sol.common.Template",
              classConfig: { source: "{{userFolder 'data'}}" },
              method: "apply",
              params: []
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
            test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
              className: "sol.common.Template",
              classConfig: { source: "{{userFolder 'inbox'}}" },
              method: "apply",
              params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{number '10,99'}}" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{abs '2000.11'}}" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{debitCreditIndicator '-1099' 'S' 'H'}}" },
            method: "apply",
            params: []
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{debitCreditIndicator '1099' 'S' 'H'}}" },
            method: "apply",
            params: []
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
      it("dateTimeShift", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{dateTimeShift dateTime='20200329' pattern='YYYYMMDD' years=1 quarters=1 months=1 weeks=1 days=1 hours=1 minutes=1 seconds=1 milliseconds=1}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("20210806");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("now", function (done) {
        expect(function () {
          nowDate = test.Utils.getNowDateTime().date;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{now pattern='YYYYMMDD'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(nowDate);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("minDate", function (done) {
        expect(function () {
          test.Utils.findChildren("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources").then(function success(sords) {
            test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
              className: "sol.common.Template",
              classConfig: { source: "{{#minDate sords format='DD.MM.YYYY'}}{{XDateIso}}{{/minDate}}" },
              method: "apply",
              params: [{ sords: sords }]
            }).then(function success1(jsonResult) {
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
      it("maxDate", function (done) {
        expect(function () {
          test.Utils.findChildren("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources").then(function success(sords) {
            test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
              className: "sol.common.Template",
              classConfig: { source: "{{#maxDate sords format='DD.MM.YYYY'}}{{XDateIso}}{{/maxDate}}" },
              method: "apply",
              params: [{ sords: sords }]
            }).then(function success1(jsonResult) {
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
      it("externalLink", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{{externalLink objId='{{{sord.id}}}' limitTo=1 limitToUnit='y' times=5}}}" },
            method: "apply",
            params: [{ sord: templateSord }]
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
      it("math '+'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{math '10.55' '+' '11.05'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("21.6");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("math '-'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{math '10.55' '-' '11.05'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("-0.5");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("math '*'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{math '10.5' '*' '2'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("21");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("math '/'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{math '10.50' '/' '2'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("5.25");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("math '%'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{math '5' '%' '2'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("1");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("mmonthName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{{monthName isoDate='20120523' textStyle='SHORT' locale='de'}}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Mai");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("toEloCheckboxValue true", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{toEloCheckboxValue true}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("1");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("toEloCheckboxValue false", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{toEloCheckboxValue false}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("0");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("currentLanguage", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{currentLanguage}}" },
            method: "apply",
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
      it("kwl:key", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{kwl:key 'A-B'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("A-B");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("kwl:value", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{kwl:value 'A-B'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("A-B");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("xslt", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{xslt '<html><p>Dies ist ein Text</p></html>' 'ARCPATH:/Administration/Business Solutions/common/Configuration/XSLT/htmlToFo'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("<fo:block-container xmlns:fo=\"http://www.w3.org/1999/XSL/Format\" width=\"17cm\" margin-top=\"3mm\">\n    <fo:block space-before=\"4pt\" space-after=\"4pt\" linefeed-treatment=\"preserve\">Dies ist ein Text</fo:block>\n</fo:block-container>\n");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("htmlToFo", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Template",
            classConfig: { source: "{{htmlToFo '<html><p>Dies ist ein Text</p></html>'}}" },
            method: "apply",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("<fo:block-container xmlns:fo=\"http://www.w3.org/1999/XSL/Format\" width=\"17cm\" margin-top=\"3mm\">\n    <fo:block space-before=\"4pt\" space-after=\"4pt\" linefeed-treatment=\"preserve\">Dies ist ein Text</fo:block>\n</fo:block-container>\n");
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