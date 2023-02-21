function getScriptButton1Name() {
  return "Hello";
}

function eloScriptButton1Start(){
  var view = workspace.activeView;
  var item = view.firstSelected;
  var itemSord = item.loadSord();
  var parentId = itemSord.parentId;
  var parentItem = archive.getElement(parentId);

  itemSord.name = "Nachfolger von " + parentItem.name;

  item.setSord(itemSord);
}

function getScriptButtonPositions() {
  return "1,home,view";
}
