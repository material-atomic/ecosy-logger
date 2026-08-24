import { ILogDelivery, LogLevel } from "../types";

/**
 * A built-in delivery transport that logs formatted data to the standard console.
 * Uses native console methods (info, log, warn, error, debug) matching the log level.
 * Safe for both browser and Node.js environments.
 */
export class ConsoleDelivery implements ILogDelivery {
  send(level: LogLevel, formattedData: any) {
    const logFn = console[level] as (...data: any[]) => void;
    if (Array.isArray(formattedData)) {
      logFn(...formattedData);
    } else {
      logFn(formattedData);
    }
  }
}
