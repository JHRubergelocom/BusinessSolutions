importPackage(Packages.de.elo.client);
importPackage(Packages.de.elo.ix.client);

function eloOcrWordClicked() {
  var word = preview.clickedOcrWord;
  var value = parseInt(word);
  if (!isNaN(value) && (value >= 10000) && (value < 20000)) {
    workspace.setFeedbackMessage(word);
    var view = searchViews.addSearchView("Kundensuche " + word);
    var findInfo = view.createFindInfoByFulltext(word, null);
    view.search(findInfo);
  }
}