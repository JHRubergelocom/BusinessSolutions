/**
 * Represents a Posting
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @elowf
 * @requires sol.common.forms.FormWrapper
 */

sol.define("sol.recruiting.forms.Posting", {
  extend: "sol.common.forms.FormWrapper",
  prefix: "RECRUITING",
  defaultState: "defaultState",
  utils: {
  },
  onSaveRules: {
    posting: {
      solType: "RECRUITING_POSTING",
      saveValues: function () {
        return true;
      }, // of course, Boolean can also be defined
      registerUpdate: true
    }
  },
  OnInit: function () {
    // to be executed one time during init
    sol.common.forms.Utils.initializeIxSession();
  },
  AfterInputChanged: function () {},

  setPostingFields: function (requisitionno) {
    var me = this, 
        sords, requisitionqualifications, requisitiondesc, requisitionname;

    sords = sol.common.IxUtils.execute("RF_sol_common_service_SordProvider", 
      {
        masks: ["Recruiting Requisition"],
        search: [{ key: "RECRUITING_REQUISITION_NO", value: requisitionno }],
        output: [
          { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
          { source: { type: "SORD", key: "name" }, target: { prop: "name" } },
          { source: { type: "GRP", key: "RECRUITING_REQUISITION_DESC" }, target: { prop: "requisitiondesc" } },
          { source: { type: "GRP", key: "RECRUITING_REQUISITION_NAME" }, target: { prop: "requisitionname" } },
          { source: { type: "FORMBLOB", key: "RECRUITING_REQUISITION_QUALIFICATIONS" }, target: { prop: "requisitionqualifications" } }    
        ]    
      });
    if (sords.sords[0]) {
      requisitionqualifications = sords.sords[0].requisitionqualifications;
      requisitiondesc = sords.sords[0].requisitiondesc;
      requisitionname = sords.sords[0].requisitionname;
      if (!requisitionqualifications) { 
        requisitionqualifications = ""; 
      }
      if (!requisitiondesc) { 
        requisitiondesc = ""; 
      }
      if (!requisitionname) { 
        requisitionname = ""; 
      }
      me.when("IX_BLOB_RECRUITING_POSTING_QUALIFICATIONS", function (postingQualificationField) {
        postingQualificationField.set(requisitionqualifications);
      });
      me.when("IX_DESC", function (descField) {
        descField.set(requisitiondesc);
      });
      me.when("IX_GRP_RECRUITING_POSTING_NAME", function (postingNameField) {
        postingNameField.set(requisitionname);
      });
    }
  },

  InputChanged: function (source, name) {
    var me = this, 
        requisitionno;

    if (name) {
      if (source.RECRUITING_REQUISITION_NO) {
        requisitionno = me.fields.IX_GRP_RECRUITING_REQUISITION_NO.value();
        me.setPostingFields(requisitionno);
      }
    }
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