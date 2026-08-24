import { ILogDelivery, ILoggerConstructor, LoggerStandard } from "./types";
/**
 * Factory function that creates a new custom Logger class.
 * The Logger class is bound to a specific formatting standard and a set of delivery transports.
 *
 * @param standard The log format standard (e.g. "JSON", "GELF", "OTLP"). Defaults to "TEXT".
 * @param deliveries An array of ILogDelivery transports to dispatch logs to. Defaults to ConsoleDelivery.
 * @returns A class constructor implementing ILogger.
 */
export declare function Logger(standard?: LoggerStandard, deliveries?: ILogDelivery[]): ILoggerConstructor;
