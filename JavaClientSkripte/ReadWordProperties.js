// Javascript

importPackage(Packages.de.elo.client);
importPackage(Packages.java.lang);

function getScriptButton1Name() {
  return "Read Word";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start() {
  var item = workspace.getActiveView().getFirstSelected();
  try {
    processWord(item);
  } catch(e) {
    log.debug("Error processing item: " + e);
  }
}

function processWord(item) {
  var file = item.file;

  ComThread.InitSTA();
  try {
    var word = new ActiveXComponent("Word.Application");
    var documents = Dispatch.get(word, "Documents").toDispatch();
    var doc = Dispatch.call(documents, "Open", file.path).toDispatch();

    var name = readProperty(doc, "Name");
    
    var aw = Dispatch.get(doc, "ActiveWindow").toDispatch();
    Dispatch.call(aw, "Close");
    item.name = item.name + " : " + name;
    item.saveSord();
  } catch(e) {
    log.info("Error reading word properties (Vorlage): " + e);
  }
  ComThread.Release();

}

function readProperty(doc, propertyName) {
  try {
    var obj = Dispatch.call(doc, "FormFields", propertyName).toDispatch();
    var res = Dispatch.get(obj, "Result");
    return String(res);
  } catch(e) {
    log.info("Cannot read Word Property: " + propertyName + " : " + e);
    return "";
  }
}

function readProperty2(doc, propertyName) {
  try {
    var obj = Dispatch.call(doc, "FormFields", propertyName).toDispatch();
    var fieldType = Dispatch.get(obj, "Type");
    if (fieldType == 71) {
      var checkBox = Dispatch.get(obj, "CheckBox").toDispatch();
      var checked = Dispatch.get(checkBox, "Value");
      log.debug("Read checkBox [" + propertyName + "] value: " + checked);
      return (checked == "true") ? "1" : "0";
    } else {
      var res = Dispatch.get(obj, "Result");
      log.debug("Read property [" + propertyName + "] value [" + res + "]");
      return String(res);
    }
  } catch(e) {
    log.info("Cannot read Word Property: " + propertyName + " : " + e);
    return "";
  }
}
