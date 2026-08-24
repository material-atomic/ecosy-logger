import { ILogFormatter, LogLevel } from "../types";
/**
 * Formats log messages into a structured JSON string.
 * Includes level, timestamp, host, and raw data.
 */
export declare class JsonFormatter implements ILogFormatter {
    format(level: LogLevel, args: any[]): string;
}
