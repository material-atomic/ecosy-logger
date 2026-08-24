import { ILogFormatter, LogLevel } from "../types";
/**
 * Formats log messages into the Common Event Format (CEF) standard.
 * Often used by ArcSight and other SIEM solutions.
 */
export declare class CefFormatter implements ILogFormatter {
    format(level: LogLevel, args: any[]): string;
}
