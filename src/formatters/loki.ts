import { ILogFormatter, LogLevel } from "../types";
import { getHostname, parseArgs } from "../utils";

/**
 * Formats log messages into the Grafana Loki JSON Stream format.
 * Groups log streams with nanosecond timestamps.
 */
export class LokiFormatter implements ILogFormatter {
  format(level: LogLevel, args: any[]) {
    const { summary } = parseArgs(args);
    return JSON.stringify({
      streams: [
        {
          stream: { level: level, host: getHostname(), component: "core-image" },
          values: [
            [(Date.now() * 1000000).toString(), summary]
          ]
        }
      ]
    });
  }
}
