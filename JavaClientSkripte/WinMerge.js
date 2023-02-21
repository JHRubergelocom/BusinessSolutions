importPackage(Packages.de.elo.client);
importPackage(Packages.java.io);


function eloDocVersionsCompareStart(){
  var dvd = dialogs.getDocVersionsDialog();
  var versions = dvd.getSelectedDocVersions();
  var dv1 = versions.get(0);
  var dv2 = versions.get(1);
  var ext1 = String(dv1.getExt()).toLowerCase();
  var ext2 = String(dv2.getExt()).toLowerCase();
  var sord = dvd.sord;
  var file1 = archive.getFile(sord, dv1);
  var file2 = archive.getFile(sord, dv2);
  if (((ext1 == "txt") || (ext1 == "js")) && ((ext2 == "txt") || (ext2 == "js"))){
    var winMergeLocations = ["C:\\Program Files (x86)\\WinMerge\\WinMergeU.exe",
                             "C:\\Program Files\\WinMerge\\WinMergeU.exe"];
    for (var i = 0; i < winMergeLocations.length; i++) {
      var check = new File(winMergeLocations[i]);
      if (check.exists()) {
        var cmd = '"' + winMergeLocations[i] + '" /e /s /u /wl /wr "' +
                  file1.path + '" "' + file2.path + '"';
        Runtime.getRuntime().exec(cmd);
        return -1;
      }
    }
  }

  return 1;
}
