
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.services.IntegrityCheck" });

/**
 * Checks the integrity of setup packages.
 *
 * The services returns a JSON-Format datastructure with consistency information
 *
 * # As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_dev_service_IntegrityCheck', {
 *     });
 *
 * # Returns data as followed
 *
 * The service creates a data structure that looks as follows.
 *
 *     {
 *       date: "20170623105541",
 *       workflows: [{
 *              wfname:           "sol.common.dynadhocflows",
 *              insetuppackage:   false,
 *              inarchive:        false
 *          }, {
 *              wfname:           "sol.contact.company.create",
 *              insetuppackage:   true,
 *              inarchive: true   true
 *          },
 *          ......
 *          ]
 *     }
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common.ix.DateUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.SordTypeUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.StringUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.Config
 * @requires  sol.common.Template
 *
 */
sol.define("sol.dev.ix.services.IntegrityCheck", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * @private
   * Finds .eloinst Folder.
   * @returns {de.elo.ix.client.Sord[]}
   */
  findEloinst: function () {
    var searchConf = {},
        sordsEloinst, path;

    path = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions";

    searchConf.includeFolders = true;
    searchConf.includeDocuments = false;
    searchConf.sordZ = SordC.mbAllIndex;
    searchConf.name = ".eloinst";
    searchConf.exactName = true;
    searchConf.recursive = true;
    searchConf.level = 3;

    sordsEloinst = sol.common.RepoUtils.findChildren(path, searchConf);
    return sordsEloinst;

  },

  /**
   * @private
   * Get build and install json.
   * @param {de.elo.ix.client.Sord} sordEloinst
   * @returns {Object}
   */
  getbiJson: function (sordEloinst) {
    var searchConf = {},
        biJson = {},
        bisords, i;


    searchConf.includeFolders = false;
    searchConf.includeDocuments = true;
    searchConf.sordZ = SordC.mbAllIndex;

    bisords = sol.common.RepoUtils.findChildren(sordEloinst.id, searchConf);
    for (i = 0; i < bisords.length; i++) {
      if (bisords[i].name == "build") {
        biJson.build = sol.create("sol.common.Config", { load: bisords[i].id }).config;
      }
      if (bisords[i].name == "install") {
        biJson.install = sol.create("sol.common.Config", { load: bisords[i].id }).config;
      }

    }
    return biJson;
  },

  /**
   * @private
   * Reads all build and install json.
   * @param {de.elo.ix.client.Sord[]} sordsEloinst
   * @returns {Object[]}
   */
  getBuildInstallJsons: function (sordsEloinst) {
    var me = this,
        biJsons = [],
        i, biJson;

    for (i = 0; i < sordsEloinst.length; i++) {
      biJson = me.getbiJson(sordsEloinst[i]);
      biJsons.push(biJson);
    }
    return biJsons;
  },

  /**
   * @private
   * Reads all build and install wfs.
   * @param {Object[]} biJsons
   * @returns {Object[]}
   */
  getBuildInstallWfs: function (biJsons) {
    var biWfs = [],
        findWorkflowInfo, wfs, i, j, wfname;

    findWorkflowInfo = new FindWorkflowInfo();
    findWorkflowInfo.type = WFTypeC.TEMPLATE;
    wfs = sol.common.WfUtils.findWorkflows(findWorkflowInfo);
    for (i = 0; i < wfs.length; i++) {
      wfname = String(wfs[i].name);
      for (j = 0; j < biJsons.length; j++) {
        if (biJsons[j].build.setupName) {
          if (sol.common.StringUtils.startsWith(wfname, biJsons[j].build.setupName)) {
            biWfs.push({ wfname: wfname });
          }
        }
      }
    }
    return biWfs;
  },

  /**
   * @private
   * Reads all build and install wfs.
   * @param {Object[]} biWfs
   * @param {Object[]} biJsons
   * @returns {Object[]}
   */
  checkIntegrityWfs: function (biWfs, biJsons) {
    var setupWfs = [],
        biWf, i, j, k, wfname, wfTemplate, setupWf;

    // check if in build install
    for (i = 0; i < biWfs.length; i++) {
      biWf = biWfs[i];
      wfname = biWf.wfname;
      biWf.insetuppackage = false;
      biWf.inarchive = false;
      for (j = 0; j < biJsons.length; j++) {
        if (biJsons[j].build.workflowTemplates) {
          for (k = 0; k < biJsons[j].build.workflowTemplates.length; k++) {
            wfTemplate = biJsons[j].build.workflowTemplates[k];
            if (wfname == wfTemplate) {
              biWf.insetuppackage = true;
            }
          }
        }
      }
    }

    // check if in archive
    for (i = 0; i < biJsons.length; i++) {
      if (biJsons[i].build.workflowTemplates) {
        for (j = 0; j < biJsons[i].build.workflowTemplates.length; j++) {
          wfTemplate = biJsons[i].build.workflowTemplates[j];
          setupWfs.push({ wfTemplate: wfTemplate });

        }
      }
    }
    for (i = 0; i < setupWfs.length; i++) {
      setupWf = setupWfs[i];
      wfTemplate = setupWf.wfTemplate;
      setupWf.inarchive = false;
      for (j = 0; j < biWfs.length; j++) {
        biWf = biWfs[j];
        wfname = biWf.wfname;
        if (wfname == wfTemplate) {
          setupWf.inarchive = true;
        }
      }
    }
    for (i = 0; i < setupWfs.length; i++) {
      setupWf = setupWfs[i];
      wfTemplate = setupWf.wfTemplate;
      for (j = 0; j < biWfs.length; j++) {
        biWf = biWfs[j];
        wfname = biWf.wfname;
        if (wfname == wfTemplate) {
          biWf.inarchive = setupWf.inarchive;
        }
      }
    }
    return biWfs;
  },

  /**
   * @private
   * Reads all build and install sordtypes.
   * @param {Object[]} biJsons
   * @returns {Object[]}
   */
  getBuildInstallSordTypes: function (biJsons) {
    var biSordTypes = [],
        sordTypes, i, j, k, sordTypeName, sordType;

    sordTypes = ixConnect.ix().checkoutSordTypes(null, Packages.de.elo.ix.client.SordTypeC.mbNoIcons, LockC.NO);
    for (i = 0; i < sordTypes.length; i++) {
      sordTypeName = String(sordTypes[i].name);
      for (j = 0; j < biJsons.length; j++) {
        if (biJsons[j].build.sordTypes) {
          for (k = 0; k < biJsons[j].build.sordTypes.length; k++) {
            sordType = biJsons[j].build.sordTypes[k];
            if (sordTypeName == sordType) {
              biSordTypes.push({ sordTypeName: sordTypeName });
            }
          }
        }
      }
    }
    return biSordTypes;
  },

  /**
   * @private
   * Reads all build and install sordtypes.
   * @param {Object[]} biSordTypes
   * @param {Object[]} biJsons
   * @returns {Object[]}
   */
  checkIntegritySordTypes: function (biSordTypes, biJsons) {
    var setupSordTypes = [],
        biSordType, i, j, k, sordTypeName, sordType, setupSordType;

    // check if in build install
    for (i = 0; i < biSordTypes.length; i++) {
      biSordType = biSordTypes[i];
      sordTypeName = biSordType.sordTypeName;
      biSordType.insetuppackage = false;
      biSordType.inarchive = false;
      for (j = 0; j < biJsons.length; j++) {
        if (biJsons[j].build.sordTypes) {
          for (k = 0; k < biJsons[j].build.sordTypes.length; k++) {
            sordType = biJsons[j].build.sordTypes[k];
            if (sordTypeName == sordType) {
              biSordType.insetuppackage = true;
            }
          }
        }
      }
    }

    // check if in archive
    for (i = 0; i < biJsons.length; i++) {
      if (biJsons[i].build.sordTypes) {
        for (j = 0; j < biJsons[i].build.sordTypes.length; j++) {
          sordType = biJsons[i].build.sordTypes[j];
          setupSordTypes.push({ sordType: sordType });
        }
      }
    }
    for (i = 0; i < setupSordTypes.length; i++) {
      setupSordType = setupSordTypes[i];
      sordType = setupSordType.sordType;
      setupSordType.inarchive = false;
      for (j = 0; j < biSordTypes.length; j++) {
        biSordType = biSordTypes[j];
        sordTypeName = biSordType.sordTypeName;
        if (sordTypeName == sordType) {
          setupSordType.inarchive = true;
        }
      }
    }
    for (i = 0; i < setupSordTypes.length; i++) {
      setupSordType = setupSordTypes[i];
      sordType = setupSordType.sordType;
      for (j = 0; j < biSordTypes.length; j++) {
        biSordType = biSordTypes[j];
        sordTypeName = biSordType.sordTypeName;
        if (sordTypeName == sordType) {
          biSordType.inarchive = setupSordType.inarchive;
        }
      }
    }
    return biSordTypes;
  },

  /**
   * @private
   * Reads all build and install set sordtypes.
   * @param {Object[]} biJsons
   * @returns {Object[]}
   */
  getBuildInstallSetSordTypes: function (biJsons) {
    var biSetSordTypes = [],
        sordTypes, i, j, k, sordTypeName, setSordType;

    sordTypes = ixConnect.ix().checkoutSordTypes(null, Packages.de.elo.ix.client.SordTypeC.mbNoIcons, LockC.NO);
    for (i = 0; i < sordTypes.length; i++) {
      sordTypeName = String(sordTypes[i].name);
      for (j = 0; j < biJsons.length; j++) {

        if (biJsons[j].install.setSordTypes) {
          for (k = 0; k < biJsons[j].install.setSordTypes.length; k++) {
            setSordType = biJsons[j].install.setSordTypes[k];
            if (sordTypeName == setSordType.name) {
              biSetSordTypes.push(setSordType);
            }
          }
        }
      }
    }
    return biSetSordTypes;
  },

  /**
   * @private
   * Reads all build and install sordtypes.
   * @param {Object[]} biSetSordTypes
   * @returns {Object[]}
   */
  checkIntegritySetSordTypes: function (biSetSordTypes) {
    var biSetSordType, i, sordType,
        objId, sordZ, sord;

    // check if in build install
    for (i = 0; i < biSetSordTypes.length; i++) {
      biSetSordType = biSetSordTypes[i];
      try {
        objId = sol.common.RepoUtils.resolveSpecialFolder(biSetSordType.path);
      } catch (ex) {
        objId = null;
        biSetSordType.invalidPath = true;
        biSetSordType.isValid = false;
      }
      if (objId) {
        try {
          sordType = sol.common.SordTypeUtils.getSordTypeId(biSetSordType.name);
          sordZ = new SordZ(ObjDataC.mbType);
          sord = ixConnect.ix().checkoutSord(objId, sordZ, LockC.NO);
          if (sord.type == sordType) {
            biSetSordType.isValid = true;
          } else {
            biSetSordType.isValid = false;
          }
        } catch (ex) {
          biSetSordType.invalidName = true;
          biSetSordType.isValid = false;
        }

      }
    }

    return biSetSordTypes;
  },

  /**
   * @private
   * Reads all build and install colors.
   * @param {Object[]} biJsons
   * @returns {Object[]}
   */
  getBuildInstallColors: function (biJsons) {
    var biColors = [],
        colors, i, j, k, colorName, colorRGB, color;

    colors = ixConnect.ix().checkoutColors(LockC.NO);
    for (i = 0; i < colors.length; i++) {
      colorName = String(colors[i].name);
      colorRGB = String(colors[i].RGB);
      for (j = 0; j < biJsons.length; j++) {
        if (biJsons[j].install.colors) {
          for (k = 0; k < biJsons[j].install.colors.length; k++) {
            color = biJsons[j].install.colors[k];
            if ((colorName == color.name) && (colorRGB == color.rgb)) {
              biColors.push(color);
            }
          }
        }
      }
    }
    return biColors;
  },

  /**
   * @private
   * Reads all build and install colors.
   * @param {Object[]} biColors
   * @param {Object[]} biJsons
   * @returns {Object[]}
   */
  checkIntegrityColors: function (biColors, biJsons) {
    var setupColors = [],
        biColor, i, j, k, colorName, color,
        colorRGB, setupColor, setupColorName, setupColorRGB;

    // check if in build install
    for (i = 0; i < biColors.length; i++) {
      biColor = biColors[i];
      colorName = biColor.name;
      colorRGB = biColor.rgb;
      biColor.insetuppackage = false;
      biColor.inarchive = false;
      for (j = 0; j < biJsons.length; j++) {
        if (biJsons[j].install.colors) {
          for (k = 0; k < biJsons[j].install.colors.length; k++) {
            color = biJsons[j].install.colors[k];
            if ((colorName == color.name) && (colorRGB == color.rgb)) {
              biColor.insetuppackage = true;
            }
          }
        }
      }
    }

    // check if in archive
    for (i = 0; i < biJsons.length; i++) {
      if (biJsons[i].install.colors) {
        for (j = 0; j < biJsons[i].install.colors.length; j++) {
          color = biJsons[i].install.colors[j];
          setupColors.push(color);

        }
      }
    }
    for (i = 0; i < setupColors.length; i++) {
      setupColor = setupColors[i];
      setupColorName = setupColor.name;
      setupColorRGB = setupColor.rgb;
      setupColor.inarchive = false;
      for (j = 0; j < biColors.length; j++) {
        biColor = biColors[j];
        colorName = biColor.name;
        colorRGB = biColor.rgb;
        if ((colorName == setupColorName) && (colorRGB == setupColorRGB)) {
          setupColor.inarchive = true;
        }
      }
    }
    for (i = 0; i < setupColors.length; i++) {
      setupColor = setupColors[i];
      setupColorName = setupColor.name;
      setupColorRGB = setupColor.rgb;
      for (j = 0; j < biColors.length; j++) {
        biColor = biColors[j];
        colorName = biColor.name;
        colorRGB = biColor.rgb;
        if ((colorName == setupColorName) && (colorRGB == setupColorRGB)) {
          biColor.inarchive = setupColor.inarchive;
        }
      }
    }
    return biColors;
  },

  /**
   * @private
   * Reads all build and install docmasks.
   * @param {Object[]} biJsons
   * @returns {Object[]}
   */
  getBuildInstallDocMasks: function (biJsons) {
    var biDocMasks = [],
        docMasks, i, j, k, docMaskName, docMask;

    sol.common.RepoUtils.setSessionOption(SessionOptionsC.TRANSLATE_TERMS, false);
    docMasks = sol.common.SordUtils.getDocMaskNames({ filters: { nameTranslationKeyPrefix: "sol." } });
    sol.common.RepoUtils.setSessionOption(SessionOptionsC.TRANSLATE_TERMS, true);
    for (i = 0; i < docMasks.length; i++) {
      docMaskName = String(docMasks[i].name);
      for (j = 0; j < biJsons.length; j++) {
        if (biJsons[j].install.docMasksMustNotExist) {
          for (k = 0; k < biJsons[j].install.docMasksMustNotExist.length; k++) {
            docMask = biJsons[j].install.docMasksMustNotExist[k];
            if (docMaskName == docMask) {
              biDocMasks.push({ docMaskName: docMaskName });
            }
          }
        }
      }
    }
    return biDocMasks;
  },

  /**
   * @private
   * Reads all build and install docmasks.
   * @param {Object[]} biDocMasks
   * @param {Object[]} biJsons
   * @returns {Object[]}
   */
  checkIntegrityDocMasks: function (biDocMasks, biJsons) {
    var setupDocMasks = [],
        biDocMask, i, j, k, docMaskName, docMask, setupDocMask;

    // check if in build install
    for (i = 0; i < biDocMasks.length; i++) {
      biDocMask = biDocMasks[i];
      docMaskName = biDocMask.docMaskName;
      biDocMask.insetuppackage = false;
      biDocMask.inarchive = false;
      for (j = 0; j < biJsons.length; j++) {
        if (biJsons[j].install.docMasksMustNotExist) {
          for (k = 0; k < biJsons[j].install.docMasksMustNotExist.length; k++) {
            docMask = biJsons[j].install.docMasksMustNotExist[k];
            if (docMaskName == docMask) {
              biDocMask.insetuppackage = true;
            }
          }
        }
      }
    }

    // check if in archive
    for (i = 0; i < biJsons.length; i++) {
      if (biJsons[i].install.docMasksMustNotExist) {
        for (j = 0; j < biJsons[i].install.docMasksMustNotExist.length; j++) {
          docMask = biJsons[i].install.docMasksMustNotExist[j];
          setupDocMasks.push({ docMask: docMask });

        }
      }
    }
    for (i = 0; i < setupDocMasks.length; i++) {
      setupDocMask = setupDocMasks[i];
      docMask = setupDocMask.docMask;
      setupDocMask.inarchive = false;
      for (j = 0; j < biDocMasks.length; j++) {
        biDocMask = biDocMasks[j];
        docMaskName = biDocMask.docMaskName;
        if (docMaskName == docMask) {
          setupDocMask.inarchive = true;
        }
      }
    }
    for (i = 0; i < setupDocMasks.length; i++) {
      setupDocMask = setupDocMasks[i];
      docMask = setupDocMask.docMask;
      for (j = 0; j < biDocMasks.length; j++) {
        biDocMask = biDocMasks[j];
        docMaskName = biDocMask.docMaskName;
        if (docMaskName == docMask) {
          biDocMask.inarchive = setupDocMask.inarchive;
        }
      }
    }
    return biDocMasks;
  },

  /**
   * Generates a Version Script List in JSON-Format into a document.
   * @return {Object}
   */
  process: function () {
    var me = this,
        jsonIntegrityCheck = {},
        isoDate = sol.common.DateUtils.nowIso(),
        sordsEloinst, biJsons, biWfs, biSordTypes, biSetSordTypes,
        biColors, biDocMasks;

    jsonIntegrityCheck.date = isoDate;

    sordsEloinst = me.findEloinst();
    biJsons = me.getBuildInstallJsons(sordsEloinst);

    // get all workflow templates
    biWfs = me.getBuildInstallWfs(biJsons);

    // check integrity workflows in packages
    biWfs = me.checkIntegrityWfs(biWfs, biJsons);

    // get all sordtypes
    biSordTypes = me.getBuildInstallSordTypes(biJsons);

    // check integrity sordtypes in packages
    biSordTypes = me.checkIntegritySordTypes(biSordTypes, biJsons);

    // get all set sordtypes
    biSetSordTypes = me.getBuildInstallSetSordTypes(biJsons);

    // check integrity set sordtypes in packages
    biSetSordTypes = me.checkIntegritySetSordTypes(biSetSordTypes);

    // get all colors
    biColors = me.getBuildInstallColors(biJsons);

    // check integrity colors in packages
    biColors = me.checkIntegrityColors(biColors, biJsons);

    // get all docMasks
    biDocMasks = me.getBuildInstallDocMasks(biJsons);

    // check integrity docMasks in packages
    biDocMasks = me.checkIntegrityDocMasks(biDocMasks, biJsons);

    jsonIntegrityCheck.workflows = biWfs;
    jsonIntegrityCheck.sordTypes = biSordTypes;
    jsonIntegrityCheck.setSordTypes = biSetSordTypes;
    jsonIntegrityCheck.colors = biColors;
    jsonIntegrityCheck.docMasks = biDocMasks;
    me.logger.debug(["JSON-object jsonIntegrityCheck = '{0}' is generated", jsonIntegrityCheck]);
    return jsonIntegrityCheck;
  }

});

/**
 * @member sol.dev.ix.services.IntegrityCheck
 * @method RF_sol_dev_service_IntegrityCheck
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_dev_service_IntegrityCheck(iXSEContext, args) {
  logger.enter("RF_sol_dev_service_IntegrityCheck", args);
  var params, module, jsonIntegrityCheck;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  module = sol.create("sol.dev.ix.services.IntegrityCheck", params);
  jsonIntegrityCheck = module.process();
  logger.exit("RF_sol_dev_service_IntegrityCheck");
  return sol.common.ix.RfUtils.stringify(jsonIntegrityCheck);
}