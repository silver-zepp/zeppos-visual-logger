import VisLogSideCore from './core';

/**
 * VisLogAppSettings - Settings page logger
 */
export class VisLogAppSettings extends VisLogSideCore {
  /** @private */
  _settings_storage = null;
  /** @private */
  _is_initialized = false;

  /**
   * Create VisLogAppSettings instance
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.filename=''] - Filename/module name to show in logs
   * @param {boolean} [options.enabled=true] - Whether logging is enabled
   */
  constructor(options = {}) {
    super(options);
  }

  /**
   * Attach to settings storage and initialize logging
   * @param {Object} settings_storage - Settings storage object from props.settingsStorage
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.filename] - Override filename for this instance
   * @param {boolean} [options.clear_on_init=true] - Whether to clear old debug logs
   */
  attachSettingsRelay(settings_storage, options = {}) {
    if (this._is_initialized) { return; }

    this._settings_storage = settings_storage;

    if (options.filename) {
      this._filename = options.filename;
    }

    if (options.clear_on_init !== false) {
      this._clearOldLogs();
    }

    this._is_initialized = true;
  }


  /**
   * Check if the logger is initialized and ready to use
   * @returns {boolean}
   */
  initialized() {
    return this._is_initialized && this._settings_storage !== null;
  }

  /**
   * @private 
   **/
  _writeLog(level, ...args) {
    if(!this.initialized()){ return; }
    if (!this.getEnabled()) { return; }

    try {
      const message = this.formatMessage(...args);
      const log_entry = this.createLogEntry(level, message, 'AppSettings');

      const key = `${this.getDebugKeyPrefix()}${String(log_entry.counter).padStart(4, '0')}`;
      this._settings_storage.setItem(key, JSON.stringify(log_entry));

      // this.consoleLog(level, message);

    } catch (err) {
      console.log("VisLogAppSettings error:", err);
    }
  }

  /**
   * Clear all debug messages
   */
  clear() {
    this._clearOldLogs();
  }

  /** @private */
  _clearOldLogs() {
    if (!this._settings_storage) return;

    try {
      const all_settings = this._settings_storage.toObject?.() || {};

      Object.keys(all_settings)
        .filter(key => key.startsWith(this.getDebugKeyPrefix()))
        .forEach(key => {
          this._settings_storage.removeItem(key);
        });

    } catch (error) {
      console.log("VisLogAppSettings: Error clearing old logs:", error);
    }
  }

  /**
   * Destroy the logger
   */
  destroy() {
    this.setEnabled(false);
    this._settings_storage = null;
    this._is_initialized = false;
  }
}