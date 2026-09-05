/**
 * Represents the severity level of a log entry.
 */
export type LogLevel = "info" | "log" | "warn" | "error" | "debug";

/**
 * Standard log formats supported by the logger factory.
 * Includes generic formats (JSON, TEXT) and specialized telemetry standards.
 */
export type LoggerStandard = "GELF" | "JSON" | "Syslog" | "CEF" | "LEEF" | "W3C" | "OTLP" | "Fluentd" | "Loki" | "TEXT" | (string & {});

/**
 * Strategy interface for formatting raw log arguments into a specific standard.
 */
export interface ILogFormatter {
  /**
   * Formats the log arguments according to the standard.
   * @param level The severity level of the log.
   * @param args The raw arguments passed to the logger.
   * @returns The formatted payload (can be a string, object, or array).
   */
  format(level: LogLevel, args: any[]): any;
}

/**
 * Strategy interface for delivering formatted log payloads to a destination.
 */
export interface ILogDelivery {
  /**
   * Sends the formatted log data to the designated transport layer (e.g. Console, HTTP, File).
   * @param level The severity level of the log.
   * @param formattedData The payload formatted by an ILogFormatter.
   */
  send(level: LogLevel, formattedData: any): void | Promise<void>;
}

/**
 * The primary logging interface used by applications.
 */
export interface ILogger {
  info(...args: any[]): void;
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  debug(...args: any[]): void;
}

/**
 * Severity order, lowest first. `log` and `info` sit at the same height: every
 * standard here treats them as one severity, and they differ only in which
 * console method receives them.
 */
export const LOG_SEVERITY: Record<LogLevel, number> = {
  debug: 10,
  log: 20,
  info: 20,
  warn: 30,
  error: 40,
};

/**
 * Settings a formatter reads. Each field falls back to what the formatter
 * emitted before it was configurable, so an existing setup is unaffected.
 */
export interface FormatterOptions {
  /**
   * The name this application reports itself as — Loki's `component`, OTLP's
   * `service.name`, Syslog's APP-NAME, the product field in CEF and LEEF.
   */
  service?: string;
}

/**
 * Anything console-shaped. The global `console` satisfies it, and so does a
 * test double that records what it was given.
 *
 * Only `log` is required: a target without a method for some level falls back
 * to `log`, which is how a minimal sink stays usable.
 */
export interface LogAdapter {
  log(...args: any[]): void;
  info?(...args: any[]): void;
  warn?(...args: any[]): void;
  error?(...args: any[]): void;
  debug?(...args: any[]): void;
}

/**
 * Settings for {@link Logger}.
 */
export interface LoggerOptions extends FormatterOptions {
  /** Output format. Defaults to `"TEXT"`. */
  standard?: LoggerStandard;
  /**
   * Where entries go. Defaults to `console`.
   *
   * Takes a console-shaped object, an {@link ILogDelivery}, or an array mixing
   * the two — a delivery is recognised by having a `send` method.
   */
  adapter?: LogAdapter | ILogDelivery | (LogAdapter | ILogDelivery)[];
  /**
   * Lowest severity to emit; anything below it is dropped **before** being
   * formatted. Defaults to `"debug"`, which emits everything.
   */
  level?: LogLevel;
  /**
   * Set `false` to silence the logger entirely — for a test run, or a build
   * where logging is switched off by configuration. Defaults to `true`.
   */
  enable?: boolean;
}

/**
 * Constructor interface for creating new Logger instances.
 */
export interface ILoggerConstructor {
  new (): ILogger;
}
