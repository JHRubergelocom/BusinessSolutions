/**
 * Represents a Course
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @elowf
 * @requires sol.common.forms.FormWrapper
 */

sol.define("sol.learning.forms.Course", {
  extend: "sol.common.forms.FormWrapper",
  prefix: "LEARNING",
  defaultState: "defaultState",

  onSaveRules: {
    candidate: {
      solType: "RECRUITING_CANDIDATE",
      saveValues: true,
      registerUpdate: true
    }
  },
  utils: {
    updateMultiIndex: function (multiIndexDef) {
      var def = (multiIndexDef || {}).index ? multiIndexDef : { index: multiIndexDef },
          indexArray = sol.common.forms.Utils.MultiIndex(def.index);
      Array.prototype.slice.call(arguments, 1)
        .forEach(function (field) {
          var key = def.replace ? field.fName.replace(def.replace, "") : field.fName;
          field.value()
            ? indexArray.add(key)
            : indexArray.remove(key);
        });
      indexArray.save();
    },
    applyMultiIndex: function (multiIndexField, keyPrefix, possibleValues) {
      var indexArray = sol.common.forms.Utils.MultiIndex(multiIndexField),
          positiveValues = indexArray.values();
      keyPrefix || (keyPrefix = "");
      possibleValues = (possibleValues || []).slice();

      possibleValues
        .forEach(function (key) {
          var field = multiIndexField.form.fields[keyPrefix + key];
          field && (
            ~positiveValues.indexOf(key)
              ? field.set("1")
              : field.set("")
          );
        });
    },
    updateMultiIndexFromMapTableColumn: function (multiIndexField, mapTableColumn) {
      var indexArray = sol.common.forms.Utils.MultiIndex(),
          fields = multiIndexField.form.fields;
      Object.keys(fields)
        .filter(function (fieldName) {
          return fieldName.indexOf(mapTableColumn) === 0;
        })
        .forEach(function (fieldName) {
          var val = fields[fieldName].value({ full: true }); // if dynkwl field, receive complete value
          val && indexArray.add(val);
        });
      indexArray.save(multiIndexField.fName);
    },
    collectFields: function (form, prefix) {
      return Object.keys(form.fields)
        .filter(function (fn) {
          return fn.indexOf(prefix) === 0;
        })
        .map(function (fn) {
          return form.fields[fn];
        });
    },
    setCoursePictures: function (form, field) {
      var me = this,
          setPicture = function (f) {
            var val;
            f && (
              (val = f.value() && (val !== "_"))
                ? (f.setImage(undefined, "div")) // set image of GUID stored in field
                : f.setImageUrl("./images/sol.learning.course-image-big.jpg", "div"), (val === "_" && f.set(""))
            );
          },
          getPictureFields = function () {
            return me.collectFields(form, "IX_MAP_COURSE_IMAGE")
              .concat(me.collectFields(form, "IX_MAP_COURSE_REQ_IMAGE"));
          };
      (field ? [field] : getPictureFields()).forEach(setPicture);
    }
  },
  OnInit: function () {
    // to be executed one time during init
    var me = this;
    // set coversheet profile picture
    (function (field) {
      field && (
        field.value()
          ? field.setImage() // set image stored in sord
          : field.setImageUrl("./images/sol.learning.course-image-big.jpg")
      );
    }(me.fields.IX_GRP_COURSE_COVER_IMAGE));

    me.fields.IX_GRP_COURSE_VISIBILITY
      && me.utils.applyMultiIndex(me.fields.IX_GRP_COURSE_VISIBILITY, "VISIBILITY_", ["CATALOG", "MYCOURSES"]);

    me.utils.setCoursePictures(me);
  },
  BeforeInputChanged: function (source) {
    var me = this, match, picturesMapField;
    if (typeof source === "object" && (match = (Object.keys(source)[0] || "").match(/(.*)(\d+)$/))) { // dynkwl
      picturesMapField = (~["IX_MAP_COURSE_IMAGE", "IX_MAP_COURSE_TITLE", "IX_MAP_COURSE_RF"].indexOf(match[1]))
        ? "IX_MAP_COURSE_IMAGE"
        : "IX_MAP_COURSE_REQ_IMAGE";
      me.utils.setCoursePictures(me, me.fields[picturesMapField + match[2]]);
    }
  },
  AfterOnSave: function () {
    var me = this;
    me.fields.IX_GRP_COURSE_RELATED_COURSE_NAMES
      && me.utils.updateMultiIndexFromMapTableColumn(me.fields.IX_GRP_COURSE_RELATED_COURSE_NAMES, "IX_MAP_COURSE_TITLE");
    me.fields.IX_GRP_COURSE_RELATED_COURSE_REFS
      && me.utils.updateMultiIndexFromMapTableColumn(me.fields.IX_GRP_COURSE_RELATED_COURSE_REFS, "IX_MAP_COURSE_RF");
    me.fields.IX_GRP_COURSE_REQUIRED_COURSE_NAMES
      && me.utils.updateMultiIndexFromMapTableColumn(me.fields.IX_GRP_COURSE_REQUIRED_COURSE_NAMES, "IX_MAP_COURSE_REQ_TITLE");
    me.fields.IX_GRP_COURSE_REQUIRED_COURSE_REFS
      && me.utils.updateMultiIndexFromMapTableColumn(me.fields.IX_GRP_COURSE_REQUIRED_COURSE_REFS, "IX_MAP_COURSE_REQ_RF");
  },
  states: {
    stateInit: {
      OnInitAndTabChange: function () {},
      fieldProperties: {
        VISIBILITY_CATALOG: {
          responder: function (form, _state, field) {
            form.utils.updateMultiIndex({ index: form.fields.IX_GRP_COURSE_VISIBILITY, replace: "VISIBILITY_" }, field);
          }
        },
        VISIBILITY_MYCOURSES: {
          responder: function (form, _state, field) {
            form.utils.updateMultiIndex({ index: form.fields.IX_GRP_COURSE_VISIBILITY, replace: "VISIBILITY_" }, field);
          }
        }
      }
    },
    defaultState: {
      bodyClasses: [
        "default"
      ],
      fieldProperties: {}
    }
  }
});