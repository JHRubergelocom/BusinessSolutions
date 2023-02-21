importPackage(javax.mail);
importPackage(javax.mail.internet);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Represents an email
 *
 * @author ELO Digital Office GmbH
 * @version 1.07.000
 *
 * @eloas
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.ObjectUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.ObjectFormatter
 *
 * The SMTP configuration is read from
 *   /Administration/Business Solutions Custom/common/Configuration/mail.config
 *
 * # SMTP sample configuration:
 *     {
 *        "smtpHost": "smtp.elo.local"
 *     }
 *
 * # Examples of the property 'to':
 *
 *   - "to": "user@domain.com"
 *     Send the email to the email adress "user@domain.com"
 *
 *   - "to": { type: "GRP", key: "CONTRACT_RESPONSIBLE" }
 *     Take the user or email adress from the index field "CONTRACT_RESPONSIBLE"
 *
 *   - "to": { type: "MAP", key: "USER" }
 *     Take the user or email adress from the map field "USER"
 *
 *   - "to": { type: "WFMAP", key: "USER" }
 *     Take the user or email adress from the workflow map field "USER"
 *
 *   - "to": { type: "CURRENT" }
 *     Send the email to the current node user
 *
 *   - "to": { type: "NEXT", key: "USER" }
 *     Send the email to the user of the next person node
 *
 *   - "to": { type: "WFOWNER" }
 *     Send the email to the workflow owner
 *
 *   - "to": { type: "SORDOWNER" }
 *     Send the email to the object owner
 *
 * If a field contains a "@" char, it's interpreted as an email address, otherwise it is
 * interpreted as an ELO user and the email adress will be retrieved from the user
 * profile.
 *
 */

/**
 * This class allows sending E-Mails by using templates that are stored in the ELO repository.
 */
sol.define("sol.common.Mail", {

  /**
   * @cfg {String} smtpHost
   * SMTP host
   */

  /**
   * @cfg {String} from
   * Sender
   */

  /**
   * @cfg {String} to
   * Recipients
   */

  /**
   * @cfg {String} cc
   * Carbon copy recipients
   */

  /**
   * @cfg {String} bcc
   * Blind carbon copy recipients
   */

  /**
   * @cfg {String} subject
   * Subject
   * Templating can be used, e.g. {{sord.name}}
   */

  /**
   * @cfg {Object} body
   * Body configuration
   *
   * @cfg {Object} body.type
   * Body type "html" or "text". Default is "text"
   *
   * @cfg {Object} body.tplObjId
   * Object ID of the body template
   */

  /**
   * @cfg {Object} data
   * This Object will be provided for the template processing.
   */

  /**
   * @cfg {String} objId
   * The data of this sord object will be provided for the template processing.
   */

  /**
   * @cfg {String} flowId
   * The data of this workflow will be provided for the template processing.
   */

  /**
   * @cfg {String} nodeId
   * The data of this workflow node will be provided for the template processing.
   */

  /**
   * @cfg {String} user
   * SMTP user
   */

  /**
   * @cfg {String} password
   * SMTP password
   */

  /**
   * @cfg {Boolean} useSsl
   * Use SSL
   */

  /**
   * @cfg {Boolean} useStartTls
   * Use STARTTLS
   */

  /**
   * @cfg {Boolean} trustAllHosts
   * Trust all hosts
   */

  /**
   * @cfg {Boolean} passwordEncrypted
   * password is encrypted
   */

  /**
   * @cfg {Boolean} debug
   * True if the SMTP debug information should be written into the log
   */

  /**
   * @cfg {Array} atts
   * Attachments
   *
   * # Example:
   *     "atts": [{"objId": "4309"},
   *              {"objId": "4309", "convertToPdf": true}]
   */

  /**
   * @cfg {Boolean} noWorkflowInfo
   * If true, the workflow information will not be loaded
   */

  /**
   * @cfg {Number} smtpTimeout
   * SMTP timeout
   */

  /**
   * @cfg {Number} smtpConnectionTimeout
   * SMTP connection timeout
   */

  /**
   * @cfg {Number} smtpWriteTimeout
   * SMTP write timeout
   */

  /**
   * @private
   * @param {Object} config Configuration
   */
  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me.logger.debug("config={{object}}", config);
  },

  /**
   * @private
   * Transfers the properties of the given configs into the current context
   * @param {Array} configs Configuations
   */
  transferConfigs: function () {
    var me = this,
        config, prop, i;
    for (i = 0; i < arguments.length; i++) {
      config = arguments[i];
      for (prop in config) {
        me[prop] = config[prop];
      }
    }
  },
  /**
   * @private
   * Initiates a SMTP session
   */
  initSession: function () {
    var me = this,
        socketFactory, props = new java.util.Properties(),
        authenticator = null,
        mailConfig;

    if (!me.smtpHost) {
      if (me.solutionNameForAsConfig) {
        mailConfig = me.loadMailConfig("/Administration/Business Solutions/" + me.solutionNameForAsConfig + "/Configuration/mail.config");
      }
      if (!mailConfig) {
        mailConfig = me.loadMailConfig("/Administration/Business Solutions/common/Configuration/mail.config");
      }
    }

    mailConfig = mailConfig || {};

    me.smtpHost = me.smtpHost || mailConfig.smtpHost;
    me.port = me.port || mailConfig.port;
    me.user = me.user || mailConfig.user;
    me.password = me.password || mailConfig.password;
    me.useSsl = (typeof me.useSsl != "undefined") ? me.useSsl : mailConfig.useSsl;
    me.useStartTls = (typeof me.useStartTls != "undefined") ? me.useStartTls : mailConfig.useStartTls;

    me.smtpTimeout = (me.smtpTimeout || mailConfig.smtpTimeout || 30000) + "";
    me.smtpConnectionTimeout = (me.smtpConnectionTimeout || mailConfig.smtpConnectionTimeout || 30000) + "";
    me.smtpWriteTimeout = (me.smtpWriteTimeout || mailConfig.smtpWriteTimeout || 30000) + "";

    me.trustAllHosts = (typeof me.trustAllHosts != "undefined") ? me.trustAllHosts : mailConfig.trustAllHosts;
    me.trustAllHosts = (typeof me.trustAllHosts != "undefined") ? me.trustAllHosts : true;

    me.passwordEncrypted = (typeof me.passwordEncrypted != "undefined") ? me.passwordEncrypted : mailConfig.passwordEncrypted;

    if (!me.smtpHost) {
      throw "SMTP host must be set.";
    }
    props.put("mail.smtp.host", me.smtpHost);
    props.put("mail.smtp.localhost", java.net.InetAddress.localHost.hostName);
    if (me.password) {
      props.put("mail.smtp.auth", "true");
      authenticator = new javax.mail.Authenticator(me);
    }
    if (me.useSsl || me.useStartTls) {
      if (me.useSsl) {
        me.port = me.port || "465";
        props.put("mail.smtp.ssl.enable", "true");
      } else {
        me.port = me.port || "587";
        props.put("mail.smtp.starttls.enable", "true");
      }
      if (me.trustAllHosts) {
        socketFactory = new Packages.com.sun.mail.util.MailSSLSocketFactory();
        socketFactory.trustAllHosts = true;
        props.put("mail.smtp.ssl.socketFactory", socketFactory);
      }
    } else {
      me.port = me.port || "25";
    }

    props.put("mail.smtp.port", me.port);

    props.put("mail.smtp.timeout", me.smtpTimeout);
    props.put("mail.smtp.connectiontimeout", me.smtpConnectionTimeout);
    props.put("mail.smtp.writetimeout", me.smtpWriteTimeout);

    me.logger.debug("Start SMTP session: " + props);
    me.session = javax.mail.Session.getInstance(props, authenticator);
    if (me.debug) {
      me.session.debug = true;
      me.outputStream = new ByteArrayOutputStream();
      me.session.setDebugOut(new PrintStream(me.outputStream));
    }
  },

  /**
   * Loads the mail configuration
   * @param {String} repoPath
   * @return {Object} Mail configuration
   */
  loadMailConfig: function (repoPath) {
    var conn, objId, config;

    conn = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;

    objId = sol.common.RepoUtils.getObjId(repoPath);

    if (!objId) {
      return;
    }

    config = sol.create("sol.common.Config", { compose: objId, connection: conn }).config;

    return config;
  },

  /**
   * @private
   * Retrieves the data that is provided for templating
   */
  getData: function () {
    var me = this,
        wfDiagram;

    me.body = me.body || {};
    me.data = me.data || me.body.data || {};

    if (me.objId) {
      me.sord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbSord, LockC.NO).sord;
      me.data.sord = sol.common.SordUtils.getTemplateSord(me.sord).sord;
    }

    if (me.flowId && me.nodeId && !me.noWorkflowInfo) {
      wfDiagram = me.getWorkflow();
      me.data.node = sol.common.WfUtils.getTemplateWfDiagramNode(wfDiagram, String(me.nodeId)).node;
    }
  },


  getValue: function (def) {
    var me = this,
        value, wfDiagram, wfNode, successorNodes;

    if (!def) {
      return "";
    }

    if (sol.common.ObjectUtils.isObject(def)) {
      if (!def.type) {
        throw "to.type is empty";
      }

      me.logger.debug("valueConfig=" + JSON.stringify(def));

      switch (String(def.type).toUpperCase()) {

        case "GRP":
          me.checkKey(def);
          value = sol.common.SordUtils.getValue(me.sord, def);
          break;

        case "MAP":
          me.checkKey(def);
          value = sol.common.SordUtils.getValue(me.sord, def);
          break;

        case "SORDOWNER":
          value = me.sord.ownerName;
          break;

        case "WFMAP":
          me.checkKey(def);
          me.checkWorkflowProps();
          value = sol.common.WfUtils.getWfMapValue(me.flowId, def.key);
          break;

        case "CURRENT":
          wfDiagram = me.getWorkflow();
          wfNode = sol.common.WfUtils.getNode(wfDiagram, me.nodeId);
          if (wfNode) {
            value = wfNode.userName;
          } else {
            me.logger.warn(["Can't determinate workflow node: flowId={0}, nodeId={1}", wfDiagram.id, me.nodeId]);
          }
          break;

        case "NEXT":
          wfDiagram = me.getWorkflow();
          successorNodes = sol.common.WfUtils.getSuccessorNodes(wfDiagram, me.nodeId, WFNodeC.TYPE_PERSONNODE);
          if (!successorNodes || (successorNodes.length == 0)) {
            throw "No appropriate successor node found";
          }
          if (successorNodes.length > 1) {
            throw "Successor node is ambiguous";
          }
          value = successorNodes[0].userName;
          break;

        case "WFOWNER":
          wfDiagram = me.getWorkflow();
          value = wfDiagram.ownerName;
          break;

        default:
          throw "def.type=" + def.type + " is unsupported";
      }
    } else {
      value = def;
    }

    return value;
  },

  /**
   * @private
   * Retrieves the recipient of the mail
   * @param {Object|String} to Recipient definition
   * @return {String} recipient
   */
  getRecipient: function (to) {
    var me = this, recipient;

    recipient = me.getValue(to);

    if (!recipient) {
      throw "Recipient user is empty";
    }

    if (recipient.indexOf("@") == -1) {
      recipient = sol.common.UserUtils.getMailAddress(recipient);
    }

    if (!recipient) {
      throw "Recipient is empty";
    }

    return recipient;
  },

  /**
   * @private
   * Retrieves the sender of the mail
   * @param {Object|String} from Sender definition
   * @return {String} sender
   */
  getSender: function (from) {
    var me = this, sender;

    sender = me.getValue(from);

    if (!sender) {
      throw "Sender user is empty";
    }

    if (sender.indexOf("@") == -1) {
      sender = sol.common.UserUtils.getMailAddress(sender);
    }

    if (!sender) {
      throw "Sender is empty";
    }

    return sender;
  },

  /**
   * @private
   * Retrieves the subject of the mail
   * @param {Object|String} subj subject definition
   * @return {String} subject
   */
  getSubject: function (subj) {
    var me = this,
        subject, tpl;

    if (!(subject = me.getValue(subj))) {
      throw "subject is empty";
    }

    if (subject.indexOf("{{") > -1) {
      tpl = sol.create("sol.common.Template", { source: subject });
      subject = tpl.apply(me.data);
    }

    return subject;
  },

  /**
   * @private
   * @param {Object} to Recipient configuration
   * Checks the key value
   */
  checkKey: function (to) {
    if (!to.key) {
      throw "to.key is empty";
    }
  },

  /**
   * @private
   * Checks the me.flowId property
   */
  checkWorkflowProps: function () {
    var me = this;
    if (!me.flowId) {
      throw "flowId is empty";
    }
  },

  /**
   * @private
   * Returns the workflow diagram
   * @return {de.elo.ix.client.WFDiagram}
   */
  getWorkflow: function () {
    var me = this;

    if (!me.wfDiagram) {
      if (!me.flowId) {
        throw "flowId is empty";
      }
      if (!me.nodeId) {
        throw "nodeId is empty";
      }

      me.wfDiagram = ixConnect.ix().checkoutWorkFlow(me.flowId, WFTypeC.ACTIVE, WFDiagramC.mbAll, LockC.NO);
    }

    return me.wfDiagram;
  },

  /**
   * @private
   * @return {javax.mail.PasswordAuthentication} Authententication
   */
  getPasswordAuthentication: function () {
    var me = this,
        des, password;

    if (me.passwordEncrypted) {
      des = new Packages.de.elo.utils.sec.DesEncryption();
      password = des.decrypt(me.password);
    } else {
      password = me.password;
    }
    return new javax.mail.PasswordAuthentication(me.user, password);
  },

  /**
   * Sends an email
   */
  send: function () {
    var me = this,
        message, multiPart,
        i, attConfig, sord, attInputStream, dataSource, attPart, subject;

    if (!me.from) {
      throw "'From' is empty.";
    }
    me.initSession();
    me.getData();
    me.recipient = me.getRecipient(me.to);

    if (!me.recipient) {
      throw "Recipient is empty.";
    }

    me.cc = me.cc || "";
    me.cc && (me.recipientCc = me.getRecipient(me.cc));

    me.bcc = me.bcc || "";
    me.bcc && (me.recipientBcc = me.getRecipient(me.bcc));

    message = new MimeMessage(me.session);
    message.setFrom(new InternetAddress(me.getSender(me.from)));

    me.recipient.split(";").forEach(function (toPart) {
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(toPart));
    });
    me.recipientCc && me.recipientCc.split(";").forEach(function (ccPart) {
      message.addRecipient(Message.RecipientType.CC, new InternetAddress(ccPart));
    });
    me.recipientBcc && me.recipientBcc.split(";").forEach(function (bccPart) {
      message.addRecipient(Message.RecipientType.BCC, new InternetAddress(bccPart));
    });

    subject = me.getSubject(me.subject) || "";
    message.setSubject(subject, "UTF-8");
    multiPart = new MimeMultipart();
    me.addBody(multiPart);
    if (me.atts) {
      for (i = 0; i < me.atts.length; i++) {
        attConfig = me.atts[i];
        if (attConfig.objId == "CURRENT") {
          if (me.sord && sol.common.SordUtils.isDocument(me.sord)) {
            attConfig.objId = me.sord.id;
          } else {
            continue;
          }
        }
        me.logger.debug(["Add attachment: objId={0}", attConfig.objId]);
        sord = ixConnect.ix().checkoutSord(attConfig.objId, EditInfoC.mbSordDoc, LockC.NO).sord;
        attConfig.extension = sord.docVersion.ext;
        attInputStream = me.getAttAsStream(attConfig);
        dataSource = new javax.mail.util.ByteArrayDataSource(attInputStream, "application/octet-stream");
        attInputStream.close();
        attPart = new MimeBodyPart();
        attPart.dataHandler = new javax.activation.DataHandler(dataSource);
        attPart.fileName = sol.common.FileUtils.sanitizeFilename(sord.name) + "." + attConfig.extension;
        multiPart.addBodyPart(attPart);
      }
    }
    message.setContent(multiPart);
    me.logger.info(["Send mail: recipient={0}, subject={1}", me.recipient, me.subject]);
    Transport.send(message);

    me.logJavaMailInfo();
  },

  /**
   * @private
   * @param {javax.mail.Multipart} multiPart MultiPart
   */
  addBody: function (multiPart) {
    var me = this,
        bodyContent, template, bodyPart;
    me.body = me.body || {};
    bodyContent = me.body.content || "";
    if (me.body.tplObjId) {
      template = sol.create("sol.common.Template", {});
      template.load(me.body.tplObjId);
      bodyContent = template.apply(me.data);
    }
    bodyPart = new MimeBodyPart();
    if (me.body.type == "html") {
      bodyPart.setContent(bodyContent, "text/html; charset=utf-8");
    } else {
      bodyPart.setContent(bodyContent, "text/plain");
    }
    multiPart.addBodyPart(bodyPart);
  },

  /**
   * @private
   */
  logJavaMailInfo: function () {
    var me = this;
    if (me.debug) {
      me.logger.info(me.outputStream);
    }
  },

  /**
   * @private
   * @param {object} attConfig Attachment configuration
   * @return {java.io.InputStream} Attachment input stream
   */
  getAttAsStream: function (attConfig) {
    var officeConverter, inputStream;
    if (attConfig.objId) {
      if (attConfig.convertToPdf) {
        officeConverter = sol.create("sol.common.as.functions.OfficeConverter", {
          openFromRepo: {
            objId: attConfig.objId
          },
          saveToStream: {
            format: "pdf"
          }
        });
        if (officeConverter.isSupported(attConfig.extension)) {
          inputStream = officeConverter.execute();
          attConfig.extension = "pdf";
          return inputStream;
        }
      }
    }
    return sol.common.RepoUtils.downloadToStream(attConfig.objId);
  }
});