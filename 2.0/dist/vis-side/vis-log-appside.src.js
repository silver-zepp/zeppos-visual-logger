import VisLogSideCore from './core';
const logger = Logger.getLogger('log');

/**
 * VisLogAppSide - Side service logger with Settings relay
 */
export class VisLogAppSide extends VisLogSideCore {
  /** @private */
  _side_service_instance = null;
  /** @private */
  _is_attached = false;
  /** @private */
  _settings_listener = null;

  /**
   * Create VisLogAppSide instance
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.filename=''] - Filename/module name to show in logs for identification
   * @param {boolean} [options.enabled=true] - Whether logging and relay functionality is enabled
   
  * @example
  * const vis = new VisLogAppSide();
  * vis.log("Hello from AppSide!");
  */
  constructor(options = {}) {
    super(options);
  }

  /**
   * Attach to side service
   * @param {Object} side_service_instance - The 'this' context from BaseSideService
   * @param {Object} [options={}] - Configuration options
   */
  attachSideRelay(side_service_instance, options = {}) {
    this._side_service_instance = side_service_instance;
    this._is_attached = true;

    if (this.getEnabled()) {
      this._setupRelay();
    } else {
      logger.log('VisLogAppSide: Relay NOT attached - disabled');
    }
  }
  /** @private */
  _writeLog(level, ...args) {
      if (!this.getEnabled()) return;
      if (!this._is_attached) return;
    try {
      const message = this.formatMessage(...args);
      const log_entry = this.createLogEntry(level, message, 'AppSide');

      // BLE comm
      this._side_service_instance.call({
        type: 'VIS_DBG_LOG',
        data: log_entry
      }).catch(err => {
        logger.log('VisLogAppSide: Failed to send log:', err);
      });

      // TODO: ?
      // this.loggerLog(level, message);

    } catch (err) {
      logger.log("VisLogAppSide logging error:", err);
    }
  }

  /** @private */
  _setupRelay() {
    if (!this._side_service_instance) { return; }
    
    this._settings_listener = ({ key, newValue, oldValue }) => {
      if (key.startsWith(this.getDebugKeyPrefix())) {
        this._relaySettingsLog(key, newValue);
      }
    };
    
    settings.settingsStorage.addListener('change', this._settings_listener);
  }

  /** @private */
  _relaySettingsLog(key, value) {
    if (!this._side_service_instance || !value) { return; }

    try {
      const log_entry = JSON.parse(value);
      
      if (!VisLogSideCore.validateLogEntry(log_entry)) { return; }

      log_entry.source = 'AppSettings';

      this._side_service_instance.call({
        type: 'VIS_DBG_LOG',
        data: log_entry
      }).catch(err => {
        logger.log('VisLogAppSide: Failed to relay settings log:', err);
      });

    } catch (error) {
      logger.log('VisLogAppSide: Error parsing settings log:', error);
    }
  }

  /**
   * Detach from side service
   */
  detachSideRelay() {
    if (this._settings_listener) {
      try {
        if (settings.settingsStorage.removeListener) {
          settings.settingsStorage.removeListener('change', this._settings_listener);
        } else {
          logger.log('VisLogAppSide: settingsStorage.removeListener() not available!');
        }
      } catch (error) {        
        logger.log('VisLogAppSide: Error removing settings listener:', error);
      }
      this._settings_listener = null;
    }

    this._side_service_instance = null;
    this._is_attached = false;
  }
}