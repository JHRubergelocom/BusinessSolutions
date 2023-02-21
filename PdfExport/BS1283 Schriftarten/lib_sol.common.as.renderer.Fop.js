
//@include lib_Class.js

/**
 * Rendering PDF file from a Apache FOP template.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 */
sol.define("sol.common.as.renderer.Fop", {

  requiredConfig: ["templateId"],

  /**
   * @cfg {String} templateId (required)
   * The template which should be rendered
   */

  /**
   * @cfg {String} targetId
   * The target folder to store the rendered document.
   * Either `targetId` or `objId` has to be defined.
   */

  /**
   * @cfg {String} objId
   * The rendered document will be saved as a version of this object
   * Either `targetId` or `objId` has to be defined.
   */

  /**
   * @cfg {String} toStream
   * If true, the renderer will return the output stream
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    if (!me.objId && !me.targetId && !me.toStream) {
      throw "IllegalArgumentException: either 'targetId' or 'objId' has to defined";
    }
  },

  render: function (name, data) {
    var me = this,
        result = {},
        pdfStream, foContent, foStream, tpl, eloAsConfig,
        fopConfig, fopFontsConfig, fopFontsAutoDetect, fopFontsDirs, fopFontsDirFiles, fontTempDir;

    me.maskId = me.maskId || "";

    try {
      tpl = sol.create("sol.common.Template", {});
      tpl.load(me.templateId);

      foContent = tpl.apply(data);

      me.logger.debug(["fo={0}", foContent]);

      foStream = org.apache.commons.io.IOUtils.toInputStream(foContent, "UTF-8");
      pdfStream = new ByteArrayOutputStream();

      eloAsConfig = sol.create("sol.common.Config").loadEloAsConfig(me.solutionNameForAsConfig);
      fopConfig = eloAsConfig.fop || {};
      fopFontsConfig = fopConfig.fonts || {};
      fopFontsAutoDetect = (typeof fopFontsConfig.autoDetect == "undefined") ? true : fopFontsConfig.autoDetect;
      fopFontsDirs = fopFontsConfig.dirs || [];
      fopFontsDirFiles = fopFontsDirs.map(function (fopFontsDir) {
        if (fopFontsDir.indexOf("ARCPATH") === 0) {
          fontTempDir = sol.common.FileUtils.getTempDirPath() + File.separator + "ELOasFonts";
          sol.common.FileUtils.downloadDocuments(fopFontsDir, fontTempDir, { makeDstDirs: true, includeReferences: true });
          fopFontsDir = fontTempDir;
        }
        return new java.io.File(fopFontsDir);
      });

      try {
        Packages.de.elo.mover.main.helper.XmlHelper.convertToPdf2(foStream, pdfStream, fopFontsAutoDetect, fopFontsDirFiles);
      } catch (ex) {
        Packages.de.elo.mover.main.helper.XmlHelper.convertToPdf(foStream, pdfStream);
      }

      if (me.toStream) {
        result.outputStream = pdfStream;
      }

      if (me.objId) {
        result.objId = sol.common.RepoUtils.saveToRepo({
          objId: me.objId,
          extension: "pdf",
          outputStream: pdfStream
        });
      }

      if (me.targetId) {
        sol.common.RepoUtils.preparePath(me.targetId);
        result.objId = sol.common.RepoUtils.saveToRepo({
          name: name,
          parentId: me.targetId,
          maskId: me.maskId,
          extension: "pdf",
          outputStream: pdfStream
        });
      }
    } catch (ex) {
      me.logger.error(["error rendering report '{0}' (templateId='{1}')", name, me.templateId], ex);
    } finally {
      if (foStream) {
        foStream.close();
      }
      if (pdfStream) {
        pdfStream.close();
      }
    }
    return result;
  }
});