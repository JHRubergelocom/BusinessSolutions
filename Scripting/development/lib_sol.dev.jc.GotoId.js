
//@include lib_Class.js

importPackage(Packages.de.elo.ix.client);

/**
 * Tool to help finding objects and documents by ID/GUID
 *
 * (taken from ELO standard GotoId script)
 *
 * @author ELO Digital Office GmbH
 * @version 1.1
 *
 * @elojc
 *
 */
sol.define("sol.dev.jc.GotoId", {
  singleton: true,

  /**
   * Excecuted from button event
   */
  execute: function () {
    var me = this, 
        mode = 1,
        lastId = archive.getUserOption("EloJ.S.Script.ELOGotoId.LastId", ""),
        result, isObjId, isDocId, isMD5, searchId, memoText, translate, intId, editInfo, payload;

    if ((lastId != "") && (lastId.charAt(0) == 42)) {
      mode = 2;
      lastId = lastId.substring(1);
    }

    mode = archive.getUserOption("EloJ.S.Script.ELOGotoId.Mode", 1);
    result = this.inputIdDlg(lastId, mode);
    if (!result) {
      return;
    }

    isObjId = result.isObjId;
    isDocId = result.isDocId;
    isMD5 = result.isMD5;
    searchId = result.searchId;

    memoText = searchId;
    if (!isObjId) {
      memoText = "*" + memoText;
    }
    archive.setUserOption("EloJ.S.Script.ELOGotoId.LastId", memoText);

    if (searchId) {
      if (isObjId) {
        try {
          archive.setUserOption("EloJ.S.Script.ELOGotoId.Mode", 1);
          translate = ixConnect.ix().checkoutSord(searchId, EditInfoC.mbSord, LockC.NO);
          isObjId = true;
          intId = translate.sord.id;
        } catch (e) {
          workspace.setFeedbackMessage(this.getText("sol.dev.GotoId.MsgNoGuid") + " " + searchId);
          log.info(e);
          return;
        }
      } else if (isMD5) {
        try {
          archive.setUserOption("EloJ.S.Script.ELOGotoId.Mode", 3);
          me.rfName = "RF_sol_dev_service_GetObjIDbyMD5";
          payload = { md5: searchId };
          if (searchId.substring(0, 1) != "'") {
            payload.md5 = "'" + payload.md5 + "'";
          }
          result = sol.common.IxUtils.execute(me.rfName, payload);
          log.info(result);
          if (result) {
            intId = result[0].objid;
          }
        } catch (e) {
          workspace.setFeedbackMessage(this.getText("sol.dev.GotoId.MsgNoGuid") + " " + searchId);
          log.info(e);
          return;
        }
      } else if (isDocId) {
        try {
          archive.setUserOption("EloJ.S.Script.ELOGotoId.Mode", 2);
          editInfo = ixConnect.ix().checkoutDoc(null, intId, EditInfoC.mbSord, LockC.NO);
          intId = editInfo.sord.id;
        } catch (e) {
          workspace.setFeedbackMessage(this.getText("sol.dev.GotoId.MsgNoDoc") + " " + intId);
          return;
        }
      }
      if (!workspace.gotoId(parseInt(intId, 10))) {
        workspace.setFeedbackMessage(this.getText("sol.dev.GotoId.MsgNoEntry") + " " + intId);
      }
    }
  },

  /**
   * @private
   * @param {String} lastId
   * @param {Integer} mode
   * @return {Object}
   */
  inputIdDlg: function (lastId, mode) {
    var dialog = workspace.createGridDialog("GotoId", 10, 12),
        panel = dialog.gridPanel,
        txtObjid, txtDocId, txtMd5, ed, rb, item, sep, sord, label2, nextLine, doc, node, reminder, result;

    // haesslicher Work Around - die Textdateien duerfen keine = Zeichen enthalten.
    // Ab Version 8.05 wird alles besser...
    panel.addLabel(1, 1, 10, this.getText("sol.dev.GotoId.MsgInput") + "=" + this.getText("sol.dev.GotoId.MsgInput2"));

    ed = panel.addTextField(1, 3, 10);
    ed.text = lastId;

    rb = [];
    rb[1] = panel.addRadioButton(1, 5, 10, this.getText("sol.dev.GotoId.BtnObjId"), "", "ModeGroup");
    rb[2] = panel.addRadioButton(1, 6, 10, this.getText("sol.dev.GotoId.BtnDocId"), "", "ModeGroup");
    rb[3] = panel.addRadioButton(1, 7, 10, this.getText("sol.dev.GotoId.BtnMD5"), "", "ModeGroup");
    rb[mode].selected = true;

    if (workspace.activeView && workspace.activeView.firstSelected) {
      item = workspace.activeView.firstSelected;
      sep = new Packages.javax.swing.JSeparator();
      panel.addComponent(1, 8, 10, 1, sep);

      sord = item.sord;
      label2 = panel.addLabel(1, 9, 2, this.getText("sol.dev.GotoId.ActItem"));
      label2.bold = true;
      label2 = panel.addLabel(3, 9, 7, item.name);
      label2.bold = true;

      nextLine = 10;
      panel.addLabel(1, nextLine, 2, this.getText("sol.dev.GotoId.ObjectId"));
      txtObjid = panel.addTextField(3, nextLine, 7);
      txtObjid.text = sord.id + " : " + this.asELOName(sord.id) + " : " + sord.guid;
      nextLine++;

      doc = sord.docVersion;
      if (doc) {
        panel.addLabel(1, nextLine, 2, this.getText("sol.dev.GotoId.FileId"));
        txtDocId = panel.addTextField(3, nextLine, 7);
        txtDocId.text = doc.id + " : " + this.asELOName(doc.id) + "." + doc.ext + " : " + doc.guid;
        nextLine++;

        panel.addLabel(1, nextLine, 2, this.getText("sol.dev.GotoId.MD5"));
        txtMd5 = panel.addTextField(3, nextLine, 7);
        txtMd5.text = sord.id + " : " + this.asELOName(sord.id) + " : " + doc.md5;
        nextLine++;
      }

      if (item.task && item.task.wfNode) {
        node = item.task.wfNode;
        panel.addLabel(1, nextLine, 2, this.getText("sol.dev.GotoId.FlowId"));
        panel.addLabel(3, nextLine, 7, node.flowId + "." + node.nodeId);
        nextLine++;
      }

      if (item.task && item.task.reminder) {
        reminder = item.task.reminder;
        panel.addLabel(1, nextLine, 2, this.getText("sol.dev.GotoId.ReminderId"));
        panel.addLabel(3, nextLine, 7, reminder.id);
        nextLine++;
      }
    }

    if (!dialog.show()) {
      return undefined;
    }

    result = {
      isObjId: rb[1].selected,
      isDocId: rb[2].selected,
      isMD5: rb[3].selected,
      searchId: String(ed.text)
    };
    return result;
  },

  /**
    * @private
    * @param {String} id
    * @return {Boolean}
    */
  isGuid: function (id) {
    if (id.length != 38) {
      return false;
    }

    if ((id.substring(0, 1) != "(") || (id.substring(37) != ")")) {
      return false;
    }

    return true;
  },

  /**
   * @private
   * @param {Integer} number
   * @return {String}
   */
  asELOName: function (number) {
    var hexId = Number(number).toString(16);

    if (hexId.length < 8) {
      hexId = "00000000".substring(0, 8 - hexId.length) + hexId;
    }

    return hexId;
  },

  /**
   * @private
   * @param {String} key
   * @return {String}
   */
  getText: function (key) {
    return utils.getText("sol.dev.client", key);
  }

});
