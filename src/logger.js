// TODO:
// - add jsdoc
// - add constants
const C = require("./logger.constants");

module.exports = class Logger {
  constructor(logLevel) {
    this.logLevel = logLevel;
  }

  /* no getter/setter needed, since logLevel is not private
  setLogLevel(logLevel) {
    this.logLevel = logLevel;
  }
*/
  msg(type, message) {
    if (type >= this.logLevel) {
      if (type === C.ERROR) {
        console.log("[E] " + message);
      } else if (type === C.WARNING) {
        console.log("[W] " + message);
      } else if (type === C.INFO) {
        console.log("[I] " + message);
      } else if (type === C.DEBUG) {
        console.log("[D] " + message);
      }
    }
  }
};
