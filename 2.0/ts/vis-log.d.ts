export const DEVICE_WIDTH: any;
export const DEVICE_HEIGHT: any;
export const screenShape: any;
export default class VisLog {
    /**
     * Create a new VisLog instance.
     * @param {string} [filename=""] - The filename to show in console.log messages (optional).
     */
    constructor(filename?: string);
    /**
     * Log a message with an "LOG" prefix.
     * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
     */
    log(...args: any[]): void;
    /**
     * Log a message with an "INFO" prefix.
     * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
     */
    info(...args: any[]): void;
    /**
     * Log a message with a "WARN" prefix.
     * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
     */
    warn(...args: any[]): void;
    /**
     * Log a message with an "ERR" prefix.
     * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
     */
    error(...args: any[]): void;
    /**
     * Log a message with an "DBG" prefix.
     * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
     */
    debug(...args: any[]): void;
    /**
     * Clear all messages from the logger.
     */
    clear(): void;
    /**
     * Refreshing the widget will help it appear on top of other widgets as well as fixing the missing background.
     */
    refresh(): void;
    /**
     * Update the settings for this VisLog instance.
     * @param {Object} settings - An object containing the settings to update.
     * @param {string} [settings.filename] - The new filename to show in console.log messages.
     * @param {boolean} [settings.log_from_top] - Whether to position the logger at the top or the bottom of the screen.
     * @param {boolean} [settings.console_log_enabled] - Whether to enable console logging.
     * @param {boolean} [settings.prefix_enabled] - Whether to include a prefix in log messages.
     * @param {boolean} [settings.timeout_enabled] - Whether to automatically remove old messages after a timeout.
     * @param {boolean} [settings.visual_log_enabled] - Whether to enable visual logging.
     * @param {boolean} [settings.background_enabled] - Whether to enable background behind the text.
     * @param {number} [settings.text_size] - The size of the text in the visual log.(@default=16)
     * @param {number} [settings.text_style] - The style of the text in the visual log. (@default=hmUI.text_style.ELLIPSIS)
     * @param {number} [settings.text_color] - The color of the text in the visual log.
     * @param {number} [settings.background_color] - The color of the background in the visual log.
     * @param {number} [settings.line_count] - Maximum amount of vertical lines for the visual log. (@default=5)
     * @param {number} [settings.padding_multiplier] - The padding multiplier to fine tune vertical text position on different devices. (@default=1.5) Try increasing this value if you don't see the widget.
     * @param {number} [settings.margin] - The margin in pixels to fine tune vertical text position on different devices. (@default=0) Try increasing this value if the text doesn't fit the screen.
     */
    updateSettings(settings: {
        filename?: string;
        log_from_top?: boolean;
        console_log_enabled?: boolean;
        prefix_enabled?: boolean;
        timeout_enabled?: boolean;
        visual_log_enabled?: boolean;
        background_enabled?: boolean;
        text_size?: number;
        text_style?: number;
        text_color?: number;
        background_color?: number;
        line_count?: number;
        padding_multiplier?: number;
        margin?: number;
    }): void;
    #private;
}
export { hmUI, px };
