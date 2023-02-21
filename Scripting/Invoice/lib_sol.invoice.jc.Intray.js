importPackage(Packages.java.util);
importPackage(Packages.com.sciapp.table);

importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * JavaClient intray functions
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @elojc
 * @requires  sol.invoice.config
 * @requires  sol.invoice.jc.Utils
 */
sol.define("sol.invoice.jc.Intray", {
  singleton: true,

  /**
   * Archive invoice
   */
  archiveInvoice: function () {
    var me = this,
        invoices = intray.allSelected,
        targetId = this._getEntryFolder(),
        archivist = new this.IntrayArchivist(this.IntrayArchivistC.SINGLE_INVOICE);

    RhinoManager.registerClass(me.$className);
    archivist.archive(targetId, invoices);
  },

  /**
   * Archive invoice with attachments
   */
  archiveInvoiceWithAttachments: function () {
    var me = this,
        invoices = intray.allSelected,
        targetId = this._getEntryFolder(),
        archivist = new this.IntrayArchivist(this.IntrayArchivistC.INVOICE_WITH_ATTACHEMENTS);

    RhinoManager.registerClass(me.$className);
    archivist.archive(targetId, invoices);
  },

  /**
   * Archive documents to invoice container
   */
  archiveDocumentsToInvoiceContainer: function () {
    var me = this;
    RhinoManager.registerClass(me.$className);
    this.showDlgSelectInvoiceContainer();
  },

  // control variables script dialogues
  /**
   * @cfg {Boolean} boolInitDialog                true if GridDialog is initialised
   * @cfg {Object} dlgSelectInvoiceContainer      reference to Select Invoice Container Dialogue represented by de.elo.client.scripting.dialog.GridDialog
   * @cfg {Object} tblInvoices                    reference to JTable Invoices represented by javax.swing.JTable
   * @cfg {Object} rdbInvoiceNr                   reference to Radiobutton InvoiceNr represented by de.elo.client.scripting.dialog.RadioButton
   * @cfg {Object} rdbKreditorNr                  reference to Radiobutton KreditorNr represented by de.elo.client.scripting.dialog.RadioButton
   * @cfg {Object} txtSearch                      reference to TextField Search represented by de.elo.client.scripting.dialog.TextField
   * @cfg {Object[]} sordsFolderInvoiceContainer  reference to invoice container sords represented by de.elo.ix.client.Sord
   * Control variables for script dialogues
   */
  controlDialog: {
    boolInitDialog: true,
    dlgSelectInvoiceContainer: null,
    tblInvoices: null,
    rdbInvoiceNr: null,
    rdbKreditorNr: null,
    txtSearch: null,
    sordsFolderInvoiceContainer: []
  },

  /**
   * Search for an invoice container
   * @return {Object[]} invoice container represented by de.elo.ix.client.Sord
   */
  searchInvoiceContainer: function () {
    var sordsFolderInvoiceContainer, sordsSubEntry, boolInvoiceNr, searchFilterObjKey, searchFilterObjKeys, strSearch, i;

    sordsFolderInvoiceContainer = [];
    if (sol.invoice.Config.useInvoiceContainer.value) {
      boolInvoiceNr = this.controlDialog.rdbInvoiceNr.selected;
      strSearch = this.controlDialog.txtSearch.text;

      if (strSearch && strSearch != "") {
        searchFilterObjKey = new ObjKey();
        searchFilterObjKey.data = [strSearch];
        if (boolInvoiceNr) {
          searchFilterObjKey.name = sol.invoice.Config.fields.INVOICE_NUMBER.value;
        } else {
          searchFilterObjKey.name = sol.invoice.Config.fields.VENDOR_NO.value;
        }
        searchFilterObjKeys = [searchFilterObjKey];
      }

      sordsSubEntry = this.executeInvoiceSearch(searchFilterObjKeys);

      for (i = 0; i < sordsSubEntry.length; i++) {
        sordsFolderInvoiceContainer.push(sordsSubEntry[i]);
      }
    } else {
      workspace.showAlertBox("searchInvoiceContainer:", " Suche nicht ausführen");
    }
    return sordsFolderInvoiceContainer;
  },

  /**
   * Searches invoices using the index server.
   * @param {de.elo.ix.client.ObjKeys[]} objKeys (optional) An Array with ObjKeys, to limit the search result
   * @return {de.elo.ix.client.Sord[]} The search result
   */
  executeInvoiceSearch: function (objKeys) {
    var findInfo = new FindInfo(),
        findByIndex = new FindByIndex(),
        findByType,
        invoices = [],
        findResult, sords, i, max;

    findByIndex.maskId = sol.invoice.Config.invoiceMaskName.value;
    if (objKeys) {
      findByIndex.objKeys = objKeys;
    }
    findInfo.findByIndex = findByIndex;

    if (sol.invoice.Config.useInvoiceContainer.value) {
      findByType = new FindByType();
      findByType.typeStructures = true;
      findInfo.findByType = findByType;
    }

    findResult = ixConnect.ix().findFirstSords(findInfo, 999, SordC.mbAllIndex);
    sords = findResult.sords;
    for (i = 0, max = sords.length; i < max; i++) {
      invoices.push(sords[i]);
    }
    ixConnect.ix().findClose(findResult.searchId);

    if (findResult.moreResults) {
      // TODO set dialog status: "to many results, refine search" ?!?
    }

    return invoices;
  },

  /**
   * Eventhandler start search
   * Start search
   */
  evtStartSearch: function () {
    var me = this,
        tblJTable, strShortname, indexMaskName, indexGrpFields, sordsArchiveDocument;

    this.controlDialog.sordsFolderInvoiceContainer = [];
    // abort if init dialogue
    if (this.controlDialog.boolInitDialog) {
      return;
    }
    // execute search
    this.controlDialog.sordsFolderInvoiceContainer = this.searchInvoiceContainer();
    // fill selection table
    tblJTable = this.controlDialog.tblInvoices;
    strShortname = me._text("intray.evtDlgSelectInvoiceContainer.txtShortName");
    indexMaskName = sol.invoice.Config.invoiceMaskName.value;
    indexGrpFields = ["INVOICE_NUMBER", "INVOICE_DATE", "VENDOR_NO", "INVOICE_NET_AMOUNT"];
    sordsArchiveDocument = this.controlDialog.sordsFolderInvoiceContainer;
    sol.invoice.jc.Utils.fillJTableControl(tblJTable, strShortname, indexMaskName, indexGrpFields, sordsArchiveDocument);
  },

  /**
   * Eventhandler check dialoguefields
   */
  evtDlgSelectInvoiceContainer: function () {
    var _intray = sol.invoice.jc.Intray;

    // abort if init dialogue
    if (this.controlDialog.boolInitDialog) {
      return;
    }
    // check if invoices selected
    if (this.controlDialog.tblInvoices.getSelectedRow() == -1) {
      // set status dialogue invalid
      sol.invoice.jc.Utils.setDialogStatus(CONSTANTS.FIELD_STATE.INVALID, _intray._text("intray.evtDlgSelectInvoiceContainer.txtNoInvoicesSelected"), this.controlDialog.dlgSelectInvoiceContainer);
      return;
    }
    // set status dialogue ok
    sol.invoice.jc.Utils.setDialogStatus(CONSTANTS.FIELD_STATE.CHECKED, "", this.controlDialog.dlgSelectInvoiceContainer);
  },

  /**
   * Start inputbox for invoice container name
   * @param {Array} documents intray documents represented by de.elo.client.scripting.items.IntrayDocument
   * @return {String}
   */
  showDlgNameInvoiceContainer: function (documents) {
    return workspace.showSimpleInputBox(this._text("ribbon.btnArchiveInvoiceWithAtt"), this._text("intray.dlgNameInvoiceContainer.text"), documents[0].name);
  },

  /**
   * Start dialog for selection invoice container
   */
  showDlgSelectInvoiceContainer: function () {
    var _intray, pnl, txf, result, ctrTable, index, invoices, targetId, archivist;

    _intray = sol.invoice.jc.Intray;
    // start init dialogue
    this.controlDialog.boolInitDialog = true;
    this.controlDialog.dlgSelectInvoiceContainer = workspace.createGridDialog(_intray._text("ribbon.btnArchiveDocumentsToInvoiceContainer"), 7, 10);
    pnl = this.controlDialog.dlgSelectInvoiceContainer.gridPanel;
    pnl.setGrowing([3], [2]);
    // select invoice no or vendor no
    this.controlDialog.rdbInvoiceNr = pnl.addRadioButton(1, 1, 1, _intray._text("intray.evtDlgSelectInvoiceContainer.txtInvoiceNr"), "evtStartSearch", "Grp1");
    this.controlDialog.rdbInvoiceNr.selected = true;
    this.controlDialog.rdbKreditorNr = pnl.addRadioButton(2, 1, 1, _intray._text("intray.evtDlgSelectInvoiceContainer.txtKreditorNr"), "evtStartSearch", "Grp1");
    // start search
    txf = this.controlDialog.txtSearch = pnl.addTextField(3, 1, 2);
    txf.addChangeEvent("evtStartSearch");
    pnl.addButton(6, 1, 1, _intray._text("intray.evtDlgSelectInvoiceContainer.txtSearch"), "evtStartSearch");
    // table control overview invoice container
    result = sol.invoice.jc.Utils.createJTableControl(true, evtDlgSelectInvoiceContainer);
    this.controlDialog.tblInvoices = result.tblJTable;
    ctrTable = result.scpScrollPane;
    pnl.addComponent(1, 2, 7, 9, ctrTable);
    // init dialogue finished
    this.controlDialog.boolInitDialog = false;
    evtStartSearch();
    evtDlgSelectInvoiceContainer();
    if (!this.controlDialog.dlgSelectInvoiceContainer.show()) {
      workspace.setFeedbackMessage(_intray._text("intray.showDlgSelectInvoiceContainer.txtSelectInvoiceContainerCancelled"));
    } else {
      index = this.controlDialog.tblInvoices.getSelectedRow();
      if (index > -1) {
        // archive intray documente in selected invoice container
        invoices = intray.allSelected;
        targetId = this.controlDialog.sordsFolderInvoiceContainer[index].id;
        archivist = new this.IntrayArchivist(this.IntrayArchivistC.SINGLE_DOCUMENT);
        archivist.archive(targetId, invoices);
      }
    }
  },

  /**
   * @private
   * Get EntryFolder. If it does not exist, it will be created.
   * @return {Number} objId The elements ID
   */
  _getEntryFolder: function () {
    var entryFolder;

    entryFolder = sol.create("sol.common.Template", { source: sol.invoice.Config.paths.entry.value }).apply();
    entryFolder = sol.common.RepoUtils.preparePath(entryFolder);
    if (!entryFolder) {
      throw "Can't access the entry repository path";
    }
    return entryFolder;
  },

  /**
   * @private
   * Calls the javaclient localisationtext modul
   * @param  {String}  key textkey
   * @return {String}  text in the current language of the javaclient
   */
  _text: function (key) {
    return utils.getText("sol.invoice.client", key);
  },

  /**
   * @cfg {Object} IntrayArchivistC   reference to IntrayArchivistC
   * @cfg {Object} IntrayArchivistC.SINGLE_INVOICE   single invoice
   * @cfg {Object} IntrayArchivistC.INVOICE_WITH_ATTACHEMENTS   invoice with attachments
   * Constants for intray archive
   */
  IntrayArchivistC: {
    SINGLE_DOCUMENT: "SINGLE_DOCUMENT",
    SINGLE_INVOICE: "SINGLE_INVOICE",
    INVOICE_WITH_ATTACHEMENTS: "INVOICE_WITH_ATTACHEMENTS"
  },

  IntrayArchivist: function (mode) {
    var _config = sol.invoice.Config,
        _intray = sol.invoice.jc.Intray,
        _logger = _intray.logger,
        _containerMode = (sol.invoice.Config.useInvoiceContainer.value === true),
        _Archivists = {};

    _Archivists[_intray.IntrayArchivistC.SINGLE_DOCUMENT] = function (targetId, intrayDocuments) {
      var intrayDocument,
          count = 0;
      if (!intrayDocuments.hasMoreElements()) {
        throw "No document(s) for archiving selected";
      }
      while (intrayDocuments.hasMoreElements()) {
        intrayDocument = intrayDocuments.nextElement();
        _archive(targetId, intrayDocument);
        count++;
      }
      _logger.info(["imported {0} invoices to InvoiceContainer : folderId={1}", count, targetId]);
    },

    _Archivists[_intray.IntrayArchivistC.SINGLE_INVOICE] = function (targetId, intrayDocuments) {
      var count = 0,
          archiveTargetId = targetId,
          maskId, container, intrayDocument, wfName, newObjId, dstMaskId, addToFullTextDatabase;

      if (!intrayDocuments.hasMoreElements()) {
        throw "No document(s) for archiving selected";
      }

      maskId = sol.common.SordUtils.getDocMask(_config.invoiceMaskName.value).id;

      while (intrayDocuments.hasMoreElements()) {
        intrayDocument = intrayDocuments.nextElement();

        if (_containerMode) {
          _logger.debug("Archiving in container mode");
          container = sol.common.SordUtils.createSord({
            parentId: targetId,
            mask: _config.invoiceMaskName.value,
            name: intrayDocument.name,
            sortOrder: SortOrderC.MANUAL,
            documentContainer: true
          });

          archiveTargetId = ixConnect.ix().checkinSord(container, SordC.mbAll, LockC.NO);
        } else {
          _logger.debug("Archiving invoice individually");
        }

        dstMaskId = _containerMode ? 0 : maskId;

        addToFullTextDatabase = (_config.addToFullTextDatabase && _config.addToFullTextDatabase.value) ? _config.addToFullTextDatabase.value : false;

        newObjId = _archive(archiveTargetId, intrayDocument, {
          maskId: dstMaskId,
          documentContainer: _containerMode,
          addToFullTextDatabase: addToFullTextDatabase
        });

        wfName = _createWfName(_containerMode ? archiveTargetId : newObjId);
        _startInvoiceWorkflow(_containerMode ? archiveTargetId : newObjId, wfName);
        count++;
      }
      _logger.info(["imported {0} invoices", count]);
    };

    _Archivists[_intray.IntrayArchivistC.INVOICE_WITH_ATTACHEMENTS] = function (targetId, intrayDocuments) {
      var count, container, containerId, invoiceName, wfName, i, max,
          documentsArray = [];
      if (!intrayDocuments.hasMoreElements()) {
        throw "No document(s) for archiving selected";
      }

      while (intrayDocuments.hasMoreElements()) {
        documentsArray.push(intrayDocuments.nextElement());
      }
      count = 0;
      invoiceName = _intray.showDlgNameInvoiceContainer(documentsArray);
      if (!invoiceName || invoiceName.length() <= 0) {
        workspace.setFeedbackMessage(_intray._text("intray.dlgNameInvoiceContainer.cancel"));
        return;
      }
      container = sol.common.SordUtils.createSord({
        parentId: targetId,
        mask: _config.invoiceMaskName.value,
        name: invoiceName,
        sortOrder: SortOrderC.MANUAL,
        documentContainer: true
      });

      containerId = ixConnect.ix().checkinSord(container, SordC.mbAll, LockC.NO);

      wfName = _createWfName(containerId);

      i = 0;
      for (i = 0, max = documentsArray.length; i < max; i++) {
        _archive(containerId, documentsArray[i]);
        count++;
      }
      _startInvoiceWorkflow(containerId, wfName);

      _logger.info(["imported {0} documents into '{1} (id={2})'", count, container.name, containerId]);
    };

    this.archive = _Archivists[mode] ? _Archivists[mode] : _noModeDefined;

    function _createWfName(sordId) {
      return sol.create("sol.common.Template", { source: _config.wfNamePattern.value }).applySord(sordId);
    }

    function _archive(targetId, intrayDocument, params) {
      var archiveDocument, sord, sordZ, newObjId;

      params = params || {};

      if (typeof params.maskId != "undefined") {
        intrayDocument.sord = ixConnect.ix().changeSordMask(intrayDocument.sord, params.maskId, EditInfoC.mbSord).sord;
      }

      if (params.documentContainer) {
        intrayDocument.sord.details.documentContainer = params.documentContainer;
      }

      archiveDocument = intrayDocument.insertIntoArchive(targetId, _intray._text("intray.archiveinvoice.versionNumber"), _intray._text("intray.archiveinvoice.versionComment"));

      newObjId = archiveDocument.id;

      if (params.addToFullTextDatabase) {
        sordZ = new SordZ(SordC.mbDetails);
        sord = ixConnect.ix().checkoutSord(newObjId, sordZ, LockC.NO);
        sord.details.fulltext = params.addToFullTextDatabase;
        ixConnect.ix().checkinSord(sord, sordZ, LockC.NO);
        intrayDocument.sord.details.fulltext = params.addToFullTextDatabase;
      }

      return newObjId;
    }

    function _startInvoiceWorkflow(objId, name) {
      ixConnect.ix().startWorkFlow(_config.wfTemplate.value, name, objId);
    }

    function _noModeDefined() {
      throw "no '" + mode + "' mode implemented";
    }
  }
});

/**
 * @member sol.invoice.jc.Intray
 */
function evtStartSearch() {
  sol.invoice.jc.Intray.evtStartSearch();
}

/**
 * @member sol.invoice.jc.Intray
 */
function evtDlgSelectInvoiceContainer() {
  sol.invoice.jc.Intray.evtDlgSelectInvoiceContainer();
}
