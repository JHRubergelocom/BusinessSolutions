
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js
//@include lib_sol.common.ActionBase.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.AsUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.ExceptionUtils.js
//@include lib_sol.common.ExecUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Roles.js
//@include lib_sol.common.SordProvider.js

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
 * @requires  sol.common.ExceptionUtils
 * @requires  sol.common.ExecUtils
 * @requires  sol.common.FileUtils
 * @requires  sol.common.HttpUtils
 * @requires  sol.common.Injection
 * @requires  sol.common.Locale
 * @requires  sol.common.Config
 * @requires  sol.common.Template
 * @requires  sol.common.WfUtils
 * @requires  sol.common.Roles
 * @requires  sol.common.SordProvider
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
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {},
        file, dir, path, fileData, cls, func,
        i, bytes, byte, string, strings, sordMap,
        findInfo, findChildren, findByType, findDirect;

    switch (me.className) {
      case "sol.common.MapTable":
        sordMap = sol.create("sol.common.SordMap", { objId: me.classConfig.objId });
        me.classConfig.map = sordMap;
        break;
      case "sol.common.mixins.Inject":
        return result;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common.Template":
        switch (me.method) {
          case "registerCustomHelper":
            me.params = [];
            me.params.push("hello");
            me.params.push(function (config) {
              return "hello " + arguments[0];
            });
          default:
        }
        break;
      case "sol.common.FileUtils":
        switch (me.method) {
          case "copyFile":
            new File(me.params[0]).createNewFile();
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
          case "inject":
            cls = sol.create("sol.unittest.Injection", {});
            func = cls["process"];
            break;
          case "injectJSON":
            cls = sol.create("sol.unittest.InjectionJson", {});
            func = cls["process"];
            break;
          case "injectSordById":
            cls = sol.create("sol.unittest.InjectionSord", {});
            func = cls["process"];
            break;
          default:
        }
        break;
      case "sol.common.Locale":
        cls = sol.create("sol.common.Locale", { ec: me.ec });
        cls.read();
        break;
      case "sol.common.MapTable":
        if (cls.hasNextRow()) {
          cls.nextRow();
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
      case "sol.common.Roles":
        switch (me.method) {
          case "EQUALS":
          case "GT":
          case "GE":
          case "LT":
          case "LE":
          case "STARTSWITH":
            func = cls.fct[me.method];
            break;
          default:
        }
        break;
      case "sol.common.SordProvider":
        findInfo = new FindInfo();
        findChildren = new FindChildren();
        findByType = new FindByType();
        findChildren.parentId = 1;
        findChildren.mainParent = false;
        findChildren.endLevel = 1;
        findByType.typeStructures = true;
        findByType.typeDocuments = true;
        findInfo.findChildren = findChildren;
        findInfo.findByType = findByType;
        switch (me.method) {
          case "find":
          case "pageFind":
            me.params[0] = findInfo;
            me.params[3] = new SordZ();
            break;
          case "findAll":
            me.params[0] = findInfo;
            me.params[2] = new SordZ();
            break;
          case "findIds":
            me.params[0] = findInfo;
            me.params[2] = { idSordZ: new SordZ() };
            return result;
          case "formBlobsExtractor":
            return result;
          case "getAvailableTerms":
            me.params[3] = findInfo;
            break;
          case "getContextTerms":
            findInfo = new FindInfo();
            findDirect = new FindDirect();
            findDirect.query = "query1";
            findDirect.searchInMemo = true;
            findDirect.searchInFulltext = true;
            findDirect.searchInIndex = true;
            findDirect.searchInSordName = true;
            findInfo.findDirect = findDirect;
            me.params[0] = findInfo;
            return result;
          case "getSearchCriteriaQuery":
            findInfo = new FindInfo();
            findDirect = new FindDirect();
            findDirect.query = "query1";
            findDirect.searchInMemo = true;
            findDirect.searchInFulltext = true;
            findDirect.searchInIndex = true;
            findDirect.searchInSordName = true;
            findInfo.findDirect = findDirect;
            me.params[2] = findInfo;
            break;
          case "getSord":
            me.params[1] = new SordZ();
          case "performSearch":
          case "searchViaIndex":
            me.params[2] = { idSordZ: new SordZ() };
            break;
          default:
        }
      default:
    }

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    switch (me.className) {
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
      case "sol.common.SordProvider":
        switch (me.method) {
          case "buildRegEx":
            result = String(result);
            break;
          default:
        }
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

