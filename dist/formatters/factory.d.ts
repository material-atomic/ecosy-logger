import { ILogFormatter, LoggerStandard } from "../types";
/**
 * Factory class responsible for instantiating the correct log formatter based on the chosen standard.
 * Caches formatter instances to optimize memory usage (Singleton pattern).
 */
export declare class FormatterFactory {
    private static formatters;
    static get(standard?: LoggerStandard): ILogFormatter;
}
