import { ILogFormatter, LogLevel } from "../types";
/**
 * Formats log messages into the Grafana Loki JSON Stream format.
 * Groups log streams with nanosecond timestamps.
 */
export declare class LokiFormatter implements ILogFormatter {
    format(level: LogLevel, args: any[]): string;
}
