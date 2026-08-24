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
