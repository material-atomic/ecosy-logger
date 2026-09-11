# @ecosy/logger

A multi-format, highly optimized logging strategy for the Ecosy Framework.
Designed with the Strategy and Factory patterns to decouple log formatting from log delivery.

## Features

- **10+ Supported Formats**: GELF, JSON, Syslog, CEF, LEEF, W3C, OTLP, Fluentd, Loki, and standard Text.
- **Delivery Strategy**: Easily plug in your own delivery transports (e.g., Console, File, Graylog, HTTP).
- **Zero Dependencies**: Lightweight, works perfectly in both Node.js and Browser environments.
- **Tree-Shakable**: Built with wildcard exports so you only bundle what you use.

## Installation

```bash
npm install @ecosy/logger
# or
yarn add @ecosy/logger
```

## Quick Start

```typescript
import { Logger } from "@ecosy/logger";
import { ConsoleDelivery } from "@ecosy/logger/deliveries/console";

// Create a logger using JSON format and output to Console
const MyJsonLogger = Logger("JSON", [new ConsoleDelivery()]);
const log = new MyJsonLogger();

log.info("Application started", { port: 3000 });
```

## Advanced: Custom Formatter & Delivery

You can inject multiple deliveries or build your own to send logs via network.

```typescript
import { Logger } from "@ecosy/logger";
import { ILogDelivery, LogLevel } from "@ecosy/logger/types";

class HttpDelivery implements ILogDelivery {
  send(level: LogLevel, formattedData: any) {
    // formattedData will be automatically formatted to OTLP JSON string
    fetch("https://otel.example.com/v1/logs", {
      method: "POST",
      body: formattedData,
    });
  }
}

// Automatically uses the OtlpFormatter
const OtelLogger = Logger("OTLP", [new HttpDelivery()]);
const log = new OtelLogger();

log.error("Failed to connect to DB", new Error("Timeout"));
```

## PRETTY: coloured console output, NestJS-style

```typescript
import { Logger } from "@ecosy/logger";

const AppLogger = Logger({ standard: "PRETTY", service: "api" });
new AppLogger("Router").log("Mapped {/users, GET}");
// [api] 41822  - 09/11/2026, 10:04:05 AM    LOG [Router] Mapped {/users, GET} +3ms
```

The context is the constructor's optional argument. Objects and Errors are
passed to the console as they are, after the line, so it can inspect them and
print a stack.

Colour belongs to the **destination**, not the logger — escape codes are right
for a terminal, `%c` styles for a browser console, and noise in a file or a log
collector. So it is the console delivery that colours, and only PRETTY entries:

- `color: "auto"` (default): ANSI on a TTY through the global `console`, CSS in
  a browser console, plain anywhere else — including a custom adapter.
  `NO_COLOR` turns it off, `FORCE_COLOR` on.
- `color: "ansi" | "css" | "none"`, or `true` / `false` for auto / none.
- `theme`: which colour each part takes. `NestTheme` is the default; a theme is
  plain data, so `{ ...NestTheme, context: "cyan" }` changes one part.

```typescript
Logger({ standard: "PRETTY", color: "auto", theme: { ...NestTheme, context: "cyan" } });
```

## Graylog

`GraylogDelivery` sends GELF 1.1 over HTTP (`fetch` — Node, browsers, edge) or
UDP (Node, chunked when a message exceeds one datagram). It builds the GELF
from the entry as logged, whatever the logger's standard, so one logger can
print PRETTY to the terminal and ship GELF at once:

```typescript
import { Logger, GraylogDelivery } from "@ecosy/logger";

const AppLogger = Logger({
  standard: "PRETTY",
  service: "sniprender",
  adapter: [
    console,
    new GraylogDelivery({ url: "http://graylog:12201/gelf", service: "sniprender" }),
    // or: new GraylogDelivery({ transport: "udp", host: "graylog", port: 12201 })
  ],
});

new AppLogger("Jobs").warn("retrying", { attempt: 2 });   // _context: "Jobs" in Graylog
```

A send that fails goes to `onError` (default `console.error`) and is never
thrown at the code that logged. Custom deliveries receive the same record as
their third argument — `send(level, formatted, { level, args, context, time })`
— to format for themselves.

## NestJS Integration

Since `@ecosy/logger` is completely framework-agnostic, it plays perfectly with NestJS. You can seamlessly replace the default NestJS logger by implementing `LoggerService`.

```typescript
import { LoggerService } from "@nestjs/common";
import { Logger } from "@ecosy/logger";
import { ConsoleDelivery } from "@ecosy/logger/deliveries/console";

// 1. Generate the base class with your preferred format
const EcosyBaseLogger = Logger("JSON", [new ConsoleDelivery()]);

// 2. Extend it and implement NestJS LoggerService
export class NestEcosyLogger extends EcosyBaseLogger implements LoggerService {
  // log, warn, error, and debug are automatically inherited!

  // Map NestJS's optional 'verbose' to Ecosy's 'info'
  verbose(message: any, ...optionalParams: any[]) {
    this.info(message, ...optionalParams);
  }

  // Optional: Map NestJS 'fatal' to error
  fatal(message: any, ...optionalParams: any[]) {
    this.error("FATAL: " + message, ...optionalParams);
  }
}
```

Then use it in your `main.ts`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new NestEcosyLogger(),
  });
  await app.listen(3000);
}
```

## Extending the Logger (Domain-Specific Logging)

Because the `Logger()` factory returns a class constructor, you can easily extend it to add your own domain-specific logging methods. This is perfect for standardizing audit logs, metrics, or user actions.

```typescript
import { Logger } from "@ecosy/logger";
import { ConsoleDelivery } from "@ecosy/logger/deliveries/console";

const BaseGelfLogger = Logger("GELF", [new ConsoleDelivery()]);

export class AuditLogger extends BaseGelfLogger {
  // Custom domain method
  logUserAction(
    userId: string,
    action: string,
    metadata: Record<string, any> = {},
  ) {
    // Under the hood, this will be formatted as GELF and sent to deliveries
    this.info("USER_ACTION", {
      userId,
      action,
      ...metadata,
    });
  }

  // Another custom method
  reportPayment(transactionId: string, amount: number) {
    this.warn("PAYMENT_RECEIVED", { transactionId, amount });
  }
}

const audit = new AuditLogger();
audit.logUserAction("user_123", "LOGIN_SUCCESS", { ip: "192.168.1.1" });
```
