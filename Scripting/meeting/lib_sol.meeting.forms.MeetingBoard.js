/**
 * @author MHe, ELO Digital Office GmbH
 * @elowf
 *
 * @requires sol.common.forms.FormWrapper
 */
sol.define("sol.meeting.forms.MeetingBoard", {
  extend: "sol.common.forms.FormWrapper",
  mixins: [
    "sol.common.forms.mixins.FormWrapperPlugins"
  ],
  defaultState: function () {
    return this.workflowActive ? "workflow" : "preview";
  },
  plugins: [
    sol.meeting.forms.config.plugins.general.ProductLine,
    sol.meeting.forms.config.plugins.meetingBoard.ProposalTypes,
    sol.meeting.forms.config.plugins.meetingBoard.UniqueUser,
    sol.meeting.forms.config.plugins.meetingBoard.MemberAutoFocus,
    sol.meeting.forms.config.plugins.meetingBoard.MemberRemoveValidation,
    sol.meeting.forms.config.plugins.meetingBoard.DeadlinesPlugin,
    sol.meeting.forms.config.plugins.meetingBoard.UniqueOrganizerUser,
    sol.meeting.forms.config.plugins.meetingBoard.MinutesTakerUserImage
  ],

  onSaveRules: {
    meetingBoard: {
      solType: "MEETING_BOARD",
      saveValues: true,
      registerUpdate: true
    }
  },

  states: {
    stateInit: {
      fieldProperties: {
        IX_DESC: {
          placeholder: { key: "sol.meeting.form.board.description.placeholder" }
        },
        IX_GRP_MEETING_BOARD_CODE: {
          responder: function (form, state, field, value) {
            // accept only chars and digits and convert the code to uppercases
            var regExp = /[^\w\d]/g;
            field.set(value.replace(regExp, "").toUpperCase());
          }
        },
        IX_MAP_MEETING_BOARD_SETTING_DEADLINES_ACTIVATE: {
          template: {
            name: "toggle",
            config: {
              toggleOptionFieldName: "IX_MAP_MEETING_BOARD_SETTING_DEADLINES_ACTIVATE",
              onValue: "1",
              offValue: "",
              onState: {
                tabProperties: {
                  all: {
                    _350_board_settings_deadlines: {
                      hidden: false
                    }
                  }
                }
              },
              offState: {
                tabProperties: {
                  all: {
                    _350_board_settings_deadlines: {
                      hidden: true
                    }
                  }
                }
              },
              defaultState: {
                tabProperties: {
                  all: {
                    _350_board_settings_deadlines: {
                      hidden: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      tabProperties: {
        all: {
          _221_organizer_to_remove: {
            hidden: true
          },
          _330_board_settings_proposals: {
            hidden: true
          }
        }
      }
    },
    workflow: {
      plugins: [
        sol.meeting.forms.config.plugins.meetingBoard.UserImagePlugin,
        sol.meeting.forms.config.plugins.meetingBoard.RecuringItems,
        sol.meeting.forms.config.plugins.meetingBoard.CRUDStatus,
        sol.meeting.forms.config.plugins.meetingBoard.ReadonlyTablePlugin
      ],
      fieldProperties: {
        IX_GRP_MEETING_BOARD_CODE: {
          readonly: false
        },
        IX_GRP_MEETING_BOARD_ORGANIZER: {
          readonly: false
        }
      }
    },
    preview: {
      plugins: [
        sol.meeting.forms.config.plugins.meetingBoard.PreviewMembers,
        sol.meeting.forms.config.plugins.meetingBoard.UserImagePluginPreview,
        sol.meeting.forms.config.plugins.meetingBoard.GotoMember
      ],
      fieldProperties: {
        IX_GRP_MEETING_BOARD_CODE: {
          readonly: true
        },
        IX_GRP_MEETING_BOARD_ORGANIZER: {
          readonly: false
        }
      }
    }
  },

  methods: {
    AfterOnInitAndTabChange: function () {
      var me = this;
      me.hideOrganizerLabels();


      me.$form.when(
        me.$form.tabs.all.parts._330_board_settings_proposals, 
        me.$form.fields.IX_GRP_MEETING_PRODUCT_LINE, function(proposalSettingTemplate, productLine) {

          productLine.value().toLowerCase() === "premium"
            ? proposalSettingTemplate.show()
            : proposalSettingTemplate.hide()
      });

      me.$form.when(
        me.$form.tabs.all.parts._350_board_settings_deadlines, 
        me.$form.tabs.all.parts._351_board_settings_deadlines_t, 
        me.$form.fields.IX_GRP_MEETING_PRODUCT_LINE, function(deadlineSettingTemplate, deadlineTitleTemplate, productLine) {

          productLine.value().toLowerCase() === "premium"
            ? (deadlineSettingTemplate.show(), deadlineTitleTemplate.show())
            : (deadlineSettingTemplate.hide(), deadlineTitleTemplate.hide())
      });
      
      me.$form.when(
        me.$form.tabs.all.parts._342_board_settings_approval, 
        me.$form.fields.IX_GRP_MEETING_PRODUCT_LINE, function(approvalSettingTemplate, productLine) {

          productLine.value().toLowerCase() === "premium"
            ? approvalSettingTemplate.show()
            : approvalSettingTemplate.hide()
      });
    },

    OnAddLine: function (name, index, rowFields) {
      var me = this;
      me.hideOrganizerLabel(name, index);
    },

    AfterOnRemoveLine: function (name, index, removedFieldValues) {
      var me = this;
      if (name == "organizer" && me.$form && me.$form.tables["organizer"] && index == 1) {
        //we have to show the label only in first line
        me.showOrganizerLabel();
      }
    },

    BeforeOnSave: function () {
      var me = this;

      me.saveRemovedOrganizer();
      me.$form.when(me.$form.fields.IX_GRP_MEETING_BOARD_ORGANIZER, function (organizer) {
        me.$form.updateMultiIndexFromMapTableColumn(organizer, "IX_MAP_MEETING_BOARD_ORGANIZER");
      });
    },

    saveRemovedOrganizer: function () {
      var me = this,
          oldOrganizer, newOrganizer = [], i, usersToRemove = [];

      if (me.$form.tables["organizer"] && me.$form.tables["removeorganizer"] && me.$form.fields.IX_GRP_MEETING_BOARD_ORGANIZER) {
        oldOrganizer = me.$form.fields.IX_GRP_MEETING_BOARD_ORGANIZER.value().split(new RegExp(String.fromCharCode(182), "g")); //¶

        sol.common.forms.Utils.forEachRow("IX_MAP_MEETING_BOARD_ORGANIZER", function (index, field) {
          newOrganizer.push(field.value);
        });

        for (i = 0; i < oldOrganizer.length; i++) {
          if (!newOrganizer.includes(oldOrganizer[i])) {
            usersToRemove.push({
              IX_MAP_MEETING_BOARD_REMOVE_ORGANIZER: oldOrganizer[i]
            });
          }
        }
        me.$form.tables["removeorganizer"].insert(usersToRemove, "IX_MAP_MEETING_BOARD_REMOVE_ORGANIZER");
      }
    },

    hideOrganizerLabels: function () {
      var me = this;
      if (me.$form && me.$form.tables["organizer"]) {
        me.$form.tables["organizer"].forEach(function (row) {
          if (row.row > 1) {
            //we just want to show the label of the first line
            me.hideOrganizerLabel("organizer", row.row);
          }
        });
      }
    },

    hideOrganizerLabel: function (tableId, index) {
      var me = this,
          row, tr, label;

      if (tableId == "organizer" && me.$form.tables[tableId]) {
        row = me.$form.tables[tableId].getRow(index);
        tr = row.IX_MAP_MEETING_BOARD_ORGANIZER.element().closest("tr");
        label = tr.querySelector("#LBL_ORGANIZER");
        if (label) {
          label.classList.add("hidden");
        }
      }
    },

    showOrganizerLabel: function () {
      //$var returns the first element so it's the label of the first line
      $var("LBL_ORGANIZER").classList.remove("hidden");
    }
  }

});

sol.define("sol.meeting.forms.plugins.MeetingItems", {
  rowProperties: function () {
    return {
      meetingItems: { // tableId
        WF_MAP_MEETING_ITEM_DURATION: {
          tooltip: { key: "sol.meeting.form.item.duration.tooltip" }
        },
        WF_MAP_MEETING_ITEM_DESC: {
          placeholder: { key: "sol.meeting.form.item.desc.placeholder" }
        }
      }
    };
  },
  updateAllPositions: function (row) {
    var me = this,
        form = me.$form;
    form.when(form.tables[sol.meeting.tables.items], function (table) {

      if (table.isEmpty([sol.meeting.fields.wfMap.MEETING_AGENDA_POSITION, sol.meeting.fields.wfMap.MEETING_ITEM_TITLE])) {
        // skip update position number because the first row is not valid
        // It's important that no position was written to the field when the table is
        // actually empty. So the whole row has to be empty, otherwise we create a empty
        // meeting item object into the archive.
        // If the table is empty none title field should remain required
        table.forEach(function (_row) {
          me.setTitleRequired(_row, false);
        });
        return;
      }

      table.forEach(function (_row) {
        me.updatePosition(_row);
        me.setTitleRequired(_row, true);
      });
    });
  },

  AfterInputChanged: function (field) {
    var me = this;
    me.updateAllPositions();
  },

  BeforeOnSave: function () {
    var me = this;
    me.updateAllPositions();
  },

  AfterOnRemoveLine: function (name, index, removedFieldValues) {
    var me = this;
    me.updateAllPositions();
  },

  updatePosition: function (row) {
    row[sol.meeting.fields.wfMap.MEETING_AGENDA_POSITION].set(String(row.row));
  },

  setTitleRequired: function (row, value) {
    row[sol.meeting.fields.wfMap.MEETING_ITEM_TITLE].setAttribute("optional", !value);
  }

});


sol.define("sol.meeting.forms.plugins.ProposalTypes", {
  extend: "sol.common.forms.AbstractTablePlugin",

  AfterOnInitAndTabChange: function (activeTab) {
    var me = this;

    try {
      // initialize proposal types table if table is empty
      // and multiIndex wasn't loaded before
      !me.hasProposals()
        && !me.isMultiIndexLoaded()
        && me.initDefaultProvidedProposalTypes();
    } catch (ex) {
    }
  },

  AfterInputChanged: function (field) {
    var me = this;

    // after tabChange we should update index field
    me.updateProvidedProposalTypes();
  },

  AfterOnSave: function () {
    var me = this;
    me.updateProvidedProposalTypes();
  },

  initDefaultProvidedProposalTypes: function () {
    var me = this, form = me.$form,
        columnName = sol.meeting.fields.map.PROPOSAL_TYPES;

    form.when(sol.meeting.fields.grp.MEETING_PROVIDED_PROPOSALTYPES, function (field) {
      form.updateMapTableColumnsFromMultiIndex(field, columnName, me.tableId);
      me.$multiIndexLoaded = true;
    });
  },

  hasProposals: function () {
    var me = this;
    return !me.getTable().isEmpty([sol.meeting.fields.map.PROPOSAL_TYPES]);
  },

  updateProvidedProposalTypes: function () {
    var me = this, form = me.$form,
        columnName = sol.meeting.fields.map.PROPOSAL_TYPES;

    form.when(sol.meeting.fields.grp.MEETING_PROVIDED_PROPOSALTYPES, function (field) {
      form.updateMultiIndexFromMapTableColumn(field, columnName);
    });
  },

  /**
   * @return {Boolean} return true if MultiIndex was already loaded to the map table
   */
  isMultiIndexLoaded: function () {
    var me = this;
    return !!me.$multiIndexLoaded;
  }
});

sol.define("sol.meeting.forms.plugins.RemoveTableValidation", {

  requiredConfig: ["tableId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  AfterOnSave: function () {
    var me = this, row,
        table = me.getTable();

    if (table.isEmpty()) {
      row = table.getRow(1);
      table.columns
        .map(function (col) {
          return row[col];
        })
        .forEach(function (field) {
          sol.common.forms.Utils.removeValidation(field.name);
        });
    }
  },

  getTable: function () {
    var me = this;
    return me.$form.tables[me.tableId];
  }
});

sol.define("sol.meeting.forms.plugins.MeetingBoardDeadlines", {

  requiredConfig: ["fields"],


  initialize: function (config) {
    var me = this;
    me.init = false;
    me.$super("sol.Base", "initialize", [config]);
  },


  AfterOnInitAndTabChange: function() {
    var me = this,
      form = me.$form

    me.once(function() {
      form.when(
        "IX_MAP_MEETING_REGISTER_DEADLINE_SHIFT_VALUE",
        "IX_MAP_MEETING_REGISTER_DEADLINE_SHIFT_UNIT",
        function(shiftValue, shiftUnit) {
          if (!shiftValue.value() && !shiftUnit.value()){
            shiftValue.set(sol.meeting.config.deadlineShiftValue);
            shiftUnit.setLocalizedDynKwlKey(sol.meeting.config.deadlineShiftUnitKey);
          }
        });
    });
  },

  once: function(startCallback) {
    var me = this; // TODO: this function might be implemented in a generic way

    if (me.init === false) {
      startCallback();
      me.init = true;
    }
    return {
      always: function(cb) {
        cb();
      }
    }
  },

  BeforeOnSave: function () {
    var me = this,
        form = me.$form;

        form.when(
          "IX_MAP_MEETING_REGISTER_DEADLINE_SHIFT_VALUE",
          "IX_MAP_MEETING_REGISTER_DEADLINE_SHIFT_UNIT",
          "IX_MAP_MEETING_BOARD_SETTING_DEADLINES_ACTIVATE", function(shiftValue, shiftUnit, deadlineActive) {

            if (deadlineActive.value() == "1") {
              shiftValue.setAttribute("optional", false);
              shiftUnit.setAttribute("optional", false);
            } else {
              shiftValue.setAttribute("optional", true);
              shiftUnit.setAttribute("optional", true);

              shiftValue.set("");
              shiftUnit.set("");
            }
          });
  }
});

