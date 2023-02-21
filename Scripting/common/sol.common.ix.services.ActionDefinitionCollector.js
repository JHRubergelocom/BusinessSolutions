
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.ActionDefinitionCollector" });

var _0x9311=["\x64\x65\x73\x63","\x70\x61\x72\x73\x65","\x63\x6C\x69\x65\x6E\x74\x41\x70\x70\x54\x79\x70\x65","\x73\x65\x73\x73\x69\x6F\x6E\x4F\x70\x74\x69\x6F\x6E\x73","\x44\x52\x46\x4A","\x6C\x61\x75\x6E\x63\x68\x70\x61\x64","\x63\x6C","\x65","\x45\x4C\x4F\x4D\x69\x6E\x69\x41\x70\x70\x2F","\x6C\x69\x63","\x58","\x69\x6E\x64\x65\x78\x4F\x66","\x66\x63\x74","\x61\x63\x74\x69\x6F\x6E","\x2F","\x6E\x61\x6D\x65","\x62\x75\x74\x74\x6F\x6E","\x72\x69\x62\x62\x6F\x6E","\x73\x75\x62\x73\x74\x72\x69\x6E\x67","\x45\x4C\x4F\x62\x73","\x73\x65\x74\x43\x75\x73\x74\x6F\x6D\x65\x72\x4E\x61\x6D\x65","\x73\x65\x74\x4D\x6F\x64\x75\x6C\x65\x4E\x61\x6D\x65","\x73\x65\x74\x4C\x69\x63\x65\x6E\x73\x65\x4B\x65\x79","\x63\x68\x65\x63\x6B\x4C\x69\x63\x65\x6E\x73\x65","\x69\x78","\x64\x63","","\x23","\x69\x64","\x75\x73\x65\x72","\x73\x69\x67","\x55\x54\x46\x2D\x38","\x67\x65\x74\x4D\x44\x35","\x4D\x64\x35\x48\x61\x73\x68","\x73\x65\x63","\x75\x74\x69\x6C\x73","\x65\x6C\x6F","\x64\x65","\x73\x65\x72\x6E\x6F","\x6C\x69\x63\x65\x6E\x73\x65","\x67\x65\x74\x53\x65\x72\x76\x65\x72\x49\x6E\x66\x6F"];var ActionDefinitionManager={register:function(_0x938fx2,_0x938fx3,_0x938fx4){var _0x938fx5=this,_0x938fx6;_0x938fx6= JSON[_0x9311[1]](_0x938fx2[_0x9311[0]]);return (_0x938fx3[_0x9311[3]][_0x9311[2]]== _0x9311[4]|| _0x938fx4== _0x9311[5])?((_0x938fx5[_0x9311[6]](_0x938fx6))?_0x938fx5[_0x9311[7]](_0x938fx3,_0x938fx6,true):null):_0x938fx5[_0x9311[7]](_0x938fx3,_0x938fx6,false)},cl:function(_0x938fx6){var _0x938fx5=this,_0x938fx7=false,_0x938fx8=_0x9311[8],_0x938fx9,_0x938fxa,_0x938fxb;if(_0x938fx6[_0x9311[9]]){_0x938fx9=  new LicenseInfo();if(_0x938fx6[_0x9311[9]][_0x9311[11]](_0x9311[10])=== 0){_0x938fx8+= _0x938fx6[_0x9311[13]][_0x9311[12]]+ _0x9311[14]+ _0x938fx6[_0x9311[17]][_0x9311[16]][_0x9311[15]];_0x938fxa= _0x938fx6[_0x9311[9]][_0x9311[18]](1)}else {_0x938fx8+= _0x938fx6[_0x9311[13]][_0x9311[12]];_0x938fxa= _0x938fx6[_0x9311[9]]};try{_0x938fx9[_0x9311[20]](_0x9311[19]);_0x938fx9[_0x9311[21]](_0x938fx8);_0x938fx9[_0x9311[22]](_0x938fxa);ixConnect[_0x9311[24]]()[_0x9311[23]](_0x938fx9);_0x938fx7= true}catch(ex){};if(_0x938fx7!== true){_0x938fxb= _0x938fx5[_0x9311[25]]();if(_0x938fxb){try{_0x938fx9[_0x9311[20]](_0x938fxb);_0x938fx9[_0x9311[21]](_0x938fx8);_0x938fx9[_0x9311[22]](_0x938fxa);ixConnect[_0x9311[24]]()[_0x9311[23]](_0x938fx9);_0x938fx7= true}catch(ex){}}}};return _0x938fx7},e:function(_0x938fx3,_0x938fx6,_0x938fxc){var _0x938fx8,_0x938fxd;_0x938fx8= _0x938fx6[_0x9311[13]][_0x9311[12]]+ _0x9311[14]+ ((_0x938fx6[_0x9311[17]]&& _0x938fx6[_0x9311[17]][_0x9311[16]])?_0x938fx6[_0x9311[17]][_0x9311[16]][_0x9311[15]]:_0x9311[26]);_0x938fxd= (_0x938fxc&& _0x938fx6[_0x9311[9]])?(_0x938fx6[_0x9311[9]]+ _0x9311[27]+ _0x938fx8+ _0x9311[27]+ _0x938fx3[_0x9311[29]][_0x9311[28]]):_0x938fx6[_0x9311[13]][_0x9311[12]];_0x938fx6[_0x9311[30]]= String(Packages[_0x9311[37]][_0x9311[36]][_0x9311[35]][_0x9311[34]][_0x9311[33]][_0x9311[32]](_0x938fxd,_0x9311[31]));return _0x938fx6},dc:function(){var _0x938fxb;try{_0x938fxb= ixConnect[_0x9311[24]]()[_0x9311[40]]()[_0x9311[39]][_0x9311[38]]}catch(ex){_0x938fxb= null};return _0x938fxb}} // eslint-disable-line

/**
 * Collects all ribbon and action definitions for ELO Business Solutions.
 * This service is usually called automatically during the client startup procedure.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.09.000
 */
sol.define("sol.common.ix.services.ActionDefinitionCollector", {
  extend: "sol.common.ix.ServiceBase",

  collectorVersion: "1.09.000",

  requiredClientVersions: {
    WCLB: { // JavaClient
      REPLACE: "20.00.000",
      MULTI: "30.00.000"
    },
    QRDC: { // WebClient
      REPLACE: "20.00.000",
      MULTI: "30.00.000"
    }
  },

  /*
   * Definition of the different modes:
   * LEGACY : mode for clients prior to ELO20
   * REPLACE: mode for ELO20 clients
   * MULTI  : mode for clients after ELO20
   */
  buttonMergeModes: {
    LEGACY: { name: "LEGACY", fct: "legacyMergeFct" },
    REPLACE: { name: "REPLACE", fct: "replaceMergeFct" },
    MULTI: { name: "MULTI", fct: "multiMergeFct" }
  },

  /**
   * @cfg {String} parentId (required)
   * id of the parent element (guid, objId or archivepath)
   */
  parentId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/_global/Action definitions",
  sordKeys: ["id", "guid", "name", "desc"],
  totalCount: 10000,
  maxFind: 1000,
  objKeys: [],
  filter: [],
  endLevel: 1,

  sordKeyMap: {
    id: { elementSelector: ObjDataC.mbId },
    guid: { elementSelector: ObjDataC.mbGuid },
    name: { elementSelector: ObjDataC.mbName },
    desc: { elementSelector: SordC.mbDesc }
  },

  initialize: function (config) {
    var me = this;

    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.maskName = config.maskName || me.maskName;
    me.parentId = config.parentId || me.parentId;
    me.formatter = config.formatter || me.formatter;
    me.sordKeys = config.sordKeys || me.sordKeys;
    me.objKeys = config.objKeys || me.objKeys;
    me.ec = config.ec || me.ec;
    me.endLevel = config.endLevel || me.endLevel;
    me.returnDataDefinition = config.returnDataDefinition || me.returnDataDefinition;
    me.filter = config.filter || me.filter;

    me.objKeyMap = {};
    me.jsonData = [];
    me.docMasks = {};
  },

  /**
   * list of objects that are translated using IX translation keys.
   */
  translateObjectProperties: {
    ribbon: {
      button: {
        text: true,
        splitText: true,
        tooltipText: true,
        tooltipTitle: true
      },
      buttongroup: {
        text: true
      },
      ribbonTab: {
        text: true
      }
    },
    action: {
      locale: {
        errorDlgTitle: true,
        typesDlgTitle: true,
        typesDlgHeader: true,
        typesDlgText: true,
        typesDlgNoTypes: true,
        treeDlgTitle: true,
        treeDlgHeader: true,
        treeDlgRootName: true
      }
    }
  },

  /**
   * Starts the collection of the desired data
   * @return {String}
   */
  execute: function () {
    var me = this,
        childSords, i, def, lang,
        terms = [],
        definitions = [];

    me.computeSordElementSelector();
    childSords = me.collectChildren();

    if (childSords) {
      // read definitions
      for (i = 0; i < childSords.length; i++) {
        try {
          def = ActionDefinitionManager.register(childSords[i], me.ec, me.client);

          def = me.transformRibbonDefinitions(def);

          if (def && me.checkRequiredModules(def)) {
            me.parseDefinition(me.translateObjectProperties, def, function (key, val) {
              terms.push(val);
              return null;
            });

            definitions.push(def);
          }
        } catch (ex) {
          me.logger.error("failed loading definition: " + childSords[i].name, ex);
        }
      }

      // translate definitions
      lang = String(me.ec.ci.language);
      sol.common.TranslateTerms.require(terms, lang);

      for (i = 0; i < definitions.length; i++) {
        def = definitions[i];
        me.parseDefinition(me.translateObjectProperties, def, function (key, val) {
          return sol.common.TranslateTerms.translate(val);
        });
      }
    }

    return JSON.stringify({
      definitions: definitions
    });
  },

  /**
   * @private
   * Helper for handling object structures.
   * @param {Object} base
   * @param {Object} obj
   * @param {Function} fct
   */
  parseDefinition: function (base, obj, fct) {
    var me = this,
        objName, res;
    for (objName in base) {
      if (base && base.hasOwnProperty(objName)
          && obj && obj.hasOwnProperty(objName)) {
        if (base[objName] === true) {
          res = fct.call(me, objName, obj[objName], obj);
          if (res !== null && res !== "") {
            obj[objName] = res;
          }
        } else {
          me.parseDefinition(base[objName], obj[objName], fct);
        }
      }
    }
  },

  /**
   * @private
   * @return {Array}
   */
  collectChildren: function () {
    var me = this,
        i, filter, idx, objKey, length,
        jsonData = [],
        findInfo = new FindInfo(),
        objKeyFilters = [],
        findResult,
        parentEditInfo, parentId;

    me.logger.enter("collectChildren");

    // get guid from arcpath
    // this allows accessing child elements of the given path without the requiremt of accessing
    // parent elements in the Administration folder.
    try {
      parentEditInfo = ixConnectAdmin.ix().checkoutSord(me.parentId, EditInfoC.mbOnlyId, LockC.NO);
      parentId = parentEditInfo.sord.id;
    } catch (exc) {
      me.logger.warn("'_global/Action definition' folder is missing.");
      return null;
    }

    findInfo.findChildren = new FindChildren();
    findInfo.findChildren.parentId = parentId;
    findInfo.findChildren.endLevel = me.endLevel;

    // apply optional mask filter
    if (me.maskName) {
      if (!findInfo.findByIndex) {
        findInfo.findByIndex = new FindByIndex();
      }
      findInfo.findByIndex.maskId = me.maskName;
    }

    // apply filter
    if (me.filter && me.filter.length > 0) {
      if (!findInfo.findByIndex) {
        findInfo.findByIndex = new FindByIndex();
      }
      for (i = 0; i < me.filter.length; i++) {
        filter = me.filter[i];
        objKey = new ObjKey();
        objKey.name = filter.key;
        objKey.data = [filter.val];
        objKeyFilters.push(objKey);
        me.logger.debug("applied filter:", objKey);
      }
      findInfo.findByIndex.objKeys = objKeyFilters;
    }

    // apply find options
    findInfo.findOptions = new FindOptions();
    findInfo.findOptions.totalCount = me.totalCount;

    try {
      idx = 0;
      findResult = ixConnect.ix().findFirstSords(findInfo, me.maxFind, me.sordZ);
      while (true) {
        for (i = 0, length = findResult.sords.length; i < length; i++) {
          jsonData.push(findResult.sords[i]);
        }
        if (!findResult.moreResults) {
          break;
        }
        idx += findResult.sords.length;
        findResult = ixConnect.ix().findNextSords(findResult.searchId, idx, me.maxFind, me.sordZ);
      }
    } finally {
      if (findResult) {
        ixConnect.ix().findClose(findResult.searchId);
      }
    }

    me.logger.exit("collectChildren");

    return jsonData;
  },

  /**
   * @private
   *
   * Computes a SordZ selector for information that is required.
   */
  computeSordElementSelector: function () {
    var me = this,
        sordKey, elementSelector, i, objKeyName;
    me.sordZ = new SordZ(ObjDataC.mbMask);
    if (me.sordKeys) {
      me.sordKeys.forEach(function (key) {
        sordKey = me.sordKeyMap[key];
        if (sordKey) {
          elementSelector = sordKey.elementSelector;
        }
        if (elementSelector) {
          me.sordZ.add(elementSelector);
        }
      });
    }
    if (me.objKeys) {
      me.sordZ.add(SordC.mbObjKeys);
      for (i = 0; i < me.objKeys.length; i++) {
        objKeyName = me.objKeys[i];
        me.objKeyMap[objKeyName] = true;
      }
    }
  },

  /**
   * @private
   * Determines the mode for mergeing the button and ribbon definitions.
   * @return {Object}
   */
  getButtonMergeMode: function () {
    var me = this,
        requiredVersions;

    requiredVersions = me.requiredClientVersions[me.ec.sessionOptions.clientAppType];

    if (requiredVersions && sol.common.RepoUtils.checkVersion(me.ec.sessionOptions.clientAppVersion, requiredVersions[me.buttonMergeModes.MULTI.name])) {
      return me.buttonMergeModes.MULTI;
    } else if (requiredVersions && sol.common.RepoUtils.checkVersion(me.ec.sessionOptions.clientAppVersion, requiredVersions[me.buttonMergeModes.REPLACE.name])) {
      return me.buttonMergeModes.REPLACE;
    }

    return me.buttonMergeModes.LEGACY;
  },

  transformRibbonDefinitions: function (actionDefinition) {
    var me = this,
        mergeMode, mergeFct;

    mergeMode = me.getButtonMergeMode();
    mergeFct = (mergeMode && mergeMode.fct) ? me[mergeMode.fct] : null;

    if (sol.common.ObjectUtils.isFunction(mergeFct)) {
      actionDefinition = mergeFct.call(me, actionDefinition);
    }

    return actionDefinition;
  },

  /**
   * @private
   * Checks, if all required modules are installed.
   * @param {Object} actionDefinition
   * @return {Boolean}
   */
  checkRequiredModules: function (actionDefinition) {
    var me = this,
        requirementsMeet = true;

    if (actionDefinition && actionDefinition.action && actionDefinition.action.requiredModules && (actionDefinition.action.requiredModules.length > 0)) {
      requirementsMeet = actionDefinition.action.requiredModules.every(function (requiredModule) {
        var modulePath, moduleObjId, moduleInstalled;
        modulePath = sol.common.RepoUtils.resolveSpecialFolder("{{bsFolderPath}}/" + requiredModule);
        moduleObjId = sol.common.RepoUtils.getObjId(modulePath);
        moduleInstalled = !!moduleObjId;
        if (!moduleInstalled) {
          me.logger.warn(["ActionDefinition of button '{0}' is missing requirements. Required module '{1}' is not installed.", actionDefinition.ribbon && actionDefinition.ribbon.button && actionDefinition.ribbon.button.name, requiredModule]);
        }
        return moduleInstalled;
      });
    }

    return requirementsMeet;
  },

  legacyMergeFct: function (actionDefinition) {
    return actionDefinition;
  },

  /**
   * @private
   * The first additional button position is used instead of the original, in case there is any.
   * The additional 'ribbonTab' and 'buttongroup' properties will replace the original, while the 'button' property will be merged into the original.
   * @param {Object} actionDefinition
   * @return {Object}
   */
  replaceMergeFct: function (actionDefinition) {
    var ribbonDef, additionalRibbonDef, mergeObjFct;

    mergeObjFct = function (source, target) {
      var key;
      for (key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key];
        }
      }
    };

    if (actionDefinition && actionDefinition.ribbon && actionDefinition.ribbon.additionalButtonPositions && actionDefinition.ribbon.additionalButtonPositions[0]) {
      ribbonDef = actionDefinition.ribbon;
      additionalRibbonDef = ribbonDef.additionalButtonPositions[0];
      if (additionalRibbonDef.ribbonTab && ribbonDef.ribbonTab) {
        ribbonDef.ribbonTab = additionalRibbonDef.ribbonTab;
      }
      if (additionalRibbonDef.buttongroup && ribbonDef.buttongroup) {
        ribbonDef.buttongroup = additionalRibbonDef.buttongroup;
      }
      if (additionalRibbonDef.button && ribbonDef.button) {
        mergeObjFct(additionalRibbonDef.button, ribbonDef.button);
      }
    }
    return actionDefinition;
  },

  multiMergeFct: function (actionDefinition) {
    throw "NotImplementedException: multiple button positions have to be implemented for this ELO version";
  }

});

/**
 * @member sol.common.ix.services.ActionDefinitionCollector
 * @method RF_sol_common_services_ActionDefinitionCollector
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_ActionDefinitionCollector(ec, configAny) {
  var config, actionDefinitionCollector, result;

  logger.enter("RF_sol_common_services_ActionDefinitionCollector");

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);
  config.ec = ec;

  logger.debug(["ec.ci.language={0}", String(ec.ci.language)]);
  logger.debug(["ixConnect.loginResult.clientInfo.language={0}", String(ixConnect.loginResult.clientInfo.language)]);

  actionDefinitionCollector = sol.create("sol.common.ix.services.ActionDefinitionCollector", config);
  result = actionDefinitionCollector.execute();

  logger.exit("RF_sol_common_services_ActionDefinitionCollector");

  return result;
}
