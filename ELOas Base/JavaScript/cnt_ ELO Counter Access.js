// start of namespace cnt
var cnt = new Object();
cnt = {

  getCounterValue: function (counterName, autoIncrement) {
    var counterNames = new Array(1);
    counterNames[0] = counterName;
    var counterInfo = ixConnect.ix().checkoutCounters(counterNames, autoIncrement, LockC.NO);
    return counterInfo[0].getValue();
  },

  createCounter: function (counterName, initialValue) {
    var counterInfo = new CounterInfo();
    counterInfo.setName(counterName);
    counterInfo.setValue(initialValue);

    var info = new Array(1);
    info[0] = counterInfo;

    ixConnect.ix().checkinCounters(info, LockC.NO);
  },

  getTrackId: function (counterName, prefix) {
    var tid = cnt.getCounterValue(counterName, true);
    return cnt.calcTrackId(tid, prefix);
  },

  calcTrackId: function (trackId, prefix) {
    var chk = 0;
    var tmp = trackId;

    while (tmp > 0) {
      chk = chk + (tmp % 10);
      tmp = Math.floor(tmp / 10);
    }

    return prefix + "" + trackId + "C" + (chk % 10);
  },

  checkId: function (value, checksum) {
    var chk = 0;

    while (value > 0) {
      chk = chk + (value % 10);
      value = Math.floor(value / 10);
    }

    return (chk % 10) == checksum;
  },

  findTrackId: function (text, prefix, length) {
    text = " " + text + " ";

    var pattern = "\\s" + prefix + "\\d+C\\d\\s";
    if (length > 0) {
      pattern = "\\s" + prefix + "\\d{" + length + "}C\\d\\s";
    }

    var val = text.match(new RegExp(pattern, "g"));
    if (!val) {
      return -1;
    }

    for (var i = 0; i < val.length; i++) {
      var found = val[i];
      var number = found.substr(prefix.length + 1, found.length - prefix.length - 4);
      var checksum = found.substr(found.length - 2, 1);
      if (checkId(number, checksum)) {
        return number;
      }
    }

    return -1;
  }

}
// end of namespace cnt