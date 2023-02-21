
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Starting accounting workflow from a specific elo folder.
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 *
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ExceptionUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.as.Utils
 * @requires sol.common.IxUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ObjectUtils
 *
 */
sol.define("sol.datev.accounting.as.StartInvoiceWorkflow", {


  run: function () {
    var me = this,
      config = sol.create("sol.common.Config", { compose: "/sol.datev.accounting/Configuration/sol.invoice.config" }).config,
      targetId = me.getEntryFolder(config.paths.entry.value) || "ARCPATH:/0 - Posteingang",
      maskName = config.invoiceMaskName.value || "Receipt Document",
      invoiceType = "",
      wfName,
      ed, containerId;

    me.logger.debug(["walking: tree_state={0}, objId={1}", EM_TREE_STATE, EM_ACT_SORD.id]);

    if (EM_TREE_STATE === 1 && sol.common.SordUtils.isDocument(EM_ACT_SORD)) {
      var rawDocument = sol.common.RepoUtils.getSord(EM_ACT_SORD.id);
      
      invoiceType = String(sol.common.SordUtils.getObjKeyValue(rawDocument, "INVOICE_TYPE"));

      me.logger.info("invoice type" + invoiceType);
      me.logger.info(["work on invoice scan '{0}'", EM_ACT_SORD.name]);
      me.logger.debug("create container");
      ed = ixConnect.ix().createSord(targetId, maskName, EditInfoC.mbAll);
      ed.sord.name = EM_ACT_SORD.name;
      containerId = ixConnect.ix().checkinSord(ed.sord, SordC.mbAll, LockC.NO);

      var searchKey = me.getLocalizedKey(invoiceType);
      me.logger.info(["searchKey {0}", searchKey]);
      var documentType = sol.common.IxUtils.execute("RF_sol_datev_accounting_service_GetDocumentTypeByTypeKey", {
         documentTypeKey: me.getLocalizedKey(searchKey)
      });

      if (!documentType){
         throw "cannot start workflow, document type config was not found";  
      }

    
      sol.common.IxUtils.execute('RF_sol_function_Set', {
        objId: containerId,
        entries: [
          {type:"GRP", key: "INVOICE_TYPE", value: invoiceType},
          {type:"MAP", key: "ACCOUNTING_DATEV_DOCTYPE", value: documentType.docType},
          {type:"MAP", key: "ACCOUNTING_USER_ADD_DISABLE", value: documentType.form.disableAddUser.value},
          {type:"MAP", key: "ACCOUNTING_USER_LINES", value: documentType.form.userLines.value},
        ]
      });

    
    
      me.logger.debug("move invoice to container");
      sol.common.IxUtils.execute("RF_sol_function_Move", { objId: EM_ACT_SORD.id, targetId: containerId });


      var sord = sol.common.RepoUtils.getSord(containerId);
      wfName = me.getWorkflowName(sord, config.wfNamePattern.value);
      me.logger.info(["start workflow: template={0} name={1}", config.wfTemplate.value, wfName]);

      ixConnect.ix().startWorkFlow(config.wfTemplate.value, wfName, containerId);

    }
  },

  getEntryFolder: function(entryFolder){
    var me = this;
    entryFolder = sol.create("sol.common.Template", { source: entryFolder }).apply();
    entryFolder = sol.common.RepoUtils.preparePath(entryFolder);
    return entryFolder;
  },

  getWorkflowName: function(sord, wfNamePattern){
      var me = this;
      
      me.logger.info(["use wf name pattern: {0}", wfNamePattern]);

      var data = sol.common.ObjectFormatter.format({
        sord: {
          formatter: 'sol.common.ObjectFormatter.TemplateSord',
          data: sord
      }});

      me.logger.info(JSON.stringify(data));
      return sol.create("sol.common.Template", {source: wfNamePattern}).apply(data);
  },

  /**
   * @private
   * @param {} value 
   * @param {*} options 
   */
  getLocalizedKey: function(value){
    return value ? value.split("-")[0].trim() : ""
  },

});
