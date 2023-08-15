import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  log(message: string) {
    console.log(`[Log]: ${message}`);
  }

  error(message: string, trace: string) {
    console.error(`[Error]: ${message}, Trace: ${trace}`);
  }

  warn(message: string) {
    console.warn(`[Warning]: ${message}`);
  }

  debug(message: string) {
    console.debug(`[Debug]: ${message}`);
  }

  verbose(message: string) {
    console.log(`[Verbose]: ${message}`);
  }
}
