// start namespace run
var run = new Object();
run = {


  execute: function (command) {
    log.debug("Execute command: " + command);
    var p = Runtime.getRuntime().exec(command);
    p.waitFor();
    log.debug("Done.");
  },

  freeMemory: function () {
    return Runtime.getRuntime().freeMemory();
  },

  maxMemory: function () {
    return Runtime.getRuntime().maxMemory();
  },

} // end of namespace run