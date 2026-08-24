import { ILogFormatter, ILogDelivery, ILogger, ILoggerConstructor, LogLevel, LoggerStandard } from "./types";
import { FormatterFactory } from "./formatters/factory";
import { ConsoleDelivery } from "./deliveries/console";

abstract class AbstractLogger implements ILogger {
  protected abstract readonly formatter: ILogFormatter;
  protected abstract readonly deliveries: ILogDelivery[];

  protected dispatch(level: LogLevel, args: any[]) {
    const formatted = this.formatter.format(level, args);
    for (const delivery of this.deliveries) {
      try {
        const result = delivery.send(level, formatted);
        if (result instanceof Promise) {
          result.catch(err => console.error("[Logger] Async Delivery Error:", err));
        }
      } catch (err) {
        console.error("[Logger] Sync Delivery Error:", err);
      }
    }
  }

  info(...args: any[]) { this.dispatch("info", args); }
  log(...args: any[]) { this.dispatch("log", args); }
  warn(...args: any[]) { this.dispatch("warn", args); }
  error(...args: any[]) { this.dispatch("error", args); }
  debug(...args: any[]) { this.dispatch("debug", args); }
}

/**
 * Factory function that creates a new custom Logger class.
 * The Logger class is bound to a specific formatting standard and a set of delivery transports.
 * 
 * @param standard The log format standard (e.g. "JSON", "GELF", "OTLP"). Defaults to "TEXT".
 * @param deliveries An array of ILogDelivery transports to dispatch logs to. Defaults to ConsoleDelivery.
 * @returns A class constructor implementing ILogger.
 */
export function Logger(
  standard?: LoggerStandard, 
  deliveries: ILogDelivery[] = [new ConsoleDelivery()]
): ILoggerConstructor {
  const staticFormatter = FormatterFactory.get(standard);

  return class CustomLogger extends AbstractLogger {
    protected readonly formatter = staticFormatter;
    protected readonly deliveries = deliveries;
  };
}
