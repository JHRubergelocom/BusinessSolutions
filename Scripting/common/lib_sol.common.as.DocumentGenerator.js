
//@include lib_Class.js

/**
 * Document generation.
 *
 * This class can be used to render different kinds of documents from templates.
 *
 * To be more flexible, it uses a data collector, to collect the data which can be included in the document, and a renderer to render the resulting document.
 *
 * #Data collection
 * Data collection can either be implemented with a class or with a registered function.
 *
 * #Rendering
 * For rendering a class has to be specified. This class needs to implement a `render` function which has a name and the data (result from data collector) as arguments.
 *
 * #Ordering
 * The ordering of the data, should be determined by the data collector. Anyway, there are possible scenarios (e.g. reusing a generic data collector)
 * where it will be necessary to apply a different ordering. To accomplish this, a {@link #compareFct compare function} can be implemented.
 * This function will be applied an the data collector result after the collection.
 * It will be called with two {@link sol.common.ObjectFormatter.TemplateSord TemplateSord} as arguments (see {@link #compareFct}).
 *
 * #Configuration
 * The configuration for the used modules has to be defined during construction of the `DocumentGenerator`.
 * The defined objects `collectorConfig` and `rendererConfig` will be handed directly to the used modules and therefor their structure is dependent on the used module.
 *
 * #Examples
 *
 * The first example will generate a word document with the data returned by the `ParentDataCollector`:
 *
 *     var generator = sol.create("sol.common.as.DocumentGenerator", {
 *       name: name,
 *       dataCollector: "RF_sol_pubsec_service_ParentDataCollector",
 *       renderer: "sol.common.as.renderer.Word",
 *       collectorConfig: {
 *         objId: me.objId,
 *         returnDataDefinition: true
 *       },
 *       rendererConfig: {
 *         objId: me.objId,
 *         templateId: me.templateId
 *       }
 *     });
 *     var result = generator.process();
 *
 * The next example will generate a PDF report with all child elements having a defined mask. The result of the data collector will be sorted using the `compareFct`:
 *
 *     var generator = sol.create("sol.common.as.DocumentGenerator", {
 *       name: name,
 *       dataCollector: "sol.common.ix.services.ChildrenDataCollector",
 *       renderer: "sol.common.as.renderer.Fop",
 *       collectorConfig: {
 *         parentId: me.parentId,
 *         endLevel: -1,
 *         objKeys: [],
 *         totalCount: 50000,
 *         sordKeys: ['ownerName', 'name', 'maskName', 'maskId', 'id', 'guid', 'parentId', 'XDateIso', 'IDateIso'],
 *         maskName: me.config.filingPlan.maskName,
 *         formatter: "sol.common.ObjectFormatter.TemplateSord"
 *       },
 *       rendererConfig: {
 *         targetId: me.targetId,
 *         templateId: me.templateId
 *       },
 *       compareFct: function (templateSord1, templateSord2) {
 *         var result;
 *         try {
 *           result = templateSord1.objKeys.FILING_PLAN_REFERENCE.localeCompare(templateSord2.objKeys.FILING_PLAN_REFERENCE);
 *         } catch (ex) {
 *           result = 0;
 *         }
 *         return result;
 *       }
 *     });
 *     var result = generator.process();
 *
 * #DocumentGenerator result
 * The result object is the object returned by the `render` function of the renderer.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloas
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.StringUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.SordUtils
 */
sol.define("sol.common.as.DocumentGenerator", {

  requiredConfig: ["dataCollector", "renderer", "name"],

  /**
   * @cfg {String} dataCollector (required)
   */

  /**
   * @cfg {Boolean} returnData
   * Return the data in `result.data`
   */

  /**
   * @cfg {String} renderer (required)
   */

  /**
   * @cfg {String} name (required)
   * The name for the document
   */

  /**
   * @cfg {Object} collectorConfig
   * The configuration handed to the renderer module/function
   */

  /**
   * @cfg {Object} rendererConfig
   * The configuration handed to the renderer module
   */

  /**
   * @cfg {Function} compareFct
   * Function to sort the `dataCollector` result.
   *
   * The function will be called with to {@link sol.common.ObjectFormatter.TemplateSord TemplateSord} objects
   * and has to return `-1` if first TemplateSord is bigger then the second one, `1` in the opposite case, or `0` if they are equal.
   *
   *      function (templateSord1, templateSord2) {
   *        return templateSord1.objKeys.FILING_PLAN_REFERENCE.localeCompare(templateSord2.objKeys.FILING_PLAN_REFERENCE);
   *      }
   */

  /**
   * @cfg {Boolean} restrictRightsToCurrentUser
   * Restricts the rights of the document to the current user
   */

  /**
   * @cfg {Object} additionalSordData
   * Definitions of additional Sord data to be provided, e.g. filter data for reports
   *
   *     additionalSordData: [{
   *       objId: me.objId,
   *       propertyName: "settings"
   *     }]
   */

  /**
   * @cfg {String} additionalSordData[].objId
   * Object ID of the Sord whose data is to be provided
   */

  /**
   * @cfg {String} additionalSordData[].propertyName
   * Name of the property in which the additional data is provided
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);

    me.initDataCollector(config);
    me.initRenderer(config);
  },

  process: function () {
    var me = this,
        data, result, additionalSord, additionalTplSord, i, additionalSordDataDef;

    data = me.dataCollector.collect();

    if (sol.common.ObjectUtils.isFunction(me.compareFct) && data && data.sords && (data.sords.length > 0)) {
      data.sords.sort(me.compareFct);
    }

    me.logger.debug(["additionalSordData: config={0}", JSON.stringify(me.additionalSordData) || ""]);

    if (me.additionalSordData) {
      for (i = 0; i < me.additionalSordData.length; i++) {
        additionalSordDataDef = me.additionalSordData[i];
        if (additionalSordDataDef && additionalSordDataDef.objId && additionalSordDataDef.propertyName) {
          additionalSord = sol.common.RepoUtils.getSord(additionalSordDataDef.objId);
          additionalTplSord = sol.common.SordUtils.getTemplateSord(additionalSord).sord;
          me.logger.debug(["additionalSordData: propertyName={0}, data={1}", additionalSordDataDef.propertyName, JSON.stringify(additionalTplSord) || ""]);
          data[additionalSordDataDef.propertyName] = additionalTplSord;
        }
      }
    }

    result = me.renderer.render(me.name, data);

    if (result.objId && me.restrictRightsToCurrentUser) {
      sol.common.AclUtils.changeRightsInBackground(result.objId, {
        users: [EM_USERID],
        rights: { r: true, w: true, d: true, e: true, l: true, p: true },
        mode: "SET"
      });
    }

    if (me.returnData) {
      result.data = data;
    }

    return result;
  },

  /**
   * @private
   * @param {Object} config
   */
  initDataCollector: function (config) {
    var me = this;
    if (!sol.common.ObjectUtils.isObject(me.dataCollector)) {
      if (sol.common.StringUtils.startsWith(me.dataCollector, "RF_")) {
        me.dataCollector = {
          _conf: config.collectorConfig,
          _rf: me.dataCollector,
          collect: function () {
            var me = this;
            return sol.common.IxUtils.execute(me._rf, me._conf);
          }
        };
      } else {
        me.dataCollector = sol.create(me.dataCollector, config.collectorConfig);
      }
    }
    if (!sol.common.ObjectUtils.isFunction(me.dataCollector.collect)) {
      throw "dataCollector has to define a 'collect' function";
    }
  },

  /**
   * @private
   * @param {Object} config
   */
  initRenderer: function (config) {
    var me = this;
    if (!sol.common.ObjectUtils.isObject(me.renderer)) {
      me.renderer = sol.create(me.renderer, config.rendererConfig);
    }
    if (!sol.common.ObjectUtils.isFunction(me.renderer.render)) {
      throw "renderer has to define a 'render' function";
    }
  }
});
