importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", { scope: "sol.hr.ix.services.GetGenericSearchFolderContent" });

/**
 *
 * @author Est, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.Template
 *
 * This function returns archive entries for a dynamic search folder.
 *
 * Two modes have to be defined:
 *
 * 1. Search the folder which is responsible for delivering the metadata for the search
 *
 * 2. The actual search using the metadata from search-1.
 *
 * In both cases you can use templating. Choose between the modes:
 *
 * hierarchy: find the first element matching the search criteria in the hierarchy backwards.
 *  Attention: You can only use sol.common.RepoUtils.findObjectTypeInHierarchy's config here
 *
 * findByIndex: You can define objKeys here.
 *
 * Templating:
 *    "current" object gives you access to the metadata of the object found by search no. 1
 *
 *    "sord" object gives you access to the metadata of the object found by search no. 1
 *
 * ### Example Config
 * Paste this in a folders additional information tab.
 * Be sure that every mode object gets its own line!
 *
 *     !? RF_sol_hr_service_GetGenericSearchFolderContent
 *     {"mode": "hierarchy", "searchConfig": {"vals": ["PERSONNELFILE"]}}
 *     {"mode": "findByIndex", "searchConfig": {"objKeys": {"SOL_TYPE": "HR_REQUEST", "HR_PERSONNEL_ELOUSERID": "{{sord.objKeys.HR_PERSONNEL_ELOUSERID}}"}}}
 */
sol.define("sol.hr.ix.services.GetGenericSearchFolderContent", {
  extend: "sol.common.ix.ServiceBase",

  templateData: {},

  hierarchySearch: function (searchConfig, objId) {
    return sol.common.RepoUtils.findObjectTypeInHierarchy(objId, searchConfig.vals);
  },

  getObjKeys: function (searchConfig) {
    var objKeys = [], objKey;
    for (var fieldName in searchConfig) {
      objKey = new ObjKey();
      objKey.name = fieldName;
      objKey.data = [searchConfig[fieldName]];
      objKeys.push(objKey);
    }
    return objKeys;
  },

  findByIndexSearch: function (searchConfig, returnOnlyOneResult, mbAll) {
    var me = this, result,
        maxResults = returnOnlyOneResult ? 1 : 1000,
        sordC = mbAll ? SordC.mbAllIndex : SordC.mbOnlyId,
        returns = mbAll ? "sords" : "ids",
        findInfo = new FindInfo(),
        findByIndex = new FindByIndex();

    findInfo.findByIndex = findByIndex;

    for (var prop in searchConfig) {
      findByIndex[prop] = ((prop === "objKeys") ? me.getObjKeys(searchConfig[prop]) : searchConfig[prop]);
    }
    result = ixConnect.ix().findFirstSords(findInfo, maxResults, sordC)[returns];
    return Array.prototype.slice.call(result);
  },

  find: function (config, startingPointId, returnOnlyOneResult) {
    var me = this, result;
    result = (
      (config.mode === "hierarchy" && [me.hierarchySearch(config.searchConfig, startingPointId)])
      || me.findByIndexSearch(config.searchConfig, returnOnlyOneResult, returnOnlyOneResult)
    );

    result = (!returnOnlyOneResult && config.mode === "hierarchy" && Array.isArray(result) && result.length === 1 && [+result[0].id]) || result;

    return returnOnlyOneResult
      ? ((Array.isArray(result) && result.length > 0 && (result[0])) || result) // returns [sord]
      : (Array.isArray(result) && result.map(function (s) {return (+s);})) || []; // returns [objId, objId, ...]
  },

  renderAndFind: function (config, sord, returnOnlyOneResult) {
    var me = this,
        activeTemplate = Object.keys(me.templateData).length === 0 && "current" || "sord";

    if (config === undefined || sord === undefined) {
      throw "template-sord could not be created. either sord or config is undefined";
    }

    me.templateData[activeTemplate] = sol.common.SordUtils.getTemplateSord(sord).sord;

    sol.common.TemplateUtils.render(config, me.templateData);

    return me.find(config, sord.id, returnOnlyOneResult);
  },

  process: function () {
    var me = this, baseResult, concludingResult;

    try {
      baseResult = me.renderAndFind(me.baseConfig, me.callingSord, true);
      if (baseResult === undefined || baseResult === null) {
        return [];
      }
      concludingResult = me.renderAndFind(me.concludingConfig, baseResult, false);
    } catch (e) {}

    return Array.isArray(concludingResult) ? concludingResult : [];
  }
});

/**
 * @member sol.hr.ix.services.GetGenericSearchFolderContent
 * @method RF_sol_hr_service_GetGenericSearchFolderContent
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetGenericSearchFolderContent(ec, args) {
  logger.enter("RF_sol_hr_service_GetGenericSearchFolderContent", args);
  var params = {}, objIds, result;

  if (args.length == 3) {
    params.callingSord = args[0];
    params.callingSord = ixConnect.ix().checkoutSord(params.callingSord.id, SordC.mbAllIndex, LockC.NO);
    params.baseConfig = JSON.parse(args[1]);
    params.concludingConfig = JSON.parse(args[2]);
  } else {
    throw "This function requires 2 parameters. (maybe you defined too many newlines)";
  }
  objIds = (sol.create("sol.hr.ix.services.GetGenericSearchFolderContent", params)).process();
  result = new Packages.de.elo.ix.jscript.FindSordsByIds(objIds);
  logger.exit("RF_sol_hr_service_GetGenericSearchFolderContent", result);
  return result;
}
