// start namespace mail
var mail = new Object();
mail = {

  connectImap_GMAIL: function () {
    log.debug("Connect Mailbox GMAIL");
    var props = new Properties();
    props.setProperty("mail.imap.host", "imap.gmail.com");
    props.setProperty("mail.imap.port", "993");
    props.setProperty("mail.imap.connectiontimeout", "5000");
    props.setProperty("mail.imap.timeout", "5000");
    props.setProperty("mail.imap.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
    props.setProperty("mail.imap.socketFactory.fallback", "false");
    props.setProperty("mail.store.protocol", "imaps");

    var session = Session.getDefaultInstance(props);
    log.debug("Get Store");
    MAIL_STORE = session.getStore("imaps");
    log.debug("Connect elojforum");
    MAIL_STORE.connect("imap.gmail.com", "abc@gmail.com", "1234");
    var folder = MAIL_STORE.getDefaultFolder();
    //MAIL_INBOX = folder.getFolder("INBOX");
    MAIL_INBOX = folder.getFolder("[Google Mail]/Gesendet");
    log.debug("Open folder");
    MAIL_INBOX.open(Folder.READ_WRITE);
    log.debug("Get Messages");
    MAIL_MESSAGES = MAIL_INBOX.getMessages();
    MAIL_DELETE_ARCHIVED = false;
  },

  finalizeImap_GMAIL: function () {
    if (MAIL_DELETE_ARCHIVED && MAIL_ALLOW_DELETE) {
      message.setFlag(Flags.Flag.SEEN, true);
    }
  },

  nextImap_GMAIL: function () {
    for (;;) {
      if (MAIL_POINTER >= MAIL_MESSAGES.length) {
        log.debug("No more Messages (" + MAIL_MESSAGES.length + ")");
        return false;
      }

      MAIL_MESSAGE = MAIL_MESSAGES[MAIL_POINTER];
      log.debug("Process Message: " + MAIL_MESSAGE.subject);
      var flags = MAIL_MESSAGE.getFlags();
      if (flags.contains(Flags.Flag.SEEN)) {
        MAIL_POINTER++;
        continue;
      }

      MAIL_ALLOW_DELETE = false;
      MAIL_POINTER++;
      return true;
    }

    return false;
  },

  setSmtpHost: function (smtpHost) {
    if (MAIL_SMTP_HOST != smtpHost) {
      MAIL_SMTP_HOST = smtpHost;
      MAIL_SESSION = undefined;
    }
  },

  startSession: function () {
    if (MAIL_SESSION == undefined) {
      var props = new Properties();
      props.put("mail.smtp.host", MAIL_SMTP_HOST);
      MAIL_SESSION = Session.getInstance(props, null);
    }
  },

  sendMail: function (addrFrom, addrTo, subject, body) {
    this.sendMailInternal(addrFrom, addrTo, subject, body, null);
  },

  sendHtmlMail: function (addrFrom, addrTo, subject, body) {
    this.sendMailInternal(addrFrom, addrTo, subject, null, body);
  },

   sendMailInternal: function (addrFrom, addrTo, subject, textBody, htmlBody) {
    mail.startSession();
    var msg = new MimeMessage(MAIL_SESSION);
    var inetFrom = new InternetAddress(addrFrom);
    msg.setFrom(inetFrom);

    var parts = addrTo.split(";");
    for (var i = 0; i < parts.length; i++) {
      var inetTo = new InternetAddress(parts[i]);
      msg.addRecipient(Message.RecipientType.TO, inetTo);
    }    
    
    msg.setSubject(subject);
    
    if (textBody) {
      msg.setText(textBody);
    }
    
    if (htmlBody) {
      msg.setContent(htmlBody, "text/html; charset=utf-8");
    }
    
    Transport.send(msg);
  },
  
  sendMailWithAttachment: function (addrFrom, addrTo, subject, body, attachId, isHtml) {
    var tempFile = fu.getTempFile(attachId);
    this.sendMailWithAttachmentFile(addrFrom, addrTo, subject, body, tempFile, isHtml);

    tempFile["delete"]();
  },
  
  sendMailWithAttachmentFile: function (addrFrom, addrTo, subject, body, file, isHtml) {
    mail.startSession();
    var msg = new MimeMessage(MAIL_SESSION);
    var inetFrom = new InternetAddress(addrFrom);
    msg.setFrom(inetFrom);

    var parts = addrTo.split(";");
    for (var i = 0; i < parts.length; i++) {
      var inetTo = new InternetAddress(parts[i]);
      msg.addRecipient(Message.RecipientType.TO, inetTo);
    }

    msg.setSubject(subject);

    var textPart = new MimeBodyPart();
    if (isHtml) {
      textPart.setContent(body, "text/html; charset=utf-8");
    } else {
      textPart.setContent(body, "text/plain");
    }

    var attachFilePart = new MimeBodyPart();
    attachFilePart.attachFile(file);

    var mp = new MimeMultipart();
    mp.addBodyPart(textPart);
    mp.addBodyPart(attachFilePart);
    msg.setContent(mp);
    Transport.send(msg);
  },

  connectImap: function (connectionName) {
    mail["connectImap_" + connectionName]();
    MAIL_POINTER = 0;
    MAIL_CONNECT_NAME = connectionName;
  },


  nextMessage: function () {
    if (mail["nextImap_" + MAIL_CONNECT_NAME]) {
      if (MAIL_POINTER > 0) {
        mail.finalizePreviousMessage(MAIL_MESSAGE);
      }

      return mail["nextImap_" + MAIL_CONNECT_NAME]();
    } else {
      // default implementation
      if (MAIL_POINTER > 0) {
        mail.finalizePreviousMessage(MAIL_MESSAGE);
      }

      if (MAIL_POINTER >= MAIL_MESSAGES.length) {
        return false;
      }

      MAIL_MESSAGE = MAIL_MESSAGES[MAIL_POINTER];
      MAIL_ALLOW_DELETE = false;
      MAIL_POINTER++;
      return true;
    }
  },

  finalizePreviousMessage: function (message) {
    if (mail["finalizeImap_" + MAIL_CONNECT_NAME]) {
      mail["finalizeImap_" + MAIL_CONNECT_NAME]();
    } else {
      if (MAIL_DELETE_ARCHIVED && MAIL_ALLOW_DELETE) {
        message.setFlag(Flags.Flag.DELETED, true);
      }
    }
  },


  closeImap: function () {
    if (mail["closeImap_" + MAIL_CONNECT_NAME]) {
      mail["closeImap_" + MAIL_CONNECT_NAME]();
    } else {
      MAIL_INBOX.close(true);
      MAIL_STORE.close();
    }
  },

  getBodyText: function (message) {
    var content = message.content;
    if (content instanceof String) {
      return content;
    } else if (content instanceof Multipart) {
      var cnt = content.getCount();
      for (var i = 0; i < cnt; i++) {
        var part = content.getBodyPart(i);
        var ct = part.contentType;
        if (ct.match("^TEXT/PLAIN") == "TEXT/PLAIN") {
          return part.content;
        }
      }
    }

    return "";
  },

  getSender: function (message) {
    var adress = message.sender;
    return adress.toString();
  },

  getRecipients: function (message, delimiter) {
    var adresses = message.allRecipients;

    var cnt = 0;
    if (adresses) {
      cnt = adresses.length;
    }
    var hasMany = cnt > 1;

    var result = "";
    for (var i = 0; i < cnt; i++) {
      if (hasMany) {
        result = result + delimiter;
      }
      result = result + adresses[i].toString();
    }

    return result;
  }

}
// end of namespace mail