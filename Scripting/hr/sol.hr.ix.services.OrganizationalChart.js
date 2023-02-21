importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.hrorgchart.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 *
 * @author PZ, ELO Digital Office GmbH
 *
 * @eloix
 * 
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.hrorgchart.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.hr.ix.services.OrganizationChart", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {String} objId Only applies to {@link RF_sol_hr_service_OrganizationChart_Get}.
   */

  /**
   * @cfg {Boolean} [includeNodeRawData=false] Only applies to {@link RF_sol_hr_service_OrganizationChart_Get}.
   */

  mixins: ["sol.hrorgchart.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    companies: { config: "hrorgchart", prop: "entities.orgchart.services.organizationalchart.companies" }, // {}
    struct: { config: "hrorgchart", prop: "entities.orgchart.services.organizationalchart.structure" }, // {}
    translations: { config: "hrorgchart", prop: "entities.orgchart.services.organizationalchart.structure.translations", template: true } // {}
  },

  /**
   * Retrieves all companies (org chart roots) from the archive.
   * @return {Object}
   * @return {Object} return.companies
   */
  getCompanies: function () {
    var me = this,
        companies;

    companies = me.lookupCompanies();

    return {
      companies: companies
    };
  },

  /**
   * Retrieves the organization chart which consists of nodes an associations as well as additional information for the whole chart.
   * @return {Object}
   * @return {Object[]} return.organization The nodes ans associations
   * @return {Object} return.colors The configured colors for the chart element types
   * @return {Object} return.translations The translations for the chart element types
   */
  getOrganizationChart: function () {
    var me = this,
        orgChartRoot, organization, organizationStruct, colors;

    orgChartRoot = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

    organization = me.lookupOrganization(orgChartRoot.id);
    organizationStruct = me.buildStructure(orgChartRoot, organization);

    colors = me.getColors();

    return {
      organization: organizationStruct,
      colors: colors,
      translations: me.translations
    };
  },

  /**
   * @private
   * Retrieves all companies from the archive using the configured `SOL_TYPE`.
   * @return {Object[]}
   */
  lookupCompanies: function () {
    var me = this,
        lookupSolType, lookupStatus, findByIndex, findInfo, findResult, companies;

    lookupSolType = new ObjKey();
    lookupSolType.name = "SOL_TYPE";
    lookupSolType.data = [me.companies.lookupType];

    lookupStatus = new ObjKey();
    lookupStatus.name = "HR_ORGCHART_STATUS";
    lookupStatus.data = ["1"];

    findByIndex = new FindByIndex();
    findByIndex.objKeys = [lookupSolType, lookupStatus];

    findInfo = new FindInfo();
    findInfo.findByIndex = findByIndex;

    findResult = ixConnect.ix().findFirstSords(findInfo, 1000, SordC.mbMin);
    ixConnect.ix().findClose(findResult.searchId);

    companies = (findResult && findResult.sords && (findResult.sords.length > 0)) ? findResult.sords.map(function (company) {
      return { company: company.name, guid: company.guid };
    }) : [];

    return companies;
  },

  /**
   * @private
   * Retrieves all chart elements below a specified root filted by the configured filter.
   * @param {String} rootObjId
   * @return {de.elo.ix.client.Sord[]}
   */
  lookupOrganization: function (rootObjId) {
    var me = this;

    return sol.common.RepoUtils.findChildren(rootObjId, {
      includeFolders: true,
      includeDocuments: false,
      sordZ: SordC.mbAllIndex,
      recursive: true,
      level: -1,
      objKeysObj: (me.struct && me.struct.chartElementFilter) ? me.struct.chartElementFilter : undefined
    });
  },

  /**
   * @private
   * Builds the organization chart structure with nodes and associations.
   * @param {de.elo.ix.client.Sord} root
   * @param {de.elo.ix.client.Sord[]} organization
   * @return {Object[]}
   */
  buildStructure: function (root, organization) {
    var me = this,
        struct = [],
        rootInfo;

    if (root) {
      rootInfo = me.getNodeInfo(root);
      struct.push(me.getNodeObj(rootInfo));
    }

    if (organization && (organization.length > 0)) {
      organization.forEach(function (orgaNode) {
        var nodeInfo = me.getNodeInfo(orgaNode);

        struct.push(me.getNodeObj(nodeInfo));
        struct.push(me.getAssocObj(nodeInfo));
      });
    }

    return struct;
  },

  /**
   * @private
   * Retrieves the colors for the org chart types from the type configurations.
   * @return {Object}
   */
  getColors: function () {
    var me = this,
        getColorFct, defaultColor, colorObj, type;

    getColorFct = function (mappings) {
      var i;
      if (mappings && (mappings.length > 0)) {
        for (i = 0; i < mappings.length; i++) {
          if (mappings[i].property === "color") {
            return mappings[i].from;
          }
        }
      }
    };

    defaultColor = getColorFct(me.struct.defaultNodeMappings);
    colorObj = {
      DEFAULT: defaultColor
    };

    for (type in me.struct.nodeMappings) {
      colorObj[type] = getColorFct(me.struct.nodeMappings[type]) || defaultColor;
    }

    return colorObj;
  },

  /**
   * @private
   * Retrieves the translations for the org chart types from the configuration.
   * @return {Object}
   */
  getTranslations: function () {
    var me = this,
        translationsObj;

    translationsObj = JSON.parse(sol.create("sol.common.Template", { source: JSON.stringify(me.translations) }).apply());

    return translationsObj;
  },

  /**
   * @private
   * Converts a sord to an node object.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Object}
   */
  getNodeInfo: function (sord) {
    var nodeInfo;

    nodeInfo = sol.common.ObjectFormatter.format({
      sord: {
        formatter: "sol.common.ObjectFormatter.TemplateSord",
        data: sord,
        config: {
          sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName", "parentId"],
          allMapFields: false
        }
      }
    }).sord;

    return nodeInfo;
  },

  /**
   * @private
   * Converts a node object to a chart node object.
   * @param {Object} nodeInfo
   * @return {Object}
   */
  getNodeObj: function (nodeInfo) {
    var me = this,
        tplInfo, tplObj, nodeObj;

    tplInfo = me.prepareNodeTemplate(nodeInfo.objKeys.SOL_TYPE);
    tplObj = tplInfo.tpl;
    nodeObj = tplObj.apply(nodeInfo);
    nodeObj = JSON.parse(nodeObj);

    me.convertTypes(nodeObj, tplInfo.conversions);

    if (me.includeNodeRawData === true) {
      nodeObj.$rawData = nodeInfo;
    }

    return nodeObj;
  },

  /**
   * @private
   * Determines an association object for a node object.
   * @param {Object} nodeInfo
   * @return {Object}
   */
  getAssocObj: function (nodeInfo) {
    var me = this,
        tplObj, assocObj;

    tplObj = me.prepareAssocTemplate();
    assocObj = tplObj.apply(nodeInfo);
    assocObj = JSON.parse(assocObj);

    return assocObj;
  },

  /**
   * @private
   * Prepares the template (from configuration) used to create chart node objects.
   * @param {String} objectType
   * @return {Object}
   * @return {sol.common.Template} return.tpl
   * @return {Object} return.conversions
   */
  prepareNodeTemplate: function (objectType) {
    var me = this;
    return me.prepareTemplate(me.struct.nodeMappings[objectType], "_nodeInfoTemplate_" + objectType, me.struct.defaultNodeMappings);
  },

  /**
   * @private
   * Prepares the template (from configuration) used to create chart association objects.
   * @return {sol.common.Template}
   */
  prepareAssocTemplate: function () {
    var me = this;
    return me.prepareTemplate(me.struct.assocMappings, "_nodeAssocTemplate").tpl;
  },

  /**
   * @private
   * Internal helper used by {@link prepareNodeTemplate} and {@link prepareAssocTemplate}.
   * @param {Object[]} mappings
   * @param {String} cacheProperty
   * @param {Object[]} defaultMappings (optional)
   * @return {Object}
   * @return {sol.common.Template} return.tpl
   * @return {Object} return.conversions
   */
  prepareTemplate: function (mappings, cacheProperty, defaultMappings) {
    var me = this,
        cachePropertyConversion = cacheProperty + "_conversion",
        tplObject, conversionObject;

    if (!me[cacheProperty]) {
      tplObject = {};
      conversionObject = {};
      mappings = (mappings && (mappings.length > 0)) ? mappings : [];

      if (defaultMappings && (defaultMappings.length > 0)) {
        mappings = defaultMappings.concat(mappings);
      }

      mappings.forEach(function (m) {
        tplObject[m.property] = m.from;
        if (m.type) {
          conversionObject[m.property] = m.type;
        }
      });

      me[cacheProperty] = sol.create("sol.common.Template", { source: JSON.stringify(tplObject) });
      if (Object.keys(conversionObject).length > 0) {
        me[cachePropertyConversion] = conversionObject;
      }
    }
    return {
      tpl: me[cacheProperty],
      conversions: me[cachePropertyConversion]
    };
  },

  /**
   * @private
   * Converts types as specified in the mappings.
   * @param {Object} nodeObj
   * @param {Object} conversionCfg
   */
  convertTypes: function (nodeObj, conversionCfg) {
    var me = this,
        convertionProperty;
    if (conversionCfg && (Object.keys(conversionCfg).length > 0)) {
      for (convertionProperty in conversionCfg) {
        if (nodeObj.hasOwnProperty(convertionProperty)) {
          switch (conversionCfg[convertionProperty]) {
            case "boolean":
              nodeObj[convertionProperty] = me.convert2Boolean(nodeObj[convertionProperty]);
              break;
            case "number":
              nodeObj[convertionProperty] = me.convert2Number(nodeObj[convertionProperty]);
              break;
            default:
              break;
          }
        }
      }
    }
  },

  /**
   * @private
   * Converts to boolean.
   * @param {String} value
   * @return {Boolean}
   */
  convert2Boolean: function (value) {
    if (value === "0" || value === "false" || value === "" || !value) {
      return false;
    }
    return true;
  },

  /**
   * @private
   * Converts to number.
   * @param {String} value
   * @return {Number}
   */
  convert2Number: function (value) {
    return parseInt(value, 10);
  }

});


/**
 * @member sol.hr.ix.services.OrganizationChart
 * @method RF_sol_hr_service_OrganizationChart_Companies
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_OrganizationChart_Companies(ec, args) {
  var rfUtils, rfParams, service, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  service = sol.create("sol.hr.ix.services.OrganizationChart", rfParams);
  result = rfUtils.stringify(service.getCompanies());
  return result;
}

/**
 * @member sol.hr.ix.services.OrganizationChart
 * @method RF_sol_hr_service_OrganizationChart_Get
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_OrganizationChart_Get(ec, args) {
  var rfUtils, rfParams, service, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");

  service = sol.create("sol.hr.ix.services.OrganizationChart", rfParams);
  result = rfUtils.stringify(service.getOrganizationChart());
  return result;
}
