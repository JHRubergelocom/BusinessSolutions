
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js

/**
 * 
 *
 * @author ELO Digital Office GmbH
 * @version 1.07
 *
 * @eloix
 *
 * @requires sol.common.Map
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 */
sol.define("sol.knowledge.ix.DynKwlCategories", {

  keyNames: ["KNOWLEDGE_CATEGORY"],

  mapKeys: [
    "IX_GRP_KNOWLEDGE_BOARD_REFERENCE"
  ],

  initialize: function () {
    var me = this;
    me.log = sol.create("sol.Logger", { scope: this.$className || "sol.knowledge.ix.DynKwlCategories" });
  },

  open: function (ec, sord, fieldName) {
    var me = this;

    me._open({
      name: fieldName,
      value: sol.common.SordUtils.getObjKeyValue(sord, fieldName),
      map: me.mapKeys.reduce(function (acc, mapKey) {
        acc[mapKey] = sol.common.SordUtils.getObjKeyValue(sord, mapKey);
        return acc;
      }, {})
    });
  },

  /**
   * Opens a connection for elo wf forms and map field capable components
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec
   * @param {java.util.HashMap} map Map of all entries passed by the client
   * @param {String} focusName Name of the currently focused field
   * 
   */
  openMap: function (ec, map, focusName) {
    var me = this;

    me._open({
      name: focusName,
      value: map[focusName],
      map: map
    })
  },

  _open: function (field) {
    var me = this, boards, boardMap;

    me.resultSet = [];
    me.index = 0;

    boards = sol.common.RepoUtils.findSords({
      "objKeysObj": {
        "KNOWLEDGE_BOARD_REFERENCE": field.map["IX_GRP_KNOWLEDGE_BOARD_REFERENCE"]
      },
      "maskId": "Knowledge Board"
    });

    boardMap = sol.create('sol.common.SordMap', {
      objId: boards[0].id
    });
    boardMap.read();

    boardMap.forEachRow("SETTING_CATEGORY_LIST_ITEM_", function (i) {
      var value = boardMap.getValue("SETTING_CATEGORY_LIST_ITEM_" + i);
      if (field.value == "" || value.indexOf(field.value) !== -1) {
        me.resultSet.push([value]);
      }
    });
  },

  /**
   * Returns the next row of the table.
   *
   * @return {Array} table row
   */
  getNextRow: function () {
    var me = this,
      row;

    row = me.resultSet[me.index++];

    return row;
  },

  /**
   * Returns the header of this table that can be displayed by the clients.
   *
   * @return {Array} table header
   */
  getHeader: function () {
    return ["Kategorie"];
  },

  /**
   * Returns the keys of this table that can be used in order to map
   * map or group fields with columns.
   *
   * @return {Array} Table keys
   */
  getKeyNames: function () {
    var me = this;
    return ["KNOWLEDGE_CATEGORY"];
  },

  /**
   * Returns true if table has more rows.
   *
   * @return {Boolean} Has more rows
   */
  hasMoreRows: function () {
    var me = this;
    return (me.index < (me.resultSet.length));
  },

  /**
   * Returns a title for this table used by the user interface.
   *
   * @return {String} title
   */
  getTitle: function () {
    return "Bereichskategorie";
  }

});

function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.knowledge.ix.DynKwlCategories" }),
    iterator;
  try {
    log.enter("DynamicKeywordList (");
    iterator = sol.create("sol.knowledge.ix.DynKwlCategories", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.exit(")getDataIterator");
  }
}
