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
 * Constructor interface for creating new Logger instances.
 */
export interface ILoggerConstructor {
  new (): ILogger;
}
