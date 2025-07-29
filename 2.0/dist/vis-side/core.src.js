export class VisLogSideCore {
  static DEFAULT_DEBUG_KEY_PREFIX = '_vislog_';
  static LOG_LEVELS = ['LOG', 'INFO', 'WARN', 'ERROR', 'DEBUG'];

  /** @private */
  _dbg_key_prefix = '_vislog_';
  /** @private */
  _log_counter = 0;
  /** @private */
  _enabled = true;
  /** @private */
  _filename = '';

  constructor(options = {}) {
    this._dbg_key_prefix = options.debug_key_prefix || VisLogSideCore.DEFAULT_DEBUG_KEY_PREFIX;
    this._filename = options.filename || '';
    this._enabled = options.enabled !== false;
    this._log_counter = 0;
  }

  log(...args) { this._writeLog('LOG', ...args); }
  info(...args) { this._writeLog('INFO', ...args); }
  warn(...args) { this._writeLog('WARN', ...args); }
  error(...args) { this._writeLog('ERROR', ...args); }
  debug(...args) { this._writeLog('DEBUG', ...args); }

  setEnabled(enabled) {
    this._enabled = enabled;
  }

  getEnabled() {
    return this._enabled;
  }

  /** @private */
  getFilename() {
    return this._filename;
  }

  /** @private */
  getDebugKeyPrefix() {
    return this._dbg_key_prefix;
  }

  /** @private */
  getNextCounter() {
    return this._log_counter++;
  }

  /** @private */
  createLogEntry(level, message, source) {
    return {
      timestamp: Date.now(),
      level: level,
      message: message,
      filename: this._filename,
      counter: this.getNextCounter(),
      source: source
    };
  }

  /** @private */
  formatMessage(...args) {
    return args.map(arg => 
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(' ');
  }

  /** @private */
  consoleLog(level, message) {
    console.log(`[${level}]${this._filename ? ` [${this._filename}]` : ''} ${message}`);
  }

  /** @private */
  _writeLog(level, ...args) {
    // abstract
  }

  /** @private */
  static validateLogEntry(log_entry) {
    return log_entry && log_entry.level && log_entry.message;
  }
}

export default VisLogSideCore;