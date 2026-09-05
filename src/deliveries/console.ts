/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILogDelivery, LogAdapter, LogLevel } from "../types";

/**
 * Sends formatted entries to a console-shaped target.
 *
 * Calls the method matching the level, falling back to `log` when the target
 * has none, and spreads an array payload — which is what makes `TEXT` render
 * as if `console.log` had been called directly.
 *
 * Safe in both the browser and Node.
 */
export class ConsoleDelivery implements ILogDelivery {
  /**
   * @param target Where to write. Defaults to the global `console`.
   */
  constructor(private readonly target: LogAdapter = console) {}

  send(level: LogLevel, formattedData: any) {
    const logFn = (this.target[level] ?? this.target.log).bind(this.target) as (...data: any[]) => void;

    if (Array.isArray(formattedData)) {
      logFn(...formattedData);
    } else {
      logFn(formattedData);
    }
  }
}
