import { ILogFormatter, LogLevel } from "../types";
import { getHostname, parseArgs } from "../utils";

/**
 * Formats log messages into the Graylog Extended Log Format (GELF) v1.1.
 * Ideal for sending structured logs to Graylog or Logstash.
 */
export class GelfFormatter implements ILogFormatter {
  private mapLevel(level: LogLevel): number {
    const mapping: Record<LogLevel, number> = { error: 3, warn: 4, info: 6, log: 6, debug: 7 };
    return mapping[level];
  }
  format(level: LogLevel, args: any[]) {
    const { summary, full } = parseArgs(args);
    return JSON.stringify({
      version: "1.1",
      host: getHostname(),
      short_message: summary,
      full_message: full,
      timestamp: Date.now() / 1000,
      level: this.mapLevel(level),
      _framework_chain: "logger-core"
    });
  }
}
