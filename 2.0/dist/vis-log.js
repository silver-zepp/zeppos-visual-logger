/** @about Visual Logger 1.2.3 @min_zeppos 2.0 @author: Silver, Zepp Health. @license: MIT */
import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
// import { getDeviceInfo, SCREEN_SHAPE_ROUND } from "@zos/device";
import { getDeviceInfoPlus } from "./helpers/get_device_info_plus";
import { log as Logger } from "@zos/utils";

export { hmUI };
export { px };
export const {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT,
  // screenShape,
} = getDeviceInfoPlus();

export { getDeviceInfoPlus };

const is_round_screen = getDeviceInfoPlus().shape == "R" ? true : false;

let logger;

const PREFIX_LOG = "LOG";
const PREFIX_INFO = "INFO";
const PREFIX_WARN = "WARN";
const PREFIX_ERR = "ERR";
const PREFIX_DBG = "DBG";
const PREFIX_WARN_U = "○"; // ! ○
const PREFIX_ERR_U = "⊗";
const PREFIX_INFO_LOG_DBG_U = "ⓘ";

// scroll
const DEFAULT_LINE_COUNT = 5; // debug array buffer
let messages_arr = new Array(DEFAULT_LINE_COUNT).fill("");
let repeats_arr = new Array(DEFAULT_LINE_COUNT).fill(0); // @add 1.02

const COLOR_WHITE = 0xffffff;
const DEFAULT_BACKGROUND_COLOR = 0x333333;
const DEFAULT_PADDING_MULT = 1.5;
const DEFAULT_TEXT_SIZE = 16;
const DEFAULT_TEXT_STYLE = hmUI.text_style.ELLIPSIS;
const DEFAULT_INITIAL_TIMEOUT = 5000;
const DEFAULT_NEXT_TIMEOUT = 2000;

const TEXT_STYLE = {
  h: 0,
  w: DEVICE_WIDTH,
  color: COLOR_WHITE,
  text_size: DEFAULT_TEXT_SIZE,
  align_h: hmUI.align.CENTER_H, // CENTER_H LEFT
  text_style: DEFAULT_TEXT_STYLE, // WRAP NONE ELLIPSIS
};
// background
const BG_STYLE = {
  x: 0,
  w: DEVICE_WIDTH,
  color: DEFAULT_BACKGROUND_COLOR,
};

export default class VisLog { // @fix 1.0.8
  #text_size = DEFAULT_TEXT_SIZE;
  #text_style = DEFAULT_TEXT_STYLE;
  #text_color = COLOR_WHITE;
  #background_color = DEFAULT_BACKGROUND_COLOR;
  #line_count = DEFAULT_LINE_COUNT;
  #log_from_top = true;
  #console_log_enabled = true;
  #prefix_enabled = true;
  #timeout_enabled = true;
  #visual_log_enabled = true;
  #text_widget = null;
  #background_widget = null;
  #timer = null;
  #background_enabled = true;
  #padding_multiplier = DEFAULT_PADDING_MULT;
  #margin = 0;

  #is_widgets_created = false;
  #is_custom_margin = false;

  #view_container = null;
  #use_logger = false;
  #reverse_order = false;

  // config for text wrapping
  #chars_per_line_estimate_factor = 0.60; // higher = better distance handling
  #round_screen_width_reduction_factor = 0.85;

  #filename = null;

  /**
   * Create a new VisLog instance.
   * @param {string} [filename=""] - The filename to show in console.log messages (optional).
   */
  constructor(filename = "") {
    this.#filename = filename;
    if (!is_round_screen) this.#log_from_top = false;
    this.#createViewContainer();
  }

  /**
   * Log a message with an "LOG" prefix.
   * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
   */
  log(...args) {
    this.#logWithPrefix(PREFIX_INFO_LOG_DBG_U, PREFIX_LOG, ...args);
  }

  /**
   * Log a message with an "INFO" prefix.
   * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
   */
  info(...args) {
    this.#logWithPrefix(PREFIX_INFO_LOG_DBG_U, PREFIX_INFO, ...args);
  }

  /**
   * Log a message with a "WARN" prefix.
   * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
   */
  warn(...args) {
    this.#logWithPrefix(PREFIX_WARN_U, PREFIX_WARN, ...args);
  }

  /**
   * Log a message with an "ERR" prefix.
   * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
   */
  error(...args) {
    this.#logWithPrefix(PREFIX_ERR_U, PREFIX_ERR, ...args);
  }

  /**
   * Log a message with an "DBG" prefix.
   * @param {...any} args - The message to log, as one or more arguments that will be joined into a single string.
   */
  debug(...args) {
    this.#logWithPrefix(PREFIX_INFO_LOG_DBG_U, PREFIX_DBG, ...args);
  }

  /**
   * Clear all messages from the logger.
   */
  clear() {
    messages_arr = new Array(this.#line_count).fill("");
    repeats_arr = new Array(this.#line_count).fill(0);
    this.#renderText();
  }
  /**
   * Refreshing the widget will help it appear on top of other widgets as well as fixing the missing background.
   */
  refresh() {
    this.#destroyWidgets();
    this.#createViewContainer();
    this.#recreateWidgets();
    this.#renderText();
  }

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
   * @param {boolean} [settings.reverse_order] - Whether to display messages in reverse order (bottom-to-top). (@default=false)
   * @param {boolean} [settings.use_logger] - Whether to use the Logger class instead of console.log. (@default=false)
   */
  updateSettings(settings) {
    if (typeof settings.filename === "string") {
      this.#filename = settings.filename;
      if (this.#use_logger) {
        logger = Logger.getLogger(settings.filename);
      }
    }
    if (typeof settings.log_from_top === "boolean") {
      this.#log_from_top = settings.log_from_top;
    }
    if (typeof settings.console_log_enabled === "boolean") {
      this.#console_log_enabled = settings.console_log_enabled;
    }
    if (typeof settings.prefix_enabled === "boolean") {
      this.#prefix_enabled = settings.prefix_enabled;
    }
    if (typeof settings.timeout_enabled === "boolean") {
      this.#timeout_enabled = settings.timeout_enabled;
    }
    if (typeof settings.visual_log_enabled === "boolean") {
      this.#visual_log_enabled = settings.visual_log_enabled;

      // hide bg @fix 1.0.6
      if (this.#background_widget) {
        this.#background_widget.setProperty(
          hmUI.prop.VISIBLE,
          settings.visual_log_enabled && this.#background_enabled
        );
      }
      // hide text
      if (this.#text_widget) {
        this.#text_widget.setProperty(
          hmUI.prop.VISIBLE,
          settings.visual_log_enabled
        );
      }
    }
    if (typeof settings.background_enabled === "boolean") {
      this.#background_enabled = settings.background_enabled;
      if (this.#background_widget) {
        this.#background_widget.setProperty(
          hmUI.prop.VISIBLE,
          settings.background_enabled && this.#visual_log_enabled
        );
      }
    }
    if (typeof settings.text_size === "number") {
      this.#text_size = settings.text_size;
    }
    if (typeof settings.text_style === "number") {
      this.#text_style = settings.text_style;
    }
    if (typeof settings.text_color === "number") {
      this.#text_color = settings.text_color;
    }
    if (typeof settings.background_color === "number") {
      this.#background_color = settings.background_color;
    }
    if (typeof settings.line_count === "number") {
      this.#line_count = settings.line_count;
      this.#trimArrays();
    }
    if (typeof settings.padding_multiplier === "number") {
      this.#padding_multiplier = settings.padding_multiplier;
    }
    if (typeof settings.margin === "number") {
      this.#margin = settings.margin;
      this.#is_custom_margin = true;
    }

    if (typeof settings.reverse_order === "boolean") {
      this.#reverse_order = settings.reverse_order;
    }
    if (typeof settings.use_logger === "boolean") {
      this.#use_logger = settings.use_logger;
      logger = Logger.getLogger(this.#filename);
    }

    this.#renderText(); // @fix 1.0.4
  }

  /**
   * Destroy the VisLog instance, clean up resources, and remove widgets.
   */
  destroy() {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }

    this.#destroyWidgets();

    messages_arr = [];
    repeats_arr = [];

    this.#is_widgets_created = false;
    this.#is_custom_margin = false;

    logger = null;
  }

  #createViewContainer() {
    if (this.#view_container) {
      hmUI.deleteWidget(this.#view_container);
    }
    this.#view_container = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, {
      x: 0,
      y: 0,
      w: DEVICE_WIDTH,
      h: DEVICE_HEIGHT,
      scroll_enable: false,
      z_index: 999 // always on top (TODO: maybe should make it adjustable?)
    });
  }

  #recreateWidgets() {
    if (this.#background_enabled) {
      this.#background_widget = this.#view_container.createWidget(hmUI.widget.FILL_RECT, {
        ...BG_STYLE,
      });
    }
    this.#text_widget = this.#view_container.createWidget(hmUI.widget.TEXT, {
      ...TEXT_STYLE,
    });
    this.#is_widgets_created = true;
  }

  #logWithPrefix(prefix_visual, prefix_console, ...args) {
    let msg_content = args.join(" ");
    let msg_for_array = msg_content;

    if (this.#prefix_enabled) {
      msg_for_array = `${prefix_visual} ${msg_content}`;
    }

    // dups check is on message with its visual prefix
    const last_message_index = messages_arr.length > 0 ? messages_arr.length - 1 : -1;
    let is_repeated = false;
    if (last_message_index !== -1) {
      is_repeated = msg_for_array === messages_arr[last_message_index];
    }

    if (is_repeated) {
      // update the repeat counter for a repeated message
      repeats_arr[repeats_arr.length - 1]++;
    } else {
      // add new message to the end of the array
      messages_arr.push(msg_for_array);
      repeats_arr.push(1);
      this.#trimArrays();
    }

    // @fix 1.02
    if (this.#timeout_enabled) {
      if (!this.#timer) {
        this.#timer = this.#createTimer(DEFAULT_INITIAL_TIMEOUT, 0, () =>
          this.#removeOldestMessage()
        );
      } else {
        clearTimeout(this.#timer);
        this.#timer = this.#createTimer(DEFAULT_INITIAL_TIMEOUT, 0, () =>
          this.#removeOldestMessage()
        );
      }
    }

    if (this.#visual_log_enabled) {
      this.#renderText();
    }
    this.#consoleLog(prefix_console, msg_content);
  }

  #getActualMessagesCount() {
    return messages_arr.filter((msg) => typeof msg === 'string' && msg !== "").length;
  }


  #removeOldestMessage() {
    const num_stored_messages = this.#getActualMessagesCount();

    if (num_stored_messages > 0) {
      messages_arr.shift();
      repeats_arr.shift();

      if (this.#visual_log_enabled) {
        this.#renderText();
      }

      const remaining_messages = this.#getActualMessagesCount();
      if (this.#timer) {
        clearTimeout(this.#timer);
        this.#timer = null;
      }

      if (remaining_messages > 0 && this.#timeout_enabled) {
        this.#timer = this.#createTimer(DEFAULT_NEXT_TIMEOUT, 0, () =>
          this.#removeOldestMessage()
        );
      }
    } else {
      if (this.#timer) {
        clearTimeout(this.#timer);
        this.#timer = null;
      }
    }
  }

  #trimArrays() {
    while (messages_arr.length > this.#line_count) {
      messages_arr.shift();
      repeats_arr.shift();
    }
  }

  #wrapText(text_to_wrap, max_chars) {
    if (max_chars <= 0) return [text_to_wrap];

    const lines = [];
    let current_line = "";
    const words = String(text_to_wrap).split(' ');

    for (const word of words) {
      if (word.length === 0 && current_line.length === 0 && lines.length === 0 && words.length === 1) {
        lines.push("");
        break;
      }
      if (word.length === 0 && current_line.length > 0) {
        continue;
      }


      if (current_line.length === 0) {
        // word fits, or word is too long and will be chunked
        if (word.length <= max_chars) {
          current_line = word;
        } else {
          // word is longer than max_chars
          let temp_word = word;
          while (temp_word.length > max_chars) {
            lines.push(temp_word.substring(0, max_chars));
            temp_word = temp_word.substring(max_chars);
          }
          current_line = temp_word; // long word %
        }
      } else if (current_line.length + 1 + word.length <= max_chars) {
        current_line += " " + word;
      } else {
        // word doesn't fit
        lines.push(current_line);
        if (word.length <= max_chars) {
          current_line = word;
        } else {
          // word is longer than max_chars
          let temp_word = word;
          while (temp_word.length > max_chars) {
            lines.push(temp_word.substring(0, max_chars));
            temp_word = temp_word.substring(max_chars);
          }
          current_line = temp_word;
        }
      }
    }

    if (current_line.length > 0 || (lines.length === 0 && words.length > 0 && words[0].length === 0) || (lines.length === 0 && words.length === 0)) {
      lines.push(current_line);
    }

    return lines.length > 0 ? lines : [""];
  }


  #renderText() {
    let final_text_for_widget = "";
    let total_visual_lines = 0;
    const background_configs = [];

    const msg2render = this.#reverse_order ? messages_arr.slice().reverse() : messages_arr.slice();
    const repeats2render = this.#reverse_order ? repeats_arr.slice().reverse() : repeats_arr.slice();

    const effective_screen_width = is_round_screen ? DEVICE_WIDTH * this.#round_screen_width_reduction_factor : DEVICE_WIDTH;
    // this.#chars_per_line_estimate_factor = fine tune
    const avg_char_width_px = this.#text_size * this.#chars_per_line_estimate_factor;
    let max_chars_per_line = avg_char_width_px > 0 ? Math.floor(effective_screen_width / avg_char_width_px) : 20;
    max_chars_per_line = Math.max(max_chars_per_line, 5);

    let current_log_entry_index = 0;

    for (let i = 0; i < msg2render.length; i++) {
      if (typeof msg2render[i] === 'string' && msg2render[i] !== "") {
        let entry_text_to_wrap = "";
        if (repeats2render[i] > 1) {
          entry_text_to_wrap += `[${repeats2render[i]}] `;
        }
        entry_text_to_wrap += msg2render[i];

        const wrapped_lines_for_current_entry = this.#wrapText(entry_text_to_wrap, max_chars_per_line);

        if (final_text_for_widget.length > 0) {
          final_text_for_widget += "\n";
        }
        final_text_for_widget += wrapped_lines_for_current_entry.join("\n");

        if (this.#background_enabled) {
          background_configs.push({
            start_visual_line: total_visual_lines,
            num_visual_lines: wrapped_lines_for_current_entry.length,
            original_log_index: this.#reverse_order ? (messages_arr.length - 1 - current_log_entry_index) : current_log_entry_index
          });
        }
        total_visual_lines += wrapped_lines_for_current_entry.length;
        current_log_entry_index++;
      }
    }

    const single_line_height = this.#text_size * this.#padding_multiplier;
    const text_block_total_height = total_visual_lines * single_line_height;

    // @add 1.0.5
    if (is_round_screen) { // screenShape === SCREEN_SHAPE_ROUND
      if (!this.#is_custom_margin) {
        this.#margin = this.#text_size;
      }
    }

    let container_y, content_y_offset_in_container;
    if (this.#log_from_top) {
      container_y = 0;
      content_y_offset_in_container = this.#margin;
    } else {
      container_y = DEVICE_HEIGHT - (text_block_total_height + this.#margin * 2);
      content_y_offset_in_container = this.#margin;
    }

    const container_total_height = text_block_total_height + this.#margin * 2;

    // update VIEW_CONTAINER position
    if (!this.#view_container) this.#createViewContainer();

    this.#view_container.setProperty(hmUI.prop.MORE, {
      y: container_y,
      h: container_total_height
    });

    // z-sorting fix and widget creation
    if (!this.#is_widgets_created) this.#recreateWidgets();

    // update background
    if (this.#background_widget && this.#background_enabled && this.#visual_log_enabled) {
      this.#background_widget.setProperty(hmUI.prop.MORE, {
        x: 0,
        y: content_y_offset_in_container,
        h: text_block_total_height,
        w: DEVICE_WIDTH,
        color: this.#background_color,
      });
      this.#background_widget.setProperty(hmUI.prop.VISIBLE, true);
    } else if (this.#background_widget) {
      this.#background_widget.setProperty(hmUI.prop.VISIBLE, false);
    }

    // update text
    if (this.#visual_log_enabled) {
      if (this.#text_widget) {
        this.#text_widget.setProperty(hmUI.prop.MORE, {
          x: 0,
          y: content_y_offset_in_container,
          w: DEVICE_WIDTH,
          h: text_block_total_height,
          text: final_text_for_widget,
          text_size: this.#text_size,
          text_style: this.#text_style,
          color: this.#text_color,
        });
        this.#text_widget.setProperty(hmUI.prop.VISIBLE, true);
      }
    } else {
      if (this.#text_widget) this.#text_widget.setProperty(hmUI.prop.VISIBLE, false);
    }
  }

  #destroyWidgets() {
    if (this.#view_container) {
      if (this.#background_widget) {
        hmUI.deleteWidget(this.#background_widget);
        this.#background_widget = null;
      }
      if (this.#text_widget) {
        hmUI.deleteWidget(this.#text_widget);
        this.#text_widget = null;
      }

      hmUI.deleteWidget(this.#view_container);
      this.#view_container = null;
      this.#is_widgets_created = false;
    }
  }

  // createTimer replica for OS 2.0
  #createTimer(startup_delay, repeat_delay, callback) {
    const bound_callback = callback.bind(this);
    const timer = setTimeout(() => {
      bound_callback();
      if (repeat_delay > 0) {
        // bugged?
        // this.#timer = this.#createTimer(repeat_delay, repeat_delay, callback);
      }
    }, startup_delay);

    return timer;
  }
  // console
  #consoleLog(prefix, msg) {
    if (this.#console_log_enabled) {
      if (this.#use_logger) {
        if (!logger && this.#filename) {
          logger = Logger.getLogger(this.#filename);
        }

        switch (prefix) {
          case PREFIX_LOG:
            logger.log(msg);
            break;
          case PREFIX_INFO:
            logger.info(msg);
            break;
          case PREFIX_WARN:
            logger.warn(msg);
            break;
          case PREFIX_ERR:
            logger.error(msg);
            break;
          case PREFIX_DBG:
            logger.debug(msg);
            break;
          default:
            logger.log(msg);
            break;
        }
      } else {
        if (this.#prefix_enabled && this.#filename) {
          msg = `[${prefix}] [${this.#filename}] ${msg}`;
        } else if (this.#prefix_enabled) {
          msg = `[${prefix}] ${msg}`;
        } else if (this.#filename) {
          msg = `[${this.#filename}] ${msg}`;
        }
        console.log(msg);
      }
    }
  }
}

/**
 * @changelog
 * 1.0.0
 * - initial release
 * 1.0.2
 * - @fix timeout resets on a repeated message
 * - @add second array to properly handle repeated messages
 * 1.0.4
 * - @fix render refresh on each updateSettings()
 * - @fix default top text starting position
 * 1.0.5
 * - @add screen shape check with default margin assignment
 * 1.0.6
 * - @fix hiding background along with the text
 * 1.0.7
 * - @add moved from console.log to logger.log to keep colorful logs
 * 1.0.8
 * - @fix added missing default to the entry class
 * 1.1.1
 * - @add logger now sticks in place, allowing the use of scroll
 * - @add reverse_order flag to switch the direction of the logs (default now top-to-bottom)
 * - @add use_logger flag to use Logger class, by default vis now uses console.log to reduce spam
 * 1.1.2
 * - @fix refresh() method wasn't recreating widget's container
 * 1.1.3
 * - @add destroy() method to clean up visual logger when dealing with multiple pages
 * 1.2.0
 * - @add vislog no longer requires "data:os.device.info" permission
 * - @add getDeviceInfoPlus() - a getter for basic device info like screen resolution. doesn't require .info permission.
 * - @upd vislog example updated to support multiple devices
 * - @rem px() removed. bugged for automation on newer devices
 * - @rem replaced ⚠ warn symbol with ○ as it was read as emoji and looked bugged
 * - @fix multiple bugfixes
 * 1.2.3
 * - @fix filename support for console.log output
 * - @fix by default log from bottom on SQUARE devices. otherwise status bar overlaps it
 * - @add library support for Balance 2 and Bip 6
 */