/**
 * @abstract
 * Provides extensive utilities for working with ELO-forms.
 *
  *
   * Using FormWrapper's simple state-manager, you can define
   * application states consisting of fields and their respective:
   *
   *  - values
   *  - labels
   *  - tooltips
   *  - placeholder
   *  - attributes (readonly / hidden / optional)
   *  - responders:
   *    a responder is a function which will get called when the field's value is changed
   *  - validators:
   *    a validator is a function which will get called when a field is clicked. Afterwards
   *    the validation massage is shown in the client.
   *
   *  There is also support for behaviour templates which provide common behaviours to a group of fields.
   *  You can use templates defined in FormWrapper.Templates (end of this file)
   *
   * # Setup
   *
   *  The Wrapper must be initialized in a form's `Header.txt`.
   *  e.g.:
   *
   *     <script type="text/javascript" src="lib_sol.common.forms.FormWrapper"></script>
   *     <script type="text/javascript" src="lib_sol.hr.forms.PersonnelFile"></script>
   *
   *  `lib_sol.hr.forms.PersonnelFile` will be a separate class extending
   *  the form-wrapper by the customer specific logic. Therefore, also add these entries to your `Header.txt`:
   *
   *     // ELO < 10.1 does not support onInit here. Just add these lines to inputChanged source == null instead.
   *     function onInit() {
   *       this.form = sol.create("sol.hr.forms.PersonnelFile");
   *       this.form.OnInitAndTabChange();
   *     }
   *
   *     function tabChanged(id) {
   *       this.form.TabChanged(id);
   *     }
   *
   *     function inputChanged(source) {
   *       source == null ?
   *         window.setTimeout(function() { sol.common.forms.Utils.initializeForm(); }, 100)
   *         : this.form.InputChanged(source);
   *     }
   *
   *     function nextClicked(id) {
   *       return (
   *         sol.common.forms.Utils.disableCancelButtonValidation(id, ["sol.common.wf.node.cancel"])
   *         || this.form.OnSave()
   *       );
   *     }
   *
   *     function saveClicked() {
   *       return this.form.OnSave();
   *     }
   *
   *     function addLineClicked(addLineId, groupIndex) {
   *       this.form.LineAdded(addLineId, groupIndex);
   *     }
   *
   *     function removeLineClicked(addLineId, groupIndex) {
   *       return this.form.LineRemoved(addLineId, groupIndex);
   *     }
   *
   *     function onDynListItemSelected(item, inputName) {
   *       this.form.InputChanged(item, inputName);
   *     }
   *
   *  By defining all customer specific logic in the extending class, your `Header.txt` will be much cleaner.
   *  It is recommended not to call any additional customer specific util-functions in `Header.txt`. Instead, you
   *  should `include` your customer-specific logic solely in the extending class.
   *
   *  You can define and use multiple extending classes in one Header.txt.
   *
   *  Minimal example for an extending class `PersonnelFile`:
   *
   *     sol.define("sol.hr.forms.PersonnelFile", {
   *       extend: "sol.common.forms.FormWrapper",
   *       prefix: "HR_PERSONNEL"  // usually all customer-specific fields have some kind of prefix. You can define it here.
   *     }
   *
   * # Usage
   *  The wrapper functions are now available in the form. These are some common use-cases:
   *
   * ### Field functions (this.form.fields.FIELDNAME)
   * Every field on the form (MAP,GRP) is represented as an object.
   *    .value(opts)-   returns the field's value.
   *                    (isodate for date-fields and the key for localized Kwls).
   *                    pass `{full: true}` to receive the localized value of an lKwl instead of key only
   *                    pass `{asNumber: true}` to receive the value as a number. (e.g. valuable for localized number strings)
   *
   *    .set(val)   -   replaces the field's value by `val`
   *                    (for val, pass an isodate date-fields and for localizedKwls pass the key)
   *
   *    .element()  -   returns the field's HTML element
   *
   *    .show()     -   displays the field in the form
   *                    (will also show the field's label and selector if called with .(true, true))
   *
   *    .hide()     -   hides the field
   *                    (will also hide the field's label and selector if called with .(true, true))
   *
   *    .setAttribute("readonly", true)
   *                -   renders a field readonly (pass false to make it writeable again)
   *
   *    .setAttribute("optional", true)
   *                -   makes a field optional. Pass false to make a field required
   *
   *    .tooltip()
   *                -   if a tooltip is defined, returns the tooltip as a String
   *
   *    .writeTooltip(tooltip)
   *                -   Adds a tooltip to the field
   *                -   removes tooltip if falsy value is passed
   *
   *    .setPlaceholder(value)
   *                -   set a placeholder text on the related field input element
   *
   *    .setImage(guid)   -   only works on image-fields! Downloads an image specified by guid and sets the image-fields src-attribute
   *                         if no guid is passed, but the sord contains a guid as the fields value, it will be used as a fallback
   *
   *  show and hide of labels will only work, if you assign the label's "variable" field a value of "LBL_" + me.prefix + `Fieldname without (WF/IX)_(MAP/GRP) and without prefix`
   *  and the label's respective input-field's variable field contains the prefix defined in the extending class definition (e.g. HR_PERSONNEL)
   *
   * ### Form functions (this.form)
   *
   *    .setState(statename)
   *                -   transforms the form according to the state-definition
   *
   *    .activeState
   *                -   stores the currently active state
   *
   *    .getActiveTabId()
   *                -   returns the id of the currently active tab (e.g. "_501_time_phases")
   *
   *    .today()    -   returns the current client date as an isodate
   *
   *    .logFieldValues(b) -   logs all fieldnames and their values to the console (as a table if implemented). pass true as parameter to return fields and values as an array instead of a console-log
   *
   *
   * ### Tabs functions (this.form.tabs)
   *    ._tabName  -   returns the tab object of the tab "tabName"
   *
   *    .activeTab  -   returns the tab object of the active tab
   *
   *    .all  - holds an object containing all templates which are available on the form
   *
   * ### Tab functions (this.form.tabs._tabName)
   *    .parts      -   holds an object containing the tab's templates (called "parts" in this framework)
   *
   *    .parts._partName - holds the part-object having the name "partName"
   *
   *    .containsCover  - boolean. does the tab contain a business solution coversheet? (__cover)
   *
   *    .hidePartsContainingOnlyEmptyFields() - hides all parts of a tab which where none of each part's fields has a value.
   *
   *    .hideUnnecessaryParts(array) - hides all parts which do not contain any of the fields listed in the passed array
   *
   * ### Template/Part functions (this.form.tabs_tabName.parts._partName)
   *    .show()     -   shows the template/part
   *
   *    .hide()     -   hides the template/part
   *
   *    .isCover    -   is the part a business solution coversheet? (__cover)
   *
   * ### Table functions (this.form.tables[tableId])
   *    .columns    -   holds an array containing the names of all columns of the respective table
   *
   *    .size       -   number of rows in the table
   *
   *    .getRow(x)   -   receives the specified table row with index x. returns a row even if it does not exist.
   *                     you can check for a non-existant row by using .getRow(x).row == undefined
   *
   *    .getRowByField(field) - receives table row by field. Use fieldindex to return the corresponding table row.
   *                     returns undefined if field isn't a column in given table.  Method is only supported on table object.
   *                     example: form.tables.tableId.getRowByField(field)
   *
   *    .insert(obj) -  inserts an object or an array of objects containing column: value pairs. ({my_column: "test"}).
   *                    optional second parameter: array of fieldnames. if specified fields are all empty, the latest existing row is used. otherwise, data is inserted in a new row.
   *                    returns an array of all added rows
   *    .forEach(cb)  -   like forEach of arrays. the callback receives an object containing the columns of a row.
   *
   *    .map(cb)    -   like map of arrays.
   *
   *    .filter(cb) -   like filter of arrays.
   *
   *    .slice()    -   like slice of arrays. useful to convert a table to an array on which other array function can be used. (e.g. .some, .any, .reduce ...)
   *
   * # States:
   *  The class extending sol.common.forms.FormWrapper can define multiple states, which can be
   *  set e.g. on input-changed events (responders). Usually, states are changed in "responder"-functions or
   *  the "BeforeOnInitAndTabChange" function, which will be called once during initialization
   *  of the wrapper and again on every tab-change. "AfterOnInitAndTabChange" is called
   *  after all states' "OnInitAndTabChange"-functions were called. (see e.g. templates, which
   *  define their own OnInitAndTabChange function).
   *  There is also "BeforeInputChanged" and "AfterInputChanged", which will be called
   *  before/after the changed field's responder has been executed.
   *  LineRemoved calls OnRemoveLine, which you can define in your extending class. Also,
   *  AfterOnRemoveLine is called when the form has finished removing the table row. You
   *  will usually want to use AfterOnRemoveLine, since it also gets passed the removed row values.
   *  You should not use the obsolete OnLineChange function, since you would have to find out
   *  manually if a line has been added or removed each time (which could be impossible to determine).
   *
   *
   * ### Order of computation
   *     (# means, you can define this function in the extending class)
   *     initialize: called during sol.create
   *       #OnInit
   *     OnInitAndTabChange: called when initializing form and on a tab change
   *       #BeforeOnInitAndTabChange
   *       Calls all OnInitAndTabChange functions which are defined in templates or states. (#template.OnInitAndTabChange and #state.OnInitAndTabChange)
   *       #AfterOnInitAndTabChange
   *     InputChanged: called when an input field´s value changes
   *       #BeforeInputChanged
   *       Calls the changed field´s #responder function
   *       #AfterInputChanged
   *     LineRemoved: called, when a JS_REMOVELINE button is clicked.
   *       #OnRemoveLine
   *       #AfterOnRemoveLine
   *     LineAdded: called, when a JS_ADDLINE button is clicked.
   *       #OnAddLine
   *     OnSave: called when "save" is clicked
   *       #BeforeOnSave
   *       Calls all rules defined in #onSaveRules
   *       #AfterOnSave
   *
   *
   *
   * ### Exemplary Formwrapper extending class:
   *     sol.define("sol.hr.forms.PersonnelFile", {
   *       extend: "sol.common.forms.FormWrapper",
   *       prefix: "HR_PERSONNEL",   // IX_MAP_HR_PERSONNEL_DATEOFJOINING -> Prefix = HR_PERSONNEL
   *       defaultState: "myDefaultState",
   *       //states begin
   *       states: {
   *         stateInit: {  //stateInit is called automatically when the form is initially loaded
   *           //declare your desired initial state here (usually responders and validators)
   *           fieldProperties: {
   *             IX_MAP_DURATION_TYPE: {
   *               responder: function(form, state, field, value) {
   *                 if (value == "") { form.setState("myDefaultState")
   *                 } else { form.setState("durationTypeSelected") };
   *               }
   *             }
   *           }
   *         },
   *         myDefaultState: {
   *           fieldProperties: {
   *             IX_MAP_HR_PERSONNEL_DEPARTMENT: {
   *               hidden: true
   *             }
   *           }
   *         },
   *         durationTypeSelected: {
   *           fieldProperties: {
   *             IX_MAP_HR_PERSONNEL_DEPARTMENT: {
   *               value: "Sales"
   *               hidden: false
   *             }
   *           }
   *         },
   *         departmentHasAValue: {
   *           fieldProperties: { IX_MAP_HR_PERSONNEL_DEPARTMENT: { hidden: false } }
   *         },
   *       }
   *     }
   *
   * ### Explanation
   *
   *  First, during initialization, the stateInit state is set. Here, we assign a responder
   *  function to the field "IX_MAP_DURATION_TYPE", which will set the state "durationTypeSelected"
   *  as soon as the field has any value.
   *
   *  The "myDefaultState" is set directly after "stateInit", because we defined it as me.defaultState
   *  In "myDefaultState", the field IX_MAP_HR_PERSONNEL_DEPARTMENT will be hidden.
   *
   *  If someone enters a value into the "IX_MAP_DURATION_TYPE" field, its responder will be executed.
   *  The responder sets the state "durationTypeSelected", which sets the DEPARTMENT-field's value to
   *  "Sales" and unhides/shows the field in the form.
   *
   *  Validators:
   *  You can define Validators in the fieldProperties of a field by assigning a "validator:" property.
   *  Tip: You don't have to define the validation function ("JS_VAL_...") in the form designer anymore!
   *
   *  BodyClasses:
   *  You can define CSS-Bodyclasses in every state:
   *  myDefaultState: { bodyClasses: ["greatDesign", "flexibleTable"] }
   *  Attention: body classes will be removed, as soon as you execute "setState" for another state.
   *  To keep body-classes during state-change, you must define the property e.g.
   *  "myDefaultState.removePreviousBodyClasses: false" in subsequent states
   *
   *  Template:
   *  To use a template, you have to define it instead of (or alongside) a field's properties.
   *  e.g.
   *
   *     ...
   *     fieldProperties: {
   *       IX_MAP_HR_PERSONNEL_CASSATIONTOGGLE: {
   *         template: "toggle"
   *         config: { ... } //see documentation at the end of this file for template configs.
   *       }
   *     }
   *     ...
   *
   *  Batchprocessing:
   *  It is tedious to define field:{hidden: true} if you want to hide many fields at once.
   *  You can use all field properties (hidden, readonly, optional, value, responder, ...) in batch
   *  processing. Example:
   *
   *     fieldProperties: {
   *       _batch: [{
   *         hidden: {
   *           val: true,
   *           fields: [
   *             "IX_GRP_HR_PERSONNEL_DATEOFJOINING", "IX_MAP_HR_PERSONNEL_PROBATIONARYPERIODDURATION"
   *           ]
   *         }
   *       }]
   *     }
   *
   *  Of course you can combine batch-processing and ´normal´ attribute setting.
   *
   *  If you want to define your own templates, you can do so in the "OnInit" function.
   *  Just add your own templates to form.templates. E.g.:
   *
   *     form.templates.mygreattemplate = function (config) { ...  return configuredTemplate; };
   *
   * ### Conclusion
   *
   *  OnInitAndTabChange should be used to set up the environment for the user.
   *  (what happens if the user switches tabs,... )
   *
   *  Any other state should be defined as ´state´.
   *  If you need more control than the standard field properties (value, hide,...) can offer,
   *  you can and should implement the logic directly in a field's responder instead of creating
   *  a state which won't have sufficient facilities to represent the desired state anyways.
   *
   *
   * # Additional features
   * ### Business Solution Coversheet
   *  The Business Solution Coversheet provides an easy way to display information in a form as readonly-labels
   *  instead of input boxes.
   *
   *  To display any MAP/GRP field in the coversheet, prepend "VIEW_" to its name when defining it in the coversheet
   *  template. e.g. IX_MAP_TEST -> VIEW_IX_MAP_TEST
   *
   *  The template containing the coversheet must be named ending with "__cover" (two underscores)
   *
   *  The required CSS rules will then be applied automatically.
   *
 * @author ESt, ELO Digital Office GmbH
 *
 * @elowf
 * @requires sol.common.DateUtils
 * @requires sol.common.forms.Utils
 */
sol.define("sol.common.forms.FormWrapper", {

  /**
   * will contain all fields of the form after initializeFields has been called
   */
  fields: {},

  /**
   * will contain all tables which are part of the form
   */
  tables: {},

  /**
   * will contain all tabs of the form after initializeTabs has been called
   */
  tabs: {
    all: {
      parts: {}
    }
  },

  /**
   * will contain rules, which are applied when a user presses the save button
   */
  onSaveRules: {},

  /**
   * will contain all template OnInitAndTabChange functions after setState has been called
   */
  onInitAndTabChangeFunctions: [],

  /**
   * holds the active state's name as a string
   */
  activeState: undefined,

  /**
   * true if the form is running in workflow mode. (set in initialize)
   */
  workflowActive: false,

  /**
   * Version of ELO-wf parsed to an Integer. (10.04.032 = 1004032)
   */
  wfVersion: 0,

  /**
   * Name of ELO-wf (e.g. wf-Solutions)
   */
  wfName: "",

  /**
   * Default editor options. editor won't be initialize at start by default
   * because of backwards compatibility
   */
  editorOptions: { initImmediately: false, redactorOptions: {} },

  /**
   *  logs all fieldnames and their values to the console (as a table if implemented in the JS-Engine).
   *  @param {Boolean} nolog returns fields and their values as an array instead of doing a console-log
   *  @returns {[{fieldName: String, fieldValue: String}] || undefined}
   */
  logFieldValues: function (nolog) {
    var me = this;
    return (function (keys) {
      return (nolog && keys) || (console.table ? console.table(keys) : console.log(keys));
    })(
      Object.keys(me.fields)
      .sort(function (a, b) {
        return (a).localeCompare(b);
      })
      .map(function (field) {
        return {
          fieldName: field,
          fieldValue: me.fields[field].value()
        };
      })
    );
  },

  /**
   * returns true if the passed string `str` ends with passed string `needle`, otherwise false
   */
  endsWith: function(str, needle) {
    return (typeof str === "string" && typeof needle === "string")
      && (str.lastIndexOf(needle) + needle.length === str.length);
  },

  /**
   * returns true if the running WF's version is >= the passed `requiredVersion`
   * requiredVersion (String)
   *  e.g. "10.02.000"
   */
  wfMeetsVersionRequirement: function (requiredVersion) {
    var me = this;
    return (typeof requiredVersion === "string" ? +(requiredVersion.replace(/\./g, "", true)) : 0) <= me.wfVersion;
  },

  /**
   * determines the active tab's id e.g. "_510_time_details" and returns it
   * @returns {String}
   */
  getActiveTabId: function () {
    var activeTab = document.getElementsByClassName("selected");
    if (activeTab.length > 0) {
      return activeTab[0].hash && activeTab[0].hash.replace(/^#/, "_") || "none";
    } else {
      return "none";
    }
  },

  /**
   * sets a state from the "states"-object by name
   * @param {String} stateName name of the state as defined in the "states"-object
   */
  setState: function (stateName) {
    var me = this,
        state = me.states[stateName],
        delOldClasses;

    if (state === undefined) {
      return;
    }
    delOldClasses = state.removePreviousBodyClasses;
    // default is to delete old classes
    (delOldClasses === undefined || delOldClasses) && (me.activeState != undefined) && me.removeOldBodyClasses();

    me.setNewBodyClasses(state.bodyClasses);
    me.setFieldProperties(state.fieldProperties);
    me.setTabProperties(state.tabProperties);
    state.reassignlkwls && me.reassignLocalizedKwlValues({
      force: true
    });
    me.assignValidators(state);
    me.assignValidationFunctionsToWindow();
    me.assignResponders(state);

    if (state.OnInitAndTabChange && !(state.OnInitAndTabChange in me.onInitAndTabChangeFunctions)) {
      me.onInitAndTabChangeFunctions.push(state.OnInitAndTabChange);
    }

    me.activeState = stateName;
  },

  /**
   * sets localizedKwl keys again (e.g. to receive translated text)
   * this is usually run once during initialization, but can be called manually at any time
   * @param {force: Boolean} opts if defined, forces a reassignment of all localizedKwl values.
   *                              Usually, only incomplete localizedKwl values are reassigned
   */
  reassignLocalizedKwlValues: function (opts) {
    var me = this;
    for (var fieldname in me.fields) {
      var field = me.fields[fieldname],
          fValue = field.value({
            full: true
          });
      if (field.isLocalized) {
        field.localizedDynKwlName
        && (
            fValue
            && (
              (opts && opts.force) ||
              (fValue.indexOf(" - ") === -1) ||
              (fValue.search(/\w+ - ?$/g) === 0)
            )
        ) && field.set(field.value());
      }
    }
  },


  /**
   * removes all bodyClasses which were set by the previous state
   */
  removeOldBodyClasses: function () {
    var me = this;
    me.removeBodyClasses(me.states[me.activeState].bodyClasses);
  },

  /**
   * removes bodyclasses
   * @private
   */
  removeBodyClasses: function (bodyClasses) {
    var me = this;
    bodyClasses && bodyClasses.forEach(function (bc) {
      me.removeBodyClass(bc);
    });
  },

  /**
   * @private
   */
  setNewBodyClasses: function (bodyClasses) {
    var me = this;
    me.setBodyClasses(bodyClasses);
  },

  /**
   * @private
   */
  setBodyClasses: function (bodyClasses) {
    var me = this;
    bodyClasses && bodyClasses.forEach(function (bc) {
      me.addBodyClass(bc);
    });
  },

  /**
   * determines the current day as isoDate using the beginning of the day as time and returns it
   * @returns {Integer (isodate)}
   */
  today: function () {
    return sol.common.DateUtils.dateToIso(new Date(), {
      startOfDay: true
    });
  },

  /**
   * iterates over the fieldProperties defined in a state and assigns these properties
   * to the respective field
   * @private
   */
  setFieldProperties: function (fieldProperties) {
    var me = this;
    for (var fieldName in fieldProperties) {
      if (fieldName == "_batch") {
        me.batchProcessProperties(fieldProperties[fieldName]);
      } else {
        me.processAFieldsProperties(fieldName, fieldProperties[fieldName]);
      }
    }
  },

  /**
   * iterates over the batchProperties defined in a state and performs the batch-tasks accordingly
   * @private
   */
  batchProcessProperties: function (batchProperties) {
    var me = this,
        propsAsArray = [];
    if (!(batchProperties instanceof Array)) {
      for (var key in batchProperties) {
        propsAsArray.push(batchProperties[key]);
        batchProperties = propsAsArray;
      }
    }
    try {
      batchProperties.forEach(function (o) {
        for (var prop in o) {
          var fields = o[prop].fields,
            value = o[prop].val,
            property = {},
            noLog;
          property[prop] = value;

          if (fields === "all") {
            noLog = true;
            fields = Object.keys(me.fields);
          }
          fields.forEach(function (name) {
            me.processAFieldsProperties(name, property, noLog);
          });
        }
      });
    } catch (e) {
      console.log("_batch property not defined correctly:", e);
    }
  },

  /**
   * used in setFieldProperties to map the defined properties to functions
   * @private
   */
  processAFieldsProperties: function (fieldName, aFieldsProperties, noLog) {
    var me = this, workflowOnlyModes = Array.isArray(aFieldsProperties["workflowOnly"]) && aFieldsProperties["workflowOnly"];

    for (var option in aFieldsProperties) {
      var optionValue = aFieldsProperties[option],
          overwrite = aFieldsProperties["overwrite"],
          field = me.fields[fieldName];
      if (!field || !field.element()) {
        noLog || console.log("Field '" + fieldName + "' does not exist! Skipping ...");
        return;
      }

      if (!me.workflowActive && (workflowOnlyModes && (workflowOnlyModes.indexOf(option) > -1))) {
        noLog || console.log("Rule '" + option + "' for '" + fieldName + "' only active in workflows! Skipping ...");
        continue;
      }

      switch (option) {
        case "value":
          (overwrite && field.set(optionValue)) || (!field.value() && field.set(optionValue));
          break;
        case "readonly":
          field.setAttribute(option, optionValue);
          break;
        case "optional":
          field.setAttribute(option, optionValue);
          break;
        case "hidden":
          field.setAttribute(option, optionValue);
          break;
        case "tooltip":
          field.writeTooltip(optionValue);
          break;
        case "placeholder":
          field.setPlaceholder(optionValue);
          break;
        case "template":
          me.applyTemplate(optionValue);
          field.template = optionValue; // it's nice to have access to the assigned template later...
          break;
        default:
          break;
      }
    }
  },

  /**
   * iterates over the tabProperties defined in a state and assigns these properties
   * to the respective tab. However, you should not try to assign properties to tabs
   * but to parts. (tab names can change too easily which winds up to orphaned rules)
   * @private
   */
  setTabProperties: function (tabProperties) {
    var me = this;
    for (var tabId in tabProperties) {
      //if (tabId == "_batch") {
      //me.batchProcessProperties(tabProperties[fieldName]); // not implemented yet
      //} else { no more else, see description }
      for (var partId in tabProperties[tabId]) {
        me.processAPartsProperties(partId, tabId, tabProperties[tabId][partId]);
      }
    }
  },

  /**
   * used in setTabProperties to map the defined properties to functions
   * @private
   */
  processAPartsProperties: function (partId, tabId, aPartsProperties) {
    var me = this;
    for (var option in aPartsProperties) {
      var optionValue = aPartsProperties[option],
          tab = me.tabs[tabId],
          part;

      if (!tab) {
        console.log("Tab '" + tabId + "' does not exist! Skipping ...");
        return;
      }

      part = tab.parts[partId];
      if (!part) {
        console.log("Formpart '" + partId + "' does not exist! Skipping ...");
        return;
      }
      switch (option) {
        case "hidden":
          part.setAttribute(option, optionValue);
          break;
        case "template":
          me.applyTemplate(optionValue);
          part.template = optionValue; // it's nice to have access to the assigned template later...
          break;
        default:
          break;
      }
    }
  },

  setRowProperties: function(row, rowProperties){
    var me = this, field;
    for (var tableId in rowProperties) {
       for (var columnName in rowProperties[tableId]){
         field = row[columnName];
         field && (function(f){
            me.processAFieldsProperties(f.name, rowProperties[tableId][columnName])
            f.responder = rowProperties[tableId][columnName].responder;
         })(field);
       }
    }
  },

  /**
   * renders a template using the passed config and adds it to the statemanager
   * @private
   */
  applyTemplate: function (templateObject) {
    var me = this,
        tName = templateObject.name,
        tConfig = templateObject.config,
        template = me.templates[tName],
        result;

    result = template.call(me, tConfig);
    me.addTemplateStatesToStates(result.states);

    if (result.OnInitAndTabChange && !(result.OnInitAndTabChange in me.onInitAndTabChangeFunctions)) {
      me.onInitAndTabChangeFunctions.push(result.OnInitAndTabChange);
    }

    if (result.OnSaveRule) {
      me.onSaveRules[result.OnSaveRule.name] = result.OnSaveRule.rule;
    }

    if (result.GlobalFunctions) {
      for (var functionName in result.GlobalFunctions) {
        window[functionName] = result.GlobalFunctions[functionName];
      }
    }
  },

  /**
   * adds states to the statemanager
   * @private
   */
  addTemplateStatesToStates: function (templateStates) {
    var me = this;
    for (var stateName in templateStates) {
      var state = templateStates[stateName];
      if (!state) {
        continue;
      }
      if (me.states[stateName] === undefined) {
        me.states[stateName] = {
          fieldProperties: {}
        };
      }
      for (var fieldName in state.fieldProperties) {
        var field = state.fieldProperties[fieldName];
        if (me.states[stateName].fieldProperties[fieldName] === undefined) {
          me.states[stateName].fieldProperties[fieldName] = {};
        }
        if (me.states[stateName].fieldProperties === undefined) {
          me.states[stateName].fieldProperties = {};
        }
        for (var propName in field) {
          var fieldInState = me.states[stateName].fieldProperties[fieldName];
          fieldInState[propName] = field[propName];
        }
      }
      for (var tabId in state.tabProperties) {
        var tab = state.tabProperties[tabId];
        if (me.states[stateName].tabProperties === undefined) {
          me.states[stateName].tabProperties = {};
        }
        if (me.states[stateName].tabProperties[tabId] === undefined) {
          me.states[stateName].tabProperties[tabId] = {};
        }
        for (var propName in tab) {
          var tabInState = me.states[stateName].tabProperties[tabId];
          tabInState[propName] = tab[propName];
        }
      }
    }
  },

  removeBodyClass: sol.common.forms.Utils.removeBodyClass,
  addBodyClass: sol.common.forms.Utils.addBodyClass,

  /**
   * determines a short name of a field using the prefix e.g. HR_PERSONNEL.
   *
   * IX_MAP_HR_PERSONNEL_DEPARTMENT -> department
   * @param {String} fieldName e.g. IX_MAP_HR_PERSONNEL_DEPARTMENT
   * @param {String} prefix e.g. HR_PERSONNEL
   * @returns {String}
   */
  getShortName: function (fieldName, prefix) {
    if (fieldName.indexOf(prefix) != -1) {
      return fieldName.slice(fieldName.indexOf(prefix) + prefix.length + 1).toLowerCase();
    } else {
      var match = /IX_\w{2,5}_(.+)/g.exec(fieldName);
      if (match && match[1]) {
        return match[1].toLowerCase();
      }
    }
    return fieldName;
  },

  determineUndefinedFields: function (params) {
    var me = this;
    return Object.keys(params || {})
      .filter(function (param) {
        return me.propIsField(param) && (!$var(param));
      });
  },

  /**
   * builds the "fields" object, which is accessible via me.fields
   * using the FormWrapper.Field Class
   * @private
   */
  initializeFields: function () {
    var me = this;

    me.getNamesOfAllFieldsOnForm().forEach(function (name) {
      var field = sol.create("sol.common.forms.FormWrapper.Field", {
        fName: name,
        shortName: me.getShortName(name, me.prefix),
        validator: undefined,
        responder: undefined,
        prefix: me.prefix,
        form: me
      });
      if (field) {
        me.fields[field.fName] = field; // makes field accessible by long name
        field.viewSource = field.fName.indexOf("VIEW_") === 0 ? field.fName.replace(/^VIEW_/, "") : undefined;
      }
    });
    // if fields are views, fill them with values from their source
    for (var fieldName in me.fields) {
      var field = me.fields[fieldName], viewSource, num, numVal = undefined;
      if (field.viewSource) {
        field.viewSource = me.fields[field.viewSource];
        field.element().classList.add("sol-coversheetfield");
        if (field.viewSource && field.viewSource.value()) {
          if (num = ((viewSource = field.viewSource).element().getAttribute("inputtype") === "num")) {
            numVal = ELOF.numberToAmount(String(viewSource.value({ asNumber: true })), viewSource.element());
            field.element().innerHTML = numVal;
          }
          if (!num || numVal == undefined) {
            field.viewSource.isDate
              ? field.set(elo.wf.date.format(field.viewSource.value()))
              : field.element().innerHTML = (field.viewSource.value({
                localizedStringOnly: true
              }).replace(/(?:\r\n|\r|\n)/g, "<br />"));
          }
        }
      }
    }
  },

  determineTableSize: function (tableCols) {
    var me = this, tableSize = 0;
    Object.keys(me.fields)
      .forEach(function (name) {
        var match = name.match(/(.*[^0-9])(\d+)$/), row;
        if (match && ~tableCols.indexOf(match[1])) {
          row = +(match[2]);
          (row > tableSize) && (tableSize = row);
        }
      });
    return tableSize;
  },

  initializeTables: function () {
    var me = this, tables = {};
    Array.prototype.slice.call(document.querySelectorAll("tbody[eloelems*='JS_ADDLINE']"))
      .forEach(function (table) {
        var jsAdd, id, colCount, cols, tb;
        jsAdd = table.querySelector("input[name='JS_ADDLINE']");
        if (jsAdd) {
          id = jsAdd.getAttribute("addlineid") || "default";
          tb = (tables[id] = {});

          tb.columns = table.getAttribute("eloelems").split(",")
            .filter(function (name) {
              return (name.indexOf("1") === (name.length - 1)) && me.fields[name];
            })
            .map(function (col) {
              return col.substr(0, col.length - 1);
            });
          colCount = (cols = tb.columns).length;
          tb.size = me.determineTableSize(tb.columns);
          tb.id = id;
          tb.form = me;
          tb.getRow = me.getTableRow.bind(me, cols, colCount);
          tb.addRow = me.addRow.bind(tb, jsAdd.onclick.bind(jsAdd));
          tb.removeRow = me.removeRow.bind(tb);
          tb.insert = me.insert.bind(tb);
          tb.forEach = me.tableForEach;
          tb.map = me.tableMap;
          tb.filter = me.tableFilter;
          tb.slice = me.tableSlice;
          tb.getRowByField = me.getRowByField.bind(tb); // bind current table at 'this' context

          /**
           *  each field should have access to it's own table via tableId
           */
          tb.forEach(function(row) {
            Object.keys(row)
              .filter(function(prop){return prop !== "row"})
              .map(function(fieldName){return row[fieldName]})
              .forEach(function(colField){
                  colField && (colField.tableId = tb.id)
              })
         })
        }
      });

    me.tables = tables;

    Object.keys(tables)
      .forEach(function (tableId) {
        var table = tables[tableId];
        me.removeDeletedTrailingRows(table.id, 1, table.size);
      });

    me.fields = me.getNewFieldsObject();
  },


  addRow: function (fn, empty) {
    var me = this, isEmpty = false, row = me.getRow(me.size);
    if (empty) {
      isEmpty = !(Array.isArray(empty) ? empty : [empty])
        .some(function (fieldName) {
          var field = row[fieldName], value = field && field.value();
          return (value !== undefined && value !== "");
        });
    }

    isEmpty || fn();  // only add new row if last row is not empty

    return me.getRow(me.size);
  },

  /**
   * Remove the passed row object
   *
   * Unfortunately there is no well provided api function
   * to remove a row from a table, so be careful with this function.
   *
   * It's actually a workaround to find the
   * remove button within the same row and simulate a click on
   * the JS_REMOVELINE button (like addRow function in formwrapper)
   *
   * @param {Object} row - the table row object which should be removed
   * @param {Object} [options]
   * @param {String} [options.indicatorField] source column to find JS_REMOVELINE Button
   *                 If not set use first column name as default
   */
  removeRow: function (row, options) {
    var me = this,
      indicatorColumn = options && options.indicatorColumn;

    if (!indicatorColumn && me.columns.length > 0) {
      // use first column as an indicatorColumn
      indicatorColumn = me.columns[0];
    }

    if (row) {
      try {
        row[indicatorColumn].element()
        .closest("tr") // find parent tr and search then the JS_REMOVELINE Button from there
        .querySelector("a.jsRemoveLine")
        .click();
      } catch (ex) {
        console.warn("Could not determine remove button - Did you add JS_REMOVELINE and JS_ADDLINE in your form?");
      }
    } else {
      console.warn("row could not be remove because row is not set");
    }
  },

  insert: function (data, emptyFields) {
    var me = this, inserted = [];
    (Array.isArray(data) ? data : [data])
      .forEach(function (obj) {
        var row = me.addRow(emptyFields);
        Object.keys(obj || {})
          .forEach(function (col) {
            row[col] && row[col].set(obj[col]);
          });
        inserted.push(row);
      });
    return inserted;
  },

  getTableRow: function (cols, colCount, row) {
    var me = this, sizeOutOfBounds = (row > me.size || row < 1),
        prettyCol = { row: sizeOutOfBounds ? undefined : row },
        formFields = me.fields, k, col;
    for (k = 0; k < colCount; k++) {
      prettyCol[col = cols[k]] = formFields[col + row];
    }
    return prettyCol;
  },

  tableForEach: function (cb, thisArg) {
    var table = thisArg || this, size = table.size, i;
    for (i = 1; i <= size; i++) {
      cb.call(table, table.getRow(i), i, table);
    }
  },

  tableMap: function (cb, thisArg) {
    var table = thisArg || this, size = table.size, i, result = [];
    for (i = 1; i <= size; i++) {
      result.push(cb.call(table, table.getRow(i), i, table));
    }
    return result;
  },

  tableFilter: function (cb, thisArg) {
    var table = thisArg || this, size = table.size, i, prettyCol, result = [];
    for (i = 1; i <= size; i++) {
      cb.call(table, (prettyCol = table.getRow(i)), i, table) && result.push(prettyCol);
    }
    return result;
  },

  tableSlice: function (from, to) {
    var me = this, size = me.size, i, result = [], max = to || size + 1;
    for (i = from || 1; i <= size && i < max; i++) {
      result.push(me.getRow(i));
    }
    return result;
  },


  getRowByField: function(field){
    var me = this; // should be a table object via bind
    if (!field) return;

    var result = me.columns
      .filter(function(col) { return field.fName.startsWith(col) })
      .map(function(colName) { return field })
      .map(function(colField) { return me.getRow(sol.common.forms.Utils.getFieldNameIndex(colField.fName))});

    return result[0]; // return undefined if field is not a column field
  },

  /**
   * determines if the passed string is a field which can be handled by the FormWrapper.
   * @returns {Boolean}
   */
  propIsField: function (prop) {
    return (
      prop.indexOf("IX_MAP_") === 0
      || prop.indexOf("WF_MAP_") === 0
      || prop.indexOf("IX_GRP_") === 0
      || prop.indexOf("VIEW_") === 0
    );
  },

  /**
   * collects all fields that may be used in the form
   * @private
   */
  getNamesOfAllFieldsOnForm: function () {
    var me = this,
        tables = document.getElementsByTagName("tbody"),
        fields = [],
        tableNo = -1;
    while (tables[++tableNo]) {
      fields = fields.concat(tables[tableNo].getAttribute("eloelems").split(","));
    }

    // find viewfields
    for (var tabName in me.tabs) {
      var tab = me.tabs[tabName];
      if (tab && tab.containsCover) {
        Array.prototype.slice.call(tab.element.querySelectorAll("[elonodename]")).filter(function (element) {
          return element.id.indexOf("VIEW_") === 0;
        }).forEach(function (field) {
          fields.push(field.id.trim());
        });
      }
    }

    for (var prop in ELO_PARAMS) {
      var me = this,
          value = ELO_PARAMS[prop];
      typeof value === "string" &&
        me.propIsField(prop) &&
        fields.push(prop);
    }

    return fields.filter(function (item, index, a) {
      return a.indexOf(item) == index;
    });
  },

  removeFromUndefinedFields: function (name) {
    var me = this, foundAt;
    ((foundAt = me.undefinedFields.indexOf(name)) > -1)
      && me.undefinedFields.splice(foundAt, 1);
  },

  /**
   * adds a new field to the "fields" object, which is accessible via me.fields
   * using the FormWrapper.Field Class
   * @private
   */
  initializeNewField: function (name) {
    var me = this,
        field;
    field = sol.create("sol.common.forms.FormWrapper.Field", {
      fName: name,
      shortName: me.getShortName(name, me.prefix),
      validator: undefined,
      responder: undefined,
      prefix: me.prefix,
      form: me
    });
    if (field) {
      me.fields[field.fName] = field; // makes field accessible by long name
      me.removeFromUndefinedFields(name);  // field has been defined on the form, so remove it from undefined fields
      return field;
    }
  },

  /**
   * adds new fields (which were added to the form since initialize) to the "fields" object, which is accessible via me.fields
   * using the FormWrapper.Field Class
   */
  initializeNewFields: function () {
    var me = this;
    me.getNewFieldsOnForm().forEach(function (name) {
      var field = sol.create("sol.common.forms.FormWrapper.Field", {
        fName: name,
        shortName: me.getShortName(name, me.prefix),
        validator: undefined,
        responder: undefined,
        prefix: me.prefix,
        form: me
      });
      if (field) {
        me.fields[field.fName] = field; // makes field accessible by long name
      }
    });
  },

  /**
   * collects all fields that were added to the form since initialize
   * @private
   */
  getNewFieldsOnForm: function () {
    var me = this,
        oldFields = Object.keys(me.fields),
        newFields = [];
    for (var prop in ELO_PARAMS) {
      var value = ELO_PARAMS[prop];
      typeof value === "string" &&
        me.propIsField(prop) &&
        oldFields.indexOf(prop) === -1 && newFields.push(prop);
    }
    return newFields;
  },

  /**
   * Takes an arbitrary amount of arguments which can either be a String or an object.
   * When an argument is a string, it will be used to look up the respective field/template/table
   * from the form. Otherwise the argument is passed to the callback as is.
   *
   * The callback, which must be passed as the last parameter, will only be executed, if none of
   * the calls arguments are undefined.
   *
   * Example:
   * If the field IX_GRP_MY_FIELD exists and the field IX_DESC exists and a template called mytemplate exists
   * and a table called mytable exists in the form, execute the callback.
   *
   *
   *     form.when("IX_GRP_MY_FIELD", form.fields.IX_DESC, "mytemplate", "mytable", function (field, desc, template) {
   *       field.set(desc.value());
   *       template.hide();
   *       return field.value();
   *     });
   */
  when: function () {
    function isDefined (arg) {
      return arg !== undefined;
    }
    function toWrapperObj (r) {
      if (typeof r == "string" && (r = r.trim())) { // sanitize
        return me.fields[r] || me.tabs.all.parts[r] || me.tables[r];
      }
      return r;
    }

    var me = this,
        required = Array.prototype.slice.call(arguments),
        cb = required.pop(),
        args = required.map(toWrapperObj),
        allDefined = args.every(isDefined);

    if (typeof cb == "function" && allDefined) {
      return cb.apply(cb, args);
    }
  },

  /**
   * builds the "tabs" object, which is accessible via me.tabs
   * using the FormWrapper.Tab Class
   * @private
   */
  initializeTabs: function () {
    var me = this;
    me.tabs.all = sol.create("sol.common.forms.FormWrapper.Tab", { parentForm: me, parts: {} });
    me.getElementsOfAllTabsOnForm().forEach(function (tabDiv) {
      var tab = sol.create("sol.common.forms.FormWrapper.Tab", {
        name: tabDiv.id,
        element: tabDiv,
        parentForm: me
      });
      if (tab && tab.name && tab.element) {
        tab.id = tab.name.replace(/^/, "_");
        me.tabs[tab.id] = tab; // makes tab accessible
        me.tabs[tab.id].parts = {};
        me.getPartsOfTab(tab).forEach(function (partDiv) {
          var children, part;

          children = partDiv && partDiv.id && partDiv.getAttribute && partDiv.getAttribute("eloelems");
          part = sol.create("sol.common.forms.FormWrapper.Part", {
            name: partDiv && partDiv.id,
            element: partDiv,
            childrenFields: children ? children.split(",") : []
          });
          if (part && part.name && part.element) {
            part.id = part.name.replace(/^part/, "");
            part.isCover = me.endsWith(part.id, "__cover") ? true : false;
            if (me.endsWith(part.id, "__cover")) {
              tab.element.classList.add("sol-coversheet-tab");
              tab.containsCover = true;
            }
            part.isCover && part.element.classList.add("sol-coversheet");
            if (part.id) {
              me.tabs[tab.id].parts[part.id] = part;
              me.tabs["all"].parts[part.id] = part;
            }
          }
        });
      }
    });
  },

  /**
   * determines all tab Elements
   * @returns [{} (HTML-div)]
   * @private
   */
  getElementsOfAllTabsOnForm: function () {
    var tabDivs = [],
        tabElements = document.getElementsByClassName("tabContent");

    for (var n in tabElements) {
      var tabDiv = tabElements.namedItem ? (tabElements.namedItem((!isNaN(parseFloat(n)) && isFinite(n)) ? tabElements[n].id : n)) : tabElements[n];
      tabDiv && tabDivs.push(tabDiv);
    }
    return tabDivs;
  },

  /**
   * determines all template/part elements inside tabs
   * @returns [{} (HTML-div)]
   * @private
   */
  getPartsOfTab: function (tab) {
    var partDivs = [],
      partElements = tab.element.getElementsByTagName("tbody");
    for (var n in partElements) {
      var partDiv = partElements.namedItem ? partElements.namedItem((!isNaN(parseFloat(n)) && isFinite(n)) ? partElements[n].id : n) : partElements[n];
      partDiv && partDivs.push(partDiv);
    }
    return partDivs;
  },

  /**
   * assigns the validator function to the window object, just like ELO WF does it.
   * @private
   */
  assignValidationFunctionsToWindow: function () {
    var me = this;
    for (var field in me.fields) {
      if (me.fields[field].validator || (me.fields[field].validator === false)) {
        window["JS_VAL_" + field.toUpperCase()] = me.fields[field].validator;
        me.reassignEloVerify(me.fields[field].element(), "JS_VAL_" + field.toUpperCase());
      }
    }
  },

  /**
   * used by assignValidationFunctionToWindow
   * @private
   */
  reassignEloVerify: function (element, newJsVal) {
    var eloVerify = element.getAttribute("eloverify"),
        match, newVerify = newJsVal;
    if (eloVerify) {
      if (eloVerify.indexOf("JS_VAL_") == -1) {
        newVerify = eloVerify + " " + newJsVal;

      } else {
        match = /(.*) ?JS_VAL_[^ ](.*)/g.exec(eloVerify);
        newVerify = match && match[1] + " " + newJsVal + " " + match[2];
      }
    }
    element.setAttribute("eloverify", newVerify);
  },

  /**
   * assigns props defined in a state object to the respective fields
   */
  assignPropToFields: function (state, propname) {
    var me = this;
    for (var fieldName in state.fieldProperties) {
      var field = state.fieldProperties[fieldName];
      if (me.fields[fieldName] && (field[propname] || field[propname] === false)) {
        me.fields[fieldName][propname] = field[propname];
      }
    }
  },

  /**
   * Convert a MultiIndexField to a mapTable
   *
   * Current restriction limited to one column
   * @param {Field} multiIndexField
   * @param {String} mapTableColumn
   *
   * @throws If multiIndexField is undefined
   * @throws If mapTableColumn is undefined
   * @since 1.11.000
   */
  updateMultiIndexFromMapTableColumn: function(multiIndexField, mapTableColumn) {

    if (!multiIndexField) {
      throw Error("multiIndexField must be set");
    }

    if (!mapTableColumn) {
      throw Error("mapTableColumn must be set");
    }

    var indexArray = sol.common.forms.Utils.MultiIndex(),
      fields = multiIndexField.form.fields,
      tableIndexPos = mapTableColumn.length,
      pilcrows = new RegExp(String.fromCharCode(182), "g");

    Object.keys(fields)
      .filter(function (fieldName) {
        return fieldName.indexOf(mapTableColumn) === 0;
      })
      .filter(function (fieldName) {
        return !isNaN(+(fieldName.substr(tableIndexPos)));
      })
      .sort(function (a, b) {
        return +(a.substr(tableIndexPos)) - +(b.substr(tableIndexPos));
      })
      .forEach(function (fieldName) {
        var val = fields[fieldName].value({ full: true }).replace(pilcrows, " "); // if dynkwl field, receive complete value
        val && indexArray.add(val);
    });

    indexArray.save(multiIndexField.fName);
  },

  /**
   * Convert each value of a MultiIndex field to a specific column of a table
   *
   * The function create dyanmically a new row for each value of the MultiIndex value
   * @param {Field} multiIndexField source
   * @param {String} mapTableColumn All values of the MultiIndex field copied to this column
   * @param {String} [tableId=default] the table of the column
   *
   * @throws Will throw an error if tableId doesn't exist in form
   * @since 1.11.000
   */
  updateMapTableColumnsFromMultiIndex: function (multiIndexField, mapTableColumn, tableId) {
     var me = this, multiIndexArray, firstColumn = mapTableColumn + "1",
      pilcrows = new RegExp(String.fromCharCode(182), "g"),
      table = tableId || "default";

      if (!me.tables || !me.tables[tableId]) {
        throw Error("table " + tableId + " doesn't exist in form. Do you use the right name?");
      }

      multiIndexArray = multiIndexField.value().split(pilcrows);

      // set first entry manually because the row exists per definition
      me.fields[firstColumn].set(multiIndexArray.shift());

      setTimeout(function () {
        multiIndexArray.forEach(
          function(value) {
            var row = me.tables[table].addRow();
            row[mapTableColumn].set(value);
          }
        );
      }, 0);
  },

  /**
   * calculates a date in the future using input parameters
   * @param {Integer }isoDate         isoDate as starting point
   * @param {Integer }durationNumber  number representing e.g. weeks, days (any momentJS unit)
   * @param {String} durationUnit    momentJS unit descriptor (y, Q, M, w, d)
   * @param {String} terminationPoint    momentJS unit descriptor (y, Q, M, w, d)
   * @returns {Integer} the new date as an isoDate
   */
  calculateDate: function (isoDate, durationNumber, durationUnit, terminationPoint, offsetNumber, offsetUnit) {

    var srcDate, dstDate;

    srcDate = sol.common.DateUtils.isoToDate(String(isoDate));
    durationNumber = Number(durationNumber);
    dstDate = sol.common.DateUtils.shift(srcDate, durationNumber, {
      unit: durationUnit
    });

    dstDate = (terminationPoint && (moment(dstDate.getTime())).endOf(terminationPoint).toDate()) || dstDate;

    if (offsetNumber) {
      dstDate = sol.common.DateUtils.shift(dstDate, offsetNumber, {
        unit: offsetUnit || "d"
      });
    }

    return sol.common.DateUtils.dateToIso(dstDate, {
      startOfDay: true
    });
  },

  /**
   * see setCalculatedDate
   */
  returnCalculatedDate: function (srcDateFieldName, durationFieldName, terminationPointFieldName, dstDateFieldName, offsetNumber, offsetUnit) {
    return this.setCalculatedDate(srcDateFieldName, durationFieldName, terminationPointFieldName, dstDateFieldName, offsetNumber, offsetUnit, true);
  },

  dayIsDay: function (isoDate1, isoDate2) {
    return isoDate1.substr(6, 2) === isoDate2.substr(6, 2);
  },

  /**
   * uses calculateDate internally to simplify setting the value to a target field
   * @param {String} srcDateFieldName    start date field name or isoDate
   * @param {String} durationFieldName   field name of a field which holds a durationNumber
   * @param {String} terminationPointFieldName    field name of a field which holds a termination point (at the end of the month, year, quarter,...)
   * @param {String} dstDateFieldName    this field will receive the return value of calculateDate
   * @param {String} offsetNumber    adjusts the calculated date by value (+-x)
   * @param {String} offsetUnit    unit for adjustment
   * @param {Boolean} onlyReturn    if true, returns the calculated value instead of setting the value
   * @returns {undefined || Integer (isoDate)}
   */
  setCalculatedDate: function (srcDateFieldName, durationFieldName, terminationPointFieldName, dstDateFieldName, offsetNumber, offsetUnit, onlyreturn) {
    var me = this,
        srcIsoDate, durationNumber, durationUnit, terminationPoint, dstIsoDate;

    if (srcDateFieldName === undefined) {
      srcIsoDate = sol.common.DateUtils.dateToIso(new Date(), {
        startOfDay: true
      }); //today
    } else if (String(srcDateFieldName) !== "" && (String(srcDateFieldName).indexOf("IX_") == -1)) {
      srcIsoDate = +(srcDateFieldName); // isoDate from parameter
    } else {
      srcIsoDate = me.fields[srcDateFieldName] && me.fields[srcDateFieldName].value(); // isoDate from Field
    }

    if (srcIsoDate && me.fields[durationFieldName]) {
      durationNumber = me.fields[durationFieldName].value() || 0;
      terminationPoint = (terminationPointFieldName && me.fields[terminationPointFieldName].value()) || "";
      durationUnit = me.fields[me.fields[durationFieldName].selector.name].value(); // B-)
      // moment.js initial calculation
      dstIsoDate = me.calculateDate(srcIsoDate, durationNumber, durationUnit, terminationPoint);
      // lap years
      if ((!terminationPoint || (terminationPoint === "d")) && ((durationUnit !== "d" && me.dayIsDay(dstIsoDate, srcIsoDate)) || (durationUnit === "d" || durationUnit === "w"))) {
        dstIsoDate = me.calculateDate(dstIsoDate, -1, "d");
      }
      // calculate offset
      if (offsetNumber && offsetUnit) {
        dstIsoDate = me.calculateDate(dstIsoDate, 0, "d", undefined, offsetNumber, offsetUnit);
      }

      if (onlyreturn) {
        return dstIsoDate;
      }
      me.fields[dstDateFieldName].set(dstIsoDate);
    }
  },

  /**
   * assigns validators of a state to the respective field
   * @private
   */
  assignValidators: function (state) {
    var me = this;
    me.assignPropToFields(state, "validator");
  },

  /**
   * assings responders of a state to the respective field
   * @private
   */
  assignResponders: function (state) {
    var me = this;
    me.assignPropToFields(state, "responder");
  },

  OnLineChange: function (lineAdded, name, index) {
    return true;
  },

  OnAddLine: function (name, index, rowFields) {
    return true;
  },

  OnRemoveLine: function (name, index, rowFields) {
    return true;
  },

  AfterOnRemoveLine: function (name, index, removedFieldValues) {
    return true;
  },
  LineAdded: function (tableId, index) {
    var me = this;
    tableId || (tableId = "default");
    (index > me.tables[tableId].size) && (me.tables[tableId].size = index);
    return me.OnAddLine(tableId, index, me.initializeFieldsOfTableRow(tableId, index));
  },

  anyIdChanged: function (ids) {
    return ids
      .some(function (arr) {
        return arr[0].element().id !== arr[1];
      });
  },

  LRCb: function (tableId, index, ids, removedFieldValues) {
    var me = this;
    if (me.anyIdChanged(ids)) {
      me.removeDeletedTrailingRows(tableId, index, me.tables[tableId].size);
      me.tables[tableId].size = me.findTableSize(tableId, me.tables[tableId].size);
      me.fields = me.getNewFieldsObject();

      me.AfterOnRemoveLine(tableId, index, removedFieldValues);
    } else {
      window.setTimeout(function () {
        me.LRCb(tableId, index, ids, removedFieldValues);
      }, 1);
    }
  },

  LineRemoved: function (tableId, index) {
    var me = this, ids, possiblyRemovedFields = {}, possiblyRemovedFieldValues = {};
    tableId || (tableId = "default");
    (ids = me.collectIdsOfTableRow(tableId, index))
      .forEach(function (arr) {
        var cur = arr[0];
        possiblyRemovedFields[cur.fName] = cur;
        possiblyRemovedFieldValues[cur.fName] = cur.value();
      });
    me.LRCb(tableId, index, ids, possiblyRemovedFieldValues);  // start timeout callback for AfterOnRemoveLine

    return me.OnRemoveLine(tableId, index, possiblyRemovedFields);
  },

  removeDeletedTrailingRows: function (tableId, startFrom, tableSize) {
    var me = this, cur;
    for (cur = startFrom; cur <= tableSize; cur++) {
      me.initializeFieldsOfTableRow(tableId, cur); // reinitialize.
    }
  },

  initializeFieldsOfTableRow: function (tableId, rowNo) {
    var me = this, tableFields = me.tables[tableId].columns,
      length = tableFields.length, i, name, sName, fields = {}, state = me.getStateInit();
    // TODO: we should set responder of current state and tableId to the initializedField
    for (i = 0; i < length; i++) {
      if ($var(name = (sName = tableFields[i]) + rowNo)) {
        !me.fields[name] && (function(){
            var f = me.initializeNewField(name);
            f.tableId = tableId;
            fields[sName] = f;
          })()
      } else {
        me.fields[name] = undefined;
      }
    }
    // initialize state for each row
    state && state.rowProperties && me.setRowProperties(me.tables[tableId].getRow(rowNo), state.rowProperties);
    return fields;
  },

  getActiveState: function(){
    var me = this;
    return me.states[me.activeState] || me.getStateInit();
  },

  getStateInit: function(){
    var me = this;
    return me.states["stateInit"];
  },

  collectIdsOfTableRow: function (tableId, rowNo) {
    var me = this, tableFields = me.tables[tableId].columns, length = tableFields.length, i, name, el, ids = [];
    for (i = 0; i < length; i++) {
      if (el = $var(name = tableFields[i] + rowNo)) {
        ids.push([me.fields[name], el.id]);
      }
    }
    return ids;
  },

  findTableSize: function (tableId, lastKnown) {
    var me = this, tableFields = me.tables[tableId].columns, length = tableFields.length, i;
    // start checking backwards from the last column to be known to be the largest
    while (lastKnown > 1) {
      for (i = 0; i < length; i++) {
        if ($var(tableFields[i] + lastKnown)) {
          return lastKnown;
        }
      }
      lastKnown--;
    }

    return lastKnown;
  },

  getNewFieldsObject: function () {
    var me = this, newFieldsObject = {}, fieldName, fields = me.fields, field;
    for (fieldName in fields) {
      (fieldName !== "")
        && (field = me.fields[fieldName])
        && (newFieldsObject[fieldName] = field);
    }
    return newFieldsObject;
  },

  /**
   * wrapper around OnInitAndTabChange which also unhides all fields on the form
   * @private
   */
  TabChanged: function () {
    var me = this;
    for (var fieldName in me.fields) {
      if (fieldName !== "") {
        var field = me.fields[fieldName];
        field.show(true, true);
      }
    }
    for (var tabId in me.tabs) {
      if (tabId !== "") {
        var tab = me.tabs[tabId];
        for (var partId in tab.parts) {
          if (partId !== "") {
            var part = tab.parts[partId];
            part.show();
          }
        }
      }
    }

    me.OnInitAndTabChange();
  },

  /**
   * Executes registered callbacks when the tab is changed or the form is initialized.
   * @private
   */
  OnInitAndTabChange: function () {
    var me = this;
    me.tabs.activeTab = me.tabs[me.getActiveTabId()];
    if (me.tabs.activeTab === undefined) {
      me.tabs.activeTab = {};
      me.tabs.activeTab.name = "";
    }

    // can be defined in extending class
    me.BeforeOnInitAndTabChange && me.BeforeOnInitAndTabChange();

    me.onInitAndTabChangeFunctions.forEach(function (f) {
      f.call(me);
    });

    // can be defined in extending class
    me.AfterOnInitAndTabChange && me.AfterOnInitAndTabChange();
  },

  getNameOfKwlSource: function (source) {
    if (typeof source === "object" && source.$KEY && source.$VALUE) {
      return Object.keys(source).filter(function (prop) {
        return (prop !== "$KEY") && (prop !== "$VALUE");
      })[0];
    }
  },

  initializeRowFieldsOfMapTableKwl: function (kwlFields) {
    var me = this;
    kwlFields
      .forEach(function (field) {
        me.propIsField(field) && !me.fields[field] && me.initializeNewField(field);
      });
  },

  /**
   * Basically executes the responder of a field which was changed by user input.
   * It is also possible to define a BeforeInputChanged and a AfterInputChanged
   * function in the extending class to make changes before/after any field-change
   * without specifically depending on one field.
   * @private
   */
  InputChanged: function (source, name) {
    var me = this,
        fieldname, field, val, row;

    fieldname = source.name || name || me.getNameOfKwlSource(source);
    if (!me.fields[fieldname] && source.$KEY && source.$VALUE && ((fieldname.indexOf("IX_") !== 0) && (fieldname.indexOf("WF_") !== 0))) { //kwl
      fieldname = "IX_GRP_" + fieldname;
    }
    !me.fields[fieldname] && me.initializeNewField(fieldname);
    (!source.name && name) && me.initializeRowFieldsOfMapTableKwl(Object.keys(source || {}));
    field = me.fields[fieldname];
    val = field.value();

    // can be defined in extending class
    me.BeforeInputChanged && me.BeforeInputChanged(field);

    if (field.tableId) {
      row = me.tables[field.tableId].getRowByField(field);
    }

    field.responder && field.responder(me, me.activeState, field, val, row); // row is undefined if field is not a table row object

    // can be defined in extending class
    me.AfterInputChanged && me.AfterInputChanged(field);
  },

  /**
   * @private
   * Only returns false if the rule matches and saveValues is false.
   * Also executes "registerUpdate", if defined.
   * @param {Object} rule
   * @return {Boolean}
   */
  shouldISave: function (rule) {
    var mask = rule.maskName,
        soltype = rule.solType,
        ruleActive, saveValues;
    ruleActive =
      (mask && soltype && mask === ELO_PARAMS.IX_MASKNAME && soltype === ELO_PARAMS.IX_GRP_SOL_TYPE) ||
      (mask && !soltype && mask === ELO_PARAMS.IX_MASKNAME) ||
      (!mask && soltype && soltype === ELO_PARAMS.IX_GRP_SOL_TYPE);

    if (ruleActive) {
      rule.registerUpdate && sol.common.forms.Utils.registerUpdate((typeof rule.registerUpdate === "string") ? rule.registerUpdate : null);
      saveValues = ((typeof rule.saveValues) === "function") ? rule.saveValues.call(this) : rule.saveValues;
      return (saveValues !== undefined) ? saveValues : true;
    } else {
      return true;
    }
  },

  /**
   * executes OnSaveRules and consolidates their results
   * @private
   */
  executeOnSaveRules: function () {
    var me = this,
        combinedResults = true,
        result;
    for (var ruleName in me.onSaveRules) {
      var rule = me.onSaveRules[ruleName];
      if (rule) {
        result = me.shouldISave(rule);
        if (combinedResults) {
          combinedResults = result;
        }
      }
    }
    return combinedResults;
  },

  /**
   * OnSave callback
   * @private
   */
  OnSave: function () {
    var me = this,
        result = true;
    me.BeforeOnSave && me.BeforeOnSave();
    result = me.executeOnSaveRules();
    me.AfterOnSave && me.AfterOnSave(result);
    return result;
  },

  /**
   * initializes the class.
   */
  initialize: function () {
    var me = this;

    me.workflowActive = ELO_PARAMS.ELO_FLOWID !== "-1";
    me.wfVersion = typeof ELOWF_VERSION === "string" ? +(ELOWF_VERSION.replace(/\./g, "", true)) : 0;
    if (window.location && typeof window.location.pathname === "string") {
      if (window.location.pathname.indexOf("plugin/de.elo.ix.plugin.proxy/wf")) {
        me.wfName = window.location.pathname.split("/");
        me.wfName = me.wfName.slice(1, me.wfName.length - 2).join("/");
      } else {
        me.wfName = window.location.pathname.split("/");
        me.wfName = me.wfName.length > 1 ? me.wfName[1] : "";
      }
    }

    me.initializeTabs();
    me.tabs.activeTab = me.tabs[me.getActiveTabId()];
    me.templates = sol.create("sol.common.forms.FormWrapper.Templates");
    me.undefinedFields = me.determineUndefinedFields(ELO_PARAMS); // fields which are not on the form, but in ELO_PARAMS
    me.initializeFields();
    me.initializeTables();
    me.OnInit && me.OnInit();
    me.setState("stateInit");
    me.defaultState && me.setState(me.defaultState);
    me.reassignLocalizedKwlValues();
  }
});

sol.define("sol.common.forms.FormWrapper.Tab", {
  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
  * hides all parts of a tab which where none of each part's fields has a value.
  */
  hidePartsContainingOnlyEmptyFields: function () {
    var me = this;
    Object.keys(me.parts)
    .filter(function (partName) {
      return (
        me.parts[partName].childrenFields
        .filter(function (fieldName) {
          return me.parentForm.fields[fieldName].value() != "";
        }).length === 0
      );
    })
    .forEach(function (partName) {
      me.parts[partName].hide();
    });
  },

  /**
  * hides all parts which do not contain any of the fields listed in the passed array
  */
  hideUnnecessaryParts: function (necessaryFields) {
    var me = this;
    Object.keys(me.parts)
    .filter(function (partName) {
      return (
        me.parts[partName].childrenFields
        .filter(function (fieldName) {
          return necessaryFields.indexOf(fieldName) > -1;
        }).length === 0
      );
    })
    .forEach(function (partName) {
      me.parts[partName].hide();
    });
  }
});

/**
 * Represents a form-tab's template/part
 *
 * @author ESt, ELO Digital Office GmbH
 *
   */
sol.define("sol.common.forms.FormWrapper.Part", {
  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * Hides the template/part
   */
  hide: function () {
    var me = this;
    me.changeVisibility(false);
  },

  /**
   * Unhides/shows the template/part
   */
  show: function () {
    var me = this;
    me.changeVisibility(true);
  },

  /**
   * sets the style attribute accordingly
   * @private
   */
  changeVisibility: function (visible) {
    var me = this;
    me.element.style.display = visible ? "" : "none";
  },

  /**
   * used by FormWrapper to map state properties to the respective functions
   * @private
   */
  setAttribute: function (attribute, value) {
    var me = this;
    switch (attribute) {
      case "hidden":
        value ? me.hide() : me.show();
        break;
      default:
        break;
    }
  }
});


/**
 * Represents a form-template's field.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * Fields are automatically linked to their label, if they are called
 *
 *     "LBL_" + me.prefix + me.getShortName();
 *
 * To make things easier, localizedKwls will automatically be linked to
 * a selector:
 *
 *     me.fName + "_UNIT"
 *
 * e.g.
 *
 *     IX_MAP_HR_PERSONNEL_DEPARTMENT
 *     label: LBL_HR_PERSONNEL_DEPARTMENT
 *     selector: IX_MAP_HR_PERSONNEL_DEPARTMENT_UNIT
 *
 * This is important for the ´smart´ "set" and "value" functions to work!
 *
 * Setting a localizedKwl Value the old way:
 *
 *     //insert complicated, localizedKwl specific code here
 *
 * Setting a localizedKwl Value the new way:
 *
 *     form.fields.IX_MAP_HR_PERSONNEL_DEPARTMENT.set("DEV")
 *
 * The same also works for dates and of course "normal fields".
 *
 * field.show() and field.hide() take two parameters:
 * includingLabel     Boolean
 * includingSelector  Boolean
 * If both parameters are set to true, the field, its label and its unit-selector will be hidden/shown.
 */
sol.define("sol.common.forms.FormWrapper.Field", {
  initialize: function (config) {
    var me = this,
        parent, selector, unitSelectorName;

    me.$super("sol.Base", "initialize", [config]);
    me.name = me.fName;
    if (!me.name) {
      return;
    }

    parent = $var(me.fName);
    parent = parent && parent.parentElement;

    me.isDate = (parent && parent.getAttribute("elonodename") == "DATE") || (me.element() && me.element().getAttribute("eloverify") == "date");
    me.datePicker = me.isDate && me.element().parentElement.children[1];

    me.editor = me.isEditor()
        && sol.create("sol.common.forms.FormWrapper.RedactorApi", {
          field: me,
          immediately: me.form.editorOptions.initImmediately,
          redactorOptions: me.form.editorOptions.redactorOptions
        });

    unitSelectorName = me.prefix + "_" + me.shortName.toUpperCase() + "_UNIT";

    me.label = $var("LBL_" + me.prefix + "_" + me.shortName.toUpperCase());

    if (me.isDate) {
      selector = $var(me.fName); // yep
    } else {
      selector = $var("IX_MAP_" + unitSelectorName) || $var("IX_GRP_" + unitSelectorName);
    }
    me.selector = selector;
    me.localizedDynKwlName = me.getDynKwlName();
    me.localizedDynKwl = me.localizedDynKwlName && me.element().nextSibling;
  },

  isEditor: function () {
    var me = this;
    return !!(me.element() && me.element().closest(".redactor3"));
  },

  /**
   * determines the dynamic keyword list's name, if the field is linked to one and returns it
   * @returns {String}
   */
  getDynKwlName: function () {
    var me = this,
        kwl = me.element() && me.element().nextSibling,
        name, result, elocompl;
    if (!me.element()) {
      return;
    }
    name = (me.element().getAttribute("swlname") || (kwl && kwl.getAttribute("swlname"))) || elocompl;

    elocompl = (me.element().getAttribute("elocompl") || (kwl && kwl.getAttribute("elocompl")));

    me.localizedDynKwlOrigName = elocompl;

    name = (name === "#DATE#" ? undefined : name);

    result = name && ((name.indexOf("DYNSWL_") == 0 && name.replace("DYNSWL_", "")) || name) || undefined;
    me.isLocalized = result && (!elocompl); //localized kwls do not have elocompl attribute
    return result;
  },

  /**
   * removes selector from a kwl-field (e.g. for making it readonly)
   * @private
   */
  kwlStyle: function (mode) {
    var me = this;
    mode === "remove"
      ? me.localizedDynKwlName && me.element().removeAttribute("elocompl")
      : me.localizedDynKwlName && me.element().setAttribute("elocompl", me.localizedDynKwlOrigName || me.localizedDynKwlName);
  },

  /**
   * wrapper around $var, can also work with images (which $var can't)
   * @returns {HTML-DIV}
   */
  element: function () {
    var el = $var(this.fName);
    if (!el) {
      el = document.getElementsByName(this.fName);
      el = el.length > 0 && el[0]; // var does not seem to find images, therefore try this
    }
    return el;
  },

  valueFromEloParams: function () {
    var me = this;
    return (me.form.undefinedFields.indexOf(me.fName) === -1)
      ? ""  // only lookup in ELO_PARAMS if field was never on form
      : (ELO_PARAMS[me.fName] === "undefined" ? "" : ELO_PARAMS[me.fName]);
  },

  /**
   * determines the field's value.
   *
   * returns an isoDate if the field is a date.
   * returns its key, if the field is a localizedKwl.
   *  @returns {String}
   */
  value: function (opts) {
    var me = this, value;

    value = (
      (me.isDate && sol.common.forms.Utils.getIsoDate(me.fName, {
        startOfDay: true
      }))
      || (me.localizedDynKwlName && me.getSelectedLocalizedDynKwlValue(opts))
      || ($var(me.fName) ? $val(me.fName) : ($val(me.fName) || me.valueFromEloParams()))
      || ""
    );

    return (opts && opts.asNumber)
      ? toNum(value) // ELO WF global function
      : value;
  },

  /**
   * returns current tooltip as a String
   */
  tooltip: function () {
    var me = this;
    return (me.element() && me.element().getAttribute("savedtitle")) || "";
  },

  /**
   * writes tip as the new tooltip
   */
  writeTooltip: function (tip) {
    var me = this, el = me.element();
    if (!el) {
      return;
    }
    if (typeof tip === "string" && tip) {
      if (el.getAttribute("savedtitle")) {
        el.setAttribute("savedtitle", tip);
      } else {
        el.setAttribute("title", tip);
        ELOF.assignTooltips(el.parentElement);
      }
    } else {
      el.getAttribute("savedtitle")
      ? el.onmouseover = undefined
      : console.log(me.fName + ": No tooltip created for value '" + tip + "' (type:" + typeof tip + ")");
    }
  },

  /**
   * Write a placeholder to the current field element
   */
  setPlaceholder: function(placeholderValue){
    var me = this, el = me.element(), localizedValue;

    if (!el) {
      return;
    }

    localizedValue = placeholderValue;
    if (typeof localizedValue === "object"){
      try {
        localizedValue = elo.helpers.Text.getText(placeholderValue.key);
      } catch (e){
        /** In case of an error, the placeholder should reset to avoid inconsistent state */
        console.warn("could not translate  " + placeholderValue.key, e);
        localizedValue = "";
      }
    }

    el.setAttribute("placeholder", localizedValue);
  },

 /**
  * @private please use value() for the same effect
  */
  getSelectedLocalizedDynKwlValue: function (opts) {
    var me = this;
    if (opts) {
      if (opts.full) {
        return $val(me.fName) || "";
      }
      if (opts.localizedStringOnly) {
        return me.getSelectedLocalizedDynKwlString() || "";
      }
    }
    return me.getSelectedLocalizedDynKwlKey() || "";
  },

 /**
  * @private please use getSelectedLocalizedDynKwlValue() without a parameter for the same effect
  */
  getSelectedLocalizedDynKwlKey: function (key) {
    var me = this,
        val = key || $val(me.name) || "";
    if (val.search(/\w+ - ?.*/g) === -1) {
      return val;
    } else {
      return val.slice(0, val.indexOf(" -"));
    }
  },

 /**
  * @private please use getSelectedLocalizedDynKwlValue() with { localizedStringOnly:true } for the same effect
  */
  getSelectedLocalizedDynKwlString: function () {
    var me = this,
        val = $val(me.name);
    if (val.search(/\w+ - ?.*/g) === -1) {
      return val;
    } else {
      return val.slice(val.indexOf(" -") + 3);
    }
  },

  /**
   * set a field's value to `value`.
   *
   * pass an isoDate if the field is a date.
   *
   * pass a key, if it's a localizedKwl
   *
   * @param {String || Integer(isoDate)} value
   */
  set: function (value) {
    var me = this, children;
    (me.isDate && value === "" && ($update(me.fName, value) || true))
    || (me.isDate && (sol.common.forms.Utils.setIsoDate(me.fName, value) || true))
    || (!me.localizedDynKwl && me.localizedDynKwlName && (me.selectDynKwlEntry(value) || true))
    || (me.localizedDynKwlName && (me.setLocalizedDynKwlKey(value) || true))
    || (me.editor && (me.editor.set(value) || true))
    || $update(me.fName, value);

    children = me.element().childNodes;
    value && me.viewSource && children.length === 1 && children[0].tagName === "ACRONYM" && me.element().replaceChild(document.createTextNode(value), children[0]);
  },

  selectDynKwlEntry: function (value) {
    var me = this, obj = {};
    obj[me.fName] = value;
    (typeof scatterDynamicField === "function" ? scatterDynamicField : _scatterDynamicField)(obj, me.fName); //wf function
  },

  convertToDiv: function (url) {
    function replace(a, b) {
      a.parentElement.appendChild(b).parentElement.removeChild(a);
    }
    var img = this.element(), div = img.tagName === "DIV" ? img : document.createElement("div");
    div.setAttribute("name", img.getAttribute("name"));
    div.style = "background-image:url(\'" + url + "\');";
    div.value || (div.value = "");
    (img.tagName !== "DIV") && replace(img.parentElement, div);
  },

  /**
   * sets an Image divs Image to the image having the passed guid. If no guid is passed, and the field's value contains a guid, it will be used instead
   * @param {String} guid
   */
  setImage: function (guid, elementType) {
    var me = this, url, el = me.element();
    guid = guid || me.value();
    !guid && me.hide();
    if (me.form.wfMeetsVersionRequirement("10.02.000") && me.form.wfName) {
      url = "/" + me.form.wfName + "/apps/rest/api/download/" + guid + "?ticket=" + ELO_PARAMS.ELO_TICKET;
      if (elementType === "div") {
        me.convertToDiv(url);
      } else {
        el.src = url;
      }
    } else {
      guid && sol.common.forms.Utils.initializeIxSession(function () {
        elo.IX.ix().checkoutDoc(guid, null, elo.CONST.EDIT_INFO.mbDocument, elo.CONST.LOCK.NO, new de.elo.ix.client.AsyncCallback(
          function (doc) {
            url = doc.document.docs[0].url;
            if (elementType === "div") {
              me.convertToDiv(url);
              (url === "./images/") ? me.hide() : me.show();
            } else {
              el.src = url;
              (url === "./images/") ? me.hide() : me.show();
            }
          },
          function () {
            null;
          }));
      });
    }
  },

  /**
   * Sets an image by an URL
   * @param {String} url URL
   */
  setImageUrl: function (url, elementType) {
    var me = this, el = me.element();
    if (url) {
      if (elementType === "div") {
        me.convertToDiv(url);
        me.show();
        el.style = "background-image:url('" + url + "');";
      } else {
        me.show();
        el.src = url;
      }
    }
  },

  /**
   * @private please use set() for the same effect
   * @param {String} key
   */
  setLocalizedDynKwlKey: function (key) {
    var me = this;
    if (key) {
      $update(me.fName, me.getSelectedLocalizedDynKwlKey(key));
      $listDyn(me.localizedDynKwlName, me.fName, undefined, function (data) {
        var result = data.table.find(function (entry) {
          return entry[0] === key;
        });
        result && $update(me.fName, result[2]);
      });
    } else {
      $update(me.fName, "");
    }
  },
  /**
   * used by FormWrapper to map state properties to the respective functions
   * @private
   */
  setAttribute: function (attribute, value) {
    var me = this,
        field = me.element(), parentFun;
    switch (attribute) {
      case "readonly":
        if (field.type === "checkbox") {
          field[value ? "setAttribute" : "removeAttribute"]("disabled", value);
        } else {
          parentFun = value && field.parentElement.setAttribute.bind(field.parentElement) ||
          field.parentElement.removeAttribute.bind(field.parentElement);
          field.readOnly = value;
          parentFun("isreadonly", value);
          $setReadOnly(me.fName, value);
          me.kwlStyle(value && "remove");
        }
        break;
      case "optional":
        value ? me.makeOptional() : me.makeMandatory();
        break;
      case "hidden":
        value ? me.hide(true, true) : me.show(true, true);
        break;
      default:
        break;
    }
  },

  /**
   * @private please use setAttribute("optional", true)
   */
  makeOptional: function () {
    var me = this;
    me.modifyEloVerify(me.element(), "remove");
    me.label && me.label.parentElement && me.label.parentElement.classList.remove("required");
  },

  /**
   * used by assignValidationFunctionToWindow
   * @private
   */
  modifyEloVerify: function (element, action) {
    var me = this, eloVerify = element.getAttribute("eloverify"),
        match;
    if (eloVerify || (eloVerify.trim() === "")) {
      switch (action) {
        case "remove":
          element.setAttribute("eloverify", me.removeKeyFromEloVerify(eloVerify));
          break;
        case "add":
          element.setAttribute("eloverify", me.addKeyToEloVerify(eloVerify));
          break;
        default:
          break;
      }
    }
  },
  removeKeyFromEloVerify: function (eloVerify) {
    var match = /(.* ?)notemptyforward( ?.*)/g.exec(eloVerify);
    if (match) {
      eloVerify = match[1] + match[2];
    }
    return eloVerify.trim();
  },


  /**
   * @private please use setAttribute("optional", false)
   */
  makeMandatory: function () {
    var me = this;
    me.modifyEloVerify(me.element(), "add");
    me.label && me.label.parentElement && me.label.parentElement.classList.add("required");
  },
  addKeyToEloVerify: function (eloVerify) {
    var match = /(.* ?)notemptyforward( ?.*)/g.exec(eloVerify);
    if (!match) {
      eloVerify += " notemptyforward";
    }
    return eloVerify.trim();
  },

  /**
   * can be used to set an HTML Attribute
   * @param {String} attribute  name of the style attribute
   * @param {String} value  value for the attribute
   * @param {Boolean} includingLabel also set attribute for field's label
   * @param {Boolean} includingSelector also set attribute for field's selector
   */
  setStyleAttribute: function (attribute, value, includingLabel, includingSelector) {
    var me = this,
        field = me.element(),
        label = me.label,
        selector = me.selector,
        selectorButton = selector && selector.parentElement.children[1];
    field.style[attribute] = value;
    if (includingLabel && label) {
      label.style[attribute] = value;
    }
    if (includingSelector && selector) {
      selector.style[attribute] = value;
      selectorButton.style[attribute] = value;
    }
  },

 /**
  * applies a manipulator function to the field
  * @private
  */
  applyStandardManipulator: function (manipulator, includingLabel, includingSelector) {
    var me = this,
        field = me.fName,
        label = me.label && me.label.id,
        selector = me.selector && me.selector.name;
    manipulator(field);

    includingLabel && manipulator(label);
    includingSelector && manipulator(selector);
  },

 /**
  * @private please use show() or hide() for the same effect
  */
  changeVisibility: function (visible, includingLabel, includingSelector) {
    var me = this;
    // 9.3
    if (visible) {
      if (me.localizedDynKwl) {
        me.localizedDynKwl.style.visibility = "visible";
      }
      if (me.datePicker) {
        me.datePicker.children[0].classList.add("calbutton");
      }
    } else {
      if (me.localizedDynKwl) {
        me.localizedDynKwl.style.visibility = "visible";
      }
      if (me.datePicker) {
        me.datePicker.children[0].classList.remove("calbutton");
      }
    }
    // 9.3 end
    me.applyStandardManipulator(visible ? $show.bind(me) : $hide.bind(me), includingLabel, includingSelector);
  },

  /**
   * unhides/shows the field on the form
   * @param {Boolean} includingLabel also unhide/show the field's label
   * @param {Boolean} includingSelector also unhide/show the field's selector
   */
  show: function (includingLabel, includingSelector) {
    this.changeVisibility(true, includingLabel, includingSelector);
  },

  /**
   * hides the field on the form
   * @param {Boolean} includingLabel also hides the field's label
   * @param {Boolean} includingSelector also hides the field's selector
   */
  hide: function (includingLabel, includingSelector) {
    this.changeVisibility(false, includingLabel, includingSelector);
  }
});

sol.define("sol.common.forms.FormWrapper.RedactorApi", {

  requiredConfig: ["field"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    console.log("init redactor field", me.field);
    if (me.immediately) {
      me.initRedactor(me.redactorOptions);
    }
  },

  /**
   * 
   */
  initRedactor: function (options) {
    var me = this,
     el = me.field.element();
    $R(el, options || {});
  },

  /**
   * 
   */
  set: function (content) {
    var me = this,
     el = me.field.element();
    el && $R(el, "source.setCode", content);
  },

  /**
   * 
   */
  get: function (content) {
    var me = this,
     el = me.field.element();
    return (el && $R(el, "source.getCode"));
  },

});

/**
 * FormWrapper Templates
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @elowf
 *
 * The FormWrapper provides a simple templating mechanism.
 * To use a template, define a field in any state and set its template.name property
 * to the name of the template:
 *
 *     IX_MAP_HR_CASSATIONTOGGLE: {
 *       template: { name: "toggle", config: { ... } }
 *     }
 *
 * A template is simply a function which creates a state-object using the config passed via template.config
 * and returns the created state-object in the end.
 *
 * Simplest template:
 *
 *     myReadOnlyTemplate: function (config) {
 *       var configuredTemplate;
 *
 *       configuredTemplate = {
 *         states: {
 *           myDefaultState: {
 *             fieldProperties: {},
 *             tabProperties: {}
 *           }
 *         }
 *       }
 *
 *       configuredTemplate.states.myDefaultState.fieldProperties[config.name] = {readonly: config.value};
 *       return configuredTemplate;
 *     }
 *
 * This template `myReadOnlyTemplate` would do only one thing: set a field readonly when the defaultState is set.
 *
 * If you define state properties in a template, they will overwrite existing states, be careful. Never overwrite the stateInit state itself, but only a field's properties in its `fieldProperties`!
 *
 * You can define a template like the one above in the OnInit function, if you define it in the extending class.
 *
 *     OnInit: function {
 *       var me = this;
 *       me.templates.myReadOnlyTemplate = me.myReadOnlyTemplate;
 *     }
 *
 * Now you can use the template in stateInit:
 *
 *     IX_GRP_HR_PERSONNEL_FIRSTNAME: {
 *       template: { name: "myReadOnlyTemplate", config: { name: "IX_GRP_HR_PERSONNEL_FIRSTNAME", value: true } };
 *     }
 *
 * Using the template in stateInit initializes the template. The template then adds the desired attributes to the myDefaultState state.
 * You usually don't use templates in other states than stateInit.
 *
 * Of course, more complex templates make more sense, since a fieldProperty can only be assigned one single template.
 *
 * You can not use a template and properties (e.g. "hidden", "readonly", ...) in a fieldProperty at the same time!
 *
 * Hint:
 *
 *     Define a template in OnInit. Initialize it in stateInit. The template then takes in effect when the specific state is triggered (in this case myDefaultState)
 */
sol.define("sol.common.forms.FormWrapper.Templates", {
  /**
   * Toggle Template.
   *
   * ### Example config
   * You have a form containing a toggle. Depending on which option is toggled, you want to hide, or respectively unhide fields.
   *
   * A toggle always has an "on-state", an "off-state" and an internal "nothing toggled" state
   *
   *     {
   *        toggleOptionFieldName: "IX_MAP_HR_CASSATIONTOGGLE",
   *        onValue: "sol.hr.form.personnelfiledocument.cassationactive",
   *        offValue: "sol.hr.form.personnelfiledocument.nocassation",
   *        onState: {
   *          fieldProperties: {
   *            IX_MAP_HR_PERSONNEL_CASSATIONPERIOD: {
   *              hidden: false
   *            },
   *            IX_MAP_HR_PERSONNEL_CASSATIONPERIOD_UNIT: {
   *              hidden: false
   *            },
   *            IX_GRP_HR_PERSONNEL_CASSATIONDATE: {
   *              hidden: false
   *            }
   *          }
   *        },
   *        offState: {
   *          fieldProperties: {
   *            IX_MAP_HR_PERSONNEL_CASSATIONPERIOD: {
   *              hidden: true
   *            },
   *            IX_MAP_HR_PERSONNEL_CASSATIONPERIOD_UNIT: {
   *              hidden: true
   *            },
   *            IX_GRP_HR_PERSONNEL_CASSATIONDATE: {
   *              hidden: true,
   *              value: ""
   *            }
   *          }
   *        }
   *      }
   */
  toggle: function (config) {
    var configuredTemplate,
      triggerLogic = function (toggledOption) {
        var me = this;
        if (toggledOption == config.onValue) {
          me.setState("toggle_" + config.toggleOptionFieldName + "_anyOptionSelected");
          me.setState("toggle_" + config.toggleOptionFieldName + "_OnOptionSelected");
        } else if (toggledOption == config.offValue) {
          me.setState("toggle_" + config.toggleOptionFieldName + "_anyOptionSelected");
          me.setState("toggle_" + config.toggleOptionFieldName + "_OffOptionSelected");
        }
      };

    configuredTemplate = {
      states: {
        stateInit: {
          fieldProperties: {},
          tabProperties: {}
        }
      },
      OnInitAndTabChange: function () {
        var me = this,
          toggledOption = me.fields[config.toggleOptionFieldName].value();

        if (!config.tabs || config.tabs.length === 0 || config.tabs.indexOf(me.tabs.activeTab.name) > -1) {
          toggledOption == "" ?
            me.setState("toggle_" + config.toggleOptionFieldName + "_defaultState") :
            triggerLogic.call(me, toggledOption);
        }
      }
    };

    configuredTemplate.states.stateInit.fieldProperties[config.toggleOptionFieldName] = {
      responder: function (form, state, field, value) {
        triggerLogic.call(form, value);
      }
    };

    configuredTemplate.states["toggle_" + config.toggleOptionFieldName + "_defaultState"] = config.defaultState;
    configuredTemplate.states["toggle_" + config.toggleOptionFieldName + "_OnOptionSelected"] = config.onState;
    configuredTemplate.states["toggle_" + config.toggleOptionFieldName + "_OffOptionSelected"] = config.offState;
    configuredTemplate.states["toggle_" + config.toggleOptionFieldName + "_anyOptionSelected"] = config.anyState;

    return configuredTemplate;
  },

  /**
   * Filechooser Variants (drag&drop, filechooser, webcam picture capturing).
   * This template has various dependencies (jar-file, libs, ...)
   *
   * In some forms, you'd maybe like to let the user select a picture. And save it for later use.
   * If so, please use the 113_capturepic_webcam "HR"-Form as an inspiration.
   *
   * As soon as you defined your own form having all required fields, you can use the following template
   * ### Example config
   *
   *     {
   *       name: "personnelphotopicker",
   *       webcamName: "personnelphotocam",
   *       webcamConfig: {
   *         javaStartupButton: "WEBCAM_JAVA",
   *         varNameBtnReset: "JS_WEBCAM_RESET",
   *         varNameBtnSnap: "JS_WEBCAM_SNAP",
   *         varNameContainer: "WEBCAM_INIT",
   *         width: 540,
   *         height: 390,
   *         dest_width: 720,
   *         dest_height: 520,
   *         crop_width: 400,
   *         crop_height: 520,
   *         image_format: "jpeg",
   *         jpeg_quality: 90,
   *         swfURL: "lib_webcam.swf",
   *         fps: 45,
   *         showIfNoCam: true
   *       },
   *       dropZoneId: "dropZone",
   *       filePickerId: "filePicker",
   *       accept: "image/jpeg, image/jpg, image/png",
   *       maxSize: "3", //Megabyte (float values possible)
   *       maskNameForRule: "Personnel file",
   *       solTypeForRule: "PERSONNELFILE",
   *       photoReferenceField: "HR_PERSONNEL_PHOTO_GUID",
   *       photoReferenceFieldObjId: "HR_PERSONNEL_PHOTO_OBJID",
   *       clearPreviewField: "JS_PICTURE_CLEAR",
   *       filePickerField: "JS_FILEPICKER",
   *       photoConfig: {
   *         maskName: "Personnel file document",
   *         pictureName: "Mitarbeiterfoto"
   *       }
   *     }
   */
  fileChooserVariants: function (config) {
    var configuredTemplate;

    configuredTemplate = {
      states: {
        stateInit: {
          fieldProperties: {},
          tabProperties: {}
        }
      },
      OnInitAndTabChange: function () {
        var me = this;
        me.fcv = sol.create("sol.common.forms.FileChooserVariants", config);
      },
      OnSaveRule: {
        name: "FileDragDropAndDialog" + config.name,
        rule: {
          maskName: config.maskNameForRule,
          solType: config.solTypeForRule,
          saveValues: function () {
            var me = this;
            me.fcv.uploadFile();
            return true;
          }
        }
      }
    };

    return configuredTemplate;
  },

  /**
   * Template for a date which will receive its value from a unit field and its selector.
   *
   * Validation messages will be displayed, if the user tries to change a field which would falsify the calculation
   *
   * e.g.
   * Start date "20170101"
   *
   * unit "4"
   *
   * unitselector value "days"
   *
   * target date = 20170105
   *
   * Please always name your selector unit field "FIELDNAME_UNIT"
   * Other names are not supported yet.
   *
   * ### Example config
   *
   *     {
   *       startDateFnOrValue: "IX_GRP_HR_PERSONNEL_DATEOFJOINING",
   *       unitValueFieldName: "IX_MAP_HR_PERSONNEL_PROBATIONARYPERIODDURATION",
   *       unitSelectorFieldName: "IX_MAP_HR_PERSONNEL_PROBATIONARYPERIODDURATION_UNIT",
   *       targetDateFieldName: "IX_MAP_HR_PERSONNEL_ENDOFPROBATIONARY",
   *       validationMessage: "Da im Feld `Ende der Probezeit` ein von der Berechnung abweichender Wert eingegeben wurde, ist dieses Feld jetzt gesperrt. Leeren Sie das Feld, wenn Sie die Berechnungsfunktion verwenden möchten!"
   *     }
   *
   */
  dateFromUnitSelectorRestrictive: function (config) {
    var configuredTemplate;
    configuredTemplate = {
      states: {
        stateInit: {
          fieldProperties: {},
          tabProperties: {}
        }
      }
    };

    configuredTemplate.states["dfus_" + config.targetDateFieldName + "_HasNoValue"] = {
      fieldProperties: {}
    };
    configuredTemplate.states["dfus_" + config.targetDateFieldName + "_HasNoValue"].fieldProperties[config.unitValueFieldName] = {
      readonly: false,
      validator: false
    };
    configuredTemplate.states["dfus_" + config.targetDateFieldName + "_HasNoValue"].fieldProperties[config.unitSelectorFieldName] = {
      readonly: false,
      validator: false
    };

    configuredTemplate.states["dfus_" + config.targetDateFieldName + "_HasCustomValue"] = {
      fieldProperties: {}
    };
    configuredTemplate.states["dfus_" + config.targetDateFieldName + "_HasCustomValue"].fieldProperties[config.unitValueFieldName] = {
      readonly: true,
      validator: function () {
        return config.validationMessage;
      }
    };
    configuredTemplate.states["dfus_" + config.targetDateFieldName + "_HasCustomValue"].fieldProperties[config.unitSelectorFieldName] = {
      readonly: true,
      validator: function () {
        return config.validationMessage;
      }
    };

    configuredTemplate.states.stateInit.fieldProperties[config.targetDateFieldName] = {
      responder: function (form, state, field, value) {
        if (value === "") {
          form.setState("dfus_" + config.targetDateFieldName + "_HasNoValue");
        } else if (value !== form.returnCalculatedDate(config.startDateFnOrValue, config.unitValueFieldName, config.targetDateFieldName, config.offsetNumber, config.offsetUnit)) {
          form.setState("dfus_" + config.targetDateFieldName + "_HasCustomValue");
        }
      }
    };
    configuredTemplate.states.stateInit.fieldProperties[config.unitValueFieldName] = {
      responder: function (form, state, field, value) {
        if (field.value() && form.fields[config.unitSelectorFieldName].value()) {
          form.setCalculatedDate(config.startDateFnOrValue, config.unitValueFieldName, config.targetDateFieldName, config.offsetNumber, config.offsetUnit);
        }
      }
    };

    configuredTemplate.states.stateInit.fieldProperties[config.unitSelectorFieldName] = {
      responder: function (form, state, field, value) {
        if (field.value() && form.fields[config.unitSelectorFieldName].value()) {
          form.setCalculatedDate(config.startDateFnOrValue, config.unitValueFieldName, config.targetDateFieldName, config.offsetNumber, config.offsetUnit);
        }
      }
    };

    return configuredTemplate;
  },

   /**
   * Template for a date which will receive its value from a unit field, its duration-selector and an optional "termination-Point" selector.
   *
   * Please always name your selector unit field "FIELDNAME_UNIT"
   * Other names are not supported yet.
   *
   * Also, it is recommended, to name your termination point field "FIELDNAME_TP"
   *
   * ### Example config
   *
   *     IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL: {
   *       template: {
   *         name: "dateFromUnitSelector",
   *         config: {
   *           recalculate: true,
   *           startDateFnOrValue: undefined,  // == today
   *           unitValueFieldName: "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE",
   *           unitSelectorFieldName: "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_UNIT",
   *           terminationPointFieldName: "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_TP",
   *           targetDateFieldName: "IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL",
   *         }
   *       }
   *     }
   *
   */
  dateFromUnitSelector: function (config) {
    var configuredTemplate;
    configuredTemplate = {
      states: {
        stateInit: {
          fieldProperties: {},
          tabProperties: {}
        }
      }
    };

    configuredTemplate.states["dfus_" + config.targetDateFieldName + "_HasCustomValue"] = {
      fieldProperties: {}
    };
    configuredTemplate.states["dfus_" + config.targetDateFieldName + "_HasCustomValue"].fieldProperties[config.unitValueFieldName] = {
      value: "",
      overwrite: true
    };
    configuredTemplate.states["dfus_" + config.targetDateFieldName + "_HasCustomValue"].fieldProperties[config.unitSelectorFieldName] = {
      value: "",
      overwrite: true
    };

    configuredTemplate.states.stateInit.fieldProperties[config.targetDateFieldName] = {
      responder: function (form, state, field, value) {
        if (value !== form.returnCalculatedDate(config.startDateFnOrValue, config.unitValueFieldName, config.terminationPointFieldName || "", config.targetDateFieldName, config.offsetNumber, config.offsetUnit)) {
          form.setState("dfus_" + config.targetDateFieldName + "_HasCustomValue");
        }
      }
    };

    if (config.terminationPointFieldName) {
      configuredTemplate.states.stateInit.fieldProperties[config.terminationPointFieldName] = {
        responder: function (form, state, field, value) {
          if (field.value() && form.fields[config.terminationPointFieldName].value()) {
            form.setCalculatedDate(config.startDateFnOrValue, config.unitValueFieldName, config.terminationPointFieldName || "", config.targetDateFieldName, config.offsetNumber, config.offsetUnit);
          }
        }
      };
    }

    configuredTemplate.states.stateInit.fieldProperties[config.unitValueFieldName] = {
      responder: function (form, state, field, value) {
        if (field.value() && form.fields[config.unitSelectorFieldName].value()) {
          form.setCalculatedDate(config.startDateFnOrValue, config.unitValueFieldName, config.terminationPointFieldName || "", config.targetDateFieldName, config.offsetNumber, config.offsetUnit);
        }
      }
    };

    configuredTemplate.states.stateInit.fieldProperties[config.unitSelectorFieldName] = {
      responder: function (form, state, field, value) {
        if (field.value() && form.fields[config.unitSelectorFieldName].value()) {
          form.setCalculatedDate(config.startDateFnOrValue, config.unitValueFieldName, config.terminationPointFieldName || "", config.targetDateFieldName, config.offsetNumber, config.offsetUnit);
        }
      }
    };

    if (config.recalculate) {
      configuredTemplate.OnInitAndTabChange = function () {
        var me = this,
            unitValueField = me.fields[config.unitValueFieldName];
        if (unitValueField && unitValueField.value()) {
          me.setCalculatedDate(config.startDateFnOrValue, config.unitValueFieldName, config.terminationPointFieldName || "", config.targetDateFieldName, config.offsetNumber, config.offsetUnit);
        }
      };
    }

    return configuredTemplate;
  }

});