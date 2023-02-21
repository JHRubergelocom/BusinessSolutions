
function NotifyCallback() {
}

var notifyCallback = new NotifyCallback();

NotifyCallback.prototype.filterTask = function(task) {
  return true;
}

NotifyCallback.prototype.beforeSend = function(text) {
  return text;
}

NotifyCallback.prototype.getTableLine = function(task) {
  return null;
}

NotifyCallback.prototype.getMailUser = function(userName) {
  return null;
}

NotifyCallback.prototype.formatMessage = function(template, node, sord, properties) {
  return null;
}

NotifyCallback.prototype.getSubject = function(node, sord, properties) {
  return null;
}

