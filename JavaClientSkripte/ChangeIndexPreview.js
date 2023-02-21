
function eloIndexPreviewAvailable() {
  var preview = workspace.indexPreview;

  var oldMsg = preview.text;
  var newMsg = oldMsg.replace("Thiele", "****");
  newMsg = newMsg.replace("Matthias", "****");
  preview.text = newMsg;
}