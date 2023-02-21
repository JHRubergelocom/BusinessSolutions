/**
 * Updates organization, division, department and team of personnel files.
 *
 * This is used in the orgchart update workflow.
 * If an orgchart element is updated, this function collects all child elements of the orgchart and searches/updates all associated personnel files.
 *
 * Uses {@link sol.hr.ix.functions.UpdateReferences} to find and update the personnel files.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloas
 * @requires sol.common.Cache
 * @requires sol.common.Config
 * @requires sol.common.Injection
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.Template
 * @requires sol.common.TemplateUtils
 * @requires sol.common.as.FunctionBase
 * @requires sol.hrorgchart.mixins.Configuration
 */

sol.define("sol.hr.as.functions.UpdatePersonnelFileWithOrgChartData", {
  extend: "sol.common.as.FunctionBase",
  mixins: ["sol.common.mixins.Inject", "sol.hrorgchart.mixins.Configuration"],

  requiredConfig: ["orgChartGuid"],

  inject: {
    startElement: { sordIdFromProp: "orgChartGuid" },
    lookupTypes: { config: "hrorgchart", prop: "entities.chartelement.functions.updatePersonnelFiles.chartElementLookupTypes", template: false },
    updateReferenceCfg: { config: "hrorgchart", prop: "entities.chartelement.functions.updatePersonnelFiles.updateReferences", template: false }
  },

  /**
   * @cfg {String} orgChartGuid The GUID of the start element.
   */

  orgChartSordZ: SordC.mbAllIndex,
  personnelFileSordZ: SordC.mbAllIndex,

  /**
   * Starts the processing.
   * @return {Object}
   */
  process: function () {
    var me = this,
        orgChartElements;

    me.logger.enter("process");
    me.logger.info(["Start update process: guid={0}", me.orgChartGuid]);

    orgChartElements = me.collectOrgChartElements(me.startElement);

    me.logger.debug(["Execute update for {0} orgchart elements", orgChartElements.length]);

    orgChartElements.forEach(me.processOrgChartElement, me);

    me.logger.exit("process");

    return { passOn: true };
  },

  /**
   * @private
   * Retrieves all orgchart elements that are children of the specified start element (including the start element itself).
   * @param {de.elo.ix.client.Sord} startElement
   * @return {de.elo.ix.client.Sord[]}
   */
  collectOrgChartElements: function (startElement) {
    var me = this,
        chartElements;

    me.logger.enter("collectOrgChartElements", { startElementId: startElement.id, startElementName: String(startElement.name) });

    chartElements = sol.common.RepoUtils.findChildren(startElement.guid, {
      includeFolders: true,
      includeDocuments: false,
      sordZ: me.orgChartSordZ,
      recursive: true,
      level: -1,
      objKeysObj: { SOL_TYPE: me.lookupTypes }
    });

    if (chartElements && (chartElements.length > 0)) {
      chartElements.push(startElement);
    } else {
      chartElements = [startElement];
    }

    me.logger.exit("collectOrgChartElements", { elementCount: chartElements.length });

    return chartElements;
  },

  /**
   * @private
   * Retrieves all personnel files associated to the specified orgchart element and processes each of them.
   * @param {de.elo.ix.client.Sord} orgChartElement
   */
  processOrgChartElement: function (orgChartElement) {
    var me = this,
        fctName, paramStr;

    me.logger.enter("processOrgChartElement", { id: orgChartElement.id, name: String(orgChartElement.name) });

    if (!me.updateReferenceCfgTemplate) {
      me.updateReferenceCfgTemplate = sol.create("sol.common.Template", { source: JSON.stringify(me.updateReferenceCfg) });
    }

    fctName = "RF_sol_hr_function_UpdateReferences";
    paramStr = me.updateReferenceCfgTemplate.apply({ orgChartElementGuid: orgChartElement.guid });
    me.logger.debug(["Call '{0}' to update personnel files. params={1}", fctName, paramStr]);
    sol.common.IxUtils.execute(fctName, JSON.parse(paramStr));

    me.logger.exit("processOrgChartElement");
  }

});