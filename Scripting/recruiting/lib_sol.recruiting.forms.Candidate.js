/**
 * Represents a Candidate
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @elowf
 * @requires sol.common.forms.FormWrapper
 */

sol.define("sol.recruiting.forms.Candidate", {
  extend: "sol.common.forms.FormWrapper",
  prefix: "RECRUITING",
  defaultState: "defaultState",

  onSaveRules: {
    candidate: {
      solType: "RECRUITING_CANDIDATE",
      saveValues: function () {
        return true;
      }, // of course, Boolean can also be defined
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
          : field.setImageUrl("./images/sol.recruiting.user-image-big.jpg")
      );
    }(me.fields.IX_GRP_RECRUITING_CANDIDATE_PHOTO_GUID));

    // apply ranking css
    (function (field) {
      var rankingCoverSheet = document.getElementById("VIEW_IX_GRP_RECRUITING_CANDIDATE_RANKING");
      if (field && field.value()) {
        if (rankingCoverSheet) {
          rankingCoverSheet.className += " ranking ranking_" + field.value();
        }
      } else {
        if (rankingCoverSheet) {
          rankingCoverSheet.display = "none";
        }
      }
    }(me.fields.IX_GRP_RECRUITING_CANDIDATE_RANKING));

    me.fields.IX_GRP_RECRUITING_CANDIDATE_AGREEMENTS
      && me.utils.applyMultiIndex(me.fields.IX_GRP_RECRUITING_CANDIDATE_AGREEMENTS, "AGREEMENT_", ["TALENT_POOL"]);
  },
  states: {
    stateInit: {
      OnInitAndTabChange: function () {
        var me = this;
        // set formatted deletion date if available otherwise hide deletion messagebox
        (function (field) {
          (field && field.value())
            ? field.set(elo.wf.date.format(field.value()))  // format
            : (me.tabs.all.parts._100_delete_msg && me.tabs.all.parts._100_delete_msg.hide());
        }(me.fields.IX_GRP_RECRUITING_CANDIDATE_CASSATIONDATE));

        // select default template in Hiring Workflow template
        (function (field) {
          field && field.set("Default");
        }(me.fields.WF_MAP_RECRUITING_FILE_TEMPLATE));

      },
      fieldProperties: {
        IX_GRP_RECRUITING_CANDIDATE_PHASE: {
          responder: function (form, _state, _field, _value) {
            form.fields.IX_GRP_RECRUITING_CANDIDATE_STATUS.set("");
          }
        },
        AGREEMENT_TALENT_POOL: {
          responder: function (form, _state, field) {
            form.utils.updateMultiIndex({ index: form.fields.IX_GRP_RECRUITING_CANDIDATE_AGREEMENTS, replace: "AGREEMENT_" }, field);
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