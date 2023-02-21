
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Knowledge label utilities
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 *
 * @requires sol.common.Config
 */
sol.define("sol.knowledge.ix.LabelUtils", {
  singleton: true,

  /**
   * Loads (and merges) the label configuration from the JSON file: `/Administration/Business Solutions/knowledge/Configuration/labels.config`
   * @param {Boolean} force
   * @return {Object}
   */
  loadLabelConfig: function (force) {
    var me = this;

    me.labelConfig = sol.create("sol.common.Config", { compose: "/knowledge/Configuration/labels.config" }).config;

    return me.labelConfig;
  },

  /**
   * Returns the index of key or -1 when not available
   * @param {Object[]} labels
   * @param {String} key
   * @return {Number}
   */
  getLabelIndex: function (labels, key) {
    var i, label;

    for (i = 0; i < labels.length; i++) {
      label = labels[i];
      if (label.key == key) {
        return i;
      }
    }
    return -1;
  },

  /**
   * Select a label from labels
   * @param {Object} label
   * @return {Object}
   */
  selectLabelConfig: function (label) {
    var me = this,
        labels, ind;

    me.loadLabelConfig(true);

    if (me.labelConfig.labels) {
      labels = me.labelConfig.labels;
      ind = me.getLabelIndex(labels, label.key);
      if (ind > -1) {
        return labels[ind];
      }
    }
    return {};
  },

  /**
   * Inserts a label to labels
   * @param {Object} label
   */
  insertLabelConfig: function (label) {
    var me = this,
        cfg = sol.create("sol.common.Config", { load: "ARCPATH:/Administration/Business Solutions/knowledge/Configuration/labels.config", writable: true }),
        myConfig, labels, ind;

    myConfig = cfg.config;
    if (myConfig.labels) {
      labels = myConfig.labels;
      ind = me.getLabelIndex(labels, label.key);
      if (ind == -1) {
        labels.push(label);
      }
    }
    cfg.save();
    me.loadLabelConfig(true);
  },

  /**
   * Updates a label to labels
   * @param {Object} label
   */
  updateLabelConfig: function (label) {
    var me = this,
        cfg = sol.create("sol.common.Config", { load: "ARCPATH:/Administration/Business Solutions/knowledge/Configuration/labels.config", writable: true }),
        myConfig, labels, ind;

    myConfig = cfg.config;
    if (myConfig.labels) {
      labels = myConfig.labels;
      ind = me.getLabelIndex(labels, label.key);
      if (ind > -1) {
        labels[ind] = label;
      }
    }
    cfg.save();
    me.loadLabelConfig(true);
  },

  /**
   * Deletes a label from labels
   * @param {Object} label
   */
  deleteLabelConfig: function (label) {
    var me = this,
        cfg = sol.create("sol.common.Config", { load: "ARCPATH:/Administration/Business Solutions/knowledge/Configuration/labels.config", writable: true }),
        myConfig, labels, ind;

    myConfig = cfg.config;
    if (myConfig.labels) {
      labels = myConfig.labels;
      ind = me.getLabelIndex(labels, label.key);
      if (ind > -1) {
        labels.splice(ind, 1);
      }
    }
    cfg.save();
    me.loadLabelConfig(true);
  },

  /**
   * Get all labels
   * @param {Object} label
   * @return {Object[]}
   */
  getLabels: function () {
    var me = this,
        labels;

    me.loadLabelConfig(true);
    labels = [];
    if (me.labelConfig.labels) {
      labels = me.labelConfig.labels;
    }
    return labels;
  }

});
