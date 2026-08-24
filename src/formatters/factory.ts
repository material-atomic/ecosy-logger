import { ILogFormatter, LoggerStandard } from "../types";
import { JsonFormatter } from "./json";
import { TextFormatter } from "./text";
import { GelfFormatter } from "./gelf";
import { SyslogFormatter } from "./syslog";
import { CefFormatter } from "./cef";
import { LeefFormatter } from "./leef";
import { W3cFormatter } from "./w3c";
import { OtlpFormatter } from "./otlp";
import { FluentdFormatter } from "./fluentd";
import { LokiFormatter } from "./loki";

/**
 * Factory class responsible for instantiating the correct log formatter based on the chosen standard.
 * Caches formatter instances to optimize memory usage (Singleton pattern).
 */
export class FormatterFactory {
  private static formatters: Record<string, ILogFormatter> = {
    "JSON": new JsonFormatter(),
    "TEXT": new TextFormatter(),
    "GELF": new GelfFormatter(),
    "Syslog": new SyslogFormatter(),
    "CEF": new CefFormatter(),
    "LEEF": new LeefFormatter(),
    "W3C": new W3cFormatter(),
    "OTLP": new OtlpFormatter(),
    "Fluentd": new FluentdFormatter(),
    "Loki": new LokiFormatter()
  };

  static get(standard?: LoggerStandard): ILogFormatter {
    if (!standard) return this.formatters["TEXT"];
    return this.formatters[standard] || this.formatters["TEXT"];
  }
}
