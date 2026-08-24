import { ILogFormatter, LogLevel } from "../types";
/**
 * Formats log messages into the OpenTelemetry (OTLP) Logs Data Model.
 * Outputs a JSON representation of the OTLP Protobuf structure.
 */
export declare class OtlpFormatter implements ILogFormatter {
    private mapSeverity;
    format(level: LogLevel, args: any[]): string;
}
