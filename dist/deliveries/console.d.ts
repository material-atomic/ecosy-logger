import { ILogDelivery, LogLevel } from "../types";
/**
 * A built-in delivery transport that logs formatted data to the standard console.
 * Uses native console methods (info, log, warn, error, debug) matching the log level.
 * Safe for both browser and Node.js environments.
 */
export declare class ConsoleDelivery implements ILogDelivery {
    send(level: LogLevel, formattedData: any): void;
}
