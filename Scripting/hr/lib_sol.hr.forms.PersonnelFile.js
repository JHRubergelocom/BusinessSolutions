/**
 * Represents a Personnel File
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @elowf
 * @requires sol.common.forms.FormWrapper
 */

sol.define("sol.hr.forms.PersonnelFile", {
  extend: "sol.common.forms.FormWrapper",
  prefix: "HR_PERSONNEL",
  defaultState: "defaultState",

  OnInit: function () {
    // to be executed one time during init
    var me = this;
    // set coversheet profile picture
    (function (field) {
      field && (
        field.value()
          ? field.setImage() // set image stored in sord
          : field.setImageUrl("./images/sol.hr.user-image-big.jpg")
      );
    }(me.fields.IX_GRP_HR_PERSONNEL_PHOTO_GUID));


  },
  AfterInputChanged: function () {
    var me = this;
    (me.fields.IX_GRP_HR_PERSONNEL_ENDOFPROBATIONARY && me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL) && (
      (me.fields.IX_GRP_HR_PERSONNEL_ENDOFPROBATIONARY.value() > me.today())
        ? me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL.hide(true, true) || me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLENOTICE.show(true, true)
        : me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL.show(true, true) || me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLENOTICE.hide(true, true)
    );
  },
  onSaveRules: {
    personnelFile: {
      solType: "PERSONNELFILE",
      saveValues: function () {
        return true;
      }, // of course, Boolean can also be defined. But functions seemed nice here.
      registerUpdate: true
    }
  },
  states: {
    stateInit: {
      fieldProperties: {
        IX_MAP_HR_FILE_REVIEW_ACTIVE: {
          responder: function (form, state, field, value) {
            // using HR_FILE_REVIEW_ACTIVE as Checkbox here ...
            form.fields.WF_MAP_INQUIRY_REVIEWER_USER_ID.set(value === "1" ? ELO_PARAMS.ELO_CONNECTUSERNAME : "");
          }
        },
        IX_GRP_HR_PERSONNEL_SUPERIOR: {
          responder: function (form, state, field, value) {
            // add elouser-tooltip to superior field
            (value && form.fields.IX_MAP_HR_PERSONNEL_SUPERIORUSERID)
            && field.writeTooltip("ELO-User: '" + form.fields.IX_MAP_HR_PERSONNEL_SUPERIORUSERID.value() + "'");
          }
        },
        IX_GRP_HR_PERSONNEL_MENTOR: {
          responder: function (form, state, field, value) {
            // add elouser-tooltip to mentor field
            (value && form.fields.IX_MAP_HR_PERSONNEL_MENTORUSERID)
            && field.writeTooltip("ELO-User: '" + form.fields.IX_MAP_HR_PERSONNEL_MENTORUSERID.value() + "'");
          }
        },
        IX_MAP_HR_PERSONNEL_PHOTO_OBJID: {
          template: {
            name: "fileChooserVariants",
            config: {
              accept: "image/jpeg, image/jpg, image/png",
              maxSize: "3", //Megabyte (float values possible)
              solTypeForRule: "PERSONNELFILE",
              photoReferenceField: "HR_PERSONNEL_PHOTO_GUID", // must be GRP
              photoReferenceFieldObjId: "HR_PERSONNEL_PHOTO_OBJID", // must be MAP
              photoConfig: {
                maskName: "Personnel file document",
                pictureName: "Mitarbeiterfoto"
              }
            }
          }
        },
        IX_MAP_DURATION_TYPE: {
          template: {
            name: "toggle",
            config: {
              toggleOptionFieldName: "IX_MAP_DURATION_TYPE",
              onValue: "sol.hr.form.personnelfile.fixedterm",
              offValue: "sol.hr.form.personnelfile.permanent",
              defaultState: {
                fieldProperties: {
                  _batch: [
                    {
                      hidden: {
                        val: true,
                        fields: [
                          "IX_GRP_HR_PERSONNEL_DATEOFJOINING", "IX_GRP_HR_PERSONNEL_DATEOFLEAVING", "IX_GRP_HR_PERSONNEL_LASTDAYOFWORK", "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE", "IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL", "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_TP", "IX_MAP_HR_PERSONNEL_TERMOFCONTRACT", "IX_MAP_HR_PERSONNEL_TERMOFCONTRACT_UNIT"
                        ]
                      }
                    }
                  ]
                },
                tabProperties: {
                  all: {
                    _530_probationary_period: {
                      hidden: true
                    }
                  }
                }
              },
              onState: {
                fieldProperties: {
                  IX_MAP_HR_PERSONNEL_TERMOFCONTRACT: {
                    hidden: false
                  },
                  IX_MAP_HR_PERSONNEL_TERMOFCONTRACT_UNIT: {
                    hidden: false
                  },
                  IX_GRP_HR_PERSONNEL_DATEOFLEAVING: {
                    optional: false,
                    workflowOnly: ["optional"] // only set mandatory if in workflow
                  }
                }
              },
              offState: {
                fieldProperties: {
                  IX_MAP_HR_PERSONNEL_TERMOFCONTRACT: {
                    hidden: true
                  },
                  IX_MAP_HR_PERSONNEL_TERMOFCONTRACT_UNIT: {
                    hidden: true
                  },
                  IX_GRP_HR_PERSONNEL_DATEOFLEAVING: {
                    optional: true
                  }
                }
              },
              anyState: {
                fieldProperties: {
                  _batch: [
                    {
                      hidden: {
                        val: false,
                        fields: [
                          "IX_GRP_HR_PERSONNEL_DATEOFJOINING", "IX_GRP_HR_PERSONNEL_DATEOFLEAVING", "IX_GRP_HR_PERSONNEL_LASTDAYOFWORK", "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE", "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_TP", "IX_MAP_HR_PERSONNEL_TERMOFCONTRACT", "IX_MAP_HR_PERSONNEL_TERMOFCONTRACT_UNIT"
                        ]
                      }
                    },
                    {
                      value: {
                        val: "w",
                        fields: [
                          "IX_MAP_HR_PERSONNEL_PERIODOFNOTICEPROBATIONARY_UNIT", "IX_MAP_HR_PERSONNEL_PERIODOFNOTICEPROBATIONARY_TP", "IX_MAP_HR_PERSONNEL_PROBATIONARYPERIODDURATION_UNIT", "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_UNIT", "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_TP", "IX_MAP_HR_PERSONNEL_TERMOFCONTRACT_UNIT"
                        ]
                      }
                    }
                  ]
                },
                tabProperties: {
                  all: {
                    _530_probationary_period: {
                      hidden: false
                    }
                  }
                }
              }
            }
          }
        },
        IX_GRP_HR_PERSONNEL_DATEOFJOINING: {
          responder: function (form, state, field, value) {
            var props = form.states.stateInit.fieldProperties, fieldNames = ["IX_GRP_HR_PERSONNEL_DATEOFLEAVING", "IX_GRP_HR_PERSONNEL_ENDOFPROBATIONARY"];
            fieldNames.forEach(function (fName) {
              config = props[fName].template.config;
              if (form.fields[config.startDateFnOrValue].value() && form.fields[config.unitSelectorFieldName].value() && form.fields[config.unitValueFieldName].value()) {
                form.setCalculatedDate(config.startDateFnOrValue, config.unitValueFieldName, config.terminationPointFieldName || "", config.targetDateFieldName, config.offsetNumber, config.offsetUnit);
              }
            });
          }
        },
        IX_GRP_HR_PERSONNEL_ENDOFPROBATIONARY: {
          template: {
            name: "dateFromUnitSelector",
            config: {
              startDateFnOrValue: "IX_GRP_HR_PERSONNEL_DATEOFJOINING",
              unitValueFieldName: "IX_MAP_HR_PERSONNEL_PROBATIONARYPERIODDURATION",
              unitSelectorFieldName: "IX_MAP_HR_PERSONNEL_PROBATIONARYPERIODDURATION_UNIT",
              targetDateFieldName: "IX_GRP_HR_PERSONNEL_ENDOFPROBATIONARY",
            }
          }
        },
        IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL: {
          template: {
            name: "dateFromUnitSelector",
            config: {
              recalculate: true,
              startDateFnOrValue: undefined, // == today
              unitValueFieldName: "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE",
              unitSelectorFieldName: "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_UNIT",
              terminationPointFieldName: "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_TP",
              targetDateFieldName: "IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL"
            }
          }
        },
        IX_MAP_HR_PERSONNEL_NEXTPOSSIBLENOTICE: {
          template: {
            name: "dateFromUnitSelector",
            config: {
              recalculate: true,
              startDateFnOrValue: undefined, // == today
              unitValueFieldName: "IX_MAP_HR_PERSONNEL_PERIODOFNOTICEPROBATIONARY",
              unitSelectorFieldName: "IX_MAP_HR_PERSONNEL_PERIODOFNOTICEPROBATIONARY_UNIT",
              terminationPointFieldName: "IX_MAP_HR_PERSONNEL_PERIODOFNOTICEPROBATIONARY_TP",
              targetDateFieldName: "IX_MAP_HR_PERSONNEL_NEXTPOSSIBLENOTICE"
            }
          }
        },
        IX_GRP_HR_PERSONNEL_DATEOFLEAVING: {
          template: {
            name: "dateFromUnitSelector",
            config: {
              startDateFnOrValue: "IX_GRP_HR_PERSONNEL_DATEOFJOINING",
              unitValueFieldName: "IX_MAP_HR_PERSONNEL_TERMOFCONTRACT",
              unitSelectorFieldName: "IX_MAP_HR_PERSONNEL_TERMOFCONTRACT_UNIT",
              targetDateFieldName: "IX_GRP_HR_PERSONNEL_DATEOFLEAVING",
            }
          }
        },
        IX_MAP_HR_PERSONNEL_FILECASSATIONTOGGLE: {
          template: {
            name: "toggle",
            config: {
              toggleOptionFieldName: "IX_MAP_HR_PERSONNEL_FILECASSATIONTOGGLE",
              onValue: "sol.hr.form.personnelfile.cassationactive",
              offValue: "sol.hr.form.personnelfile.nocassation",
              defaultState: {
                fieldProperties: {
                  IX_MAP_HR_PERSONNEL_FILECASSATIONPERIOD: {
                    hidden: true,
                    value: "",
                    overwrite: true
                  },
                  IX_MAP_HR_PERSONNEL_FILECASSATIONPERIOD_UNIT: {
                    hidden: true
                  },
                  IX_GRP_HR_PERSONNEL_FILECASSATIONDATE: {
                    hidden: true,
                    value: "",
                    overwrite: true
                  }
                }
              },
              onState: {
                fieldProperties: {
                  IX_MAP_HR_PERSONNEL_FILECASSATIONPERIOD: {
                    hidden: false
                  },
                  IX_MAP_HR_PERSONNEL_FILECASSATIONPERIOD_UNIT: {
                    hidden: false,
                    value: "y"
                  },
                  IX_GRP_HR_PERSONNEL_FILECASSATIONDATE: {
                    hidden: false
                  }
                }
              },
              offState: {
                fieldProperties: {
                  IX_MAP_HR_PERSONNEL_FILECASSATIONPERIOD: {
                    hidden: true,
                    value: "",
                    overwrite: true
                  },
                  IX_MAP_HR_PERSONNEL_FILECASSATIONPERIOD_UNIT: {
                    hidden: true
                  },
                  IX_GRP_HR_PERSONNEL_FILECASSATIONDATE: {
                    hidden: true,
                    value: "",
                    overwrite: true
                  }
                }
              }
            }
          }
        },
        IX_GRP_HR_PERSONNEL_FILECASSATIONDATE: {
          template: {
            name: "dateFromUnitSelector",
            config: {
              startDateFnOrValue: "IX_GRP_HR_PERSONNEL_DATEOFLEAVING",
              unitValueFieldName: "IX_MAP_HR_PERSONNEL_FILECASSATIONPERIOD",
              unitSelectorFieldName: "IX_MAP_HR_PERSONNEL_FILECASSATIONPERIOD_UNIT",
              targetDateFieldName: "IX_GRP_HR_PERSONNEL_FILECASSATIONDATE",
              validationMessage: "Da im Feld `Kassationsdatum` ein von der Berechnung abweichender Wert eingegeben wurde, ist dieses Feld jetzt gesperrt. Leeren Sie das Feld, wenn Sie die Berechnungsfunktion verwenden möchten!"
            }
          }
        },
        IX_GRP_HR_PERSONNEL_TEMPORARY_AUTODELETE: {
          template: {
            name: "dateFromUnitSelector",
            config: {
              startDateFnOrValue: undefined, // = today
              unitValueFieldName: "IX_MAP_HR_PERSONNEL_TEMPORARY_AUTODELETE_PERIOD",
              unitSelectorFieldName: "IX_MAP_HR_PERSONNEL_TEMPORARY_AUTODELETE_PERIOD_UNIT",
              targetDateFieldName: "IX_GRP_HR_PERSONNEL_TEMPORARY_AUTODELETE",
              validationMessage: "Da im Feld `Kassationsdatum` ein von der Berechnung abweichender Wert eingegeben wurde, ist dieses Feld jetzt gesperrt. Leeren Sie das Feld, wenn Sie die Berechnungsfunktion verwenden möchten!"
            }
          }
        }
      },
      tabProperties: {}
    },
    defaultState: {
      bodyClasses: [
        "default"
      ],
      OnInitAndTabChange: function () {
        //to be executed one time on init and every time the tab is changed
        var me = this, requestDataHistory, necessaryFields;

        if (me.fields.IX_BLOB_RQDATAHISTORY && me.fields.IX_BLOB_RQDATAHISTORY.value()) {
          try {
            requestDataHistory = JSON.parse(me.fields.IX_BLOB_RQDATAHISTORY.value());
            necessaryFields =
              requestDataHistory
                .map(function (field) {
                  return Object.keys(field)[0];
                });

            // hide all parts not needed for displaying the request
            if (ELO_PARAMS.ELO_FLOWID == "-1") {
              me.tabs.all.hideUnnecessaryParts(necessaryFields);
              me.tabs.all.parts._720_reason_date.show(); // show fulfillment date and reason
            }

            // write tooltips containing original values
            requestDataHistory.forEach(function (history) {
              var fieldName = Object.keys(history)[0], field = me.fields[fieldName], msg;
              msg = history[fieldName] && "Original: <br> " + (
                field.isDate
                  ? elo.wf.date.format(history[fieldName])
                  : history[fieldName]
              ) + "<br><br>";
              field && field.writeTooltip(msg + field.tooltip());
            });
          } catch (e) {
            console.log("Hiding unnecessary fields and displaying tooltips failed: " + e);
          }
        }

        // add elouser-tooltip to superior field
        (me.fields.IX_GRP_HR_PERSONNEL_SUPERIOR && me.fields.IX_GRP_HR_PERSONNEL_SUPERIOR.value() && me.fields.IX_MAP_HR_PERSONNEL_SUPERIORUSERID)
        && me.fields.IX_GRP_HR_PERSONNEL_SUPERIOR.writeTooltip("ELO-User: '" + me.fields.IX_MAP_HR_PERSONNEL_SUPERIORUSERID.value() + "'");

        // add elouser-tooltip to mentor field
        (me.fields.IX_GRP_HR_PERSONNEL_MENTOR && me.fields.IX_GRP_HR_PERSONNEL_MENTOR.value() && me.fields.IX_MAP_HR_PERSONNEL_MENTORUSERID)
        && me.fields.IX_GRP_HR_PERSONNEL_MENTOR.writeTooltip("ELO-User: '" + me.fields.IX_MAP_HR_PERSONNEL_MENTORUSERID.value() + "'");

        // hide termination template if employee is still employed
        if (me.fields.IX_MAP_HR_PERSONNEL_DATEOFNOTICE && me.fields.IX_MAP_HR_PERSONNEL_DATEOFNOTICE.value() === "") {
          me.setState("hideTerminationTemplate");
        }

        // if user views inquired personnel file hide time-tool
        me.fields.IX_GRP_SOL_TYPE
        && me.fields.IX_GRP_SOL_TYPE.value() === "INQUIRED_PERSONNELFILE"
        && me.tabs.all.parts._540_time_controlling
        && me.tabs.all.parts._540_time_controlling.hide();

        // if we are still in probationary period
        (me.fields.IX_MAP_HR_PERSONNEL_ENDOFPROBATIONARY && me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL) && (
          (me.fields.IX_MAP_HR_PERSONNEL_ENDOFPROBATIONARY.value() >= me.today())
            ? me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL.hide(true, true) || me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLENOTICE.show(true, true)
            : me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL.show(true, true) || me.fields.IX_MAP_HR_PERSONNEL_NEXTPOSSIBLENOTICE.hide(true, true)
        );

        // unhide dateofleaving if it has a value. (may be hidden if no employment type has been selected so far but termination workflow has been executed.)
        (function (field) {
          field && field.value() && field.show(true, true);
        }(me.fields.IX_GRP_HR_PERSONNEL_DATEOFLEAVING));

        // readonly in workflow-form
        me.tabs.all.parts._710_hrdepartment_only && me.fields.IX_MAP_HR_REASON_FOR_INQUIRY.setAttribute("readonly", true);

        // double-check in providepersonnelfileaccess
        (me.fields.WF_MAP_INQUIRY_ILLEGAL_USER && me.fields.WF_MAP_INQUIRY_ILLEGAL_SECURITY_ROLE)
        && (me.fields.WF_MAP_INQUIRY_ILLEGAL_USER.value() === "" && me.fields.WF_MAP_INQUIRY_ILLEGAL_SECURITY_ROLE.value() === "")
        && me.setState("hideInquiryWarning");

        // only show this message, if user is a fallback user
        (
          (me.fields.WF_MAP_CHANGEUSER_CHANGEDUSERBY
          && (me.fields.WF_MAP_CHANGEUSER_CHANGEDUSERBY.value() === "" || me.fields.WF_MAP_CHANGEUSER_CHANGEDUSERBY.value() === "FROMFIELD")
          ) || (!me.fields.WF_MAP_CHANGEUSER_CHANGEDUSERBY)
        )
        && me.setState("hideUserFallbackMessage");
      }
    },
    hideUserFallbackMessage: {
      tabProperties: {
        all: {
          _712_fallback_user_msg: {
            hidden: true
          }
        }
      }
    },
    hideInquiryWarning: {
      tabProperties: {
        all: {
          _711_inquiry_warning: {
            hidden: true
          }
        }
      }
    },
    hideTerminationTemplate: {
      tabProperties: {
        all: {
          _520_termination: {
            hidden: true
          }
        }
      }
    }
  }
});