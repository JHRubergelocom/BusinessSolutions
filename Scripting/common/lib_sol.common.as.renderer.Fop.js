
//@include lib_Class.js

/**
 * Rendering PDF file from a Apache FOP template.
 *
 * @author ELO Digital Office GmbH
 *
 * @eloas
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 */
sol.define("sol.common.as.renderer.Fop", {

  /**
   * @cfg {String} templateId
   * The objid of a template sord
   * which should be rendered
   * either templateContent or templateId has to be passed
   */

  /**
   * @cfg {String} templateContent
   * The template content which should be rendered
   * either templateContent or templateId has to be passed
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

  /**
   * @cfg {String} version
   * Version of the rendered document
   */

  /**
   * @cfg {String} versionComment
   * Version comment of the rendered document
   */

  /**
   * @cfg {String} versionIncrement
   * Version increment, i.g. `1` to the saved rendered document
   */

  /**
   * @cfg {Object} objKeysObj
   * Map that contains key-value pairs to the saved rendered document
   */

  /**
   * @cfg {String} ownerId
   * Owner ID to the saved rendered document
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    if (!me.objId && !me.targetId && !me.toStream) {
      throw "IllegalArgumentException: either 'targetId' or 'objId' has to defined";
    }
    if (!me.templateId && !me.templateContent) {
      throw "IllegalArgumentException: either 'templateId' or 'templateContent' has to be defined";
    }
  },

  render: function (name, data) {
    var me = this,
        result = {},
        fopFontDirFiles = [],
        pdfStream, foContent, foStream, tpl, eloAsConfig,
        fopConfig, fopFontsConfig, fopFontsAutoDetect, fopFontsDirs, i, fopFontsDir,fopFontsRepoPaths, fopFontsRepoPath, exceptionString;

    me.maskId = me.maskId || "";

    try {
      tpl = sol.create("sol.common.Template", {});
      if (me.templateContent) {
        tpl.setSource(me.templateContent);
      } else {
        tpl.load(me.templateId);
      }

      foContent = tpl.apply(data);

      me.logger.debug(["fo={0}", foContent]);

      foStream = org.apache.commons.io.IOUtils.toInputStream(foContent, "UTF-8");
      pdfStream = new ByteArrayOutputStream();

      eloAsConfig = sol.create("sol.common.Config").loadEloAsConfig(me.solutionNameForAsConfig);

      me.logger.debug(["asConfig={0}", JSON.stringify(eloAsConfig)]);
      fopConfig = eloAsConfig.fop || {};
      fopFontsConfig = fopConfig.fonts || {};
      fopFontsAutoDetect = (typeof fopFontsConfig.autoDetect == "undefined") ? true : fopFontsConfig.autoDetect;
      fopFontsDirs = fopFontsConfig.dirs || [];
      fopFontsRepoPaths = [];

      for (i = 0; i < fopFontsDirs.length; i++) {
        fopFontsDir = fopFontsDirs[i];
        if (fopFontsDir.indexOf("ARCPATH") == 0) {
          fopFontsRepoPaths.push(fopFontsDir);
        } else {
          fopFontDirFiles.push(new java.io.File(fopFontsDir));
        }
      }
      if (fopFontsRepoPaths.length > 0) {
        fopFontsRepoPath = sol.common.as.Utils.downloadFonts({ fopFontsRepoPaths: fopFontsRepoPaths });
        fopFontDirFiles.push(new java.io.File(fopFontsRepoPath));
      }

      if (me.hasMethod("de.elo.mover.main.helper.XmlHelper", "convertToPdf2")) {
        me.logger.info(["convertToPdf2: foStreamPresent={0}, pdfStreamPresent={1}, fopFontsAutoDetect={2}, fopFontDirs={3}", !!foStream, !!pdfStream, fopFontsAutoDetect, fopFontDirFiles]);
        Packages.de.elo.mover.main.helper.XmlHelper.convertToPdf2(foStream, pdfStream, fopFontsAutoDetect, fopFontDirFiles);
      } else {
        me.logger.info(["convertToPdf: foStreamPresent={0}, pdfStreamPresent={1}", !!foStream, !!pdfStream]);
        Packages.de.elo.mover.main.helper.XmlHelper.convertToPdf(foStream, pdfStream);
      }

      if (me.toStream) {
        result.outputStream = pdfStream;
      }

      if (me.objId) {
        result.objId = sol.common.RepoUtils.saveToRepo({
          objId: me.objId,
          extension: "pdf",
          outputStream: pdfStream,
          version: me.version,
          versionComment: me.versionComment,
          versionIncrement: me.versionIncrement,
          objKeysObj: me.objKeysObj,
          ownerId: me.ownerId
        });
      }

      if (me.targetId) {
        sol.common.RepoUtils.preparePath(me.targetId);
        result.objId = sol.common.RepoUtils.saveToRepo({
          name: name,
          parentId: me.targetId,
          maskId: me.maskId,
          extension: "pdf",
          outputStream: pdfStream,
          version: me.version,
          versionComment: me.versionComment,
          objKeysObj: me.objKeysObj,
          ownerId: me.ownerId
        });
      }
    } catch (ex) {
      exceptionString = sol.common.ExceptionUtils.parseException(ex);
      me.logger.error(["error rendering report '{0}' (templateId='{1}')", name, me.templateId], exceptionString);
    } finally {
      if (foStream) {
        foStream.close();
      }
      if (pdfStream) {
        pdfStream.close();
      }
    }
    return result;
  },

  /**
   * @private
   * Checks wether a method exists
   * @param clazz Class
   * @param methodName Method name
   */
  hasMethod: function (className, methodName) {
    var methods, clazz, methodExists;

    if (!className) {
      throw "Class name is missing";
    }

    if (!methodName) {
      throw "Method name is missing";
    }

    clazz = java.lang.Class.forName(className);

    methods = clazz.declaredMethods;

    methodExists = methods.some(function (method) {
      return (method.name == methodName);
    });

    return methodExists;
  }
});