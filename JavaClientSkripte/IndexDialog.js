importPackage(Packages.de.elo.ix.client);

function eloIndexDialogNameEnter() {
  buildName();
}

function eloIndexDialogObjKeyExit() {
  buildName();
}

function buildName() {
  if (indexDialog.docMaskId == 2) {
    // Email Maske
    var name = "Mail von " + indexDialog.getObjKeyValue("ELOOUTL1") +
               " an " + indexDialog.getObjKeyValue("ELOOUTL2");
    indexDialog.name = name;
  }
}

