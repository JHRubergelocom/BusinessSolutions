/**
 * Renders a visitor list as PDF and saves it to the archive.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 */
sol.define("sol.visitor.as.actions.CreateVisitorList", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.visitorConfig = sol.create("sol.common.Config", { compose: "/visitor/Configuration/visitor.config" }).config;
    sol.common.TranslateTerms.require("sol.visitor.as.actions.CreateVisitorList");
  },

  getName: function () {
    return "CreateVisitorList";
  },

  process: function () {
    var me = this,
        visitorListSord, name, generator, result, mapObj, filterStatus, filterLocation, filterCategory, filterDate, setPrivacyFieldsParams;

    mapObj = sol.common.SordUtils.getMapEntriesAsObject({ objId: me.objId });

    visitorListSord = sol.common.RepoUtils.getSord(me.objId);
    sol.common.SordUtils.setObjKeyValue(visitorListSord, "SOL_TYPE", me.visitorConfig.visitor.solTypeVisitorList);
    ixConnect.ix().checkinSord(visitorListSord, SordC.mbAllIndex, LockC.NO);

    me.logger.info(["mapObj={0}", JSON.stringify(mapObj)]);

    filterStatus = mapObj.VISITORLIST_STATUS ? mapObj.VISITORLIST_STATUS.substr(0, 2) + "*" : "";
    filterCategory = mapObj.VISITORLIST_CATEGORY ? mapObj.VISITORLIST_CATEGORY.substr(0, 2) + "*" : "";
    filterLocation = mapObj.VISITORLIST_LOCATION || "";
    filterDate = (mapObj.VISITORLIST_STARTDATE && mapObj.VISITORLIST_ENDDATE) ? mapObj.VISITORLIST_STARTDATE.substr(0, 8) + "0000" + "..." + mapObj.VISITORLIST_ENDDATE.substr(0, 8) + "2359" : "+0000-00-00";

    me.logger.info(["filter: filterStatus={0}, filterLocation={1}, filterCategory={2}, filterDate={3}", filterStatus, filterLocation, filterCategory, filterDate]);
    name = sol.create("sol.common.Template", { source: me.visitorConfig.reporting.names.visitor }).apply({ date: new Date() });

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_services_ChildrenDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        endLevel: -1,
        filter: [
          { key: "VISITOR_STATUS", val: filterStatus },
          { key: "VISITOR_LOCATION", val: filterLocation },
          { key: "VISITOR_CATEGORY", val: filterCategory },
          { key: "SOL_TYPE", val: me.visitorConfig.visitor.solTypeVisitor },
          { key: "VISITOR_ARRIVALDATE", val: filterDate }
        ],
        totalCount: 50000,
        sordKeys: ["ownerName", "name", "maskName", "maskId", "id", "guid", "parentId", "XDateIso", "IDateIso"],
        allObjKeys: true,
        allMapFields: true,
        formatter: "sol.common.ObjectFormatter.TemplateSord"
      },
      rendererConfig: {
        objId: me.objId,
        targetId: me.visitorConfig.reporting.visitorListsFolderId,
        templateId: me.templateId
      },
      compareFct: function (templateSord1, templateSord2) {
        return templateSord1.objKeys.VISITOR_LASTNAME.localeCompare(templateSord2.objKeys.VISITOR_LASTNAME);
      },
      restrictRightsToCurrentUser: true,
      additionalSordData: [{
        objId: me.objId,
        propertyName: "settings"
      }]
    });

    result = generator.process();

    if (result.objId) {

      setPrivacyFieldsParams = sol.common.ObjectUtils.clone(me.visitorConfig.privacy.setPrivacyFields.visitorList);
      setPrivacyFieldsParams.objId = result.objId + "";
      me.logger.info(["SetPrivacyFields: params={0}", JSON.stringify(setPrivacyFieldsParams)]);
      sol.common.IxUtils.execute("RF_sol_function_SetPrivacyFields", setPrivacyFieldsParams);

      me.addGotoIdEvent(result.objId);
    }
  }
});
