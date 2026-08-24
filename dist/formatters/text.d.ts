import { ILogFormatter, LogLevel } from "../types";
/**
 * A pass-through formatter that returns the raw arguments.
 * Typically used with ConsoleDelivery for default terminal output.
 */
export declare class TextFormatter implements ILogFormatter {
    format(_level: LogLevel, args: any[]): any[];
}
