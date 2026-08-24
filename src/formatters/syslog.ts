import { ILogFormatter, LogLevel } from "../types";
import { getHostname, parseArgs } from "../utils";

/**
 * Formats log messages into the Syslog protocol format (RFC 5424).
 * Includes Priority (PRI), version, timestamp, hostname, and message.
 */
export class SyslogFormatter implements ILogFormatter {
  private getPri(level: LogLevel): number {
    const severity: Record<LogLevel, number> = { error: 3, warn: 4, info: 6, log: 6, debug: 7 };
    return (1 * 8) + severity[level];
  }
  format(level: LogLevel, args: any[]) {
    const { summary } = parseArgs(args);
    const timeStr = new Date().toISOString();
    return `<${this.getPri(level)}>1 ${timeStr} ${getHostname()} core-app - - - ${summary}`;
  }
}
