
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.contract.ix.ContractUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.functions.CreateContractHeadless" });

/**
 * This function can be used to create contracts without user interaction.
 *
 * The function used to create new contracts is called `RF_sol_contract_function_CreateContractHeadless` and has a defined interface.
 * To create a contract this function needs a {@link #sordMetadata} object, which has to be a template sord containing the new contracts metadata.
 * Further a {@link #template} configuration is needed to determine the template which will be used to create the new contract.
 *
 * ### Examples
 *
 * ### Configuration for createing a contract
 *
 *     {
 *       template: { name: "Standard contract" },
 *       sordMetadata: {
 *         objKeys: {
 *           CONTRACT_NAME: "Vertragsname",
 *           CONTRACT_NO: "C#0815",
 *           CONTRACT_RESPONSIBLE: "Sandra Renz",
 *           CONTACT_FIRSTNAME: "Gerd",
 *           CONTACT_LASTNAME: "Baum"
 *         },
 *         mapKeys: {
 *           PARTNER_EMAIL: "g.baum@contelo.de"
 *         }
 *       }
 *     }
 *
 *
 * @eloix
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.ix.FunctionBase
 * @requires sol.contract.ix.ContractUtils
 */
sol.define("sol.contract.ix.functions.CreateContractHeadless", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["user", "template", "sordMetadata"],

  /**
   * @cfg {Object} sordMetadata (required) A template sord containing the contract information.
   */

  /**
   * @cfg {Object} template (required) Configuration to determine the contract template.
   * @cfg {String} template.name (required) Name of the contract template.
   */

  /**
   * @cfg {de.elo.ix.client.UserInfo} user (required)
   * The user used as contract responsible (if there is no defined in {@link #sordMetadata}).
   * This user will be granted full access to the contract.
   * If calling this via the registered function, the logged in user will be used.
   */


  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.config = sol.contract.ix.ContractUtils.loadConfig();
  },

  /**
   * Creates the contract.
   * @return {Object}
   */
  process: function () {
    var me = this,
        name, createSordConfig, fillSordConfig, contract;

    me.prepareTemplate();
    me.prepareMetadata();
    name = me.buildElementName(me.template.name);

    createSordConfig = {
      sourceElement: {
        objId: me.template.id,
        options: {
          copySourceAcl: true
        }
      },
      targetFolder: {
        objId: "0"
      },
      onCreatedElement: {
        setName: name,
        setPermissions: {
          mode: "SET",
          users: [me.user.name],
          rights: { r: true, w: true, d: true, e: true, l: true },
          recursive: true
        }
      }
    };

    fillSordConfig = {
      source: me.getSource(),
      target: {
        fromService: {
          name: "RF_sol_function_CreateSord",
          params: createSordConfig
        },
        startWorkflow: {
          name: me.getUpdateWorkflow(),
          title: name,
          concluding: true
        }
      },
      options: {}
    };

    contract = sol.common.IxUtils.execute("RF_sol_function_FillSord", fillSordConfig);

    return { code: "success", data: contract, info: "Contract created successfully" };
  },

  /**
   * @private
   * Retrieves the template for the contract.
   * Ensures that the template at least has a 'name' and an 'id'
   */
  prepareTemplate: function () {
    var me = this;
    if (!me.template.name) {
      throw "Headless Create: No parameter `name` defined in `template`";
    }

    me.template.id = sol.common.RepoUtils.getObjIdFromRelativePath(me.config.templateFolderId, "/" + me.template.name);

    if (!me.template.id) {
      throw "Headless Create: No template found for name '" + me.template.name + "'";
    }
  },

  /**
   * @private
   * Prepares the metadata object.
   * Ensures that the SOL_TYPE and the contract type is set.
   */
  prepareMetadata: function () {
    var me = this;

    if (me.sordMetadata && !me.sordMetadata.objKeys) {
      me.sordMetadata.objKeys = {};
    }

    me.sordMetadata.objKeys[me.config.fields.objectType] = me.config.objectTypes[0];
    me.sordMetadata.objKeys[me.config.fields.contractType] = me.template.name;

    if (!me.sordMetadata.objKeys[me.config.fields.contractResponsible]) {
      me.sordMetadata.objKeys[me.config.fields.contractResponsible] = me.user.name;
    }
  },

  /**
   * @private
   * Creates the temporary element and workflow name.
   * @param {String} contractType
   * @return {String}
   */
  buildElementName: function (contractType) {
    var me = this;
    return sol.create("sol.common.Template", { source: me.config.workflows.createContract.workflowNameTemplate }).apply({ contractType: contractType });
  },

  /**
   * @private
   * Prepares the datasource for the new contract
   * @return {Object}
   */
  getSource: function () {
    var me = this,
        source = {};

    source.templateSord = me.sordMetadata;

    return source;
  },

  /**
   * @private
   * Retrieves the headless workflow.
   * @return {String}
   */
  getUpdateWorkflow: function () {
    var me = this;
    return me.config.workflows.createContractHeadless.workflowTemplateName;
  }

});


/**
 * @member sol.common.ix.functions.ChangeRights
 * @method RF_sol_contract_function_CreateContractHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_contract_function_CreateContractHeadless(ec, args) {
  var params, module;

  logger.enter("RF_sol_contract_function_CreateContractHeadless", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "template", "sordMetadata");
  params.user = ec.user;
  module = sol.create("sol.contract.ix.functions.CreateContractHeadless", params);
  module.process();

  logger.exit("RF_sol_contract_function_CreateContractHeadless");
}
