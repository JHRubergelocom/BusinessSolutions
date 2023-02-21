importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.Template.js

/**
 * Returns converts a data mapping to an almost SET-compatible object
 *
 * ### Mapping definitions
 * Mapping definitions have to be passed as an array of objects, where each object is one mapping definition.
 * A mapping definition consists of source-fields and their respective target-fields.
 *               { "source": { "id": "MY_FIELD", "type": "GRP" }, "target": { "id": "YOUR_FIELD", "type": "GRP" }}
 *
 * Resulting mapping:
 *               { "id": "YOUR_FIELD", "type": "GRP", "value": {{sord.objKeys.MY_FIELD}} }
 *
 * You must pass true as the render parameter and a valid objId as the objId parameter, if you want the value to be rendered in the result.
 * It is also possible to define custom values by including them in the mapping definition's target property:
 *               { "source": { "id": "MY_FIELD", "type": "GRP" }, "target": { "id": "YOUR_FIELD", "type": "GRP", value: "{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}"" }}
 *
 * ### Result
 *
 *     id: "dataMapping",
 *     dataSource: params.objId,
 *     dataMapping: Array of Mappings (for a definition of "Mapping" see below)
 *     rendered: params.returnRendered
 *
 * ### Mapping
 * A Mapping consists of
 *     id: the target field's name
 *     type: the target field's type
 *     value: value or template-string
 *
 * Option "reverseMapping: true" can be used, to switch source and target mapping options. (this is e.g. used in requests.)
 *
 * A "result.dataMapping" is typically fed into a function which assigns the included values to their respective field-names.
 *
 * You can empty unrendered values by passing params.emptyNonRendered (:true) if params.returnRendered is true
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.Template
 */
sol.define("sol.hr.ix.services.GetConvertedMetadata", {
  extend: "sol.common.ix.ServiceBase",

  mappingContainsMaptable: false,

  getTemplate: function (name, type) {
    return "{{sord." +
      (type.trim() === "GRP" ? "objKeys" : "mapKeys")
      + "." +
      name.trim() + "}}";
  },

  optionalDontEscape: function (s) {
    var me = this;
    return (me.escapeHTML === false)
      ? "{" + s + "}"
      : s;
  },

  executeMapping: function (mappings) {
    var me = this;
    return (
      mappings.map(function (mapping) {
        if (mapping.source.type === "MAPTABLE") {
          me.mappingContainsMaptable = true;
        }
        return {
          id: mapping.target.id,
          type: mapping.target.type,
          value: (
            mapping.target.value
            || me.optionalDontEscape(me.getTemplate(mapping.source.id, mapping.source.type))
          )
        };
      }) || []
    );
  },

  addMapTablesToMapping: function (mappings, mapKeys) {
    return mappings
      .filter(function (mapping) {
        return mapping.type === "MAPTABLE";
      })
      .reduce(function (acc, mapping) {
        Object.keys(mapKeys)
          .filter(function (key) {
            return key.indexOf(mapping.id) === 0;
          })
          .reduce(function (ac, key) {
            return ac.push({ id: key, type: "MAP", value: mapKeys[key] }) && ac;
          }, acc);
        return acc;
      }, mappings)
      .filter(function (mapping) {
        return mapping.type !== "MAPTABLE";
      });
  },

  compensateForDeletedMapFields: function (history, current) {
    return history
      .filter(function (key) {
        return current.indexOf(key) === -1;
      })
      .map(function (key) {
        return { id: key, type: "MAP", value: "" };
      });
  },

  getMapKeysFromHistory: function (history) {
    return JSON.parse(String(history))
      .map(function (rec) {
        return Object.keys(rec)[0];
      })
      .filter(function (name) { //IX_MAP_
        return name.indexOf("IX_MAP") === 0;
      })
      .map(function (name) {
        return name.slice(7);
      });
  },

  getMapKeys: function (sord) {
    return Object.keys(sord.mapKeys);
  },

  getConvertedData: function (mapping, objId, flowId, render, renderOptions) {
    var me = this, result = { id: "dataMapping", dataSource: objId, dataMapping: [], rendered: render }, templatingData = {};

    result.dataMapping = me.executeMapping(mapping);

    templatingData.sord = objId && me.getSordData(objId, flowId, me.dataSourceAsAdmin) || {};
    if (me.mappingContainsMaptable) {
      result.dataMapping = me.addMapTablesToMapping(result.dataMapping, templatingData.sord.mapKeys || {});
    }
    if (me.history) {
      result.dataMapping = result.dataMapping
        .concat(me.compensateForDeletedMapFields(
          me.getMapKeysFromHistory(templatingData.sord.formBlobs[me.history]), me.getMapKeys(templatingData.sord))
        );
    }

    render && objId && sol.common.TemplateUtils.render(result, templatingData, renderOptions);

    return result;
  },

  reverseMappings: function (mappings) {
    return mappings.map(function (mapping) {
      return { source: mapping.target, target: mapping.source };
    });
  },

  getSordData: function (objId, flowId, asAdmin) {
    return sol.common.ObjectFormatter.format({
      sord: {
        formatter: "sol.common.ObjectFormatter.WfMap",
        data: ((asAdmin && typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect).ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO),
        config: {
          sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"],
          allMapFields: true,
          allFormBlobFields: true,
          flowId: flowId,
          asAdmin: asAdmin || false
        }
      }
    }).sord;
  },

  /**
   * Retrieves the data as specified in the constructor configuration.
   * @returns {String[]} Array with types
   */
  process: function () {
    var me = this,
        mapping = me.mapping,
        objId = me.dataSourceObjId,
        flowId = me.dataSourceFlowId,
        render = me.returnRendered,
        renderOptions = {
          emptyNonRendered: me.emptyNonRendered
        },
        asAdmin = me.asAdmin;

    mapping = me.reverseMapping ? me.reverseMappings(mapping) : mapping;

    return me.getConvertedData(mapping, objId, flowId, render, renderOptions, asAdmin);
  }
});

/**
 * @member sol.hr.ix.services.GetConvertedMetadata
 * @method RF_sol_common_service_GetConvertedMetadata
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetConvertedMetadata(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetConvertedMetadata", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}