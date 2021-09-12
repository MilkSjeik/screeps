// TODO:
// - add jsdoc
// - add constants
const DEBUG    = 1;
const INFO     = 2;
const WARNING  = 3;
const ERROR    = 4;

module.exports = class Logger {
  logLevel = 1;

  constructor(logLevel) {
    this.setLogLevel = logLevel;
  }

/* no getter/setter needed, since logLevel is not private
  setLogLevel(logLevel) {
    this.logLevel = logLevel;
  }
*/
  msg(type, message) {
    if (type >= logLevel) {
      if (type === 4) {
        console.log('[E] ' + message);
      }
      else if (type === 3) {
        console.log('[W] ' + message);
      }
      else if (type === 2) {
        console.log('[I] ' + message);
      }
      else if (type === 1) {
        console.log('[D] ' + message);
      }
    }
  }
}
