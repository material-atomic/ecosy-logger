import { ILogFormatter, LogLevel } from "../types";
/**
 * Formats log messages into the Syslog protocol format (RFC 5424).
 * Includes Priority (PRI), version, timestamp, hostname, and message.
 */
export declare class SyslogFormatter implements ILogFormatter {
    private getPri;
    format(level: LogLevel, args: any[]): string;
}
