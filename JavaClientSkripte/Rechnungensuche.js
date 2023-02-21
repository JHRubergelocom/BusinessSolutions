function getScriptButton1Name() {
  return "Search";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start() {
  doSearch();
}

function doSearch() {
  var view;

  var viewCount = searchViews.searchViewsCount;
  var viewList = searchViews.getSearchViews();
  for (var i = 0; i < viewCount; i++) {
    if (viewList(i).name == "Rechnungen") {
      view = viewList[i];
      break;
    }
  }
  
  if (!view) {
    view = searchViews.addSearchView("Rechnungen");
  }

  var fbi = view.createFindByIndex();
  fbi.setIDateIso("20110101...20111231");
  fbi.maskId = 8;
  var findInfo = view.createFindInfoByDate("");
  findInfo.findByIndex = fbi;
  view.search(findInfo);
}