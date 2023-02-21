importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserProfile.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.KwlDataCollector" });

/**
 * Reads and writes user option entries
 *
 * # Example
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_common_services_ReadUserProfileOptions", {
 *       "keys": ["EloJ.S*"]
 *     });
 *
 * # Result
 *
 *     {
 *       "EloJ.S.DlgSize.Workspace.0": "0,0,200,200,6",
 *       "EloJ.S.PreviewMappingModel26": "sql:de.elo.client.eloview.preview.TextPreview:false",
 *       "EloJ.S.DlgSize.FlowDesignDialog": "80,60,1770,900,0,0,0,180,450,0,0,0,0,0,0,0,0",
 *       "EloJ.S.ClipboardBaseList.01": "",
 *       ...
 *     }
 *
 * # Example
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_common_services_WriteUserProfileOptions", {
 *       "options": {
 *         "key1": "value1",
 *         "key2": "value2"
 *       }
 *     });
 *
 * @author ELO Digital Office GmbH
 * @version 1.07.000
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.UserProfileOptions", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.ec = config.ec;

    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  read: function () {
    var me = this,
        userId, userProfile, options;

    userId = ixConnect.loginResult.user.id;

    userProfile = sol.create("sol.common.UserProfile", {
      userId: userId
    });

    options = userProfile.read({ keys: me.keys });

    return options;
  },

  write: function () {
    var me = this,
        userId, userProfile, key, value;

    userId = ixConnect.loginResult.user.id;

    userProfile = sol.create("sol.common.UserProfile", {
      userId: userId
    });

    if (!me.options) {
      return;
    }

    for (key in me.options) {
      value = me.options[key];
      userProfile.setOption(key, value);
    }

    userProfile.write();
  }
});

/**
 * @member sol.common.ix.services.UserProfileOptions
 * @method RF_sol_common_services_ReadUserProfileOptions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_ReadUserProfileOptions(ec, configAny) {
  var config, userProfileOptions, result, resultString;

  logger.enter("RF_sol_common_services_ReadUserProfileOptions", configAny);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);

  userProfileOptions = sol.create("sol.common.ix.services.UserProfileOptions", config);
  result = userProfileOptions.read();

  logger.exit("RF_sol_common_services_ReadUserProfileOptions", result);

  resultString = JSON.stringify(result);

  return resultString;
}

/**
 * @member sol.common.ix.services.UserProfileOptions
 * @method RF_sol_common_services_WriteUserProfileOptions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_WriteUserProfileOptions(ec, configAny) {
  var config, userProfileOptions;

  logger.enter("RF_sol_common_services_ReadUserProfileOptions", configAny);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);

  userProfileOptions = sol.create("sol.common.ix.services.UserProfileOptions", config);
  userProfileOptions.write();

  logger.exit("RF_sol_common_services_ReadUserProfileOptions");
}
