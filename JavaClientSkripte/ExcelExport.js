importPackage(Packages.de.elo.client);
importPackage(Packages.com.jacob.com);
importPackage(Packages.com.jacob.activeX);
importPackage(Packages.com.ms.activeX);
importPackage(Packages.com.ms.com);

function getScriptButton1Name() {
  return "Hello";
}

function getScriptButtonPositions() {
  return "1,home,view";
}


function eloScriptButton1Start(){
  exportToExcel("c:\\temp\\test.xlsx");
}

function exportToExcel(fileName) {
  ComThread.InitSTA();
  try {
    var app = new ActiveXComponent("Excel.Application");
    var workbooks = Dispatch.get(app, "Workbooks").toDispatch();
    var xdoc = Dispatch.call(workbooks, "Open", fileName).toDispatch();
    this.sheet = Dispatch.call(xdoc, "Sheets", 1).toDispatch();

    exportSearchData(sheet);

    Dispatch.call(xdoc, "Save");
    Dispatch.call(xdoc, "Close");
  } catch (e) {
    log.info("Error: " + e);
  } finally {
    ComThread.Release();
  }
}

function setCell(sheet, row, col, value, color) {
  var cell = Dispatch.call(sheet, "Cells", row, col).toDispatch();
  Dispatch.put(cell, "Value", String(value));
  if (color) {
    var interior = Dispatch.get(cell, "Interior").toDispatch();
    Dispatch.put(interior, "ColorIndex", color);
  }
}

function exportSearchData(sheet) {
  var view = workspace.activeView;
  var items = view.elements;

  var row = 3;
  while (items.hasMoreElements()) {
    var item = items.nextElement();
    processItem(sheet, row, item);

    row++;
  }
}

function processItem(sheet, row, item) {
  setCell(sheet, row, 3, item.name);
  for (var col = 0; col < 4; col++) {
    var value = item.getObjKeyValue(col);
    setCell(sheet, row, 4 + col, value);
  }
}