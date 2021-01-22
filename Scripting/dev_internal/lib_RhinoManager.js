// RhinoManager.registerClass(me.$className);

RhinoManager = {

  registerClass: function (className) {
    var bitMask, moduleName, le, parts, li, lopt;

    if (typeof ixConnect != "undefined") {

      parts = className.split(".");

      if (parts && (parts.length > 1) && (parts[0].length == 3)) {
        if ((parts.length > 2) && (parts[0] == "erp") && ((parts[1] == "sap") || (parts[1] == "sbo") || (parts[1] == "mbc"))) {
          moduleName = parts[0] + "." + parts[1] + "." + parts[2];
        } else {
          moduleName = parts[0] + "." + parts[1];
        }

        if (moduleName) {
          le = this.lo[moduleName];

          if (le) {
            if (typeof le.v == "undefined") {
              li = ixConnect.ix().serverInfo.license;
              lopt = li.licenseOptions;
              if (lopt) {
                le.v = (lopt.get("feature." + le.k) == "true");
              } else {
                if (le.b) {
                  this.f3 = this.f3 || java.math.BigInteger.valueOf(li.features[2]);
                  bitMask = java.math.BigInteger.valueOf(2).pow(le.b);
                  le.v = this.f3.and(bitMask).equals(bitMask);
                } else {
                  le.v = true;
                }
              }
            }
            if (!le.v) {
              throw "License for module '" + moduleName + "' is missing";
            }
            return "License check: moduleName=" + moduleName + ", valid=" + le.v + ", lics=" + JSON.stringify(this.lo, null, 2);
          }
        }
      }
    }
  },

  lo: {
    "sol.invoice_electronic": { b: 4, k: "ZUGFERD" },
    "sol.invoice": { b: 5, k: "INVOICE" },
    "sol.visitor": { b: 6, k: "VISITOR" },
    "sol.contract": { b: 7, k: "CONTRACT" },
    "sol.pubsec": { b: 8, k: "EAKTE" },
    "sol.contact": { b: 9, k: "ADDRESS" },
    "sol.hr": { b: 10, k: "HRPERSONAL" },
    "sol.leave": { b: 11, k: "HRLEAVE" },
    "sol.expenses": { b: 12, k: "HREXPENSES" },
    "sol.inventory": { b: 13, k: "FIXTURES" },
    "sol.knowledge": { b: 14, k: "KNOWLEDGE" },
    "sol.recruiting": { b: 15, k: "RECRUITING" },
    "erp.sap.toolbox": { b: 16, k: "SAPTOOLBOX" },
    "sol.learning": { b: 17, k: "LEARNING" },
    "erp.sbo.integrationservice": { k: "EICBUSINESSONE" },
    "erp.sbo.outputlink": { k: "EOLBUSINESSONE" },
    "erp.sbo.datatransfer": { k: "EDTBUSINESSONE" },
    "erp.mbc.integrationservice": { k: "EICNAVISION" },
    "erp.mbc.outputlink": { k: "EOLNAVISION" },
    "erp.mbc.datatransfer": { k: "EDTNAVISION" }
  }
};

// eslint-disable-line
