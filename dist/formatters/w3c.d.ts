import { ILogFormatter, LogLevel } from "../types";
/**
 * Formats log messages into the W3C Extended Log Format.
 * Often used for web access logs (IIS, AWS ELB, etc.).
 */
export declare class W3cFormatter implements ILogFormatter {
    format(level: LogLevel, args: any[]): string;
}
