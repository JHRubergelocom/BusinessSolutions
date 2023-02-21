var importNames = JavaImporter();
importNames.importPackage(java.io);
importPackage(Packages.java.io);

importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Roles.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.RepoUtils.js

//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.functions.CreateLearningFile" });

/**
 * Create a document analysis learning file. 
 * 
 * The generated learning file contains a xml learning structure with the current sord object data.
 * The document analysis will read the file and will make a diff to compare original and change file, so the document analysis can learn from that point.
 * 
 * If the DX_STATUS field has already the value 'DONE' or 'SKIPPED', then the process of creating a learning file will be skipped.
 * 
 * # Node configuration example
 *  
 *    {
 *        "templateObj" : "ARCPATH:/Administration/Business Solutions Custom/connector_dx/Configuration/Invoice/DX learn templates/Default",
 *        "formatter" : "sol.common.ObjectFormatter.TemplateSord"
 *    }
 * 
 * 
 *
 * @author MH, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.Config
 * @requires  sol.common.SordUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.Roles
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.datev.accounting.ix.functions.CreateLearningFile", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.datev.accounting.mixins.Configuration", "sol.common.mixins.Inject"],

  /**
   *  @cfg {String} templateObj (required)
   */

   /**
    * @cfg {String} formatter ObjectFormatter class to get and format data (optional). Default is {@link sol.common.ObjectFormatter.TemplateSord}
    */

  inject: {
    autoverifier: { config: "docx", prop: "autoverifier", template: false },
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.exceptStatus = config.exceptStatus || "DONE";
    me.skipStatus = config.skipStatus || 'SKIPPED';
  },

  /**
   * 
   */
  process: function(){
      var me = this, tpl, sord;

      sord = sol.common.RepoUtils.getSord(me.objId);

      if (me.shouldSkip(sord)){
         me.logger.info(["No learning file will be generated because DX_STATUS is already done or skipped"]);
         return {
           status: 'skipping'
         }
      }

      tpl = sol.create('sol.common.Template', {});
      // load data from a text file in ELO
      tpl.load(me.templateObj);

      // accessing objKey properties is difficult.
      // use sol.common.ObjectFormatter to get an easy to use sord object.
      var data = sol.common.ObjectFormatter.format({
        sord: {
          formatter: me.formatter || 'sol.common.ObjectFormatter.TemplateSord',
          data: sord
        }
      });

      try {
        var result = tpl.apply(data);
        var fileInfo = me.createFile(data, result);
        return {fileInfo: fileInfo, data: data, content: result};
      } catch (e) {
        return {ex: e}
      }
  },

  createFile: function(data, xmlContent){
    var me = this, xmlFile, fileName, fileWriter, buffWriter, tpl;

    tpl = sol.create('sol.common.Template', {source: me.autoverifier.fileName});
    fileName = tpl.apply(data);
    try {
      // TODO create directory if it doesn't exist
      xmlFile = new File(me.autoverifier.learnExchangeFolder , fileName);
      me.logger.info(["create file {0} " , xmlFile.toString()]);
      fileWriter = new FileWriter(xmlFile);
      buffWriter = new BufferedWriter(fileWriter);

      buffWriter.write(xmlContent);
      buffWriter.flush();
    } catch (e) {
       me.logger.error(["Couldn't create learnfile at {0}, file={1}" , me.autoverifier.learnExchangeFolder, fileName], e);
       throw e;
    } finally {
      if (fileWriter != null) {
        fileWriter.close();
      }
      if (buffWriter != null) {
        buffWriter.close();
      }
    }

    return {
      fileName : fileName,
      folder : me.autoverifier.learnExchangeFolder,
      status: 'create'
    }
  },

  /**
   * Determine if file creation should be skipped
   * 
   * @returns true if field DX_STATUS is equal "DONE" or "SKIPPED"
   */
  shouldSkip: function(sord){
    var me = this, analysisStatus;
    analysisStatus = String(sol.common.SordUtils.getObjKeyValue(sord, "DX_STATUS"));
    me.logger.info(["DocXtractor Status is {0}. skip learn file creation={1}", analysisStatus, (analysisStatus === me.exceptStatus || analysisStatus === me.skipStatus)]);
    return analysisStatus === me.exceptStatus  || analysisStatus === me.skipStatus;
  }

});


/**
 * @member
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_CrateLearningFile", { flowId: wFDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  module = sol.create("sol.datev.accounting.ix.functions.CreateLearningFile", params);

  module.process();

  logger.exit("onEnterNode_CreateLearningFile");
}


/**
 * @member
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_CreateLearningFile", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;

  module = sol.create("sol.datev.accounting.ix.functions.CreateLearningFile", params);

  module.process();

  logger.exit("onExitNode_CreateLearningFile");
}


/**
 * @member
 * @method
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_datev_invoice_function_CreateLearningFile(ec, args) {
  var params, returnObj, result;
  logger.enter("RF_datev_invoice_CreateLearningFile", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  returnObj = sol.create("sol.datev.accounting.ix.functions.CreateLearningFile", params);
  result = returnObj.process();
  logger.exit("RF_datev_invoice_CreateLearningFile", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
