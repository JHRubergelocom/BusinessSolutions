
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.notify.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.notify.ix.actions.ConfigureNotifications" });

/**
 * Starts the configuration of the notify module.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.RepoUtils
 * @requires sol.common.UserProfile
 * @requires sol.common.TranslateTerms
 */
sol.define("sol.notify.ix.actions.ConfigureNotifications", {
  extend: "sol.common.ix.ActionBase",

  DIALOG_ID: "d47311c6-46f0-4930-892a-42941bac3d0b",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);

    me.config = sol.notify.Utils.loadNotifyConfig();
  },

  /**
   * @inheritdoc sol.common.ix.ActionBase#getName
   */
  getName: function () {
    return "ConfigureNotifications";
  },

  /**
   * Start the notification configuration.
   */
  process: function () {
    var me = this,
        appName, title;

    appName = me.config.appName;
    title = me.getLocalizedString(ixConnect.loginResult.clientInfo.language, "sol.notify.ix.actions.dialog.title");

    me.addAppDialogEvent(appName, { title: title, dialogId: me.DIALOG_ID });
  }

});

/**
 * @member sol.notify.ix.actions.ConfigureNotifications
 * @method RF_sol_notify_action_ConfigureNotifications
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_notify_action_ConfigureNotifications(ec, configAny) {
  var config, createCompany, result;

  logger.enter("RF_sol_notify_action_ConfigureNotifications", configAny);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);

  createCompany = sol.create("sol.notify.ix.actions.ConfigureNotifications", config);
  result = createCompany.execute();

  logger.exit("RF_sol_notify_action_ConfigureNotifications", result);

  return result;
}
