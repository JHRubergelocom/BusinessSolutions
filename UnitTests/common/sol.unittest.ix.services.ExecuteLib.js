
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js
//@include lib_sol.common.ActionBase.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ObjectFormatter.MapTableToArray.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.AsUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.IxConnectionUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.DecimalUtils.js
//@include lib_sol.common.ExceptionUtils.js
//@include lib_sol.common.ExecUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib', {
 *       className: 'sol.common.AclUtils',
 *       classConfig: {}
 *       method: 'retrieveElements',
 *       params: ["4027", true, true]
 *     });
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib', {
 *       className: 'sol.common.Template',
 *       classConfig: {source: "{{padLeft 1234 '0000000000'}}"}
 *       method: 'apply',
 *       params: []
 *     });
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib', {
 *       className: 'sol.common.TemplateUtils',
 *       classConfig: {}
 *       method: 'render',
 *       params: ["{{formatDate 'DD.MM.YYYY HH:mm:ss' 20001015120030}}", {" name": "Hans" }, { "emptyNonRendered": true, "stringifyResults": true }]
 *     });
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.ActionBase
 * @requires  sol.common.UserProfile
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common.ObjectUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.SordTypeUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.AclUtils
 * @requires  sol.common.AsUtils
 * @requires  sol.common.AsyncUtils
 * @requires  sol.common.DateUtils
 * @requires  sol.common.DecimalUtils
 * @requires  sol.common.ExceptionUtils
 * @requires  sol.common.ExecUtils
 * @requires  sol.common.FileUtils
 * @requires  sol.common.HttpUtils
 * @requires  sol.common.Injection
 * @requires  sol.common.Locale
 * @requires  sol.common.Config
 * @requires  sol.common.Template
 * @requires  sol.common.WfUtils
 */
sol.define("sol.unittest.ix.services.ExecuteLib", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["className", "classConfig", "method", "params"],

  /**
   * @cfg {String} className Class name.
   */

  /**
   * @cfg {Object} classConfig configuration for class initialization.
   */

  /**
   * @cfg {String} method Method name.
   */

  /**
   * @cfg {Object[]} params Method parameters array.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Create workflow template
   * @param {String} wfName
   * @return {de.elo.ix.client.WFDiagram} workflow template
   */
  createWorkflowTemplate: function (wfName) {
    var wfTemplate, wfNode;

    wfTemplate = ixConnect.ix().createWorkFlow(wfName, WFTypeC.TEMPLATE);
    wfNode = ixConnect.ix().createWFNode(0, WFNodeC.TYPE_BEGINNODE);
    wfNode.name = "Start node";
    wfTemplate.nodes = [wfNode];
    wfTemplate.id = ixConnect.ix().checkinWorkFlow(wfTemplate, WFDiagramC.mbAll, LockC.NO);
    return wfTemplate;
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {},
        accessC,
        file, dir, path, fileData, cls, func,
        i, bytes, byte, string, strings, sordMap,
        findInfo, findChildren, findByType,
        fileData1, fileData2, fileData3, wf1, wf2,
        wf1name, wfFindInfo, defaultAccessCode;

    switch (me.className) {
      case "sol.common.MapTable":
        sordMap = sol.create("sol.common.SordMap", { objId: me.classConfig.objId });
        me.classConfig.map = sordMap;
        break;
      case "sol.common.HttpUtils":
        switch (me.method) {
          case "getPasswordAuthentication":
            return result;
          default:
        }
        break;
      case "sol.common.mixins.Inject":
      case "sol.common.mixins.Injection.SordToken":
        return result;
      case "sol.common.IxConnectionUtils":
        switch (me.method) {
          case "restore":
            return result;
          default:
        }
        break;
      case "sol.common.SordUtils":
        switch (me.method) {
          case "getObjectMapBlob":
            return result;
          default:
        }
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common.AclUtils":
        switch (me.method) {
          case "editRights":
            me.params[4] = cls.addSordRights;
            break;
          case "editSordRights":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            me.params[1] = { combineAclFunction: cls.addSordRights, accessCode: 0, asAdmin: true };
            break;
          case "enrichContextSord":
          case "replaceUserNamePlaceholders":
            me.params[2] = ixConnect;
            break;
          case "executeBackgroundAclJob":
            me.params[0] = ixConnect;
            defaultAccessCode = cls.createAccessCode(me.params[2].rights);
            cls.initializeRights(me.params[3], me.params[1], me.params[2], me.params[0]);
            cls.appendInheritedAcl(me.params[3], me.params[1], me.params[2], me.params[0]);
            cls.appendUserAcl(me.params[3], me.params[1], me.params[2], defaultAccessCode);
            cls.appendAndGroupAcl(me.params[3], me.params[1], me.params[2], defaultAccessCode);
            break;
          case "hasClassField":
            accessC = new AccessC;
            me.params[0] = accessC.getClass();
            break;
          case "initializeRights":
            me.params[3] = ixConnect;
            break;
          case "ixExecutesBackgroundJobsSynchronous":
            me.params[0] = ixConnect;
            break;
          case "getAccessCode":
          case "getAccessRights":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common.Template":
        switch (me.method) {
          case "registerCustomHelper":
            me.params = [];
            me.params.push("hello");
            me.params.push(function (config) {
              return "hello " + arguments[0];
            });
            break;
          default:
        }
        break;
      case "sol.common.TemplateRegexUtils":
        switch (me.method) {
          case "extract":
            me.params[1] = new RegExp(me.params[1]);
            break;
          default:
        }
        break;
      case "sol.common.FileUtils":
        switch (me.method) {
          case "copyFile":
            new File(me.params[0]).createNewFile();
            if (new File(me.params[1]).exists()) {
              new File(me.params[1]).delete();
            }
            me.params[0] = new File(me.params[0]);
            me.params[1] = new File(me.params[1]);
            break;
          case "getExtension":
          case "getName":
          case "makeDirectories":
            me.params[0] = new File(me.params[0]);
            break;
          case "loadToFileData":
          case "readConfig":
          case "readFileToObject":
          case "readFileToString":
            new File(me.params[0]).createNewFile();
            cls.writeConfigToFile(me.params[0], { aa: "aa", bb: "bb" });
            break;
          case "readManifestFile":
            new File(me.params[0]).createNewFile();
            cls.writeStringToFile(me.params[0], "Manifest-Version: 1.0");
            break;
          case "rename":
            path = me.params[0].split("/");
            dir = path[0];
            file = path[1];
            cls.delete(dir, { quietly: true });
            file = new File(me.params[0]);
            dir = new File(dir);
            if (dir.mkdir()) {
              file.createNewFile();
            }
            break;
          case "saveFileData":
            new File(me.params[1]).createNewFile();
            cls.writeConfigToFile(me.params[1], { aa: "aa", bb: "bb" });
            fileData = cls.loadToFileData(me.params[1]);
            me.params[0] = fileData;
            break;
          case "writeConfigToFile":
          case "writeStringArrayToFile":
          case "writeStringToFile":
            new File(me.params[0]).createNewFile();
            break;
          case "writeObjectToFile":
            new File(me.params[1]).createNewFile();
            break;
          default:
        }
        break;
      case "sol.common.HttpUtils":
        switch (me.method) {
          case "convertByteArrayToString":
            bytes = [];
            for (i = 0; i < me.params[0].length; i++) {
              string = me.params[0][i];
              byte = java.lang.Byte.parseByte(string);
              bytes.push(byte);
            }
            me.params[0] = bytes;
            break;
          case "inputStreamToString":
            sol.common.FileUtils.writeStringToFile("File1.txt", me.params[0]);
            me.params[0] = new FileInputStream("File1.txt");
            break;
          case "logRequestProperties":
            me.params[0] = cls.prepareRequest(me.params[0], {});
            break;
          default:
        }
        break;
      case "sol.common.IniFile":
        switch (me.method) {
          case "parse":
            bytes = sol.common.RepoUtils.downloadToByteArray(me.params[0], null);
            string = new java.lang.String(bytes, "UTF-8");
            me.params[0] = string;
            break;
          default:
        }
        break;
      case "sol.common.Injection":
        switch (me.method) {
          case "initConfig":
          case "injectConfigProperty":
            me.params[1] = sol.create("sol.unittest.Injection", {});
            cls.typeOf = sol.common.ObjectUtils.type;
            break;
          case "inject":
            me.params[0] = sol.create("sol.unittest.Injection", {});
            break;
          case "injectConfig":
            me.params[2] = sol.create("sol.unittest.mixins.Configuration", {});
            cls.typeOf = sol.common.ObjectUtils.type;
            break;
          case "injectFromThis":
          case "performInjection":
            me.params[2] = sol.create("sol.unittest.Injection", {});
            cls.typeOf = sol.common.ObjectUtils.type;
            break;
          case "injectJSON":
            me.params[2] = sol.create("sol.unittest.InjectionJson", {});
            cls.typeOf = sol.common.ObjectUtils.type;
            break;
          case "injectSordById":
            me.params[2] = sol.create("sol.unittest.InjectionSord", {});
            cls.typeOf = sol.common.ObjectUtils.type;
            break;
          default:
        }
        break;
      case "sol.common.Locale":
        cls = sol.create("sol.common.Locale", { ec: me.ec });
        cls.read();
        break;
      case "sol.unittest.Map":
        cls.read();
        switch (me.method) {
          case "forEachRow":
            me.params.push(function () {});
            me.params.push(me);
            break;
          default:
        }
        break;
      case "sol.common.MapTable":
        if (cls.hasNextRow()) {
          cls.nextRow();
        }
        switch (me.method) {
          case "initialize":
            me.params[0].map = sordMap;
            break;
          default:
        }
        break;
      case "sol.common.SordMap":
        cls.read();
        switch (me.method) {
          case "forEachRow":
            me.params.push(function () {});
            me.params.push(me);
            break;
          default:
        }
        break;
      case "sol.common.WfMap":
        cls.read();
        switch (me.method) {
          case "forEachRow":
            me.params.push(function () {});
            me.params.push(me);
            break;
          default:
        }
        break;
      case "sol.common.ObjectFormatter.BaseSord":
        switch (me.method) {
          case "applyObjKeys":
            cls.build(me.classConfig.sord);
            break;
          default:
        }
        break;
      case "sol.common.ObjectFormatter.BaseTask":
        switch (me.method) {
          case "getValues":
            cls.build(me.classConfig.task);
            break;
          default:
        }
        break;
      case "sol.common.RepoUtils":
        switch (me.method) {
          case "exportRepoData":
            file = new File(me.params[0]);
            file.delete();
            me.params[0] = new File(me.params[0]);
            break;
          case "importRepoData":
            new File(me.params[0]).createNewFile();
            me.params[0] = new File(me.params[0]);
            break;
          case "findIds":
            findInfo = new FindInfo();
            findChildren = new FindChildren();
            findByType = new FindByType();
            findChildren.parentId = me.params[0];
            findChildren.mainParent = false;
            findChildren.endLevel = 1;
            findByType.typeStructures = true;
            findByType.typeDocuments = true;
            findInfo.findChildren = findChildren;
            findInfo.findByType = findByType;
            me.params[0] = findInfo;
            break;
          default:
        }
        break;
      case "sol.common.SordTypeUtils":
        switch (me.method) {
          case "buildSordType":
            fileData = sol.common.RepoUtils.downloadToFileData(me.classConfig.objId, null, me.classConfig.config);
            me.params[2] = fileData;
            me.params[3] = fileData;
            me.params[4] = fileData;
            break;
          case "createSordType":
            fileData1 = sol.common.RepoUtils.downloadToFileData(me.classConfig.objId, null, me.classConfig.config);
            fileData2 = sol.common.RepoUtils.downloadToFileData(me.classConfig.objId, null, me.classConfig.config);
            fileData3 = sol.common.RepoUtils.downloadToFileData(me.classConfig.objId, null, me.classConfig.config);
            me.params[3] = [fileData1];
            me.params[4] = [fileData2];
            me.params[5] = [fileData3];
            break;
          default:
        }
        break;
      case "sol.common.SordUtils":
        switch (me.method) {
          case "changeMask":
            return result;
          case "getDecimalSeparatorForIx":
          case "nowIsoForConnection":
            me.params[0] = ixConnect;
            break;
          case "normalizeNumber":
            me.params[2] = ixConnect;
            break;
          default:
        }
        break;
      case "sol.common.UserUtils":
        switch (me.method) {
          case "getUserIdFromTicket":
          case "getUserInfoFromTicket":
            me.params[0] = ixConnectAdmin.loginResult.clientInfo.ticket;
            return result;
          case "isMainAdminTicket":
            me.params[0] = ixConnectAdmin.loginResult.clientInfo.ticket;
            break;
          default:
        }
        break;
      case "sol.common.WfUtils":
        switch (me.method) {
          case "addSubTemplateInfo":
            wf1name = me.params[0];
            me.createWorkflowTemplate(me.params[0]);
            break;
          case "addWorkflowTemplateVersions":
          case "addWorkflowTemplateWorkingVersion":
            wf1name = me.params[0];
            wf1 = me.createWorkflowTemplate(me.params[0]);
            me.params[0] = wf1;
            wf2 = me.createWorkflowTemplate(me.params[1]);
            me.params[1] = wf2;
            break;
          case "deleteWorkflowTemplate":
            wf1 = me.createWorkflowTemplate(me.params[0]);
            me.params[0] = wf1.id;
            break;
          case "exportWorkflow":
          case "exportWorkflowTemplate":
            new File(me.params[1]).createNewFile();
            me.params[1] = new File(me.params[1]);
            break;
          case "findWorkflows":
            wfFindInfo = new FindWorkflowInfo();
            wfFindInfo.type = WFTypeC.TEMPLATE;
            me.params[0] = wfFindInfo;
            break;
          case "getFormName":
          case "getFormUrl":
            me.params[0] = cls.findFirstActiveNode(me.classConfig.objId, me.classConfig.flowId);
            break;
          case "getNextWorkflowVersionNo":
            wf1 = me.createWorkflowTemplate(me.params[0]);
            me.params[0] = wf1;
            break;
          case "importWorkflow":
            wf1name = me.params[0];
            new File(me.params[1]).createNewFile();
            me.params[1] = new File(me.params[1]);
            cls.exportWorkflow(me.classConfig.workflowId, me.params[1]);
            break;
          default:
        }
        break;
      case "sol.common.DateUtils":
        switch (me.method) {
          case "diff":
            me.params[0] = new Date(2008, 5, 23);
            me.params[1] = new Date(2010, 6, 13);
            break;
          case "endOf":
            me.params[0] = cls.isoToMoment(me.params[0]);
            break;
          case "format":
            me.params[0] = new Date(2008, 5, 23);
            break;
          case "isBetween":
            me.params[0] = new Date(2008, 5, 23);
            me.params[1] = new Date(2010, 6, 13);
            me.params[2] = new Date(2009, 6, 13);
            break;
          case "momentToIso":
          case "isLastDayOfMonth":
          case "of":
            me.params[0] = cls.isoToMoment(me.params[0]);
            break;
          case "shift":
            me.params[0] = new Date(2008, 5, 23);
            break;
          default:
        }
        break;
      default:
    }

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    switch (me.className) {
      case "sol.common.AclUtils":
        switch (me.method) {
          case "addSordRights":
          case "removeSordRights":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.common.HttpUtils":
        switch (me.method) {
          case "convertStringToByteArray":
            strings = [];
            for (i = 0; i < result.length; i++) {
              string = String(result[i]);
              strings.push(string);
            }
            result = strings;
            break;
          default:
        }
        break;
      case "sol.common.RepoUtils":
        switch (me.method) {
          case "downloadToByteArray":
            strings = [];
            for (i = 0; i < result.length; i++) {
              string = String(result[i]);
              strings.push(string);
            }
            result = strings;
            break;
          default:
        }
        break;
      case "sol.common.WfUtils":
        switch (me.method) {
          case "addSubTemplateInfo":
            ixConnect.ix().deleteWorkflowTemplate(wf1name + "", "", LockC.NO);
            break;
          case "addWorkflowTemplateVersions":
          case "addWorkflowTemplateWorkingVersion":
            ixConnect.ix().deleteWorkflowTemplate(wf1name + "", "", LockC.NO);
            ixConnect.ix().deleteWorkflowTemplate(wf1name + "", "", LockC.NO);
            break;
          case "createReminder":
            strings = [];
            for (i = 0; i < result.length; i++) {
              string = String(result[i]);
              strings.push(string);
              ixConnect.ix().deleteReminders([result[i]], LockC.YES);
            }
            result = strings;
            break;
          case "getNextWorkflowVersionNo":
            ixConnect.ix().deleteWorkflowTemplate(wf1.id, 0, LockC.NO);
            break;
          case "importWorkflow":
            ixConnect.ix().deleteWorkflowTemplate(wf1name + "", "", LockC.NO);
            break;
          default:
        }
        break;
      default:
    }
    return result;
  }
});

/**
 * @member sol.unittest.ix.services.ExecuteLib
 * @method RF_sol_unittest_service_ExecuteLib
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.ExecuteLib", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

sol.define("sol.unittest.ActionBase", {
  extend: "sol.common.ActionBase",

  addActionEvent: function () {
  },

  createEvent: function () {
  },

  getName: function () {
  },

  process: function () {
  }

});

sol.define("sol.unittest.mixins.Configuration", {
  mixin: true,

  $configRelation: {
    as: "/common/Configuration/as.config",
    myOtherConfig: "/common/Configuration/mail.config"
  }
});

sol.define("sol.unittest.Injection", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.unittest.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    myConfigValue: { config: "as", prop: "serverName" },
    params: { prop: "params" }
  },

  initialize: function (params) {
    var me = this;
    this.$super("sol.common.ix.ActionBase", "initialize", [params]);
    me.params = params;
  },

  process: function () {
    var me = this;
    return me.myConfigValue;
  }
});

sol.define("sol.unittest.InjectionJson", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.common.mixins.Inject"],

  inject: {
    myJsonValue: { json: '{ "myProp": 12345123 }' },
    params: { prop: "params" }
  },

  initialize: function (params) {
    var me = this;
    this.$super("sol.common.ix.ActionBase", "initialize", [params]);
    me.params = params;
  },

  process: function () {
    var me = this;
    return me.myJsonValue;
  }
});

sol.define("sol.unittest.InjectionSord", {

  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.common.mixins.Inject"],

  inject: {
    mySordValue: { sordId: "1", flowId: "442381" },
    params: { prop: "params" }
  },

  initialize: function (params) {
    var me = this;
    this.$super("sol.common.ix.ActionBase", "initialize", [params]);
    me.params = params;
  },

  process: function () {
    var me = this;
    return me.mySordValue;
  }
});

sol.define("sol.unittest.ObjectFormatter", {

  build: function () {
    return {};
  }
});

sol.define("sol.unittest.Map", {

  extend: "sol.common.Map",

  initialize: function (config) {
    var me = this;
    if (!config.objId) {
      throw "Object ID is empty";
    }
    me.mapId = config.objId;
    me.objId = config.objId;
    if (config.asAdmin) {
      me.asAdmin = config.asAdmin;
    }
    me.mapDomain = MapDomainC.DOMAIN_SORD;
    me.$super("sol.common.Map", "initialize", [config]);
  }

});


