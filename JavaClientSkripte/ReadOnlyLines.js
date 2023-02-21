importPackage(Packages.java.awt);
importPackage(Packages.java.net);
importPackage(Packages.org.apache.commons.codec.net);

function eloIndexDialogSetDocMask(){
  addButton();
  checkInvoice();
}

function eloIndexDialogObjKey0Exit() {
  checkInvoice();
}

function checkInvoice() {
  if (indexDialog.docMaskName == "Rechnung") {
    var invoiceNo = indexDialog.getObjKeyValue(0);
    var invAvail = invoiceNo != "";

    var key = indexDialog.getObjKey(1);
    key.enabled = invAvail;

    key = indexDialog.getObjKey(3);
    key.enabled = invAvail;
    
    key = indexDialog.getObjKey(4);
    key.visible = invAvail;
    key.labelVisible = invAvail;
  }
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

function enableFields(){
  if ( indexDialog.getDocMaskName().equals("Freie Eingabe") ) {
    indexDialog.addLabel( 1,1,4,13,"Skripting" ); // 4 ist erste Zeile
    indexDialog.addTextField( 1,14,4,53 ); // 14,53 volle Breite
  } else if ( indexDialog.getDocMaskName().equals("Barcode") ) {
    indexField2 = indexDialog.getObjKey( 1 );
    indexField2.setVisible( false );
  }
}


