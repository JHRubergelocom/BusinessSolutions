importPackage(Packages.java.awt);
importPackage(Packages.java.net);
importPackage(Packages.org.apache.commons.codec.net);

function eloIndexDialogSetDocMask(){
  addButton();
}

function addButton() {
  if (indexDialog.docMaskName == "Bestellung") {
    indexDialog.addButton(1, 35, 4, 12, "Kundensuche", "searchCustomer");
  }
}

function searchCustomer() {
  var name = indexDialog.getObjKeyValue(0);
  var codec = new URLCodec();
  var encodedName = codec.encode(name);
  var uri = new URI("http://www.google.de/search?q=" + encodedName)
  Desktop.desktop.browse(uri);
}

