/**
 * Helper functions for ELOwf forms
 *
 * @author AR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @elowf
 * @requires sol.visitor.Config
 */
sol.define("sol.visitor.forms.Utils", {
  singleton: true,

  MAX_LINES: 1000,

  templates: {
    webcam: ["720_checkin_webcam"],
    picture: ["710_visitor_picture", "711_visitor_picture_fixed"]
  },

  identifier: {
    checkin: "104_visitor_checkin_title",
    createVisitorAdhoc: "106_visitor_create_adhoc_title",
    createGroupAdhoc: "110_group_create_adhoc_title",
    checkout: "105_visitor_checkout_title",
    checkinGroup: "108_group_checkin_title",
    checkoutGroup: "109_group_checkout_title"
  },

  securityClearanceStatus: {
    not_checked: { key: "NC", class: "notchecked" },
    check_in_progress: { key: "IP", class: "notchecked" },
    checked: { key: "CD", class: "checked" },
    rejected: { key: "RE", class: "rejected" }
  },

  /**
   * Registers an update using the new IX .
   */
  registerUpdate: function () {
    sol.common.forms.Utils.registerUpdate();
  },

  /**
   * Init function for visitor Mask
   */
  initOnChange: function () {
    var me = this;

    me.setPartsVisible(null);
    $hide("TXT_TIMEFORMATINVALID");
    $hide("TXT_MAILFORMATINVALID");
    $hide("IX_MAP_VISITOR_TOTALVISITORS");
    $hide("TXT_GUID");
    $hide("IX_GRP_VISITOR_PHOTO_GUID");

    me.highlightHeader();

    if (me.checkif(me.identifier.createGroupAdhoc)) {
      me.setDate("IX_GRP_VISITOR_ARRIVALDATE");
    }

    if (me.checkif(me.identifier.checkinGroup)) {
      me.setNormalCheckInElements();
      me.setDate("IX_GRP_VISITOR_ARRIVALDATE");
    }

    if (me.checkif(me.identifier.checkoutGroup)) {
      me.setDate("IX_GRP_VISITOR_DEPARTUREDATE");
    }

    if (me.checkif(me.identifier.createVisitorAdhoc)) {
      me.setDate("IX_GRP_VISITOR_ARRIVALDATE");
      me.setTime("IX_GRP_VISITOR_ARRIVALTIME");
    }

    if (me.checkif(me.identifier.checkin)) {
      me.setNormalCheckInElements();
      me.setDate("IX_GRP_VISITOR_ARRIVALDATE");
      me.setTime("IX_GRP_VISITOR_ARRIVALTIME");
    }

    if (me.checkif(me.identifier.checkout)) {
      me.setDate("IX_GRP_VISITOR_DEPARTUREDATE");
      me.setTime("IX_GRP_VISITOR_DEPARTURETIME");
    }

    me.loadVisitorGroupMembers();

    me.prefillCheckInLines();
    me.prefillCheckOutLines();
    me.setTimePlaceholders();
    me.hideTableColumn(["IX_MAP_VISITOR_GUID"], true);

    window.setTimeout(function () {
      // delay start in order to improve loading times
      me.showVisitorImage();
    }, 100);
  },

  /**
   * Sets the elements for a normal check-in
   */
  setNormalCheckInElements: function () {
    var me = this,
        reCheckIn = false,
        reCheckInElement;

    reCheckIn = $val("IX_GRP_VISITOR_RECHECKIN");

    if (!reCheckIn || reCheckIn != "1") {

      reCheckInElement = document.querySelector(".hide-recheckin");
      if (reCheckInElement) {
        reCheckInElement.parentElement.style.display = "none";
      }

      me.setDate("IX_GRP_VISITOR_STARTDATE");
      me.setTime("IX_GRP_VISITOR_STARTTIME");
    }
  },

  /**
   * onFieldChanged
   * @param {HTMLElement} source
   */
  onFieldChanged: function (source) {
    var me = this;
    sol.common.forms.Utils.setFieldChanged(source);
    me.setPartsVisible(source);
    me.autoCompleteTime(source);
    me.setVisitorResponsible(source);
    me.setPicture(source);
    me.prefillCheckInLines();
    me.prefillCheckOutLines();
  },

  /**
   * onNextClicked function for visitor Mask
   */
  onNextClicked: function () {
    var me = this,
        count;

    count = me.countRows("IX_MAP_VISITOR_FIRSTNAME");
    $update("IX_MAP_VISITOR_TOTALVISITORS", count);
    this.clearTime();
  },

  /**
   * Only allows one field of the checkboxes of a table to be checked and unchecks all the others
   * @param {Object} source Source Object that was changed
   */
  setVisitorResponsible: function (source) {
    var i, checkedResponsible;

    if (source.name.startsWith("VISITOR_GROUPRESPONSIBLE")) {
      if (source.checked) {
        checkedResponsible = document.querySelectorAll("input[name^='VISITOR_GROUPRESPONSIBLE']:checked");
        if (checkedResponsible) {
          for (i = 0; i < checkedResponsible.length; i++) {
            if (checkedResponsible[i].name != source.name) {
              $update(checkedResponsible[i].name, "0");
            }
          }
        }
      } else {
        $update("VISITOR_GROUPRESPONSIBLE1", "1");
      }
    }
  },

  /**
   * Hides a column from a table
   * @param {Array} names Array of columns that should be hidden
   * @param {boolean} hidden Specifies wheter the columns should be shown or hidden
   */
  hideTableColumn: function (names, hidden) {
    var i, j, tableFields;
    if (names) {
      for (i = 0; i < names.length; i++) {
        tableFields = document.querySelectorAll("input[name^='" + names[i] + "']");
        if (tableFields) {
          for (j = 0; j < tableFields.length; j++) {
            if (hidden) {
              $hide(tableFields[j].name);
            } else {
              $show(tableFields[j].name);
            }
          }
        }
      }
    }
  },

  /**
   * Sets the wf parts visible
   * @param {HTMLElement} source
   */
  setPartsVisible: function (source) {
    var me = this;

    if (this.getElement("IX_MAP_VISITOR_TRAVELVEHICLE") && $val("IX_MAP_VISITOR_TRAVELVEHICLE").indexOf("C") === 0) {
      me.showElements(["IX_GRP_VISITOR_LICENSETAG", "TXT_LICENSETAG"], true);
    } else {
      me.showElements(["IX_GRP_VISITOR_LICENSETAG", "TXT_LICENSETAG"], false);
    }

    if (this.getElement("IX_GRP_VISITOR_PICKUPCHECK") && $val("IX_GRP_VISITOR_PICKUPCHECK") == "sol.visitor.form.visitorPickupYes") {
      me.showElements(["IX_MAP_VISITOR_PICKUEMPLOYEE", "TXT_PICKUEMPLOYEE"], true);
    } else {
      me.showElements(["IX_MAP_VISITOR_PICKUEMPLOYEE", "TXT_PICKUEMPLOYEE"], false);
    }
  },

  /**
   * highlightHeader
   */
  highlightHeader: function () {
    var me = this,
        clearance = $val("IX_GRP_VISITOR_SECURITY_CLEARANCE");

    if (clearance.startsWith(me.securityClearanceStatus.not_checked.key)) {
      document.body.className += " " + me.securityClearanceStatus.not_checked.class;
    } else if (clearance.startsWith(me.securityClearanceStatus.check_in_progress.key)) {
      document.body.className += " " + me.securityClearanceStatus.check_in_progress.class;
    } else if (clearance.startsWith(me.securityClearanceStatus.checked.key)) {
      document.body.className += " " + me.securityClearanceStatus.checked.class;
    } else if (clearance.startsWith(me.securityClearanceStatus.rejected.key)) {
      document.body.className += " " + me.securityClearanceStatus.rejected.class;
    }
  },

  /**
   * setPicture
   * @param {HTMLElement} source
   */
  setPicture: function (source) {
    var me = this;

    if (source.name == "IX_MAP_VISITOR_CONTACT_REFERENCE") {
      if (!$val("IX_MAP_VISITOR_CONTACT_REFERENCE")) {
        if ($var("IX_GRP_VISITOR_PHOTO_GUID")) {
          $update("IX_GRP_VISITOR_PHOTO_GUID", "");
          me.showVisitorImage();
        }
      }
    }

    if (source.name == "IX_GRP_VISITOR_PHOTO_GUID") {
      me.showVisitorImage();
    }
  },

  /**
   * Prefills the check boxes for the checkin table if a visitor is not already checked in (IX_MAP_VISITOR_CHECKEDIN not checked)
   */
  prefillCheckInLines: function () {
    var me = this,
        checkedIn, i, line, checkInVisitor;

    checkedIn = document.querySelectorAll("input[name^='VISITOR_CHECKEDIN']");
    if (checkedIn) {
      for (i = 0; i < checkedIn.length; i++) {
        line = i + 1;
        checkInVisitor = document.querySelector("input[name^='VISITOR_CHECKINVISITOR" + line + "']");
        if (checkInVisitor) {
          if (checkedIn[i].checked) {
            checkInVisitor.removeAttribute("checked");
            me.setElementsDisabled(["VISITOR_CHECKINVISITOR" + line,
              "VISITOR_FIRSTNAME" + line, "VISITOR_LASTNAME" + line,
              "VISITOR_COMPANYNAME" + line, "VISITOR_LICENSETAG" + line,
              "VISITOR_MAIL" + line, "VISITOR_PHONE" + line,
              "VISITOR_INTERNALVISITOR" + line,
              "VISITOR_ARRIVALTIME" + line], true);
          } else {
            checkInVisitor.setAttribute("checked", true);
            me.setElementsDisabled(["VISITOR_CHECKINVISITOR" + line,
              "VISITOR_FIRSTNAME" + line, "VISITOR_LASTNAME" + line,
              "VISITOR_COMPANYNAME" + line, "VISITOR_LICENSETAG" + line,
              "VISITOR_MAIL" + line, "VISITOR_PHONE" + line,
              "VISITOR_INTERNALVISITOR" + line,
              "VISITOR_ARRIVALTIME" + line], false);

            if (me.getElement("VISITOR_ARRIVALTIME" + line).value == "") {
              me.setTime("VISITOR_ARRIVALTIME" + line);
            }
          }
          sol.common.forms.Utils.setFieldChanged(checkInVisitor);
        }
      }
    }
  },

  /**
   * Deletes the time for all visitors that are not checked in or not checked out
   */
  clearTime: function () {
    var checkedIn, i, line, checkInVisitor, checkOutVisitor;

    checkedIn = document.querySelectorAll("input[name^='VISITOR_CHECKEDIN']");
    if (checkedIn) {
      for (i = 0; i < checkedIn.length; i++) {
        line = i + 1;
        checkInVisitor = document.querySelector("input[name^='VISITOR_CHECKINVISITOR" + line + "']");
        checkOutVisitor = document.querySelector("input[name^='VISITOR_CHECKOUTVISITOR" + line + "']");
        if (checkedIn[i]) {
          if (checkInVisitor && !checkInVisitor.checked && !checkedIn[i].checked) {
            $update("VISITOR_ARRIVALTIME" + line, "");
          } else if (checkOutVisitor && checkedIn[i].checked && !checkOutVisitor.checked) {
            $update("VISITOR_DEPARTURETIME" + line, "");
          }
        }
      }
    }
  },

  /**
   * Prefills the check boxes for the checkout table if a visitor is checked in (IX_MAP_VISITOR_CHECKEDIN checked)
   */
  prefillCheckOutLines: function () {
    var me = this,
        checkedIn, i, line, checkOutVisitor;

    checkedIn = document.querySelectorAll("input[name^='IX_MAP_VISITOR_CHECKEDIN']");
    if (checkedIn) {
      for (i = 0; i < checkedIn.length; i++) {
        line = i + 1;
        checkOutVisitor = document.querySelector("input[name^='IX_MAP_VISITOR_CHECKOUTVISITOR" + line + "']");
        if (checkOutVisitor) {
          if (checkedIn[i].checked) {
            checkOutVisitor.setAttribute("checked", true);
            if (me.getElement("IX_MAP_VISITOR_DEPARTURETIME" + line).value == "") {
              me.setTime("IX_MAP_VISITOR_DEPARTURETIME" + line);
            }
            me.setElementsDisabled(["IX_MAP_VISITOR_CHECKOUTVISITOR" + line, "IX_MAP_VISITOR_DEPARTURETIME" + line], false);

          } else {
            checkOutVisitor.removeAttribute("checked");
            me.setElementsDisabled(["IX_MAP_VISITOR_CHECKOUTVISITOR" + line, "IX_MAP_VISITOR_DEPARTURETIME" + line], true);

          }
        }
      }
    }
  },

  /**
   * Prefills the check boxes for the checkout table if a visitor is checked in (IX_MAP_VISITOR_CHECKEDIN checked)
   * querySelector may be changed to querySelectorAll for table fields (if (fields) {for(var i = 0; i < fields.length; i ++){var field = fields[i]}})
   * @param {Array} fields Array of fields that should be set disabled
   * @param {Boolean} disabled Specifies wheter the element should be set enabled or disabled
   */
  setElementsDisabled: function (fields, disabled) {
    var i, field;

    if (fields) {
      for (i = 0; i < fields.length; i++) {
        field = document.querySelector("input[name^='" + fields[i] + "']");
        if (field) {
          if (disabled) {
            if (field.type == "checkbox" || field.type == "radio") {
              field.setAttribute("disabled", true);
            }
            field.parentNode.setAttribute("isreadonly", true);
            field.setAttribute("readonly", true);
            field.setAttribute("tabindex", "-1");
          } else {
            field.parentNode.removeAttribute("isreadonly");
            field.removeAttribute("readonly");
            field.removeAttribute("disabled");
            field.removeAttribute("tabindex");
          }
        }
      }
    }
  },

  /**
   * Returns specific Element for a name
   * Only the element with the exact name will be retrieved (may be changed to name^= for contains search)
   * @param {String} name Name of Element to retrieve
   * @return {HTMLElement} HTML Element
   */
  getElement: function (name) {
    var element;
    element = document.querySelector("input[name=" + name + "]");
    return element;
  },

  /**
   * Returns specific Element for a class name
   * Only the element with the exact class name will be retrieved
   * @param {String} name Classname of Element to retrieve
   * @return {HTMLElement} HTML element
   */
  getElementByClassName: function (name) {
    var element;
    element = document.querySelector("input[class*=" + name + "]");
    return element;
  },


  /**
   * Shows or hides single elements
   * @param {Array} varNames Array of variable names.
   * @param {Boolean} show True if the element should be shown.
   */
  showElements: function (varNames, show) {
    var me = this;

    if (show) {
      varNames.forEach(function (varName) {
        $show(varName);
      }, me);
    } else {
      varNames.forEach(function (varName) {
        $hide(varName);
      }, me);
    }
  },


  /**
   * Sets or removes the notemptyforward attribute for the validation
   * @param {Array} varNames Array of variable names.
   * @param {Boolean} mandatory True if the element should be mandatory
   */
  setElementsMandatory: function (varNames, mandatory) {
    var me = this;

    if (mandatory) {
      varNames.forEach(function (varName) {
        var element, verify;
        element = me.getElement(varName);
        if (element) {
          verify = element.getAttribute("eloverify");
          element.setAttribute("eloverify", verify + " notemptyforward");
        }
      }, me);
    } else {
      varNames.forEach(function (varName) {
        var element, verify;
        element = me.getElement(varName);
        if (element) {
          verify = element.getAttribute("eloverify");
          element.setAttribute("eloverify", verify.replace(" notemptyforward", ""));
        }
      }, me);
    }
  },

  /**
   * Sets the current time for an specified indexfield if no value is set
   * @param {String} idxField Field that should be filled
   */
  setTime: function (idxField) {
    var element, date, time, tmpMinutes, tmpHours, field;

    element = this.getElement(idxField);
    if (element && (element.value == "" || element.value == null || element.value == " ")) {
      date = new Date();
      time = "";
      tmpMinutes = date.getMinutes();
      tmpHours = date.getHours();

      if (tmpMinutes < 10) {
        tmpMinutes = "0" + tmpMinutes;
      }
      if (tmpHours < 10) {
        tmpHours = "0" + tmpHours;
      }
      time = tmpHours + ":" + tmpMinutes;

      $update(idxField, time);
      field = $var(idxField);
      sol.common.forms.Utils.setFieldChanged(field);
    }
  },

  /**
   * Checks  whether a value is a valid time value
   * @param {String} value that should be checked
   * @return {Boolean} Returns true if value is valid
   */
  validateTime: function (value) {
    var regEx,
        validTime = true;
    regEx = new RegExp("^(2[0-4]|[0-1][0-9]):[0-5][0-9]$");
    if (value && value.search(regEx) == -1) {
      validTime = false;
    }
    return validTime;
  },


  /**
   * Checks  whether a value is a valid mail value
   * @param {String} value that should be checked
   * @return {Boolean} Returns true if value is valid
   */
  validateMail: function (value) {
    var mailformat,
        validMail = true;
    mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (value && value != "" && !value.match(mailformat)) {
      validMail = false;
    }
    return validMail;
  },


  /**
   * Checks input of field and autocompletes it to a valid time value
   * @param {Object} source html Object to check
   */
  autoCompleteTime: function (source) {
    var newValue, i;

    if (document.querySelector('.formtime input[name="' + source.name + '"]')) {
      if (source.value && source.value.indexOf(":") == -1 && !isNaN(source.value)) {
        if (source.value.length == 1) {
          source.value = "0" + source.value;
        }
        newValue = source.value;
        for (i = source.value.length; i < 4; i++) {
          newValue += "0";
        }
        newValue = newValue.substr(0, 2) + ":" + newValue.substr(2, 2);
        $update(source.name, newValue);
      }
    }
  },


  /**
   * Sets a time format placeholder to all fields with a specific class
   */
  setTimePlaceholders: function () {
    var i, elements;

    elements = document.querySelectorAll('.formtime input[type="text"]:not([placeholder])');
    if (elements) {
      for (i = 0; i < elements.length; i++) {
        elements[i].setAttribute("placeholder", "--:--");
      }
    }
  },

  /**
   * Sets the current date for an specified indexfield if no value is set
   * @param {String} idxField Field that should be filled
   */
  setDate: function (idxField) {
    var me = this,
        isoNow;
    if (!$val(idxField)) {
      isoNow = moment().format("YYYYMMDD");
      me.setIsoDate(idxField, isoNow);
    }
  },

  /**
   * Sets an ISO date
   * @param {String} fieldName Field name
   * @param {String} isoDate ISO date
   */
  setIsoDate: function (fieldName, isoDate) {
    var localizedDate, field;
    localizedDate = elo.wf.date.format(isoDate);
    $update(fieldName, localizedDate);
    field = $var(fieldName);
    sol.common.forms.Utils.setFieldChanged(field);
  },

  /**
   * Clears the Licensetag value if car was not selected
   */
  clearLicenseTag: function () {
    var checkedVehicle = this.getElement("IX_MAP_VISITOR_TRAVELVEHICLE");
    if (checkedVehicle && checkedVehicle.value.indexOf("C") !== 0) {
      $update("IX_GRP_VISITOR_LICENSETAG", "");
    }
  },

  /**
   * Gets the checked Element for a group of radiobuttons
   * @param {String} name Name of Radiobuttons of which the checkedValues should be retrieved
   * @return {HTMLElement} returns Checked DOM Object
   */
  getCheckedElement: function (name) {
    return document.querySelector("input[name='" + name + "']:checked");
  },

  /**
   * Iterates over a table.
   * @param {string} indicatorColumnName Name of a column to check if the line exists.
   * @param {function} func Callback function for the iteration.
   * @param {object} ctx Execution context.
   */
  forEachRow: function (indicatorColumnName, func, ctx) {
    var i,
        lastRow = false;
    for (i = 1; i < this.MAX_LINES; i++) {
      lastRow = !$var(indicatorColumnName + (i + 1));
      func.call(ctx, i, lastRow);
      if (lastRow) {
        break;
      }
    }
  },

  /**
   * Counts the rows of a table
   * @param {String} columnName Name of a variable (without Index)
   * @return {Number} Number of rows of the table.
   */
  countRows: function (columnName) {
    var me = this,
        count = 0;
    me.forEachRow(columnName, function () {
      count++;
    });
    return count;
  },

  /**
   * Loads the visitors image into an Element with id VISITOR_IMAGE.
   * This is primarily used by templates: '710_visitor_picture' and '711_visitor_picture_fixed'.
   *
   * If the webcam component is used by the current form as well, only webcam or visitor picture is displayed.
   */
  showVisitorImage: function () {
    var me = this,
        imageCont = document.getElementById("VISITOR_IMAGE"),
        photoGuid = $var("IX_GRP_VISITOR_PHOTO_GUID") ? $var("IX_GRP_VISITOR_PHOTO_GUID").value : ELO_PARAMS.IX_GRP_VISITOR_PHOTO_GUID;

    if (imageCont && photoGuid) {
      // prevent unessessary updates
      if (me.$loadedPictureGuid === photoGuid) {
        return;
      }
      me.$loadedPictureGuid = photoGuid;

      // if picture guid id is set, load image
      sol.common.forms.Utils.initializeIxSession(function () {
        elo.IX.ix().checkoutDoc(photoGuid, null, elo.CONST.EDIT_INFO.mbDocument, elo.CONST.LOCK.NO, new de.elo.ix.client.AsyncCallback(
          function (doc) {
            console.info(doc.document.docs[0].url);
            imageCont.innerHTML = '<img src="' + doc.document.docs[0].url + '" />';

            // display visitor picture and hide webcam
            me.showTemplate(me.templates.picture, true);
            me.showTemplate(me.templates.webcam, false);
          }, function () {
            // hide visitor picture and display webcam
            me.showTemplate(me.templates.picture, false);
            me.showTemplate(me.templates.webcam, true);
          }));
      });
    } else {
      me.$loadedPictureGuid = "";
      if (imageCont) {
        // hide visitor picture and display webcam
        me.showTemplate(me.templates.picture, false);
        me.showTemplate(me.templates.webcam, true);
      }
    }
  },

  /**
   * Shows or hides a set of ELOwf templates.
   * @param {Array} templateSet List of template names
   * @param {Boolean} visible True if all templates given should be visible
   */
  showTemplate: function (templateSet, visible) {
    var i, tpl;
    for (i = 0; i < templateSet.length; i++) {
      tpl = templateSet[i];
      visible ? $show("part_" + tpl) : $hide("part_" + tpl);
    }
  },

  checkif: function (template) {
    var found;

    found = !!document.getElementById("part_" + template);
    return found;
  },

  visitorGroupMemberMapping: {
    "VISITOR_ARRIVALTIME{i}": { type: "GRP", key: "VISITOR_ARRIVALTIME" },
    "VISITOR_DEPARTURETIME{i}": { type: "GRP", key: "VISITOR_DEPARTURETIME" },
    "VISITOR_CHECKINVISITOR{i}": { type: "MAP", key: "VISITOR_CHECKINVISITOR" },
    "VISITOR_CHECKOUTVISITOR{i}": { type: "MAP", key: "VISITOR_CHECKOUTVISITOR" },
    "VISITOR_FIRSTNAME{i}": { type: "GRP", key: "VISITOR_FIRSTNAME" },
    "VISITOR_LASTNAME{i}": { type: "GRP", key: "VISITOR_LASTNAME" },
    "VISITOR_DATE_OF_BIRTH{i}": { type: "GRP", key: "VISITOR_DATE_OF_BIRTH", dataType: "isoDate" },
    "VISITOR_PLACE_OF_BIRTH{i}": { type: "GRP", key: "VISITOR_PLACE_OF_BIRTH" },
    "VISITOR_COMPANYNAME{i}": { type: "GRP", key: "VISITOR_COMPANYNAME" },
    "VISITOR_MAIL{i}": { type: "GRP", key: "VISITOR_MAIL" },
    "VISITOR_PHONE{i}": { type: "GRP", key: "VISITOR_PHONE" },
    "VISITOR_SECURITY_CLEARANCE{i}": { type: "GRP", key: "VISITOR_SECURITY_CLEARANCE" },
    "VISITOR_GROUPRESPONSIBLE{i}": { type: "MAP", key: "VISITOR_GROUPRESPONSIBLE" },
    "VISITOR_INTERNALVISITOR{i}": { type: "MAP", key: "VISITOR_INTERNALVISITOR" },
    "VISITOR_OBJID{i}": { type: "SORD", key: "id" }
  },

  loadVisitorGroupMembers: function () {
    var me = this;

    if ((ELO_PARAMS.IX_GRP_SOL_TYPE != "VISITOR_GROUP") && (ELO_PARAMS.IX_GRP_SOL_TYPE != "VISITOR_COMPANY")) {
      return;
    }

    sol.common.IxUtils.execute("RF_sol_visitor_service_ReadVisitorGroupMembers", { visitorGroupObjId: ELO_PARAMS.ELO_OBJID },
      function (visitorGroupMembersObj) {
        var checkedResponsible;

        me.insertVisitorGroupMembers(visitorGroupMembersObj);

        // Set default responsible AFTER inserting all visitor data
        checkedResponsible = document.querySelector("input[name^='VISITOR_GROUPRESPONSIBLE']:checked");
        if (!checkedResponsible) {
          $update("VISITOR_GROUPRESPONSIBLE1", "1");
        }
      },
      function () {
        throw "Can't load visitor group members";
      }
    );
  },

  visitorGroupMembersAddLineId: 620,

  insertVisitorGroupMembers: function (visitorGroupMembersObj) {
    var me = this,
        visitorGroupMembers, i, visitorGroupMember, fieldNameTpl, fieldName, mapping, value,
        visitorStatusString, visitorStatus;

    ELOF.showLoadingDiv();

    visitorGroupMembers = visitorGroupMembersObj.visitorGroupMembers;
    for (i = 0; i < visitorGroupMembers.length; i++) {
      visitorGroupMember = visitorGroupMembers[i];
      sol.common.forms.Utils.ensureRowExists("VISITOR_FIRSTNAME" + (i + 1));
      for (fieldNameTpl in me.visitorGroupMemberMapping) {
        mapping = me.visitorGroupMemberMapping[fieldNameTpl];
        switch (mapping.type) {
          case "GRP":
            value = visitorGroupMember.objKeys[mapping.key];
            break;
          case "MAP":
            value = visitorGroupMember.mapKeys[mapping.key];
            break;
          default:
            value = visitorGroupMember[mapping.key];
            break;
        }
        fieldName = fieldNameTpl.replace("{i}", (i + 1));

        mapping.dataType = mapping.dataType || "String";

        switch (mapping.dataType.toUpperCase()) {
          case "ISODATE": {
            sol.common.forms.Utils.setIsoDate(fieldName, value);
            break;
          }

          default: {
            $update(fieldName, value);
            break;
          }
        }
      }
      visitorStatusString = visitorGroupMember.objKeys.VISITOR_STATUS || "";
      visitorStatus = visitorStatusString.substr(0, 2);

      if (visitorStatus == "CI") {
        $update("VISITOR_CHECKEDIN" + (i + 1), "1");
      }
    }

    ELOF.hideLoadingDiv();
  },

  /**
   * Collects the changed table data
   * @param {Object} config Configuration
   * @param {String} config.objIdFieldName Object-ID field name
   * @param {String} config.mapping Mapping
   * @param {String} [config.changedAttributeName=changed] Changed attribute
   * @return {Object}
   */
  collectChangedTableData: function (config) {
    var data = {},
        objIdFieldName, objIdField, table, inputs, i, input, value, index, baseFieldName,
        changed, keyName, updateObj, entry, dataType;

    config = config || {};
    config.mapping = config.mapping || {};
    config.changedAttributeName = config.changedAttributeName || "changed";

    if (!config.objIdFieldName) {
      throw "Object ID field name is empty";
    }

    objIdFieldName = config.objIdFieldName + "1";
    objIdField = $var(objIdFieldName);

    if (!objIdField) {
      return {};
    }

    table = sol.common.forms.Utils.getTable(objIdField);
    if (!table) {
      throw "Can't find table.";
    }

    inputs = table.querySelectorAll("input");
    for (i = 0; i < inputs.length; i++) {
      input = inputs[i];
      changed = input.hasAttribute(config.changedAttributeName);
      baseFieldName = sol.common.forms.Utils.getFieldNamePrefix(input.name);
      index = sol.common.forms.Utils.getFieldNameIndex(input.name);

      if (index == "") {
        continue;
      }

      data[index] = data[index] || {};

      dataType = sol.common.forms.Utils.getInputDataType(input);
      switch (dataType.toUpperCase()) {
        case "ISODATE":
          value = sol.common.forms.Utils.getIsoDate(input.name);
          break;
        default:
          value = $val(input.name);
          break;
      }

      if (baseFieldName == config.objIdFieldName) {
        data[index].objId = value;
      } else if (changed) {
        keyName = (typeof index == "undefined") ? baseFieldName : baseFieldName + "{i}";
        entry = config.mapping[keyName];
        if (entry) {
          updateObj = sol.common.ObjectUtils.clone(entry);
          updateObj.value = value;
          data[index].data = data[index].data || [];
          data[index].data.push(updateObj);
        }
      }
    }

    return data;
  },

  updateGroupMembers: function (params) {
    var me = this,
        promise;

    me.transferResponsibleValues();

    params = params || {};
    if ((params.solType == "VISITOR_GROUP") || (params.solType == "VISITOR_COMPANY")) {
      promise = new Promise(function (resolve, reject) {
        var changedData;
        changedData = me.collectChangedTableData({ objIdFieldName: "VISITOR_OBJID", mapping: sol.visitor.forms.Utils.visitorGroupMemberMapping });
        params = { visitorGroupObjId: ELO_PARAMS.ELO_OBJID, data: changedData };
        sol.common.IxUtils.execute("RF_sol_visitor_service_WriteVisitorGroupMembers", params,
          function () {
            me.numberGroupMembers();
            resolve(true);
          },
          function () {
            reject(false);
          }
        );
      });
    } else {
      promise = Promise.resolve();
    }

    return promise;
  },

  transferResponsibleValues: function () {
    var responsibleField, lineIndex, firstName, lastName, companyName;

    responsibleField = document.querySelector("input[name^='VISITOR_GROUPRESPONSIBLE']:checked");

    if (responsibleField) {
      lineIndex = sol.common.forms.Utils.getFieldNameIndex(responsibleField.name);

      firstName = $val("VISITOR_FIRSTNAME" + lineIndex);
      lastName = $val("VISITOR_LASTNAME" + lineIndex);
      companyName = $val("VISITOR_COMPANYNAME" + lineIndex);

      $update("IX_GRP_VISITOR_FIRSTNAME", firstName, true);
      $update("IX_GRP_VISITOR_LASTNAME", lastName, true);
      $update("IX_GRP_VISITOR_COMPANYNAME", companyName, true);
    }
  },

  insertGroupMembers: function (objId) {
    var newEntries = [],
        entries, i, entry, firstNameFieldName, lastNameFieldName, dateOfBirthFieldName, placeOfBirthFieldName,
        rowNo, lastNameField, newEntry, lastInput, lineNo, addButton, lastLineNo, entryChecked;

    sol.common.forms.Utils.forEachRow("VISITOR_LASTNAME", function (index) {
      var input;
      input = $var("VISITOR_LASTNAME" + index);
      if (input) {
        input.setAttribute("entryChecked", "");
      }
    });

    entries = sol.common.IxUtils.execute("RF_sol_visitor_service_ReadVisitorList", {
      objId: objId
    });

    addButton = sol.common.forms.Utils.getJsAddLineButton("VISITOR_LASTNAME1");

    for (i = 0; i < entries.length; i++) {
      entry = entries[i];

      rowNo = sol.visitor.forms.Utils.findGroupMemberRow({
        VISITOR_LASTNAME: { value: entry.lastName },
        VISITOR_FIRSTNAME: { value: entry.firstName },
        VISITOR_DATE_OF_BIRTH: { value: entry.dateOfBirth, dataType: "isoDate" },
        VISITOR_PLACE_OF_BIRTH: { value: entry.placeOfBirth }
      });

      if (rowNo > 0) {
        lastNameField = $var("VISITOR_LASTNAME" + rowNo);
        lastNameField.setAttribute("entryChecked", "true");
        continue;
      }

      newEntries.push(entry);
    }

    lastInput = sol.common.forms.Utils.getLastInput("VISITOR_LASTNAME");
    lineNo = sol.common.forms.Utils.getFieldNameIndex(lastInput.name);

    for (i = 0; i < newEntries.length; i++) {
      newEntry = newEntries[i];

      if (!sol.common.forms.Utils.isRowEmpty("VISITOR_LASTNAME" + lineNo)) {
        lineNo++;
        $addLine(addButton, 1);
      }

      firstNameFieldName = "VISITOR_FIRSTNAME" + lineNo;
      lastNameFieldName = "VISITOR_LASTNAME" + lineNo;
      dateOfBirthFieldName = "VISITOR_DATE_OF_BIRTH" + lineNo;
      placeOfBirthFieldName = "VISITOR_PLACE_OF_BIRTH" + lineNo;

      $update(firstNameFieldName, newEntry.firstName);
      $update(lastNameFieldName, newEntry.lastName);
      sol.common.forms.Utils.setIsoDate(dateOfBirthFieldName, newEntry.dateOfBirth);
      $update(placeOfBirthFieldName, newEntry.placeOfBirth);

      inputChanged($var(firstNameFieldName));
      inputChanged($var(lastNameFieldName));
      inputChanged($var(dateOfBirthFieldName));
      inputChanged($var(placeOfBirthFieldName));

      lastNameField = $var(lastNameFieldName);
      lastNameField.setAttribute("entryChecked", "true");
    }

    lastInput = sol.common.forms.Utils.getLastInput("VISITOR_LASTNAME");
    lastLineNo = sol.common.forms.Utils.getFieldNameIndex(lastInput.name);

    for (i = lastLineNo; i >= 1; i--) {
      lastNameField = $var("VISITOR_LASTNAME" + i);
      entryChecked = (lastNameField.getAttribute("entryChecked") == "true");
      if (!entryChecked) {
        $removeLine(addButton, i);
      }
    }

    sol.visitor.forms.Utils.numberGroupMembers();
  },

  numberGroupMembers: function () {
    sol.common.forms.Utils.forEachRow("VISITOR_LASTNAME", function (index) {
      $update("VISITOR_GROUP_MEMBER_NO" + index, index + "");
    });
  },

  findGroupMemberRow: function (comparisonData) {
    var i, compare, lastNameField, alreadyListed;

    for (i = 1; i < 2000; i++) {
      lastNameField = $var("VISITOR_LASTNAME" + i);
      alreadyListed = (lastNameField && lastNameField.getAttribute("alreadyListed") == "true");
      if (alreadyListed) {
        continue;
      }
      compare = sol.visitor.forms.Utils.compareGroupMemberRow(comparisonData, i);
      if (compare) {
        return i;
      }
    }

    return -1;
  },

  compareGroupMemberRow: function (comparisonData, i) {
    var key, field, comparisonElement, dataType, value,
        fieldsExist = false;

    for (key in comparisonData) {
      comparisonElement = comparisonData[key];
      field = $var(key + i);
      if (field) {
        fieldsExist = true;
        dataType = comparisonElement.dataType || "String";
        switch (dataType.toUpperCase()) {
          case "ISODATE":
            value = sol.common.forms.Utils.getIsoDate(key + i);
            break;
          default:
            value = $val(key + i);
        }
        if (comparisonElement.value != value) {
          return false;
        }
      }
    }

    return fieldsExist;
  }
});
