
//@include sol.dev.TestUtils.js
//@include sol.common.ix.functions.RenderTemplate.js

/**
 * Please consider to move the following variables to your eslint config
 */
/* jasmine variables */
/* global jasmine, describe, beforeAll, beforeEach, afterEach, afterAll, it, expect */
/* test variables */
/* global ConnectionHandler, TestUtils */
/* business solution variables */
/* global sol */

describe("sol.common.ix.functions.RenderTemplate.js", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    ixConnect = ConnectionHandler.connectIx();
  });

  beforeEach(function () {
  });

  describe("public functions should be defined", function () {

    it("onEnterNode should be defined", function () {
      // eslint-disable-next-line no-undef
      expect(onEnterNode).toBeDefined();
    });

    it("onExitNode should be defined", function () {
      // eslint-disable-next-line no-undef
      expect(onExitNode).toBeDefined();
    });
  });

  describe("", function () {
    beforeEach(function () {
    });

    describe("", function () {
      beforeEach(function () {

      });
      it("Render Template", function () {
        expect(function () {
          var config = {
            templateFields: [
              { type: "MAP", key: "COMMUNICATION_SENDERNAME" },
              { type: "GRP", key: "COMMUNICATION_SENDER" },
              { type: "GRP", key: "COMMUNICATION_RECIPIENT" },
              { type: "GRP", key: "COMMUNICATION_SUBJECT" },
              { type: "SORD", key: "desc", rerenderValue: true }
            ],
            searches: {
              COURSE: {
                const: { checkSordValues: ["objKeys.COURSE_REFERENCE"] },
                masks: [""],
                search: [
                  { key: "COURSE_REFERENCE", value: "{{sord.objKeys.COURSE_REFERENCE}}" },
                  { key: "SOL_TYPE", value: "COURSE" }
                ],
                options: {
                  allowEmptyMask: true
                }
              },
              SESSION: {
                const: { checkSordValues: ["objKeys.COURSE_REFERENCE", "objKeys.SESSION_REFERENCE"], optional: true },
                masks: [""],
                search: [
                  { key: "COURSE_REFERENCE", value: "{{sord.objKeys.COURSE_REFERENCE}}" },
                  { key: "SESSION_REFERENCE", value: "{{sord.objKeys.SESSION_REFERENCE}}" },
                  { key: "SOL_TYPE", value: "SESSION" }
                ],
                options: {
                  allowEmptyMask: true
                }
              },
              ENROLLMENT: {
                const: { checkSordValues: ["objKeys.COURSE_REFERENCE", "objKeys.COURSE_ENROLLMENT_USER"] },
                masks: [""],
                search: [
                  { key: "COURSE_REFERENCE", value: "{{sord.objKeys.COURSE_REFERENCE}}" },
                  { key: "SESSION_REFERENCE", value: "{{sord.objKeys.SESSION_REFERENCE}}", optional: true },
                  { key: "COURSE_ENROLLMENT_USER", value: "{{sord.objKeys.COURSE_ENROLLMENT_USER}}" },
                  { key: "COURSE_ENROLLMENT_INTERNAL_STATUS", value: "ACTIVE" },
                  { key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }
                ],
                options: {
                  allowEmptyMask: true
                }
              }
            },
            sordIsAlso: "MESSAGE",
            redactor: {
              storeInBlob: "REDACTOR_CLIPS",
              clips: [
                { desc: "{{translate 'sol.common_document.redactor.user.company'}}", value: "{{ENROLLMENT.objKeys.ELOCOMPANY}}" },
                { desc: "{{translate 'sol.common_document.redactor.user.department'}}", value: "{{ENROLLMENT.objKeys.ELODEPARTMENT}}" },
                { desc: "{{translate 'sol.common_document.redactor.user.fullname'}}", value: "{{ENROLLMENT.objKeys.ELOFULLNAME}}" },
                { desc: "{{translate 'sol.common_document.redactor.user.location'}}", value: "{{ENROLLMENT.objKeys.ELOLOCATION}}" },
                { desc: "{{translate 'sol.common_document.redactor.user.office'}}", value: "{{ENROLLMENT.objKeys.ELOOFFICE}}" },
                { desc: "{{translate 'sol.common_document.redactor.user.title'}}", value: "{{ENROLLMENT.objKeys.ELOTITLE}}" },
                { desc: "{{translate 'sol.common_document.redactor.user.mailaddress'}}", value: "{{ENROLLMENT.objKeys.ELOMAILADDRESS}}" },
                { desc: "{{translate 'sol.common_document.redactor.user.phonenumber'}}", value: "{{ENROLLMENT.objKeys.ELOPHONENUMBER}}" },
                { desc: "{{translate 'sol.common_document.redactor.user.mobilenumber'}}", value: "{{ENROLLMENT.objKeys.ELOMOBILENUMBER}}" },
                { desc: "{{translate 'sol.common_document.redactor.user.faxnumber'}}", value: "{{ENROLLMENT.objKeys.ELOFAXNUMBER}}" },
                { desc: "{{translate 'sol.learning.form.courseReference'}}", value: "{{COURSE.objKeys.COURSE_REFERENCE}}" },
                { desc: "{{translate 'sol.learning.form.courseName'}}", value: "{{COURSE.objKeys.COURSE_NAME}}" },
                { desc: "{{translate 'sol.learning.form.courseCategory'}}", value: "{{COURSE.objKeys.COURSE_CATEGORY}}" },
                { desc: "{{translate 'sol.learning.form.courseInstructor'}}", value: "{{COURSE.objKeys.COURSE_INSTRUCTOR}}" },
                { desc: "{{translate 'sol.learning.form.sessionReference'}}", value: "{{SESSION.objKeys.SESSION_REFERENCE}}" },
                { desc: "{{translate 'sol.learning.form.sessionName'}}", value: "{{SESSION.objKeys.SESSION_NAME}}" },
                { desc: "{{translate 'sol.learning.form.sessionInstructor'}}", value: "{{SESSION.objKeys.SESSION_INSTRUCTOR}}" },
                { desc: "{{translate 'sol.learning.form.sessionStartDate'}}", value: "{{SESSION.mapKeys.SESSION_STARTDATE}}" },
                { desc: "{{translate 'sol.learning.form.sessionStartTime'}}", value: "{{SESSION.objKeys.SESSION_STARTTIME}}" },
                { desc: "{{translate 'sol.learning.form.sessionEndTime'}}", value: "{{SESSION.mapKeys.SESSION_ENDTIME}}" },
                { desc: "{{translate 'sol.learning.form.sessionLocation'}}", value: "{{SESSION.objKeys.SESSION_LOCATION}}" },
                { desc: "{{translate 'sol.learning.form.sessionAddress'}}", value: "{{SESSION.objKeys.SESSION_FULL_ADDRESS}}" }
              ]
            }
          };
          config.objId = 6687;
          (sol.create("sol.common.ix.functions.RenderTemplate", config)).process();
        }).not.toThrow();
      });

      afterEach(function () {
        TestUtils.cleanUp();
      });
    });
  });

  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestUtils.cleanUp();
  });
});