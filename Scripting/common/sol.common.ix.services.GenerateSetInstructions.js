importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.Template.js

/**
 * Converts a {@link sol.common.ObjectFormatter.TemplateSord TemplateSord} to {@link sol.common.ix.functions.Set SET}-compatible
 * {@link sol.common.ix.functions.Set#entries instructions/entries} optionally using a {@link #mapping mapping} and returns them.
 *
 * ### Mapping definitions
 * A mapping definition consists of source-fields and their respective target-fields.
 *
 *     { source: { id: "MY_FIELD", type: "GRP" }, target: { id: "YOUR_FIELD", type: "GRP" } }
 *
 * Resulting instruction:
 *
 *     { id: "YOUR_FIELD", type: "GRP", value: "{{sord.objKeys.MY_FIELD}}" }
 *
 * You must pass true as the `returnRendered` parameter and a valid objId (String) or templateSord (Object) as the `dataSource` parameter, if you want the value to be rendered in the result.
 *
 * It is also possible to define custom values which do not occur in the `dataSource` by including them in the mapping definition's target property:
 *
 *     { target: { id: "Y_FIELD", type: "MAP", value: "{{sord.mapKeys.MY_CUSTOM_FIELD}} fixed text" } }
 *
 * If some values which are available in the dataSource should not be added to the generated instructions, the values can be defined as a `source` without a `target`
 *
 *     { source: { id: NO_FIELD, type: "MAP" } }
 *
 * If you pass a templateSord as `dataSource`, the templateSord will be used as `sord` in any templating.
 *
 * If you pass an objid as `dataSource` and a flowId as `dataSourceFlowId`, the sord will be checked out and used in templating.
 *
 * ### Empty non rendered values
 *
 * As a default, if returnRendered is true and a value could not be rendered, the original template-String will be used as the `value` in the generated instruction.
 * If you define `renderOptions: { emptyNonRendered: true }`, templates which were not rendered, will be written to the instruction as an empty String.
 * NonRendered means, the templating result is an empty string.
 *
 * ### Only generate instructions for mapped values
 *
 * If only some values of the dataSource should be used for generating instructions, defining `returnMappingsOnly: true` will only add those values defined in the mapping
 * to the resulting instructions.
 *
 * ### Reverse Mappings
 *
 * Option `reverseMapping: true` can be used, to switch source and target mapping options. (this is e.g. useful for HR-requests.)
 *
 * ### Examples
 *
 * ### Using a TemplateSord and a mapping
 *
 * #### Arguments
 *     {
 *       dataSource: {
 *         objKeys: {
 *           MY_FIELD: "myvalue"
 *         },
 *         mapKeys: {
 *           NO_FIELD: "xyz",
 *           MY_CUSTOM_FIELD: "this is"
 *         }
 *       },
 *       mapping: [
 *         { source: { id: "MY_FIELD", type: "GRP" }, target: { id: "YOUR_FIELD", type: "GRP" } },
 *         { target: { id: "Y_FIELD", type: "MAP", value: "{{sord.mapKeys.MY_CUSTOM_FIELD}} fixed text" } },
 *         { source: { id: "NO_FIELD", type: "MAP" } },
 *         { target: { id: "OLD_DATAHISTORY", type: "FORMBLOB", value: "{{sord.formBlobs.DATAHISTORY}}" } }
 *       ],
 *       returnRendered: true,
 *       renderOptions: {
 *         emptyNonRendered: true
 *       }
 *     }
 *
 * #### Return value
 *
 *     {
 *       id: "SetInstructions",
 *       dataSource: {
 *         objKeys: {
 *           MY_FIELD: "myvalue"
 *         },
 *         mapKeys: {
 *           NO_FIELD: "xyz",
 *           MY_CUSTOM_FIELD: "this is"
 *         }
 *       },
 *       instructions: [
 *         { key: "YOUR_FIELD", type: "GRP", value: "myvalue" },
 *         { key: "Y_FIELD", type: "MAP", value: "this is fixed text" },
 *         { key: "OLD_DATAHISTORY", type: "FORMBLOB", value: "" }
 *       ],
 *       rendered: true
 *     }
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.Template
 */
sol.define("sol.common.ix.services.GenerateSetInstructions", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {String|Object} dataSource
   * objId or templateSord
   */

  /**
   * @cfg {String} dataSourceFlowId (optional)
   * flowId. This will only be used, if `dataSource` is an objectId
   */

  /**
   * @cfg {Object[]} mapping (optional)
   * @cfg {Object} mapping.Object
   * @cfg {Object} mapping.Object.source (optional)
   * @cfg {String} mapping.Object.source.id name of source field
   * @cfg {String|"GRP"|"MAP"|"WFMAP"|"FORMBLOB"} mapping.Object.source.type type of field
   * @cfg {Object} mapping.Object.target (optional)
   * @cfg {String} mapping.Object.target.id name of target field
   * @cfg {String|"GRP"|"MAP"|"WFMAP"|"FORMBLOB"} mapping.Object.target.type type of field
   * @cfg {String} mapping.Object.target.value (optional) fixed or template String. This is completely optional!
   */

  /**
   * @cfg {Object[]} protectedFields (optional)
   * @cfg {Object} protectedFields.Object
   * @cfg {String|"GRP"|"MAP"|"WFMAP"|"FORMBLOB"} protectedFields.Object.type
   * @cfg {String} protectedFields.Object.id name of protected field
   */

  /**
   * @cfg {Object[]} mandatoryFields (optional) (throws exception if a field is missing)
   * @cfg {Object} mandatoryFields.Object
   * @cfg {String|"GRP"|"MAP"|"WFMAP"|"FORMBLOB"} mandatoryFields.Object.type
   * @cfg {String} mandatoryFields.Object.id name of mandatory field
   */

  /**
   * @cfg {Boolean} [reverseMapping = false] (optional)
   * switches `target` and `source` in every mapping
   */

  /**
   * @cfg {Boolean} [returnMappingsOnly = false] (optional)
   * instructionset will only contain instructions resulting from a mapping
   */

  /**
   * @cfg {Boolean} [returnRendered = false] (optional)
   * decides if resulting instructions will go through handlebars
   */

  /**
   * @cfg {Boolean} [escapeHTML = true] (optional)
   * if set to false, template strings will be generated so html won't be escaped
   */

  /**
   * @cfg {Object} renderOptions (optional)
   * additional options for rendering
   *
   * @cfg {Boolean} [renderOptions.emptyNonRendered = false] (optional)
   * empty value if handlebars could not render template
   */

  optionalDontEscape: function (s) {
    var me = this;
    return (me.escapeHTML === false)
      ? "{" + s + "}"
      : s;
  },

  getTemplate: function (name, type) {
    var t = type.trim().toUpperCase(), templateProp = (
      (t === "GRP" && "objKeys")
      || (t === "MAP" && "mapKeys")
      || (t === "WFMAP" && "wfMapKeys")
      || (t === "FORMBLOB" && "formBlobs")
      || ""
      );
    return "{{sord." + (templateProp ? templateProp + "." : "") + name.trim() + "}}";
  },

  getType: function (objName) {
    return (
      (objName === "objKeys" && "GRP")
      || (objName === "mapKeys" && "MAP")
      || (objName === "wfMapKeys" && "WFMAP")
      || (objName === "formBlobs" && "FORMBLOB")
      || objName
    );
  },

  executeMapping: function (mappings) {
    var me = this;
    me.logger.debug("Generating instructions from mapping", mappings);
    return (
      mappings
      .filter(function (mapping) {  // if there is no target, remove from mappings
        return (mapping.target && mapping.target !== {});
      })
      .map(function (mapping) {
        return {
          key: mapping.target.id,
          type: mapping.target.type,
          value: (
            mapping.target.value
            || (
              mapping.source
              ? me.optionalDontEscape(me.getTemplate(mapping.source.id, mapping.source.type))
              : ""
            )
          )
        };
      })
    );
  },

  buildInstructionsFromTemplateSord: function (tSord) {
    var me = this, result = [];
    me.logger.debug("Building instructions using TemplateSord", tSord);
    Object.keys(tSord).forEach(function (typeObjName) {
      var typeObj = tSord[typeObjName], t = me.getType(typeObjName);
      (typeof typeObj === "object") && Object.keys(typeObj).forEach(function (fieldName) {
        result.push({
          key: fieldName,
          type: me.getType(typeObjName),
          value: me.optionalDontEscape(me.getTemplate(fieldName, t))
        });
      });
    });
    return result;
  },

  /*
   *  returns templateSord-instructions which were not mapped
   */
  filterInstructions: function (instructions, mappings) {
    var me = this;
    me.logger.debug("Filtering mapped instructions");
    return instructions.filter(function (i) {
      return !(mappings.some(function (m) {
        return m.source && (m.source.id === i.key && m.source.type === i.type);
      }));
    });
  },

  filterProtectedFields: function (instructions, protected) {
    var me = this;
    me.logger.debug("Filtering protected fields");
    return instructions.filter(function (i) {
      return !(protected.some(function (p) {
        return (typeof p === "object") && (p.id === i.key && p.type === i.type);
      }));
    });
  },

  findMissingMandatories: function (instructions, mandatories) {
    var me = this;
    me.logger.debug("Checking if all mandatory fields have instructions");
    return mandatories.filter(function (m) {
      return !(instructions.some(function (i) {
        return (i.key === m.id && i.type === m.type);
      }));
    });
  },

  getConvertedData: function (mapping, tplObj, flowId, render, renderOptions, asAdmin, formBlobs) {
    var me = this, result = { rendered: render },
        templatingData = { sord: {} }, instructions = [];

    if (typeof tplObj === "object") {
      me.logger.debug("Using TemplateSord as dataSource");
      templatingData.sord = tplObj;
      instructions = me.buildInstructionsFromTemplateSord(tplObj);
    } else if ((typeof tplObj === "string") && tplObj) {
      me.logger.debug(["Using objId as dataSource. Retrieving TemplateSord using objId `{0}` (and flowId `{1}`)"], tplObj, flowId);
      templatingData.sord = me.getSordData(tplObj, flowId, asAdmin, formBlobs);
      instructions = me.buildInstructionsFromTemplateSord(templatingData.sord);
    }

    result.instructions = (
      me.returnMappingsOnly ? [] : me.filterInstructions(instructions, mapping)
    ).concat(me.executeMapping(mapping));

    me.logger.debug("Generated instructions", result.instructions);
    render && tplObj && sol.common.TemplateUtils.render(result.instructions, templatingData, renderOptions) && me.logger.debug("Applied Templating");



    me.logger.debug("Result", result);
    return result;
  },

  reverseMappings: function (mappings) {
    var me = this;
    me.logger.debug("Reversing Mapping ...", mappings);
    return mappings.map(function (mapping) {
      return { source: mapping.target, target: mapping.source };
    });
  },

  getSordData: function (objId, flowId, asAdmin, formBlobs) {
    try {
      return sol.common.WfUtils.getTemplateSord(
        ((asAdmin && typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect).ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO),
        flowId,
        { asAdmin: asAdmin, formBlobs: formBlobs }
      ).sord;
    } catch (e) {
      throw "GenerateSetInstructions: Could not retrieve TemplateSord using objId `" + objId + "` " + ((flowId && "and flowId + `" + flowId + "`") || "") + ". Insufficient rights?";
    }
  },

  mappingContainsFormBlobs: function (mapping) {
    return mapping.some(function (m) {
      return typeof m === "object" && typeof m.source === "object" && m.source.type === "FORMBLOB";
    });
  },

  /**
   * @return {Object}
   * @return {Object[]} return.instructions instructions usable as SET-entries
   * @return {Object} return.instructions.Object
   * @return {String} return.instructions.Object.key target field name
   * @return {String|"GRP"|"MAP"|"WFMAP"|"FORMBLOB"} return.instructions.Object.type target field type
   * @return {String} return.instructions.Object.value target field value
   * @return {Boolean} return.rendered if the `value`s in `instructions` are rendered
   */
  process: function () {
    var me = this,
        mapping = me.mapping || [],
        tplObj = me.dataSource,
        flowId = me.dataSourceFlowId,
        render = me.returnRendered,
        renderOptions = {
          emptyNonRendered: !!(me.renderOptions && me.renderOptions.emptyNonRendered),
          stringifyResults: !!(me.renderOptions && me.renderOptions.stringifyResults)
        },
        asAdmin = me.asAdmin,
        missingMandatoryFields = [],
        result = {},
        includeFormBlobs;

    mapping = me.reverseMapping ? me.reverseMappings(mapping) : mapping;

    includeFormBlobs = me.mappingContainsFormBlobs(mapping);

    result = me.getConvertedData(mapping, tplObj, flowId, render, renderOptions, asAdmin, includeFormBlobs);

    if (me.protectedFields) {
      if (!Array.isArray(me.protectedFields)) {
        throw "protectedFields parameter only accepts an Array as an argument";
      }
      result.instructions = me.filterProtectedFields(result.instructions, me.protectedFields);
    }

    if (me.mandatoryFields) {
      missingMandatoryFields = me.findMissingMandatories(result.instructions, me.mandatoryFields);
      if (missingMandatoryFields.length > 0) {
        throw "Some mandatory fields were not found in templateSord or mapping and therefore the resulting instructions. Missing fields:" + JSON.stringify(me.mandatoryFields);
      }
    }

    return result;
  }
});

/**
 * @member sol.common.ix.services.GenerateSetInstructions
 * @method RF_sol_common_service_GenerateSetInstructions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GenerateSetInstructions(iXSEContext, args) {
  var me = this, rfUtils, rfArgs, serviceProc, result,
      logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.GenerateSetInstructions" });

  logger.enter("RF_sol_common_service_GenerateSetInstructions");

  rfUtils = sol.common.ix.RfUtils;
  rfArgs = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  if (me.asAdmin) {
    me.logger("TemplateSord will be retrieved using ixConnectAdmin");
    sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);
  }

  serviceProc = sol.create("sol.common.ix.services.GenerateSetInstructions", rfArgs);
  result = rfUtils.stringify(serviceProc.process());
  logger.exit("RF_sol_common_service_GenerateSetInstructions");
  return result;
}