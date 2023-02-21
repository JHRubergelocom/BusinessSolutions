

//@include lib_Class.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.ExecUtils.js

importPackage(Packages.com.jacob.com);
importPackage(Packages.com.jacob.activeX);
importPackage(Packages.com.ms.activeX);
importPackage(Packages.com.ms.com);

/**
 * Compares document versions
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @elojc
 *
 * @requires sol.common.FileUtils
 * @requires sol.common.ExecUtils
 */
sol.define("sol.dev.jc.CompareDocVersions", {

  singleton: true,

  textExtensions: ["csv", "fo", "js", "json", "properties", "txt", "html"],

  wordExtensions: ["doc", "docx"],

  execute: function (docVersionsDialog) {
    var me = this,
        versionList, sord, docVersion1, docVersion2, file1, file2, ext1, ext2;

    sord = docVersionsDialog.sord;
    versionList = docVersionsDialog.selectedDocVersions;

    if (versionList.size() != 2) {
      return 1;
    }

    docVersion1 = versionList.get(0);
    docVersion2 = versionList.get(1);

    file1 = archive.getFile(sord, docVersion1);
    file2 = archive.getFile(sord, docVersion2);

    ext1 = String(docVersion1.ext).toLowerCase();
    ext2 = String(docVersion2.ext).toLowerCase();

    if ((me.textExtensions.indexOf(ext1) > -1) && (me.textExtensions.indexOf(ext2) > -1)) {
      me.compareText(file1, file2);
      return -1;
    }

    if ((me.wordExtensions.indexOf(ext1) > -1) && (me.wordExtensions.indexOf(ext2) > -1)) {
      me.compareWord(file1, file2);
      return -1;
    }
  },

  compareText: function (file1, file2) {
    var vsCodePath, winMergePath, args;

    vsCodePath = sol.common.ExecUtils.getProgramFilesDir() + "/Microsoft VS Code/Code.exe";
    winMergePath = sol.common.ExecUtils.getProgramFilesX86Dir() + "/WinMerge/WinMergeU.exe";

    if (sol.common.FileUtils.exists(vsCodePath)) {
      args = [vsCodePath, "--diff", file2.absolutePath, file1.absolutePath];
      sol.common.ExecUtils.startProcess(args);
    } else if (sol.common.FileUtils.exists(winMergePath)) {
      args = [winMergePath, "/e", "/s", "/u", "/wl", "/wr", file1.absolutePath, file2.absolutePath];
      sol.common.ExecUtils.startProcess(args);
    }
  },

  compareWord: function (file1, file2) {
    var word, documents, doc;

    ComThread.InitSTA();
    try {
      word = new ActiveXComponent("Word.Application");
      Dispatch.put(word, "Visible", true);

      documents = Dispatch.get(word, "Documents").toDispatch();
      doc = Dispatch.call(documents, "Open", file2.absolutePath).toDispatch();

      try {
        Dispatch.call(doc, "Unprotect");
      } catch (ex) {
        log.info("Cannot unprotect document: " + ex);
      }

      Dispatch.call(doc, "Compare", file1.absolutePath, "", 1, true, true, false, false, true);
      Dispatch.put(doc, "Saved", true);

      return true;

    } catch (ex) {
      log.info("Error comparing documents: " + ex);
    } finally {
      ComThread.Release();
    }

    return false;
  }
});

function eloDocVersionsCompareStart(docVersionsDialog) {
  return sol.dev.jc.CompareDocVersions.execute(docVersionsDialog);
}