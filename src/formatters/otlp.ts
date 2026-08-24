import { ILogFormatter, LogLevel } from "../types";
import { getHostname, parseArgs } from "../utils";

/**
 * Formats log messages into the OpenTelemetry (OTLP) Logs Data Model.
 * Outputs a JSON representation of the OTLP Protobuf structure.
 */
export class OtlpFormatter implements ILogFormatter {
  private mapSeverity(level: LogLevel): { text: string, num: number } {
    const map: Record<LogLevel, { text: string, num: number }> = {
      trace: { text: "TRACE", num: 1 },
      debug: { text: "DEBUG", num: 5 },
      info: { text: "INFO", num: 9 },
      log: { text: "INFO", num: 9 },
      warn: { text: "WARN", num: 13 },
      error: { text: "ERROR", num: 17 }
    } as any;
    return map[level] || { text: "INFO", num: 9 };
  }
  format(level: LogLevel, args: any[]) {
    const { summary } = parseArgs(args);
    const sev = this.mapSeverity(level);
    return JSON.stringify({
      timeUnixNano: (Date.now() * 1000000).toString(),
      severityNumber: sev.num,
      severityText: sev.text,
      body: { stringValue: summary },
      attributes: [{ key: "host.name", value: { stringValue: getHostname() } }],
      resources: { attributes: [{ key: "service.name", value: { stringValue: "core-image" } }] }
    });
  }
}
