
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js
//@include lib_sol.common.ActionBase.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
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
        i, bytes, byte, string, strings,
        service, sordMap;


    if (me.className == "sol.common.MapTable") {
      sordMap = sol.create("sol.common.SordMap", { objId: me.classConfig.objId });
      me.classConfig.map = sordMap;
    }

    if (me.className == "sol.common.mixins.Inject") {
      return result;
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    if (me.className == "sol.common.Template") {
      if (me.method == "registerCustomHelper") {
        cls.registerCustomHelper("hello", function (config) {
          return "hello " + arguments[0];
        });
        return result;
      }
    }

    if (me.className == "sol.common.FileUtils") {
      if (me.method == "copyFile") {
        new File(me.params[0]).createNewFile();
        result = cls.copyFile(new File(me.params[0]), new File(me.params[1]));
        return result;
      }
      if (me.method == "getExtension") {
        result = cls.getExtension(new File(me.params[0]));
        return result;
      }
      if (me.method == "getName") {
        result = cls.getName(new File(me.params[0]));
        return result;
      }
      if (me.method == "loadToFileData") {
        new File(me.params[0]).createNewFile();
        cls.writeConfigToFile(me.params[0], { aa: "aa", bb: "bb" });
      }
      if (me.method == "makeDirectories") {
        result = cls.makeDirectories(new File(me.params[0]));
        return result;
      }
      if (me.method == "readConfig") {
        new File(me.params[0]).createNewFile();
        cls.writeConfigToFile(me.params[0], { aa: "aa", bb: "bb" });
      }
      if (me.method == "readFileToObject") {
        new File(me.params[0]).createNewFile();
        cls.writeConfigToFile(me.params[0], { aa: "aa", bb: "bb" });
      }
      if (me.method == "readFileToString") {
        new File(me.params[0]).createNewFile();
        cls.writeConfigToFile(me.params[0], { aa: "aa", bb: "bb" });
      }
      if (me.method == "readManifestFile") {
        new File(me.params[0]).createNewFile();
        cls.writeStringToFile(me.params[0], "Manifest-Version: 1.0");
      }
      if (me.method == "rename") {
        path = me.params[0].split("/");
        dir = path[0];
        file = path[1];
        cls.delete(dir, { quietly: true });
        file = new File(me.params[0]);
        dir = new File(dir);
        if (dir.mkdir()) {
          file.createNewFile();
        }
      }
      if (me.method == "saveFileData") {
        new File(me.params[1]).createNewFile();
        cls.writeConfigToFile(me.params[1], { aa: "aa", bb: "bb" });
        fileData = cls.loadToFileData(me.params[1]);
        me.params[0] = fileData;
      }
      if (me.method == "writeConfigToFile") {
        new File(me.params[0]).createNewFile();
      }
      if (me.method == "writeObjectToFile") {
        new File(me.params[1]).createNewFile();
      }
      if (me.method == "writeStringArrayToFile") {
        new File(me.params[0]).createNewFile();
      }
      if (me.method == "writeStringToFile") {
        new File(me.params[0]).createNewFile();
      }
    }

    if (me.className == "sol.common.HttpUtils") {
      if (me.method == "convertByteArrayToString") {
        bytes = [];
        for (i = 0; i < me.params[0].length; i++) {
          string = me.params[0][i];
          byte = java.lang.Byte.parseByte(string);
          bytes.push(byte);
        }
        result = cls.convertByteArrayToString(bytes);
        return result;
      }
      if (me.method == "convertStringToByteArray") {
        result = cls.convertStringToByteArray(me.params[0]);
        strings = [];
        for (i = 0; i < result.length; i++) {
          string = String(result[i]);
          strings.push(string);
        }
        result = strings;
        return result;
      }
      if (me.method == "inputStreamToString") {
        sol.common.FileUtils.writeStringToFile("File1.txt", me.params[0]);
        me.params[0] = new FileInputStream("File1.txt");
      }
      if (me.method == "logRequestProperties") {
        me.params[0] = cls.prepareRequest(me.params[0], {});
      }
    }

    if (me.className == "sol.common.IniFile") {
      if (me.method == "parse") {
        bytes = sol.common.RepoUtils.downloadToByteArray(me.params[0], null);
        string = new java.lang.String(bytes, "UTF-8");
        me.params[0] = string;
      }
    }

    if (me.className == "sol.common.Injection") {
      if (me.method == "inject") {
        service = sol.create("sol.unittest.Injection", {});
        result = service.process();
        return result;
      }
      if (me.method == "injectJSON") {
        service = sol.create("sol.unittest.InjectionJson", {});
        result = service.process();
        return result;
      }
      if (me.method == "injectSordById") {
        service = sol.create("sol.unittest.InjectionSord", {});
        result = service.process();
        return result;
      }
    }

    if (me.className == "sol.common.Locale") {
      cls = sol.create("sol.common.Locale", { ec: me.ec });
      cls.read();
    }

    if (me.className == "sol.common.MapTable") {
      if (cls.hasNextRow()) {
        cls.nextRow();
      }
    }

    if (me.className == "sol.common.SordMap") {
      cls.read();
      if (me.method == "forEachRow") {
        cls.forEachRow(me.params[0], function () {}, me);
        return result;
      }
    }

    if (me.className == "sol.common.WfMap") {
      cls.read();
      if (me.method == "forEachRow") {
        cls.forEachRow(me.params[0], function () {}, me);
        return result;
      }
    }

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
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
