import { ILogFormatter, LogLevel } from "../types";
import { getHostname, parseArgs } from "../utils";

/**
 * Formats log messages into the Fluentd Forward Protocol standard.
 * Outputs an array payload: `[ tag, timestamp, record ]`.
 */
export class FluentdFormatter implements ILogFormatter {
  format(level: LogLevel, args: any[]) {
    return JSON.stringify([
      `app.chain.${level}`,
      Math.floor(Date.now() / 1000),
      { message: parseArgs(args).summary, host: getHostname() }
    ]);
  }
}
