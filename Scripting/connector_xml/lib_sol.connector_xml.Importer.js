
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js

/**
 * This is the XML importer object.
 *
 * The importer is used to process XML files and write extracted metadata into an existing Sord object.
 * The metadata extraction is controlled by a configuration object.
 *
 * # Usage
 *
 *     var objId = '(GUID)' ,
 *         xml = new java.io.File( 'myxmlfile.xml' ),
 *         importer;
 *
 *     importer = sol.create("sol.connector_xml.Importer", {
 *       ignoreDtd: true,  //optional
 *       xsd: [{ name: "XSD Name", guid: "(04089DB6-E667-EDDE-DB86-5FCB6E5F4DFB)" }],  //optional
 *       sord: {
 *         mask: "Eingangsrechnung"
 *       },
 *       mapping: [
 *         { name: "date", key: "INVOICE_DATE", type: "GRP", xpath: "/invoice/date", converter: "dateToIso" },
 *         { name: "recipient number", key: "RECIPIENT_NO", type: "GRP", xpath: "/invoice/recipientcode" },
 *         { name: "recipient name", key: "RECIPIENT_NAME", type: "GRP", xpath: "/invoice/recipientcode", converter: "recipientName" },
 *         { name: "status", key: "INVOICE_STATUS", type: "GRP", xpath: "/invoice/status" },
 *         { name: "cash discount days", key: "INVOICE_CASH_DISCOUNT_DAYS", type: "MAP", xpath: "/invoice/discount-days" }
 *       ],
 *       tables: [
 *         {
 *           xpath: "/invoice/items/item",
 *           prefix: "ITEM",
 *           ignoreEmptyLines: true, //optional
 *           mapping: [
 *             { name: "unit", key: "UNIT", type: "MAP", xpath: "articleUnit", pattern: "{FIELD}{i}", converter: "inviQuantityCode" },
 *             { name: "number", key: "NUMBER", type: "MAP", xpath: "articleNumber", pattern: "{FIELD}{i}" },
 *             { name: "name", key: "NAME", type: "MAP", xpath: "articleName" }
 *           ]
 *         }
 *       ],
 *       converter: [
 *         { name: "dateToIso", type: "DateConverter", fromPattern: "yyyy-MM-dd", toPattern: "yyyyMMdd" },
 *         { name: "recipientName", type: "DynamicKwlLookup", kwl: "sol.invoice.ix.dynkwl.Company", focusfield: "COMPANY_CODE", returnfield: "COMPANY_NAME", defaultValue: "nicht gepflegt" },
 *         { name: "inviQuantityCode", type: "DynamicKwlLookup", kwl: "sol.invoice.ix.dynkwl.Units", focusfield: "INVI_QUANTITY_UNIT_CODE", returnfield: "INVI_QUANTITY_UNIT", dependentFields: ["COMPANY_NAME"], defaultValue: "Code ungültig" }
 *       ]
 *     });
 *
 *     if (importer.validate(xml)) {
 *       importer.process(xml, objId);
 *     }
 *
 * ## Configuration
 * The configuration consists of several properties/sections, which will be described below.
 *
 * ### ignoreDtd
 * If set to `true`, existing DTDs in the XML will be ignored
 *
 * ### xsd
 * This contains an Array with GUIDs of XSD files in the archive. They're optional, but if none are defined the validation will always return true.
 *
 * ### sord (required)
 * This Object needs to have the property 'mask'.
 * The 'mask' String specifies which mask the processed archive document needs to have in order for a proper processing.
 *
 * ### mapping (required)
 * This Object holds configurations for the processing of the metadata. The Array contains Objects containing a name, a key (either objkey name or mapkey) a xpath in the XML and an optional converter.
 *
 *     { name: "invoice date", key: "INVOICE_DATE", type: "GRP", xpath: "/invoice/date", converter: "dateToIso" }
 *
 * - name: a descriptive name
 * - key: either objkey name or mapkey
 * - type: this could be "GRP" for an index field or "MAP" for a map field
 * - xpath: XPath string to retrieve the value from the XML
 * - converter: (optional) name of a converter; this converter needs to be defined in the 'converter' section and will be applied to an extracted value, before it will be writen
 *
 * ### tables (optional)
 * This contains an Array of table objects. Each table object has the following properties:
 *
 * - name: descriptive name of the table
 * - xpath: this XPath string points to the XML nodes which represent the table lines
 * - prefix: this string can be used in the patter (see further below)
 * - ignoreEmptyLines: (optional) this boolean value defines, if an empty node should produce an empty line or should be ignored
 * - mapping: (see mapping section above; differences will be explained below)
 *
 * #### table mapping
 * The difference is, that type can only be "MAP". Due to the repeatimg nature of a table it would make no sense, to save the data in an index field.
 *
 * Another addition is the optional pattern property. This pattern defines the structure of the map key and can contain placeholders:
 *
 * - {PREFIX}: this will be replaced with the table.prefix property
 * - {FIELD}: ths will be replaced with the key of the mapping
 * - {i}: this would be replaced with a running number
 *
 * ### converter (optional)
 * This object contains the configurations for the converters (used inside the mapping sections)
 *
 *     [
 *       { name: "dateToIso", type: "DateConverter", fromPattern: "yyyy-MM-dd", toPattern: "yyyyMMdd" }
 *     ]
 *
 * - name: name to reference this converter from the mappings (see {@link sol.connector_xml.Converter Converter})
 * - type: this string will be used to determine the correct converter (see {@link sol.connector_xml.Converter Converter})
 * - any other property depends on the used converter.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 * @requires sol.connector_xml.Utils
 *
 */
sol.define("sol.connector_xml.Importer", {

  /**
   * @cfg xsd
   * XSD files can be used in order to validate the passed format. Contains an Array with Objects caontaining the GUID of XSD files in ELO and a name for the file (just for viewing purpose).
   *
   * If one XSD has dependencies to other files please ensure that all files are properly referenced.
   *
   *     // example configuration
   *     xsd: [{ name: "XSD Name", guid: "(04089DB6-E667-EDDE-DB86-5FCB6E5F4DFB)" }],
   *
   * This configuration is optional, but if none are defined the validation will always return true.
   */
  /**
   * @cfg sord (required)
   * Defines Sord specific information.
   *
   *     // example configuration
   *     sord: {
   *       mask: "Invoice"
   *     },
   *
   * @cfg sord.mask (required) Specifies which mask the processed archive document needs to have in order for a proper processing.
   */
  /**
   * @cfg mapping (required)
   * Mapping of XML data to ELO fields.
   *
   *     // example configuration
   *     mapping:[
   *       { name: "invoice date", key: "INVOICE_DATE", type: "GRP", xpath: "/invoice/date", converter: "dateToIso" }
   *     ],
   *
   * @cfg {String} mapping.type (required)
   * Type of the elo field. Could me "MAP" or "GRP".
   *
   * @cfg {String} mapping.xpath (required)
   * XPath expression that identifies the required XML node.
   *
   * @cfg {String} mapping.converter
   * Converter that is used to the imported value into a different format.
   */
  /**
   * @cfg {Object[]} tables
   * Configuration for multiple child nodes of the same type. Represented as a table.
   *
   *     // example configuration
   *     tables: [{
   *       xpath: "/invoice/items/item",
   *       prefix: "ITEM",
   *       ignoreEmptyLines: true, //optional
   *       mapping: {
   *         "UNIT" : { type: "MAP", xpath: "articleUnit", pattern: "{FIELD}{i}", converter: "inviQuantityCode" },
   *       }
   *     }],
   *
   * @cfg {String} tables.xpath XPath evaluation to identefity the root element.
   * @cfg {String} tables.prefix
   * @cfg {String} tables.ignoreEmptyLines true if empty lines should be ignored.
   * @cfg tables.mapping Mapping of XML data to ELO fields. Refer to 'mapping' for more information.
   */
  /**
   * @cfg converter
   * Definition of custom converters that can be used by field mappings.
   *
   *     // example configuration
   *     converter: {
   *       dateToIso: { type: "DateConverter", fromPattern: "yyyy-MM-dd", toPattern: "yyyyMMdd" },
   *       recipientName: { type: "DynamicKwlLookup", kwl: "sol.invoice.ix.dynkwl.Recipients", focusfield: "RECIPIENT_NO", returnfield: "RECIPIENT_NAME", defaultValue: "nicht gepflegt" },
   *       inviQuantityCode: { type: "DynamicKwlLookup", kwl: "sol.invoice.ix.dynkwl.Units", focusfield: "INVI_QUANTITY_UNIT_CODE", returnfield: "INVI_QUANTITY_UNIT", dependentFields: ["RECIPIENT_NAME"], defaultValue: "Code ungültig" }
   *     }
   *
   * @cfg String type (required)
   * Each converter requires a type definition. For more information which converters can be used, refer to sol.connector_xml.Converter.
   */

  /**
   * @private
   * @property logger
   */
  /**
   * @private
   * @property config
   */
  /**
   * @private
   * @property utils
   */
  /**
   * @private
   * @property sordZ
   */
  /**
   * @private
   * @property validator
   */
  /**
   * @private
   * @property documentBuilder
   */

  initialize: function (config) {
    var me = this;
    if (!config) {
      throw "cannot initialize new " + me.$className + " without configuration";
    }

    me.logger = sol.create("sol.Logger", { scope: me.$className });

    me.config = config || {};
    me.utils = sol.connector_xml.Utils;
    me.sordZ = SordC.mbAllIndex;

    me.validator = me.config.xsd ? me.utils.createValidator(me.config.xsd) : null;
    me.documentBuilder = me.utils.getDocumentBuilder();
    if (me.config.ignoreDtd) {
      me.documentBuilder.setEntityResolver(new EntityResolver({
        resolveEntity: function (publicId, systemId) {
          return new InputSource(new StringReader(""));
        }
      }));
    }
  },

  /**
   * Validation against the schema which is defined in the config
   * @param {java.io.File} xml The XML file that should be validated
   * @return {Boolean}
   */
  validate: function (xml) {
    if (this.validator) {
      var xmlStreamSource = this.utils.getStreamSource(xml);
      try {
        this.validator.validate(xmlStreamSource);
      } catch (ex) {
        this.logger.warn("validation failed", ex);
        return false;
      }
    }
    return true;
  },

  /**
   * Starts the processing the XML file according to the configuration and writes the metadata into an {@link Sord} object
   * @param {java.io.File} xml The XML file that should be processed
   * @param {String} objId The ID of the {@link Sord} object
   */
  process: function (xml, objId) {
    var me = this,
        emptySord, tplSord;

    this.logger.enter("process", { objId: objId });

    if (!objId && !this.config.sord) {
      throw "either a objId or a config.sord needs to be specified";
    }

    me.logger.info(["process XML: {0}; write changes to '{1}'", xml, objId]);

    me.dirty = false;
    me.sord = ixConnect.ix().checkoutSord(objId, me.sordZ, LockC.NO);

    if (me.config.clearValues) {
      emptySord = sol.common.SordUtils.createSord({ mask: me.sord.mask + "" });
      me.sord.objKeys = emptySord.objKeys;
      ixConnect.ix().deleteMap(MapDomainC.DOMAIN_SORD, me.sord.id, null, LockC.NO);
    }

    if (me.logger.debugEnabled) {
      tplSord = sol.common.SordUtils.getTemplateSord(me.sord).sord;
      me.logger.debug(["Before import: tplSord={0}", JSON.stringify(tplSord)]);
    }

    me.mapEntries = [];
    me.fieldMap = {};
    me.formBlobs = [];

    if (!sol.common.SordUtils.hasDocMask(me.sord, me.config.sord.mask)) {
      me.sord = ixConnect.ix().changeSordMask(me.sord, me.config.sord.mask, EditInfoC.mbSord).sord;
    }

    me.doc = me.utils.getDocument(me.documentBuilder, xml);

    me.processMapping();
    me.processTables();

    if (me.logger.debugEnabled) {
      tplSord = sol.common.SordUtils.getTemplateSord(me.sord).sord;
      me.logger.debug(["After import: tplSord={0}", JSON.stringify(tplSord)]);
    }

    me.save();

    me.doc = undefined;
    me.fieldMap = undefined;
    me.mapEntries = undefined;
    me.sord = undefined;
    me.dirty = undefined;

    me.logger.exit("process");
  },

  /**
   * @private
   * Saves the changes of the {@link Sord} and the map data.
   */
  save: function () {
    var me = this;

    if (me.dirty) {
      me.logger.debug(["checkin Sord, objId={0}", me.sord.id]);
      ixConnect.ix().checkinSord(me.sord, me.sordZ, LockC.NO);
    }

    if (me.mapEntries && (me.mapEntries.length > 0)) {
      me.logger.debug(["checkin Maps, count={0}", me.mapEntries.length]);
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.sord.id, me.sord.id, me.mapEntries, LockC.NO);
    }

    if (me.formBlobs && (me.formBlobs.length > 0)) {
      me.logger.debug(["checkin Maps, count={0}", me.mapEntries.length]);
      ixConnect.ix().checkinMap("formdata", me.sord.id, me.sord.id, me.formBlobs, LockC.NO);
    }
  },

  /**
   * @private
   * [TODO] Starting a workflow
   */
  processCreate: function () {
    //TODO in future implementation
    throw "not implemented: 'processCreate'";
  },

  /**
   * @private
   * Processes the mapping section from the configuration
   */
  processMapping: function () {
    var me = this,
        converterConfig, value;

    me.logger.enter("processMapping");

    me.config.mapping.forEach(function (mapObj) {
      converterConfig = me.utils.getConverterConfig(me.config, mapObj.converter);
      value = me.utils.getValue(me.doc, mapObj, converterConfig, me.fieldMap);

      me.logger.debug(["Evaluate mapping '{0}': key={1}, type={2} -> value={3}", mapObj.name, mapObj.key, mapObj.type, value]);

      me.fieldMap[mapObj.key] = value;

      switch (mapObj.type) {
        case "GRP":
          sol.common.SordUtils.setObjKeyValue(me.sord, mapObj.key, value);
          me.dirty = true;
          break;
        case "MAP":
          me.mapEntries.push(me.utils.createMapEntry(mapObj.key, value));
          break;
        case "FORMBLOB":
          me.formBlobs.push(sol.common.SordUtils.createStringMapBlob(mapObj.key, value));
          break;
        default:
          throw "Illegal Configuration: type=" + mapObj.type + " is not implemented for mappings";
      }
    });

    me.logger.exit("processMapping");
  },

  /**
   * @private
   * Processes the tables section from the configuration
   */
  processTables: function () {
    this.logger.enter("processTables");
    var me = this,
        tables = me.config.tables;
    if (tables) {
      tables.forEach(function (table) {
        me.processTable(table);
      });
    } else {
      me.logger.debug("no tables to process");
    }
    this.logger.exit("processTables");
  },

  /**
   * @private
   * Processes one table section
   * @param {org.w3c.dom.Element} table
   */
  processTable: function (table) {
    var me = this,
        counter = 1,
        nodes, i, j, node, empty, converterConfig, value, key, mapObj;

    me.logger.debug(["Process table '{0}'", table.name]);

    nodes = me.utils.getElements(me.doc, table.xpath);

    for (i = 0; i < nodes.length; i++) {
      node = nodes.item(i);
      empty = true;

      for (j = 0; j < table.mapping.length; j++) {
        mapObj = table.mapping[j];

        converterConfig = me.utils.getConverterConfig(me.config, mapObj.converter);
        value = me.utils.getValue(node, mapObj, converterConfig, me.fieldMap);

        me.logger.debug(["Evaluate mapping '{0}': table={1}, key={2}, index={3}, type={4} -> value={5}", mapObj.name, table.name, mapObj.key, counter, mapObj.type, value]);

        if (!sol.common.StringUtils.isBlank(value)) {
          empty = false;
          switch (mapObj.type) {
            case "MAP":
              key = me.utils.buildMapKey(mapObj.pattern, table.prefix, mapObj.key, counter);
              me.mapEntries.push(me.utils.createMapEntry(key, value));
              me.fieldMap[key] = value;
              break;
            case "GRP":
              sol.common.SordUtils.setObjKeyValue(me.sord, mapObj.key, value);
              me.dirty = true;
              break;
            case "FORMBLOB":
              me.formBlobs.push(sol.common.SordUtils.createStringMapBlob(mapObj.key, value));
              break;
            default:
              throw "Illegal Configuration: type=" + mapObj.type + " is not implemented for tables";
          }
        }
      }

      if (!empty || !table.ignoreEmptyLines) {
        counter++;
      } else {
        me.logger.info("ignore empty line");
      }
    }
  }
});
