/**
 * VisLogAppSettings - Settings page logger
 */
export class VisLogAppSettings extends VisLogSideCore {
    /**
     * Create VisLogAppSettings instance
     * @param {Object} [options={}] - Configuration options
     * @param {string} [options.filename=''] - Filename/module name to show in logs
     * @param {boolean} [options.enabled=true] - Whether logging is enabled
     */
    constructor(options?: {
        filename?: string;
        enabled?: boolean;
    });
    /** @private */
    private _settings_storage;
    /** @private */
    private _is_initialized;
    /**
     * Attach to settings storage and initialize logging
     * @param {Object} settings_storage - Settings storage object from props.settingsStorage
     * @param {Object} [options={}] - Configuration options
     * @param {string} [options.filename] - Override filename for this instance
     * @param {boolean} [options.clear_on_init=true] - Whether to clear old debug logs
     */
    attachSettingsRelay(settings_storage: any, options?: {
        filename?: string;
        clear_on_init?: boolean;
    }): void;
    /**
     * Check if the logger is initialized and ready to use
     * @returns {boolean}
     */
    initialized(): boolean;
    /**
     * Clear all debug messages
     */
    clear(): void;
    /** @private */
    private _clearOldLogs;
    /**
     * Destroy the logger
     */
    destroy(): void;
}
import VisLogSideCore from './core';
