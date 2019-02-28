
//@include lib_Class.js

/**
 * ELO Notification Services Library methods for the ELOas.
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloas
 *
 * @requires sol.common.Config
 * @requires sol.common.RepoUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.HttpUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.Template
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.ObjectFormatter.TemplateTask
 * @requires sol.common.as.functions.SendMail
 * @requires sol.notify.Utils
 */
sol.define("sol.notify.as.Utils", {
  singleton: true,
  sessionLanguage: "en",

  /**
   * Reads the complete ELO user list and checks for notification
   */
  processAllUsers: function () {
    var me = this,
        users = [],
        u;

    me.logger.enter("processAllUsers");
    me.sessionLanguage = ixConnect.loginResult.clientInfo.language;
    me.logger.debug("Save session login language: " + me.sessionLanguage);
    try {
      if (!me.cfgNotifyMail) {
        me.cfgNotifyMail = sol.notify.Utils.loadNotifyConfig().email;
      }

      users = ixConnect.ix().checkoutUsers(null, CheckoutUsersC.ALL_USERS_RAW, LockC.NO);
      for (u = 0; u < users.length; u++) {
        me.processUser(users[u].id);
      }
    } catch (e) {
      me.logger.warn("Error processing all users: " + e);
    }
    ixConnect.loginResult.clientInfo.language = me.sessionLanguage;
    me.logger.debug("Reset session login language to: " + me.sessionLanguage);
    me.logger.exit("processAllUsers");
  },

  /**
   * Checks for the specified user whether he has logged on
   * on notification by mail and executes it.
   * @param {String} userId User to be checked
   */
  processUser: function (userId) {
    var me = this,
        configReport = {},
        day, isWeekend;

    me.logger.enter("processUser");
    me.logger.debug("Check Settings of user: " + userId);
    try {
      configReport = me.loadReportFlags(userId);
      if (!configReport.enableMail) {
        me.logger.debug("EMail report disabled by user option");
        return;
      }
      ixConnect.loginResult.clientInfo.language = me.loadUserLanguage(userId);
      me.logger.info("Start Process User Items of user: " + userId);
      if (!configReport.withWeekend) {
        day = new Date().getDay();
        isWeekend = (day == 6) || (day == 0);
        if (isWeekend) {
          me.logger.debug("Do not send mail at weekend days");
          return;
        }
      }
      me.processNotifyMail(userId, configReport);
    } catch (e) {
      me.logger.warn("Error processing Notification List: " + e);
    }
    me.logger.exit("processUser");
  },

  /**
   * Loads reporting flags for the specified user.
   * @param {String} userId
   * @return {Object} reporting flags
   */
  loadReportFlags: function (userId) {
    var me = this,
        configReport = {},
        profile = new UserProfile(),
        key = new KeyValue(),
        i, opt;

    key.key = me.cfgNotifyMail.optionKey;
    profile.options = [key];
    profile.userId = userId;
    profile = ixConnect.ix().checkoutUserProfile(profile, LockC.NO);

    if (!profile.options || (profile.options.length == 0)) {
      return false;
    }
    for (i = 0; i < profile.options.length; i++) {
      if (profile.options[i].key == me.cfgNotifyMail.optionKey) {
        opt = Number(profile.options[i].value);

        configReport.enableMail = (opt & sol.notify.Utils.flags.enableMail) != 0;
        configReport.sendAlways = (opt & sol.notify.Utils.flags.sendAlways) != 0;
        configReport.withGroups = (opt & sol.notify.Utils.flags.withGroups) != 0;
        configReport.withDeputies = (opt & sol.notify.Utils.flags.withDeputies) != 0;
        configReport.withWeekend = (opt & sol.notify.Utils.flags.withWeekend) != 0;
        configReport.onlyOnce = (opt & sol.notify.Utils.flags.onlyOnce) != 0;
        configReport.newsMyElo = (opt & sol.notify.Utils.flags.newsMyElo) != 0;

        return configReport;
      }
    }
    return {};
  },

  /**
   * Loads language for the specified user.
   * @param {String} userId
   * @return {string} user language
   */
  loadUserLanguage: function (userId) {
    var me = this,
        userProfile, language;

    userProfile = sol.create("sol.common.UserProfile", { userId: userId });
    language = userProfile.getOption(me.cfgNotifyMail.language) || me.sessionLanguage;

    return language;
  },

  /**
   * Creates mail to the user.
   * @param {String} userId
   * @param {Object} configReport
   */
  processNotifyMail: function (userId, configReport) {
    var me = this,
        feedAggregation = {},
        notifyPosts = [],
        sordMaps = [],
        userPictures = [],
        sordInfo = {},
        withGroups, withDeputies, withIndex,
        tasksInfo, findResult, notifyTasks, index,
        data, task, tasks, i, j, comments;

    withGroups = Boolean(me.cfgNotifyMail.withGroups & configReport.withGroups);
    withDeputies = Boolean(me.cfgNotifyMail.withDeputies & configReport.withDeputies);
    withIndex = Boolean(me.cfgNotifyMail.withIndex);

    // tasks
    tasksInfo = me.prepareFindTasksInfo(userId, withGroups, withDeputies, withIndex);
    findResult = ixConnect.ix().findFirstTasks(tasksInfo, 1000);

    notifyTasks = [];
    index = 0;
    for (;;) {
      tasks = findResult.tasks;
      me.logger.debug("Found: " + tasks.length);
      for (i = 0; i < tasks.length; i++) {
        task = tasks[i];
        if (me.processTask(task, configReport)) {
          data = me.prepareTask(userId, task, configReport);
          notifyTasks.push(data);
        }
      }
      if (!findResult.moreResults) {
        break;
      }
      index += tasks.length;
      findResult = ixConnect.ix().findNextTasks(findResult.searchId, index, 1000);
    }
    ixConnect.ix().findClose(findResult.searchId);

    // feed aggregation posts
    if (configReport.newsMyElo) {
      feedAggregation = me.getFeedAggregation(userId);
      notifyPosts = [];
      if (feedAggregation.posts) {
        notifyPosts = feedAggregation.posts;
      }
      userPictures = [];
      if (feedAggregation.users) {
        userPictures = me.getPictures(feedAggregation.users);
      }
      sordMaps = [];
      if (feedAggregation.sordMap) {
        sordMaps = me.getSordMap(feedAggregation.sordMap);
      }

      for (i = 0; i < notifyPosts.length; i++) {
        sordInfo = me.getSordInfo(notifyPosts[i].objGuid, sordMaps);
        notifyPosts[i].text1 = me.getText(notifyPosts[i].text, notifyPosts[i].type, sordInfo);
        notifyPosts[i].picture = me.getPictureUrl(notifyPosts[i].userId, userPictures);
        notifyPosts[i].username = me.getPictureUserName(notifyPosts[i].userId, userPictures);
        notifyPosts[i].sordname = sordInfo.Name;
        notifyPosts[i].guid = sordInfo.Guid;
        comments = notifyPosts[i].comments;
        for (j = 0; j < comments.length; j++) {
          comments[j].text1 = me.getText(comments[j].text, comments[j].type);
          comments[j].picture = me.getPictureUrl(comments[j].userId, userPictures);
          comments[j].username = me.getPictureUserName(comments[j].userId, userPictures);
        }
      }
    }

    me.sendNotifyMail(userId, notifyTasks, notifyPosts, configReport);
  },

  /**
   * Prepares find task infos.
   * @param {String} userId
   * @param {Boolean} withGroups Also include group term in the exam
   * @param {Boolean} withDeputies Also include appointments in the exam
   * @param {Boolean} withIndex The mail to be sent can also contain information about sord indexfields of the task
   * @return {Object} tasksInfo
   */
  prepareFindTasksInfo: function (userId, withGroups, withDeputies, withIndex) {
    var tasksInfo = new FindTasksInfo();

    tasksInfo.inclDeputy = withDeputies;
    tasksInfo.inclGroup = withGroups;
    tasksInfo.inclWorkflows = true;
    tasksInfo.inclOverTimeForSuperior = true;
    tasksInfo.lowestPriority = UserTaskPriorityC.LOWEST;
    tasksInfo.highestPriority = UserTaskPriorityC.HIGHEST;
    tasksInfo.userIds = [userId];

    if (withIndex) {
      tasksInfo.sordZ = SordC.mbAllIndex;
    }
    return tasksInfo;
  },

  /**
   * Process task.
   * @param {Object} task
   * @param {Object} configReport
   * @return {Boolean} flags if processing task successful
   */
  processTask: function (task, configReport) {
    var me = this,
        wfNode = task.wfNode,
        mapid, values, data, item;

    me.logger.debug(wfNode.nodeName);

    if (configReport.onlyOnce) {
      mapid = "NOTIFY_SENT_" + wfNode.nodeId;
      values = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, wfNode.flowId, [mapid], LockC.NO);
      if (values && values.items.length > 0) {
        data = values.items[0].value;
        if (data == "sent") {
          me.logger.info("Sent entry ignored: " + wfNode.flowId + " - " + wfNode.nodeId);
          return false;
        }
      }
      item = new KeyValue();
      item.key = mapid;
      item.value = "sent";
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, wfNode.flowId, wfNode.objId, [item], LockC.NO);
    }
    return true;
  },

  /**
   * Prepare task.
   * @param {String} userId
   * @param {Object} task
   * @param {Object} configReport
   * @return {Object}
   */
  prepareTask: function (userId, task, configReport) {
    var me = this,
        taskInfo = {},
        className;

    if (me.cfgNotifyMail.withIndex) {
      if (task.sord) {
        taskInfo = {
          sord: me.getTemplateSordInstance().build(task.sord),
          task: me.getTemplateTaskInstance().build(task)
        };
      }
    } else {
      taskInfo = {
        task: me.getTemplateTaskInstance().build(task)
      };
    }

    if (me.isOverTimeLimit(task.wfNode)) {
      className = "urgent";
    } else if (task.wfNode.userId != userId) {
      className = "group";
    } else {
      className = "normal";
    }
    return { className: className, taskInfo: taskInfo };
  },

  /**
   * Creates template sord.
   * @return {Object}
   */
  getTemplateSordInstance: function () {
    var me = this;
    if (!me.templateSordInstance) {
      me.templateSordInstance = sol.create("sol.common.ObjectFormatter.TemplateSord", {
      });
    }
    return me.templateSordInstance;
  },

  /**
   * Creates template task.
   * @return {Object}
   */
  getTemplateTaskInstance: function () {
    var me = this;
    if (!me.templateTaskInstance) {
      me.templateTaskInstance = sol.create("sol.common.ObjectFormatter.TemplateTask", {
        config: {
          wfKeys: ["activateDateWorkflowIso", "flowId", "flowName", "flowStatus", "nodeId", "nodeName", "objName", "timeLimitIso", "userId", "userName"]
        }
      });
    }
    return me.templateTaskInstance;
  },

  /**
   * Sends the notification mail.
   * @param {String} userId
   * @param {Object} notifyTasks
   * @param {Object} notifyPosts
   * @param {Object} configReport
   */
  sendNotifyMail: function (userId, notifyTasks, notifyPosts, configReport) {
    var me = this,
        htmlReport, mailAddress, sendMail, templateNotification, userName,
        titleReport, tpl, notifyEmpty, emptyIcon, notifyConfig;

    me.logger.enter("sendNotifyMail");

    notifyConfig = sol.notify.Utils.loadNotifyConfig();

    if ((notifyTasks.length > 0) || (notifyPosts.length > 0) || configReport.sendAlways) {
      me.logger.debug("notifyTasks Amount: " + notifyTasks.length);
      me.logger.debug("notifyPosts Amount: " + notifyPosts.length);

      mailAddress = me.getMailAddress(userId);
      userName = me.getUserName(userId);

      tpl = sol.create("sol.common.Template", { source: me.cfgNotifyMail.subject });
      titleReport = tpl.apply({ userName: userName });

      me.logger.debug("Send to Address: " + mailAddress);
      templateNotification = notifyConfig.mailTemplates.tasks;
      notifyEmpty = null;
      emptyIcon = null;
      if (notifyTasks.length == 0 && notifyPosts.length == 0) {
        notifyEmpty = true;
        emptyIcon = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/notify/Configuration/Resources/empty";
        emptyIcon = sol.common.RepoUtils.getDownloadUrl(emptyIcon, null);
      }
      if (mailAddress) {
        if (me.cfgNotifyMail.showMailBodyInDebugLog) {
          htmlReport = me.createMailNotifyBody(templateNotification, titleReport, notifyTasks, notifyPosts, notifyEmpty, emptyIcon);
          me.logger.debug(htmlReport);
        }
        sendMail = sol.create("sol.common.as.functions.SendMail", {
          solutionNameForAsConfig: "common",
          from: me.cfgNotifyMail.sender,
          to: mailAddress,
          subject: titleReport,
          body: {
            type: "html",
            tplObjId: templateNotification
          },
          data: { TitleReport: titleReport, NotifyTasks: notifyTasks, NotifyPosts: notifyPosts, NotifyEmpty: notifyEmpty, EmptyIcon: emptyIcon },
          debug: true
        });
        sendMail.execute();
      } else {
        me.logger.warn("User request without mail address: " + userId);
      }
    }
    me.logger.exit("sendNotifyMail");
  },

  /**
   * Reads the configured mail address to an ELO user
   * @param {String} userId ELO user
   * @return {string}
   */
  getMailAddress: function (userId) {
    var users = ixConnect.ix().checkoutUsers([userId], CheckoutUsersC.BY_IDS, LockC.NO);
    return users[0].userProps[1];
  },

  /**
   * Get user name
   * @param {String} userId ELO user
   * @return {string}
   */
  getUserName: function (userId) {
    var users = ixConnect.ix().checkoutUsers([userId], CheckoutUsersC.BY_IDS, LockC.NO);
    return users[0].name;
  },

  /**
   * Create HTML-Mail Body (for debugging)
   * @param {String} templateNotification
   * @param {String} titleReport
   * @param {String[]} notifyTasks
   * @param {String[]} notifyPosts
   * @param {Boolean} notifyEmpty
   * @param {String} emptyIcon
   * @return {string}
   */
  createMailNotifyBody: function (templateNotification, titleReport, notifyTasks, notifyPosts, notifyEmpty, emptyIcon) {
    var data, tpl, htmlReport;

    tpl = sol.create("sol.common.Template", {});
    tpl.load(templateNotification);
    data = {
      TitleReport: titleReport,
      NotifyTasks: notifyTasks,
      NotifyPosts: notifyPosts,
      NotifyEmpty: notifyEmpty,
      EmptyIcon: emptyIcon
    };
    htmlReport = tpl.apply(data);
    return htmlReport;
  },

  /**
   * Checks if time is over limit
   * @param {String} node
   * @return {Boolean}
   */
  isOverTimeLimit: function (node) {
    var esc, i;

    if (node.isOverTimeLimit()) {
      return true;
    }
    esc = node.timeLimitEscalations;
    for (i = 0; i < esc.length; i++) {
      if (esc[i].isOverTimeLimit()) {
        return true;
      }
    }
    return false;
  },

  /**
   * Get feed aggregation
   * @param {String} userId
   * @return {Object}
   */
  getFeedAggregation: function (userId) {
    var me = this,
        responseObj,
        ixConnectUser,
        ticket,
        userName,
        today, isoDate, startUrl;

    try {

      userName = me.getUserName(userId);
      ixConnectUser = ixConnect.createConnectionForUser(userName);
      ticket = ixConnectUser.loginResult.clientInfo.ticket;

      me.logger.enter("createConnectionForUser", { ixConnectUser: ixConnectUser });

      today = new Date();
      today = sol.common.DateUtils.shift(today, -me.cfgNotifyMail.periodDays); // 1 Tag zurück
      isoDate = sol.common.DateUtils.dateToIso(today, { withoutTime: true });

      startUrl = "{{eloWfBaseUrl}}/social/api/feed/aggregation/" + isoDate + "0000";
      responseObj = sol.common.HttpUtils.sendRequest({
        url: startUrl,
        resolve: true,
        method: "get",
        contentType: "application/json;charset=UTF-8",
        trustAllHosts: true,
        trustAllCerts: true,
        params: {
          ticket: ticket
        }
      });

      ixConnectUser.close();
      me.logger.exit("createConnectionForUser", ixConnectUser);

    } catch (ex) {
      return {};
    }

    me.logger.debug(responseObj);
    if (responseObj) {
      return JSON.parse(responseObj.content);
    } else {
      return {};
    }
  },

  /**
   * Get feed user pictures
   * @param {Object} users
   * @return {Object[]}
   */
  getPictures: function (users) {
    var userPictures = [];

    userPictures = Object.keys(users).map(function (k) {
      return users[k];
    });
    return userPictures;
  },

  /**
   * Get feed user picture url
   * @param {String} userId
   * @param {Object[]} userPictures
   * @return {String}
   */
  getPictureUrl: function (userId, userPictures) {
    var pictureUrl = "No Picture found",
        wfBaseUrl, i;

    for (i = 0; i < userPictures.length; i++) {
      if (userPictures[i].id == userId) {
        pictureUrl = userPictures[i].picture;
        if (pictureUrl.indexOf("..") > -1) {
          wfBaseUrl = sol.common.WfUtils.getWfBaseUrl();
          wfBaseUrl += "/social";
          pictureUrl = pictureUrl.replace("..", wfBaseUrl);
        }
      }
    }
    return pictureUrl;
  },

  /**
   * Get feed picture username
   * @param {String} userId
   * @param {Object[]} userPictures
   * @return {String}
   */
  getPictureUserName: function (userId, userPictures) {
    var pictureUserName = "No User found",
        i;

    for (i = 0; i < userPictures.length; i++) {
      if (userPictures[i].id == userId) {
        pictureUserName = userPictures[i].username;
      }
    }
    return pictureUserName;
  },

  /**
   * Get text
   * @param {String} text
   * @param {String} type
   * @param {Object} sordInfo
   * @return {String}
   */
  getText: function (text, type, sordInfo) {
    var tpl;

    if (type == "SordCreated") {
      if (sordInfo.Type == "FOLDER") {
        text = "{{translate 'sol.notify.as.utils.sendNotification.newFolder'}}";
      } else {
        text = "{{translate 'sol.notify.as.utils.sendNotification.newDocument'}}";
      }
      tpl = sol.create("sol.common.Template", { source: text });
      text = tpl.apply({});
    }
    return text;
  },

  /**
   * Get sord map
   * @param {Object} sordMap
   * @return {Object[]}
   */
  getSordMap: function (sordMap) {
    var sordMaps = [];

    sordMaps = Object.keys(sordMap).map(function (k) {
      return sordMap[k];
    });
    return sordMaps;
  },

  /**
   * Get sord info
   * @param {String} objGuid
   * @param {Object[]} sordMaps
   * @return {Object}
   */
  getSordInfo: function (objGuid, sordMaps) {
    var sordInfo = {},
        i;

    for (i = 0; i < sordMaps.length; i++) {
      if (sordMaps[i].guid == objGuid) {
        sordInfo.Type = sordMaps[i].type;
        sordInfo.Name = sordMaps[i].name;
        sordInfo.Guid = sordMaps[i].guid;
      }
    }
    return sordInfo;
  }

});

