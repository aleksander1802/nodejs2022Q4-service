import { Injectable, LoggerService, Logger, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ILoggingError } from './logging-error';

@Injectable()
export class LoggingService implements LoggerService {
  private logFilePath = path.resolve(__dirname, '../../logs/application.log');
  private errorLogFilePath = path.resolve(__dirname, '../../logs/error.log');
  private currentLogLevel = (process.env.LOG_LEVEL as LogLevel) || 'verbose';
  private maxLogFileSizeKb: number =
    parseInt(process.env.MAX_LOG_FILE_SIZE_KB, 10) || 1024;

  private logger = new Logger();

  log(message: string) {
    this.logMessage('log', message);
  }

  error(data: ILoggingError) {
    this.logMessage('error', this.formatErrorLog(data), true);
  }

  warn(message: string) {
    this.logMessage('warn', message);
  }

  debug(message: string) {
    this.logMessage('debug', message);
  }

  verbose(message: string) {
    this.logMessage('verbose', message);
  }

  private shouldLog(level: LogLevel): boolean {
    const logLevelValues: Record<LogLevel, number> = {
      log: 0,
      error: 1,
      warn: 2,
      debug: 3,
      verbose: 4,
    };

    return logLevelValues[level] <= logLevelValues[this.currentLogLevel];
  }

  private writeLogToFile(
    filePath: string,
    level: LogLevel,
    message: string,
    trace?: string,
  ) {
    const log = `${new Date().toISOString()} [${level}] - ${message}${
      trace ? '\nTrace: ' + trace : ''
    }\n`;

    // console.log(log);

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.size > this.maxLogFileSizeKb * 1024) {
        const backupPath = filePath.replace(
          '.log',
          `_backup_${Date.now()}.log`,
        );
        fs.rename(filePath, backupPath, (renameErr) => {
          if (renameErr) {
            this.logger.error(`Error renaming log file: ${renameErr}`);
          }
        });
      }
    });

    fs.appendFile(filePath, log, (err) => {
      if (err) {
        this.logger.error(`Error writing log to ${filePath}: ${err}`);
      }
    });
  }

  private logMessage(
    level: LogLevel,
    message: string,
    isError: boolean = false,
  ) {
    if (this.shouldLog(level)) {
      const filePath = isError ? this.errorLogFilePath : this.logFilePath;
      this.writeLogToFile(filePath, level, message);
    }
  }

  private formatErrorLog(data: ILoggingError): string {
    let log = `${new Date().toISOString()} [error] - ${data.message}`;

    if (data.trace) {
      log += `\nTrace: ${data.trace}`;
    }

    if (data.statusCode) {
      log += `\nStatus Code: ${data.statusCode}`;
    }
    if (data.url) {
      log += `\nURL: ${data.url}`;
    }
    if (data.method) {
      log += `\nMethod: ${data.method}`;
    }
    if (data.headers) {
      log += `\nHeaders: ${JSON.stringify(data.headers)}`;
    }
    if (data.query) {
      log += `\nQuery: ${JSON.stringify(data.query)}`;
    }
    if (data.body) {
      log += `\nBody: ${JSON.stringify(data.body)}`;
    }
    if (data.errorResponse) {
      log += `\nError Response: ${JSON.stringify(data.errorResponse)}`;
    }

    return log;
  }
}
