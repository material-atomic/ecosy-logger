import { ILogFormatter, LogLevel } from "../types";
/**
 * Formats log messages into the Graylog Extended Log Format (GELF) v1.1.
 * Ideal for sending structured logs to Graylog or Logstash.
 */
export declare class GelfFormatter implements ILogFormatter {
    private mapLevel;
    format(level: LogLevel, args: any[]): string;
}
