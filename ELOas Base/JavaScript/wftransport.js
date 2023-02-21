// JavaScript Dokument
function Wftransport() {
}

var wftransport = new Wftransport();

Wftransport.prototype.beforeSend = function(wfData) {
  log.warn("Skriptaufruf beforeSend");
  log.warn(wfData);
  wfData.remoteWfObjId = "(E4246684-9E37-B835-0E4A-D9D4FC0AC214)";
}

Wftransport.prototype.afterReturn = function(wfData) {
  log.warn("Skriptaufruf afterReturn");
  log.warn(wfData);
}

Wftransport.prototype.beforeReturn = function(wfData) {
  log.warn("Skriptaufruf beforeReturn");
  log.warn(wfData);
}