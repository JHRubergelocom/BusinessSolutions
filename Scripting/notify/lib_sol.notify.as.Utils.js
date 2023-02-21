
//@include lib_Class.js

/**
 * ELO Notification Services Library methods for the ELOas.
 *
 * @author ELO Digital Office GmbH
 * @version 1.06.001
 *
 * @eloas
 *
 * @requires sol.common.Config
 * @requires sol.common.RepoUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.HttpUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.Template
 * @requires sol.common.UserProfile
 * @requires sol.common.ExceptionUtils
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
        index = 0,
        max = 100,
        u, findUserInfo, findResult, userNamesIterator;

    me.logger.enter("processAllUsers");
    me.sessionLanguage = ixConnect.loginResult.clientInfo.language;
    me.logger.debug("Save session login language: " + me.sessionLanguage);
    try {
      if (!me.notifyConfig) {
        me.notifyConfig = sol.notify.Utils.loadNotifyConfig();
        me.cfgNotifyMail = me.notifyConfig.email;
      }

      findUserInfo = new FindUserInfo();
      findUserInfo.hasNotFlags = AccessC.FLAG_NOLOGIN;
      findUserInfo.checkoutUsersZ = CheckoutUsersC.ALL_USERS_RAW;
      findResult = ixConnect.ix().findFirstUsers(findUserInfo, max);
      try {
        while (true) {
          userNamesIterator = findResult.userNames.values().iterator();
          while (userNamesIterator.hasNext()) {
            users.push(userNamesIterator.next());
          }
          if (!findResult.isMoreResults()) {
            break;
          }
          index += findResult.userNames.size();
          findResult = ixConnect.ix().findNextUsers(findResult.searchId, index, max);
        }
      } catch (ex) {
        throw ex;
      } finally {
        ixConnect.ix().findClose(findResult.searchId);
      }

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
        reportConfig = {},
        day, isWeekend;

    me.logger.enter("processUser");
    me.logger.debug("Check Settings of user: " + userId);
    try {
      reportConfig = sol.notify.Utils.readReportConfig(userId);
      if (!reportConfig.enableMail) {
        me.logger.debug("EMail report disabled by user option");
        return;
      }
      ixConnect.loginResult.clientInfo.language = reportConfig.language;
      me.logger.info("Start Process User Items of user: " + userId);
      if (!reportConfig.withWeekend) {
        day = new Date().getDay();
        isWeekend = (day == 6) || (day == 0);
        if (isWeekend) {
          me.logger.debug("Do not send mail at weekend days");
          return;
        }
      }
      me.processNotifyMail(userId, reportConfig);
    } catch (e) {
      me.logger.warn("Error processing Notification List: " + e);
    }
    me.logger.exit("processUser");
  },

  /**
   * Creates mail to the user.
   * @param {String} userId
   * @param {Object} reportConfig
   */
  processNotifyMail: function (userId, reportConfig) {
    var me = this,
        feedAggregation = {},
        notifyPosts = [],
        sordMaps = [],
        userPictures = [],
        sordInfo = {},
        tasksInfo, findResult, notifyTasks, index,
        data, task, tasks, i, j, comments, timeZone, utcOffset, notifyPost, comment, delayMoment;

    delayMoment = moment().add(reportConfig.delayDays, "d").endOf("d");
    reportConfig.delayDateIso = sol.common.DateUtils.momentToIso(delayMoment);

    tasksInfo = me.prepareFindTasksInfo(userId, me.cfgNotifyMail, reportConfig);
    findResult = ixConnect.ix().findFirstTasks(tasksInfo, 1000);

    notifyTasks = [];
    index = 0;
    for (;;) {
      tasks = findResult.tasks;
      me.logger.debug("Found: " + tasks.length);
      for (i = 0; i < tasks.length; i++) {
        task = tasks[i];
        if (me.processTask(task, userId, reportConfig)) {
          data = me.prepareTask(userId, task, reportConfig);
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
    if (reportConfig.newsMyElo) {
      feedAggregation = me.getFeedAggregation(userId);

      timeZone = reportConfig.timeZone || me.notifyConfig.defaultTimeZone || "Europe/Berlin";
      utcOffset = sol.common.SordUtils.getTimeZoneOffset(timeZone);

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
        notifyPost = notifyPosts[i];
        sordInfo = me.getSordInfo(notifyPosts[i].objGuid, sordMaps);
        notifyPost.text1 = me.getText(notifyPost.text, notifyPost.type, sordInfo);
        notifyPost.picture = me.getPictureUrl(notifyPost.userId, userPictures);
        notifyPost.username = me.getPictureUserName(notifyPost.userId, userPictures);
        notifyPost.sordname = sordInfo.Name;
        notifyPost.guid = sordInfo.Guid;
        notifyPost.createDate = sol.common.DateUtils.transformIsoDate(notifyPost.createDate, { asUtc: true, utcOffset: utcOffset });
        notifyPost.updateDate = sol.common.DateUtils.transformIsoDate(notifyPost.updateDate, { asUtc: true, utcOffset: utcOffset });

        if (notifyPost.type == Packages.de.elo.ix.client.feed.EActionType.Survey) {
          notifyPost.comments = [];
        }

        comments = notifyPost.comments;

        for (j = 0; j < comments.length; j++) {
          comment = comments[j];
          comment.text1 = me.getText(comment.text, comment.type);
          comment.picture = me.getPictureUrl(comment.userId, userPictures);
          comment.username = me.getPictureUserName(comment.userId, userPictures);
          comment.createDate = sol.common.DateUtils.transformIsoDate(comment.createDate, { asUtc: true, utcOffset: utcOffset });
          comment.updateDate = sol.common.DateUtils.transformIsoDate(comment.updateDate, { asUtc: true, utcOffset: utcOffset });
        }
      }
    }

    me.sendNotifyMail(userId, notifyTasks, notifyPosts, reportConfig);
  },

  /**
   * Prepares find task infos.
   * @param {String} userId User ID
   * @param {Object} notifyConfig Notify configuration
   * @param {Boolean} reportConfig Report configuration
   * @return {Object} tasksInfo
   */
  prepareFindTasksInfo: function (userId, notifyConfig, reportConfig) {
    var tasksInfo, reportEndMoment, reportEndDateIso;

    reportEndMoment = moment().add(reportConfig.reportEndDays, "d").endOf("d");
    reportEndDateIso = sol.common.DateUtils.momentToIso(reportEndMoment);

    tasksInfo = new FindTasksInfo();

    tasksInfo.endDateIso = reportEndDateIso;

    tasksInfo.inclDeputy = reportConfig.withDeputies;
    tasksInfo.inclGroup = reportConfig.withGroups;
    tasksInfo.inclWorkflows = true;
    tasksInfo.inclOverTimeForSuperior = true;
    tasksInfo.lowestPriority = UserTaskPriorityC.LOWEST;
    tasksInfo.highestPriority = UserTaskPriorityC.HIGHEST;
    tasksInfo.userIds = [userId];

    if (notifyConfig.withIndex) {
      tasksInfo.sordZ = SordC.mbAllIndex;
    }
    return tasksInfo;
  },

  /**
   * Process task.
   * @param {Object} task
   * @param {String} userId
   * @param {Object} reportConfig
   * @return {Boolean} flags if processing task successful
   */
  processTask: function (task, userId, reportConfig) {
    var me = this,
        wfNode, mapKey, values, data, item, nodeDelayDateIso;

    wfNode = task.wfNode;

    me.logger.debug(wfNode.nodeName);

    nodeDelayDateIso = wfNode.userDelayDateIso + "";

    if (nodeDelayDateIso && (nodeDelayDateIso > reportConfig.delayDateIso)) {
      me.logger.debug(["Task was postponed: flowId={0}, nodeId={1}, delayDays={2}, until={3}", wfNode.flowId, wfNode.nodeId, reportConfig.delayDays || 0, nodeDelayDateIso]);
      return false;
    }

    if (reportConfig.onlyOnce) {

      mapKey = "NOTIFY_SENT_" + wfNode.nodeId + "_" + userId;
      values = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, wfNode.flowId, [mapKey], LockC.NO);
      if (values && values.items.length > 0) {
        data = values.items[0].value;
        if (data == "sent") {
          me.logger.info(["Sent entry ignored: userId={0}, flowId={1}, mapKey={2} (nodeId, userId)", userId, wfNode.flowId, mapKey]);
          return false;
        }
      }
      item = new KeyValue();
      item.key = mapKey;
      item.value = "sent";
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, wfNode.flowId, wfNode.objId, [item], LockC.NO);
      me.logger.info(["Sent entry marked: userId={0}, flowId={1}, mapKey={2} (nodeId, userId)", userId, wfNode.flowId, mapKey]);
    }
    return true;
  },

  /**
   * Prepare task.
   * @param {String} userId
   * @param {Object} task
   * @param {Object} reportConfig
   * @return {Object}
   */
  prepareTask: function (userId, task, reportConfig) {
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
   * @param {Object} reportConfig
   */
  sendNotifyMail: function (userId, notifyTasks, notifyPosts, reportConfig) {
    var me = this,
        htmlReport, mailAddress, sendMail, templateNotification, userName, notificationCount, subjectTemplate,
        titleReport, tpl, notifyEmpty, notifyConfig, solutionNameForAsConfig;

    me.logger.enter("sendNotifyMail");

    notifyConfig = sol.notify.Utils.loadNotifyConfig();

    if ((notifyTasks.length > 0) || (notifyPosts.length > 0) || reportConfig.sendAlways) {
      me.logger.debug("notifyTasks Amount: " + notifyTasks.length);
      me.logger.debug("notifyPosts Amount: " + notifyPosts.length);

      mailAddress = me.getMailAddress(userId);
      userName = me.getUserName(userId);
      notificationCount = notifyTasks.length + notifyPosts.length;

      if (notificationCount > 0) {
        subjectTemplate = me.cfgNotifyMail.subject;
      } else {
        subjectTemplate = me.cfgNotifyMail.subjectNoEntries;
      }

      tpl = sol.create("sol.common.Template", { source: subjectTemplate });
      titleReport = tpl.apply({ userName: userName, notificationCount: notificationCount });

      me.logger.debug("Send to Address: " + mailAddress);
      templateNotification = notifyConfig.mailTemplates.tasks;
      notifyEmpty = (notifyTasks.length == 0 && notifyPosts.length == 0);
      if (mailAddress) {
        if (me.cfgNotifyMail.showMailBodyInDebugLog) {
          htmlReport = me.createMailNotifyBody(templateNotification, titleReport, notifyTasks, notifyPosts, notifyEmpty);
          me.logger.debug(htmlReport);
        }

        solutionNameForAsConfig = notifyConfig.email.solutionNameForAsConfig || "common";

        sendMail = sol.create("sol.common.as.functions.SendMail", {
          solutionNameForAsConfig: solutionNameForAsConfig,
          from: me.cfgNotifyMail.sender,
          to: mailAddress,
          subject: titleReport,
          body: {
            type: "html",
            tplObjId: templateNotification
          },
          data: { TitleReport: titleReport, NotifyTasks: notifyTasks, NotifyPosts: notifyPosts, NotifyEmpty: notifyEmpty },
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
   * Get Notify WF URL
   * @return {String} WF URL
   */
  getNotifyWfBaseUrl: function () {
    var me = this;

    if (!me.notifyWfBaseUrl) {
      me.notifyWfBaseUrl = me.notifyConfig.wfBaseUrl || me.notifyConfig.email.wfBaseUrl || sol.common.WfUtils.getWfBaseUrl();
    }

    return me.notifyWfBaseUrl;
  },

  /**
   * Get feed aggregation
   * @param {String} userId
   * @return {Object}
   */
  getFeedAggregation: function (userId) {
    var me = this,
        responseObj, ixConnectUser, ticket, userName, today, isoDate, wfBaseUrl, startUrl,
        response, content, feedAggregationObj, exceptionText;

    userName = me.getUserName(userId);
    ixConnectUser = ixConnect.createConnectionForUser(userName);
    ticket = ixConnectUser.loginResult.clientInfo.ticket;

    me.logger.enter("createConnectionForUser", { ixConnectUser: ixConnectUser });

    today = new Date();
    today = sol.common.DateUtils.shift(today, -me.cfgNotifyMail.periodDays); // 1 Tag zurück
    isoDate = sol.common.DateUtils.dateToIso(today, { withoutTime: true });

    wfBaseUrl = me.getNotifyWfBaseUrl();

    startUrl = wfBaseUrl + "/social/api/feed/aggregation/" + isoDate + "0000";

    responseObj = sol.common.HttpUtils.sendRequest({
      url: startUrl,
      resolve: true,
      method: "get",
      contentType: "application/json;charset=UTF-8",
      trustAllHosts: true,
      trustAllCerts: true,
      params: {
        ticket: ticket,
        lang: ixConnect.loginResult.clientInfo.language + ""
      }
    });

    ixConnectUser.close();
    me.logger.exit("createConnectionForUser", ixConnectUser);

    if (responseObj.errorMessage) {
      me.logger.warn("getFeedAggregation: Can't get feed aggregation: error=" + responseObj.errorMessage + ", wfBaseUrl=" + wfBaseUrl + ", url=" + startUrl);
      return {};
    }

    try {
      response = JSON.stringify(responseObj);
      me.logger.debug("getFeedAggregation: reponse=" + response);
      content = responseObj.content;
      feedAggregationObj = JSON.parse(content);
    } catch (ex) {
      exceptionText = sol.common.ExceptionUtils.parseException(ex);
      me.logger.warn("getFeedAggregation: Can't parse feed response: exception=" + exceptionText + ", content=" + content);
      return {};
    }

    return feedAggregationObj;
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
    var me = this,
        pictureUrl = "No Picture found",
        wfBaseUrl, wfSocialUrl, i;

    wfBaseUrl = me.getNotifyWfBaseUrl();
    wfSocialUrl = wfBaseUrl + "/social";

    for (i = 0; i < userPictures.length; i++) {
      if (userPictures[i].id == userId) {
        pictureUrl = userPictures[i].picture;
        if (pictureUrl.indexOf("..") > -1) {
          pictureUrl = pictureUrl.replace("..", wfSocialUrl);
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

