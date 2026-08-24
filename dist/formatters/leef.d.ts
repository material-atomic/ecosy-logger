import { ILogFormatter, LogLevel } from "../types";
/**
 * Formats log messages into the Log Event Extended Format (LEEF) standard.
 * Commonly used by IBM QRadar.
 */
export declare class LeefFormatter implements ILogFormatter {
    format(level: LogLevel, args: any[]): string;
}
