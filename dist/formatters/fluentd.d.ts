import { ILogFormatter, LogLevel } from "../types";
/**
 * Formats log messages into the Fluentd Forward Protocol standard.
 * Outputs an array payload: `[ tag, timestamp, record ]`.
 */
export declare class FluentdFormatter implements ILogFormatter {
    format(level: LogLevel, args: any[]): string;
}
