// start of namespace lead
var lead = new Object();

// constants
var LEAD_DOCMASK = "0";
var LEAD_ITEMMASK = 340;
var LEAD_FOLDERMASK = 341;

lead = {

  copyIndexToParent: function (indexLine) {
    elo.setIndexValue(EM_PARENT_SORD, indexLine, elo.getIndexValue(EM_ACT_SORD, indexLine));
  },

  makeDynReg: function (sord, status) {
    var memo = "!+ , objkeys k1, objkeys k2 where objid = k1.parentid and k1.parentid = k2.parentid and k1.okeyname = 'ELO_LISTA' and k1.okeydata like '";
    memo = memo + status + " - %' and k2.okeyname = 'ELO_LIPRT' and k2.okeydata = '";
    memo = memo + NAME + "' and objtype < 254";
    var basePath = sord.getRefPaths()[0].getPathAsString();
    var delim = basePath.substring(0, 1);
    var name = Leadstatus[status];
    elo.prepareDynPath(basePath + delim + sord.name + delim + name, memo);
  },

  folderIndexToString: function (sord) {
    var i;
    var res = "#";

    for (i = 0; i < 11; i++) {
      res = res + elo.getIndexValue(sord, i) + "#";
    }

    return res;
  }

}
// end of namespace lead