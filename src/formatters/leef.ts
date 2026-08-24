import { ILogFormatter, LogLevel } from "../types";
import { parseArgs } from "../utils";

/**
 * Formats log messages into the Log Event Extended Format (LEEF) standard.
 * Commonly used by IBM QRadar.
 */
export class LeefFormatter implements ILogFormatter {
  format(level: LogLevel, args: any[]) {
    const { summary } = parseArgs(args);
    return `LEEF:2.0|CoreFramework|LoggerChain|1.0.0|${level.toUpperCase()}|^|cat=System^msg=${summary}^devTime=${new Date().toISOString()}`;
  }
}
