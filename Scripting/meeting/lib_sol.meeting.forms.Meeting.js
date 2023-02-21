/**
 * Represents a meeting
 *
 * @author MHe, ELO Digital Office GmbH
 *
 * @elowf
 * @requires sol.common.forms.FormWrapper
 */
sol.define("sol.meeting.forms.Meeting", {
  extend: "sol.common.forms.FormWrapper",
  mixins: ["sol.common.forms.mixins.FormWrapperPlugins"],

  defaultState: function () {
    return this.workflowActive ? "workflow" : "preview";
  },

  plugins: [
    sol.meeting.forms.config.plugins.general.ProductLine,
    sol.meeting.forms.config.plugins.schedule.Scheduler, // add schedule logic
    sol.meeting.forms.config.plugins.meeting.MeetingRepetition,
    sol.meeting.forms.config.plugins.participants.UserImagePlugin,
    sol.meeting.forms.config.plugins.participants.AutoFocusTable,
    sol.meeting.forms.config.plugins.participants.UniqueUser,
    sol.meeting.forms.config.plugins.participants.CRUDStatus,
    sol.meeting.forms.config.plugins.participants.RoleHandler,
    sol.meeting.forms.config.plugins.participants.ReadonlyTablePlugin,
    sol.meeting.forms.config.plugins.schedule.TableMultiIndexConverter,
    sol.meeting.forms.config.plugins.participants.MarkRowAsDeletedPlugin,
    sol.meeting.forms.config.plugins.meeting.UserImagePlugin,
    sol.meeting.forms.config.plugins.notification.NotificationDateCalculator
  ],

  states: {
    stateInit: {
      fieldProperties: {
        IX_GRP_MEETING_NAME: {
          placeholder: { key: "sol.meeting.form.meeting.title.placeholder" },
          optional: false
        },
        IX_DESC: {
          placeholder: { key: "sol.meeting.form.meeting.desc.placeholder" },
          template: {
            name: "redactor3",
            config: { field: "IX_DESC", fullWidth: true, redactor: { minHeight: "150px" } }
          }
        },
        IX_BLOB_POSTPONE_REASON: {
          template: {
            name: "fullWidth",
            config: { field: "IX_BLOB_POSTPONE_REASON", fullWidth: true }
          }
        },
        IX_BLOB_CANCEL_REASON: {
          template: {
            name: "fullWidth",
            config: { field: "IX_BLOB_CANCEL_REASON", fullWidth: true }
          }
        },
        WF_MAP_MEETING_REPETITION_CREATE: {
          template: {
            name: "toggle",
            config: {
              toggleOptionFieldName: "WF_MAP_MEETING_REPETITION_CREATE",
              onValue: "1",
              offValue: "",
              onState: {
                tabProperties: {
                  all: {
                    _320_repetition: {
                      hidden: false
                    }
                  }
                }
              },
              offState: {
                tabProperties: {
                  all: {
                    _320_repetition: {
                      hidden: true
                    }
                  }
                }
              },
              defaultState: {
                tabProperties: {
                  all: {
                    _320_repetition: {
                      hidden: true
                    }
                  }
                }
              }
            }
          }
        },
        WF_MAP_MOVE_ITEMS_MODE: {
          template: {
            name: "toggle",
            config: {
              toggleOptionFieldName: "WF_MAP_MOVE_ITEMS_MODE",
              onValue: "sol.{{package}}.forms.meeting.cancel.moveItems.optionMove",
              offValue: "sol.{{package}}.forms.meeting.cancel.moveItems.optionMoveNot",
              onState: {
                tabProperties: {
                  all: {
                    _260_move_to_meeting: {
                      hidden: false
                    }
                  }
                }
              },
              offState: {
                tabProperties: {
                  all: {
                    _260_move_to_meeting: {
                      hidden: true
                    }
                  }
                }
              },
              defaultState: {
                tabProperties: {
                  all: {
                    _260_move_to_meeting: {
                      hidden: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    workflow: {
      plugins: [
        sol.meeting.forms.config.plugins.meeting.DeadlinesPlugin
      ],
      fieldProperties: {},
      tabProperties: {}
    },
    preview: {
      plugins: [
        sol.meeting.forms.config.plugins.meeting.RegisterDeadlineValueHandler
      ],
      fieldProperties: {},
      tabProperties: {}
    }
  },

  onSaveRules: {
    meeting: {
      solType: "MEETING",
      saveValues: true,
      registerUpdate: true
    }
  },

  OnInit: function () {
    var me = this;
    me.templates.redactor3 = sol.meeting.forms.FormWrapper.Templates.redactor3;
    me.templates.fullWidth = sol.meeting.forms.FormWrapper.Templates.fullWidth;
  },

  methods: {
    AfterOnInitAndTabChange: function () {
      var me = this;
      me.$form.defaultState() == "preview" && me.setScheduleTableReadonly();
      me.setDefaultCancelMode();

      // workflow form
      me.$form.when(
        me.$form.tabs.all.parts._330_deadlines,
        me.$form.tabs.all.parts._331_deadlines_register,
        me.$form.tabs.all.parts._332_deadlines_title,
        me.$form.fields.IX_GRP_MEETING_PRODUCT_LINE, function (deadlineSettingTemplate, deadlineRegisterTemplate, deadlinesTitleTemplate, productLine) {

          productLine.value().toLowerCase() === "premium"
            ? (deadlineSettingTemplate.show(), deadlineRegisterTemplate.show(), deadlinesTitleTemplate.show())
            : (deadlineSettingTemplate.hide(), deadlineRegisterTemplate.hide(), deadlinesTitleTemplate.hide());
        });

      // preview form
      me.$form.when(
        me.$form.tabs.all.parts._332_deadlines_title,
        me.$form.tabs.all.parts._333_deadlines_preview,
        me.$form.fields.IX_GRP_MEETING_PRODUCT_LINE, function (deadlinesTitleTemplate, deadlinesPreviewTemplate, productLine) {

          productLine.value().toLowerCase() === "premium"
            ? (deadlinesTitleTemplate.show(), deadlinesPreviewTemplate.show())
            : (deadlinesTitleTemplate.hide(), deadlinesPreviewTemplate.hide());
        });
    },
    
    setScheduleTableReadonly: function () {
      var me = this;

      if (me.$form && me.$form.tables[sol.meeting.tables.schedule]) {
        me.$form.tables[sol.meeting.tables.schedule].forEach(function (row) {
          row.IX_MAP_MEETING_TIMESLOT_DAY.setAttribute("readonly", true);
          row.IX_MAP_MEETING_TIMESLOT_START.setAttribute("readonly", true);
          row.IX_MAP_MEETING_TIMESLOT_END.setAttribute("readonly", true);
          row.IX_MAP_MEETING_TIMESLOT_DAY.element().closest("tr").querySelector("a.jsRemoveLine").classList.add("hidden");
        });
        sol.common.forms.Utils.getJsAddLineButtonById(sol.meeting.tables.schedule).classList.add("hidden");
      }
    },

    setDefaultCancelMode: function () {
      var me = this;

      if (me.$form && me.$form.fields.WF_MAP_MOVE_ITEMS_MODE) {
        me.$form.fields.WF_MAP_MOVE_ITEMS_MODE.set("sol.{{package}}.forms.meeting.cancel.moveItems.optionMoveNot");
      }
    }
  }
});

/**
 * @requires MEETING_STARTDAY
 * IX_GRP_MEETING_ENDDATE
 */
sol.define("sol.meeting.forms.module.Schedule", {

  initialize: function (config) {
    var me = this;
    me.fields = config.fields;

    if (!config || !config.tableId) {
      throw Error("tableId must be passed");
    }

    me.options = Object.assign({
      weekdayFormat: "ddd",
      timePlaceholder: "--:--",
      startTime: "",
      startTimeFormat: "HH:mm",
      endTime: "",
      endTimeFormat: "HH:mm"
    }, config);

    me.$super("sol.Base", "initialize", [config]);
  },

  OnInit: function () {
    var me = this;
    window["JS_VAL_MEETING_SCHEDULE"] = me.timeScheduleValidator.bind(this);
  },

  timeScheduleValidator: function (name) {
    var me = this, data;
    data = me.getScheduleDataByRow(name);
    return sol.meeting.forms.ScheduleValidationUtils.runValidator(data, me.options);
  },

  getScheduleDataByRow: function (name) {
    var me = this, row, rowValues = {};
    row = me.getTable().getRowByField(me.$form.fields[name]);
    rowValues.date = row[sol.meeting.fields.map.MEETING_TIMESLOT_DAY].value();
    rowValues.startTime = row[sol.meeting.fields.map.MEETING_TIMESLOT_START].value();
    rowValues.endTime = row[sol.meeting.fields.map.MEETING_TIMESLOT_END].value();
    return rowValues;
  },


  rowProperties: function () {
    var me = this,
      mapFields = sol.meeting.fields.map;
    return {
      schedule: { // tableId
        IX_MAP_MEETING_TIMESLOT_DAY: {
          responder: function (form, state, field, value, row) {
            me.setWeekday(row[mapFields.MEETING_TIMESLOT_WEEKDAY], me.utils.toMoment(value));
            me.calculateStartAndEndDate();
          }
        },
        IX_MAP_MEETING_TIMESLOT_START: {
          value: me.options.startTime ? moment(me.options.startTime, me.options.startTimeFormat).format(me.options.startTimeFormat) : "",
          placeholder: me.options.timePlaceholder,
          responder: function (form, state, field, value, row) {
            field.set(me.utils.fillTime(value));
          }
        },
        IX_MAP_MEETING_TIMESLOT_END: {
          value: me.options.endTime ? moment(me.options.endTime, me.options.endTimeFormat).format(me.options.endTimeFormat) : "",
          placeholder: me.options.timePlaceholder,
          responder: function (form, state, field, value, row) {
            field.set(me.utils.fillTime(value));
          }
        },
        IX_MAP_MEETING_WEEKDAY: {
          value: me.nextDay().format(me.options.weekdayFormat)
        }
      }
    };
  },

  AfterOnInitAndTabChange: function () {
    var me = this, table = me.getTable(), row;

    // only if table is empty, we fill the first line with default values
    if (table.isEmpty([sol.meeting.fields.map.MEETING_TIMESLOT_DAY])) {
      // table has always one line at least, we can reuse it to fill out default values
      row = table.getRow(1);
      me.utils.setDate(row[sol.meeting.fields.map.MEETING_TIMESLOT_DAY], me.nextDay());
    }

    me.calculateStartAndEndDate();
  },

  OnAddLine: function (name, index, rowFields) {
    var me = this, currentDay = me.nextDay();

    me.setWeekday(rowFields[sol.meeting.fields.map.MEETING_TIMESLOT_WEEKDAY], currentDay);
    me.utils.setDate(rowFields[sol.meeting.fields.map.MEETING_TIMESLOT_DAY], currentDay);
    me.calculateStartAndEndDate();
    me.setMeetingTimesForDay(index, rowFields);

  },

  AfterOnRemoveLine: function (name, index, removedFieldValues) {
    var me = this;

    me.calculateStartAndEndDate();
    return true;
  },

  setWeekday: function (field, currentDay) {
    var me = this;
    field.set(currentDay.format(me.options.weekdayFormat));
  },

  calculateStartAndEndDate: function () {
    var me = this,
      formwrapper = me.$form;
    // set startdate and enddate when fields existing onto form
    formwrapper.when(
      sol.meeting.fields.grp.MEETING_STARTDATE,
      sol.meeting.fields.grp.MEETING_ENDDATE,
      function (startField, endField) {
        startField.set(me.utils.toIso(me.computeStartDate()));
        endField.set(me.utils.toIso(me.computeEndDate()));
      });
  },

  getTable: function () {
    var me = this;
    return me.$form.tables[this.tableId];
  },

  computeStartDate: function () {
    var me = this, table = me.getTable(), rowDate,
      // use first row as min date to start min calculation
      minDate = table.getRow(1)[sol.meeting.fields.map.MEETING_TIMESLOT_DAY].value(),
      minMomentDate = me.utils.toMoment(minDate);

    table.forEach(function (row) {
      rowDate = me.utils.toMoment(row[sol.meeting.fields.map.MEETING_TIMESLOT_DAY].value());
      if (rowDate && rowDate.isBefore(minMomentDate)) {
        minMomentDate = rowDate;
      }
    });

    return minMomentDate;
  },

  computeEndDate: function () {
    var me = this, table = me.getTable(), rowDate,
      maxDate = table.getRow(1)[sol.meeting.fields.map.MEETING_TIMESLOT_DAY].value(),
      maxMomentDate = me.utils.toMoment(maxDate);

    table.forEach(function (row) {
      rowDate = me.utils.toMoment(row[sol.meeting.fields.map.MEETING_TIMESLOT_DAY].value());
      if (rowDate && rowDate.isAfter(maxMomentDate)) {
        maxMomentDate = rowDate;
      }
    });

    return maxMomentDate;
  },

  nextDay: function () {
    var me = this,
      currentDay = me.lastDay();

    if (me.days() > 1) {
      currentDay.add(1, "days");
    }

    return currentDay;
  },

  days: function () {
    var me = this;
    return me.utils.tableSize(me.getTable());
  },

  lastDay: function () {
    var me = this;
    return (me.days() === 1)
      ? me.utils.today()
      : me.utils.toMoment(me.lastDayValue());
  },

  lastDayValue: function () {
    var me = this;
    return me.utils.toIso(this.computeEndDate());
  },

  copyKeyValueFromPreviousRow: function (dayIndex, rowFields, keys) {
    var me = this, table = me.getTable(), previousRow, value;
    dayIndex = dayIndex || 1;
    rowFields = rowFields || {};
    keys = [].concat(keys);
    previousRow = (me.utils.tableSize(table) > 1) ? table.getRow(dayIndex - 1) : {};
    keys.forEach(function (key) {
      if (key && previousRow[key]) {
        value = previousRow[key].value();
        if (rowFields[key] && !rowFields[key].value()) {
          rowFields[key].set(value);
        }
      }
    });
  },

  setMeetingTimesForDay: function (dayIndex, rowFields) {
    var me = this;
    me.copyKeyValueFromPreviousRow(dayIndex, rowFields, [sol.meeting.fields.map.MEETING_TIMESLOT_START, sol.meeting.fields.map.MEETING_TIMESLOT_END]);
  },

  utils: {
    today: function () {
      //TODO: Today function in DateUtils?
      return moment();
    },

    setDate: function (field, currentDay) {
      var me = this;
      field && field.set(me.toIso(currentDay, { withoutTime: true }));
    },

    toIso: function (moment, options) {
      return sol.common.DateUtils.momentToIso(moment, options);
    },

    toMoment: function (value) {
      return sol.common.DateUtils.isoToMoment(value);
    },

    tableSize: function (table) {
      return table.size;
    },

    fillTime: function (value) {
      return sol.common.DateUtils.fillTime(value);
    }
  }
});


sol.define("sol.meeting.forms.plugins.MeetingRepetition", {
  requiredConfig: ["tableId", "fields"],

  initialize: function (config) {
    var me = this;
    me.fields = config.fields;

    me.options = Object.assign({
      weekdayFormat: "ddd",
      timePlaceholder: "--:--",
      timeFormat: "HH:mm"
    }, config);

    me.$super("sol.Base", "initialize", [config]);
  },

  OnInit: function () {
    var me = this;
    window["JS_VAL_MEETING_REPETITION_SCHEDULE"] = me.repetitionScheduleValidator.bind(this);
  },

  repetitionScheduleValidator: function (name) {
    var me = this, data;
    data = me.getScheduleDataByRow(name);
    return sol.meeting.forms.ScheduleValidationUtils.runValidator(data, me.options);
  },

  getScheduleDataByRow: function (name) {
    var me = this, row, data = {};
    row = me.getTable().getRowByField(me.$form.fields[name]);
    data.date = row[me.fields.MEETING_REPETITION_DATE].value();
    data.startTime = row[me.fields.MEETING_REPETITION_START].value();
    data.endTime = row[me.fields.MEETING_REPETITION_END].value();
    return data;
  },


  rowProperties: function () {
    var me = this,
      fields = me.fields,
      result = {},
      table = result[me.tableId] = {};

    table[fields.MEETING_REPETITION_DATE] = {
      responder: function (form, state, field, value, row) {
        if (value) {
          me.setWeekday(row, me.utils.toMoment(value));
        }
      }
    };

    table[fields.MEETING_REPETITION_START] = {
      placeholder: me.options.timePlaceholder,
      responder: function (form, state, field, value, row) {
        field.set(me.utils.fillTime(value));
      }
    };

    table[fields.MEETING_REPETITION_END] = {
      placeholder: me.options.timePlaceholder,
      responder: function (form, state, field, value, row) {
        field.set(me.utils.fillTime(value));
      }
    };

    return result;
  },

  AfterOnInitAndTabChange: function () {
    var me = this, table = me.getTable(),
      size = me.utils.tableSize(table), row;
    if (size == 1 && !me.isCreateActive()) {
      row = table.getRow(1);
      me.setNextMeetingRepetition(row);
    }
  },

  OnAddLine: function (name, index, row) {
    var me = this;
    me.setNextMeetingRepetition(row);
  },

  BeforeOnSave: function () {
    var me = this, table = me.getTable();
    if (!me.isCreateActive()) {
      me.utils.removeAllRows(table);
      me.setAllFieldsOptional();
    }
  },

  setNextMeetingRepetition: function (row) {
    var me = this, nextday = me.getNextRepetitionDayValue();
    me.setNextday(row, nextday);
    me.setWeekday(row, me.utils.toMoment(nextday));
    me.setInitialName(row);
    me.setInitialTime(row);
  },

  isCreateActive: function () {
    var me = this;
    return me.$form.fields.WF_MAP_MEETING_REPETITION_CREATE.value();
  },

  setAllFieldsOptional: function () {
    var me = this, table = me.getTable(), fields = me.fields,
      firstRow = table.getRow(1);
    me.utils.setFieldOptional(firstRow, fields.MEETING_REPETITION_NAME);
    me.utils.setFieldOptional(firstRow, fields.MEETING_REPETITION_DATE);
    me.utils.setFieldOptional(firstRow, fields.MEETING_REPETITION_WEEKDAY);
    me.utils.setFieldOptional(firstRow, fields.MEETING_REPETITION_START);
    me.utils.setFieldOptional(firstRow, fields.MEETING_REPETITION_END);

  },

  getNextRepetitionDayValue: function () {
    var me = this,
      table = me.getTable(),
      size = me.utils.tableSize(table),
      lastRepetitionDayValue,
      nextRepetitionDay, row;


    if (size == 1) {
      lastRepetitionDayValue = me.getLastTimeslotDayValue();
    } else {
      row = table.getRow(size - 1);
      lastRepetitionDayValue = row[me.fields.MEETING_REPETITION_DATE].value();
    }

    if (!lastRepetitionDayValue) {
      lastRepetitionDayValue = me.utils.toIso(me.utils.today(), { withoutTime: true });
    }

    nextRepetitionDay = me.utils.toMoment(lastRepetitionDayValue).add(1, "days");

    return me.utils.toIso(nextRepetitionDay);
  },

  getLastTimeslotDayValue: function () {
    var me = this;
    return me.$form.fields.IX_GRP_MEETING_ENDDATE.value();
  },

  setNextday: function (row, nextday) {
    var me = this, fields = me.fields;
    row[fields.MEETING_REPETITION_DATE].set(nextday);
  },

  setWeekday: function (row, day) {
    var me = this,
      field = row[me.fields.MEETING_REPETITION_WEEKDAY];
    field.set(day.format(me.options.weekdayFormat));
  },

  setInitialName: function (row) {
    var me = this,
      fields = me.fields,
      form = me.$form;
    row[fields.MEETING_REPETITION_NAME].set(form.fields.IX_GRP_MEETING_NAME.value());
  },

  setInitialTime: function (row) {
    var me = this,
      fields = me.fields,
      form = me.$form,
      startTime = form.fields.IX_MAP_MEETING_TIMESLOT_START1.value() || "",
      endTime = form.fields.IX_MAP_MEETING_TIMESLOT_END1.value() || "";
    row[fields.MEETING_REPETITION_START].set((startTime) ? moment(startTime, me.options.timeFormat).format(me.options.timeFormat) : startTime);
    row[fields.MEETING_REPETITION_END].set((endTime) ? moment(endTime, me.options.timeFormat).format(me.options.timeFormat) : endTime);
  },

  getTable: function () {
    var me = this;
    return me.$form.tables[this.tableId];
  },

  utils: {
    today: function () {
      //TODO: Today function in DateUtils?
      return moment();
    },

    toIso: function (moment, options) {
      return sol.common.DateUtils.momentToIso(moment, options);
    },

    toMoment: function (value) {
      return sol.common.DateUtils.isoToMoment(value);
    },

    tableSize: function (table) {
      return table.size;
    },

    removeAllRows: function (table) {
      var me = this,
        size = me.tableSize(table), i;

      for (i = size; i > 0; i--) {
        table.removeRow(table.getRow(i));
      }
    },

    setFieldOptional: function (row, field) {
      row[field].setAttribute("optional", true);
    },

    fillTime: function (value) {
      return sol.common.DateUtils.fillTime(value);
    }
  }


});


sol.define("sol.meeting.forms.plugins.RoleHandler", {
  requiredConfig: ["tableId", "fields"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  OnAddLine: function (name, index, row) {
    var me = this;

    if (!me.hasRole(row)) {
      me.setRole(row, "P");
    }
  },

  hasRole: function (row) {
    var me = this;
    return (row[me.fields.MEETING_PARTICIPANT_ROLE].value() != "");
  },

  setRole: function (row, role) {
    var me = this;
    row[me.fields.MEETING_PARTICIPANT_ROLE].set(role);
  }

});


/**
 * @requires IX_GRP_MEETING_REGISTER_DEADLINE
 * @requires IX_MAP_MEETING_BOARD_SETTING_DEADLINES_ACTIVATE
 * @requires IX_MAP_MEETING_DEADLINE_TYPE
 * @requires IX_MAP_MEETING_REGISTER_DEADLINE_EXCEEDED
 */
sol.define("sol.meeting.forms.plugins.Deadlines", {



  initialize: function (config) {
    var me = this;
    me.init = false;
    me.$super("sol.Base", "initialize", [config]);
  },

  OnInit: function () {
    var me = this;

    me.$form.fields.IX_GRP_MEETING_REGISTER_DEADLINE.validator =
            function (fName, value) {
              return me.validDeadline()
                ? false
                : elo.helpers.Text.getText("sol.meeting.forms.meetingBoard.settings.invalidDeadline");
            };
  },

  AfterOnInitAndTabChange: function () {
    var me = this,
        form = me.$form;

    me.once(function () {
      form.when(
        "IX_GRP_MEETING_REGISTER_DEADLINE",
        "IX_MAP_MEETING_DEADLINE_TYPE",
        "IX_MAP_MEETING_BOARD_SETTING_DEADLINES_ACTIVATE",
        function (deadlineField, deadlineTypeField, settingsField) {
          settingsField.value() == "1"
            ? me.handleRegisterDeadline(deadlineField, deadlineTypeField)
            : me.noRegisterDeadlineUsed(deadlineField, deadlineTypeField);
        });
    }).always(function () {
      // after each tab change we have to recalculate
      me.handleDeadlineType(me.$form.fields.IX_MAP_MEETING_DEADLINE_TYPE);
    });
  },


  once: function (startCallback) {
    var me = this; // TODO: this function might be implemented in a generic way

    if (me.init === false) {
      startCallback();
      me.init = true;
    }

    return {
      always: function (cb) {
        cb();
      }
    };
  },

  handleRegisterDeadline: function (deadlineField, deadlineTypeField) {
    var me = this;
    deadlineTypeField.set("sol.meeting.forms.meetingBoard.settings.boardDeadline");
    deadlineField.setAttribute("readonly", true);
    me.scheduleDate();
  },

  noRegisterDeadlineUsed: function (deadlineField, deadlineTypeField) {
    var me = this;
    deadlineTypeField.set("sol.meeting.forms.meetingBoard.settings.noDeadline");
    deadlineField.setAttribute("readonly", false);
    me.$form.tabs._210_meeting_basic.parts._331_deadlines_register.hide();
  },

  AfterInputChanged: function (field) {
    var me = this;

    if (field.fName == "IX_GRP_MEETING_STARTDATE" && field.value()) {
      if (me.isDeadlineActive() && me.selectedBoardSettings()) {
        me.scheduleDate(me.utils.toMoment(field.value(), { withoutTime: true }));
      }
    }


    if (field.fName == "IX_MAP_MEETING_DEADLINE_TYPE") {
      me.handleDeadlineType(field);
    }
  },

  handleDeadlineType: function (field) {
    var me = this;

    switch (field.value()) {
      case "sol.meeting.forms.meetingBoard.settings.boardDeadline":
        if (me.$form.fields.IX_MAP_MEETING_BOARD_SETTING_DEADLINES_ACTIVATE.value() == "1") {
          me.scheduleDate(me.utils.toMoment(me.$form.fields.IX_MAP_MEETING_TIMESLOT_DAY1.value(), { withoutTime: true }));
        } else {
          me.$form.fields.IX_GRP_MEETING_REGISTER_DEADLINE.set("");
        }
        me.getDeadlineRegisterTab().show();
        me.$form.fields.IX_GRP_MEETING_REGISTER_DEADLINE.setAttribute("readonly", true);
        break;
      case "sol.meeting.forms.meetingBoard.settings.customDeadline":
        me.getDeadlineRegisterTab().show();
        me.$form.fields.IX_GRP_MEETING_REGISTER_DEADLINE.setAttribute("readonly", false);
        break;
      case "sol.meeting.forms.meetingBoard.settings.noDeadline":
        me.$form.fields.IX_GRP_MEETING_REGISTER_DEADLINE.setAttribute("readonly", true);
        me.getDeadlineRegisterTab().hide();
        break;
      default:
        break;
    }
  },

  getDeadlineRegisterTab: function () {
    var me = this;
    return me.$form.tabs.all.parts._331_deadlines_register;
  },

  BeforeOnSave: function () {
    var me = this;

    if (me.selectedNoDeadline()) {
      me.$form.fields.IX_GRP_MEETING_REGISTER_DEADLINE.set("");
      me.$form.fields.IX_MAP_MEETING_REGISTER_DEADLINE_EXCEEDED.set("");
    } else {
      me.isDeadlineExceeded(me.$form.fields.IX_GRP_MEETING_REGISTER_DEADLINE.value());
    }
  },

  scheduleDate: function (meetingStartDate) {
    var me = this, shiftValue, shiftUnit, deadline;

    if (!meetingStartDate) {
      meetingStartDate = me.utils.today();
    }
    shiftValue = me.$form.fields.IX_MAP_MEETING_REGISTER_DEADLINE_SHIFT_VALUE.value();
    shiftUnit = me.$form.fields.IX_MAP_MEETING_REGISTER_DEADLINE_SHIFT_UNIT.value().split(" ")[0];

    deadline = meetingStartDate.subtract(shiftValue, shiftUnit);

    me.utils.setDate(me.$form.fields.IX_GRP_MEETING_REGISTER_DEADLINE, deadline);

  },

  validDeadline: function () {
    var me = this,
      result, meetingDateIso, todayIso, deadlineIso, meetingDateMoment, todayMoment, deadlineMoment;

    if (me.selectedNoDeadline()) {
      return true;
    }

    // all ISO
    meetingDateIso = me.$form.fields.IX_GRP_MEETING_STARTDATE.value();
    todayIso = me.utils.toIso(me.utils.today(), { startOfDay: true });
    deadlineIso = me.$form.fields.IX_GRP_MEETING_REGISTER_DEADLINE.value();

    if (meetingDateIso && todayIso && deadlineIso) {

      // all Moment
      meetingDateMoment = me.utils.toMoment(meetingDateIso, { withoutTime: true }).add(1, "days");
      todayMoment = me.utils.toMoment(todayIso, { withoutTime: true }).subtract(1, "days");
      deadlineMoment = me.utils.toMoment(deadlineIso, { withoutTime: true });
      // all back to ISO
      meetingDateIso = me.utils.toIso(meetingDateMoment);
      todayIso = me.utils.toIso(todayMoment);
      deadlineIso = me.utils.toIso(deadlineMoment);

      result = me.utils.isBetween(me.utils.toDate(todayIso), me.utils.toDate(meetingDateIso), me.utils.toDate(deadlineIso));
    }

    return result;
  },

  isDeadlineExceeded: function (deadlineDate) {
    var me = this,
      today = me.utils.today().startOf("d");

    if (deadlineDate && me.utils.diff(me.utils.toDate(deadlineDate), today.toDate(), "d") == 0) {
      me.$form.fields.IX_MAP_MEETING_REGISTER_DEADLINE_EXCEEDED.set("1");
    } else {
      me.$form.fields.IX_MAP_MEETING_REGISTER_DEADLINE_EXCEEDED.set("");
    }
  },

  isDeadlineActive: function () {
    var me = this;
    return me.$form.fields.IX_MAP_MEETING_BOARD_SETTING_DEADLINES_ACTIVATE.value() == "1";
  },

  selectedBoardSettings: function () {
    var me = this;
    return me.$form.fields.IX_MAP_MEETING_DEADLINE_TYPE.value() == "sol.meeting.forms.meetingBoard.settings.boardDeadline";
  },

  selectedNoDeadline: function () {
    var me = this;
    return me.$form.fields.IX_MAP_MEETING_DEADLINE_TYPE.value() == "sol.meeting.forms.meetingBoard.settings.noDeadline";
  },

  utils: {
    setDate: function (field, currentDay) {
      var me = this;
      field && field.set(me.toIso(currentDay, { withoutTime: true }));
    },

    isBetween: function (startDate, endDate, checkDate) {
      return sol.common.DateUtils.isBetween(startDate, endDate, checkDate);
    },

    diff: function (startDate, endDate, unit, config) {
      return sol.common.DateUtils.diff(startDate, endDate, unit, config);
    },

    today: function () {
      return moment();
    },

    toIso: function (date, config) {
      return sol.common.DateUtils.dateToIso(date, config);
    },

    toMoment: function (date, config) {
      return sol.common.DateUtils.isoToMoment(date, config);
    },

    toDate: function (isoDate, config) {
      return sol.common.DateUtils.isoToDate(isoDate, config);
    }
  }
});


sol.define("sol.meeting.forms.ScheduleValidationUtils", {
  singleton: true,

  config: {
    HOUR_MIN: "HH:mm",
    invalidScheduleTxt: "sol.meeting.forms.meeting.schedule.validationError"
  },

  runValidator: function (data, options) {
    var me = this, schedule;
    schedule = me.calcSchedule(data, options);
    return sol.meeting.forms.ScheduleValidationUtils.checkSchedule(schedule.startTime, schedule.endTime);
  },

  checkSchedule: function (startTime, endTime) {
    var me = this;
    if (!startTime || !endTime) {
      return;
    }
    if (!me.isTimeScheduleValid(startTime, endTime)) {
      return elo.helpers.Text.getText(me.config.invalidScheduleTxt);
    }
  },

  isTimeScheduleValid: function (startTime, endTime) {
    var me = this;
    return me.startIsBeforeEnd(startTime, endTime) && me.endIsAfterStart(startTime, endTime);
  },

  startIsBeforeEnd: function (startTime, endTime) {
    if (!moment.isMoment(startTime) || !moment.isMoment(endTime)) {
      throw Error("Times must be moment objects");
    }
    return startTime.isBefore(endTime);
  },

  endIsAfterStart: function (startTime, endTime) {
    if (!moment.isMoment(startTime) || !moment.isMoment(endTime)) {
      throw Error("Times must be moment objects");
    }
    return endTime.isAfter(startTime);
  },

  calcSchedule: function (timeData, config) {
    var me = this, result = {}, momDate, momStartTime, momEndTime;
    timeData = timeData || {};
    config = config || {};

    if (!timeData.date || !timeData.startTime || !timeData.endTime) {
      return result;
    }

    config.startTimeFormat = config.startTimeFormat || me.config.HOUR_MIN;
    config.endTimeFormat = config.endTimeFormat || me.config.HOUR_MIN;

    momDate = sol.common.DateUtils.isoToMoment(timeData.date);
    momStartTime = moment(timeData.startTime, config.startTimeFormat, true);
    momEndTime = moment(timeData.endTime, config.endTimeFormat, true);

    if (!momDate.isValid() || !momStartTime.isValid() || !momEndTime.isValid()) {
      return result;
    }

    result.startTime = momDate.clone().add({ hours: momStartTime.hours(), minutes: momStartTime.minutes() });
    result.endTime = momDate.clone().add({ hours: momEndTime.hours(), minutes: momEndTime.minutes() });

    return result;
  }
});

sol.define("sol.meeting.forms.module.NotificationDateCalculator", {

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  AfterInputChanged: function (field) {
    var me = this,
    table = me.getTable();

    var row = table.getRowByField(field);
    me.scheduleNotificationDate(row);
  },

  AfterOnInitAndTabChange: function () {
    var me = this,
      table = me.getTable();

    table.forEach(function (row) {
      me.scheduleNotificationDate(row);
    });
  },

  scheduleNotificationDate: function (row) {
    var me = this,
      referenceDateField,
      referenceDateValue,
      calculatedDate;

    me.$form.when(
      row["IX_MAP_MEETING_NOTIFICATION_SHIFT_VALUE_"],
      row["IX_MAP_MEETING_NOTIFICATION_SHIFT_UNIT_"],
      row["IX_MAP_MEETING_NOTIFICATION_SIGN_"],
      row["IX_MAP_MEETING_NOTIFICATION_REFERENCE_DATE_"],
      function (notificationShiftField, notificationShiftUnitField, notificationSignField, referenceDate) {
        if (notificationShiftField.value() && notificationShiftUnitField.value() && notificationSignField.value() && referenceDate.value()) {

          referenceDateField = me.referenceDateFields[referenceDate.value()];
          if(me.$form.fields[referenceDateField]){
            referenceDateValue = me.$form.fields[referenceDateField].value();
          }

          if (referenceDateValue){
            calculatedDate = me.calculateDate(notificationShiftField.value(), notificationShiftUnitField.value(), notificationSignField.value(), referenceDateValue);
            row["IX_MAP_MEETING_NOTIFICATION_DATE_"].set(me.utils.toLocalDateString(calculatedDate))
          } else {
            row["IX_MAP_MEETING_NOTIFICATION_DATE_"].set("");
          }


        } else {
          row["IX_MAP_MEETING_NOTIFICATION_DATE_"].set("");
        }
      });
  },

  calculateDate: function (notificationShiftValue, notificationShiftUnit, notificationSign, referenceDateValue) {
    var me = this,
      calculatedDateMoment;

    if (notificationSign.startsWith("+")) {
      calculatedDateMoment = me.utils.toMoment(referenceDateValue, { withoutTime: true }).add(notificationShiftValue, notificationShiftUnit);
    } else {
      calculatedDateMoment = me.utils.toMoment(referenceDateValue, { withoutTime: true }).subtract(notificationShiftValue, notificationShiftUnit);
    }

    return me.utils.toIso(calculatedDateMoment);
  },

  getTable: function () {
    var me = this;
    return me.$form.tables[this.tableId];
  },

  utils: {
    toIso: function (date, config) {
      return sol.common.DateUtils.dateToIso(date, config);
    },

    toMoment: function (date, config) {
      return sol.common.DateUtils.isoToMoment(date, config);
    },

    toLocalDateString: function (date) {
      return sol.common.DateUtils.isoToDate(date).toLocaleDateString();
    }
  }
});