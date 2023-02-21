importPackage(Packages.de.elo.ix.client);

function getScriptButton1Name() {
  return "Hello";
}

function eloScriptButton1Start(){
  var userList = archive.getUserNames(true, true);

  var allUsers = "";
  var iterator = userList.iterator();
  while (iterator.hasNext()) {
    var item = iterator.next();
    var id = item.id;
    var name = item.name;
    allUsers = allUsers + id + " : " + name + "<br>";
  }

  workspace.showInfoBox("ELO", allUsers);
}

function getScriptButtonPositions() {
  return "1,home,view";
}
