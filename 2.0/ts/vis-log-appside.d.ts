/**
 * VisLogAppSide - Side service logger with Settings relay
 */
export class VisLogAppSide extends VisLogSideCore {
    /**
     * Create VisLogAppSide instance
     * @param {Object} [options={}] - Configuration options
     * @param {string} [options.filename=''] - Filename/module name to show in logs for identification
     * @param {boolean} [options.enabled=true] - Whether logging and relay functionality is enabled
     
    * @example
    * const vis = new VisLogAppSide();
    * vis.log("Hello from AppSide!");
    */
    constructor(options?: {
        filename?: string;
        enabled?: boolean;
    });
    /** @private */
    private _side_service_instance;
    /** @private */
    private _is_attached;
    /** @private */
    private _settings_listener;
    /**
     * Attach to side service
     * @param {Object} side_service_instance - The 'this' context from BaseSideService
     * @param {Object} [options={}] - Configuration options
     */
    attachSideRelay(side_service_instance: any, options?: any): void;
    /** @private */
    private _writeLog;
    /** @private */
    private _setupRelay;
    /** @private */
    private _relaySettingsLog;
    /**
     * Detach from side service
     */
    detachSideRelay(): void;
}
import VisLogSideCore from './core';
