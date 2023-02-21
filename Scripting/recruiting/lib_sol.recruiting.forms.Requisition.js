/**
 * Represents a Requisition
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @elowf
 * @requires sol.common.forms.FormWrapper
 */

sol.define("sol.recruiting.forms.Requisition", {
  extend: "sol.common.forms.FormWrapper",
  prefix: "RECRUITING",
  defaultState: "defaultState",
  utils: {
    collectFields: function (form, prefix) {
      return Object.keys(form.fields)
        .filter(function (fn) {
          return fn.indexOf(prefix) === 0;
        })
        .map(function (fn) {
          return form.fields[fn];
        });
    },
    setCandidatePictures: function (form, field) {
      var me = this,
          setPicture = function (f) {
            var val;
            f && (
              (val = f.value() && (val !== "_"))
                ? (f.setImage(undefined, "div")) // set image of GUID stored in field
                : f.setImageUrl("./images/sol.recruiting.user-image-big.jpg", "div"), (val === "_" && f.set(""))
            );
          };
      (field ? [field] : me.collectFields(form, "WF_MAP_RECRUITING_CANDIDATE_PHOTO_GUID")).forEach(setPicture);
    },
    addRankingClass: function (form, field) {
      var me = this,
          setClass = function (f) {
            f && (
              f.value()
                ? f.element().className += " ranking ranking_" + f.value()
                : f.hide()
            );
          };
      (field ? [field] : me.collectFields(form, "WF_MAP_RECRUITING_CANDIDATE_RANKING")).forEach(setClass);
    },
    setDispatchDate: function (field) {
      field && field.set(moment().add(1, "days").format("YYYYMMDD"));
    },
    selectPool: function (field, pool, noField, no) {
      field && field.set(pool);
      noField && noField.set(no);
    },
    // the tmpPrefix is required because checkboxes cannot have values besides 0, 1 and ""
    disableUnauthorizedPoolSelection: function (form, fieldPrefix, tmpPrefix) {
      var fields = Object.keys(form.fields), tmpFields;

      tmpFields = fields
        .filter(function (fieldName) {
          return fieldName.indexOf(tmpPrefix) === 0;
        });

      tmpFields
        .forEach(function (fieldName) {
          var match = fieldName.match(/[^0-9]*(\d+)$/), index = match ? match[1] : "",
              targetField = form.fields[fieldPrefix + index], tmpField = form.fields[fieldName], val = (tmpField ? tmpField.value() : "");

          (targetField && val && val.indexOf("TALENT_POOL") > -1)
            ? targetField.set("1")
            : (targetField.setAttribute("readonly", true), targetField.set(""));
        });
    }
  },
  onSaveRules: {
    requisition: {
      solType: "RECRUITING_REQUISITION",
      saveValues: function () {
        return true;
      }, // of course, Boolean can also be defined
      registerUpdate: true
    }
  },
  OnInit: function () {
    // to be executed one time during init
    var me = this;
    me.utils.setCandidatePictures(me);
    me.utils.addRankingClass(me);
    me.utils.setDispatchDate(me.fields.IX_MAP_RECRUITING_COMMUNICATION_DATEOFDISPATCH);
    window.setTimeout(me.utils.selectPool.bind(me, me.fields.WF_MAP_RECRUITING_CANDIDATE_TARGETPOOL, "Talentpool", me.fields.WF_MAP_RECRUITING_CANDIDATE_TARGETPOOL_NO, "P01"), 100);
    me.utils.disableUnauthorizedPoolSelection(me, "WF_MAP_RECRUITING_CANDIDATE_MOVETOPOOL", "WF_MAP_RECRUITING_CANDIDATE_AGREEDPOOL");
  },
  AfterInputChanged: function () {
    var me = this;
    (function (field) {
      (me.fields.WF_MAP_RECRUITER_SET && field && !field.value())
        && field.set(ELO_PARAMS.ELO_CONNECTUSERNAME);
    })(me.fields.IX_GRP_RECRUITING_REQUISITION_RECRUITER);
  },
  states: {
    stateInit: {
      fieldProperties: {}
    },
    defaultState: {
      bodyClasses: [
        "default"
      ],
      fieldProperties: {}
    }
  }
});