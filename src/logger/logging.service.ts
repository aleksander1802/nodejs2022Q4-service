import { Injectable, LoggerService, Logger, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ILoggingError } from './logging-error';

@Injectable()
export class LoggingService implements LoggerService {
  private logFilePath = path.resolve(__dirname, '../../logs/application.log');
  private errorLogFilePath = path.resolve(__dirname, '../../logs/error.log');
  private currentLogLevel = process.env.LOG_LEVEL as LogLevel;
  private maxLogFileSizeKb: number =
    parseInt(process.env.MAX_LOG_FILE_SIZE_KB, 10) || 1024;

  private logger = new Logger();

  log(message: string) {
    this.writeLogToFile(this.logFilePath, 'log', message);
  }

  error(data: ILoggingError) {
    const {
      message,
      trace,
      statusCode,
      url,
      method,
      headers,
      query,
      body,
      errorResponse,
    } = data;
    let log = `${new Date().toISOString()} [error] - ${message}${
      trace ? '\nTrace: ' + trace : ''
    }\n`;

    if (statusCode) {
      log += `Status Code: ${statusCode}\n`;
    }
    if (url) {
      log += `URL: ${url}\n`;
    }
    if (method) {
      log += `Method: ${method}\n`;
    }
    if (headers) {
      log += `Headers: ${JSON.stringify(headers)}\n`;
    }
    if (query) {
      log += `Query: ${JSON.stringify(query)}\n`;
    }
    if (body) {
      log += `Body: ${JSON.stringify(body)}\n`;
    }
    if (errorResponse) {
      log += `Error Response: ${JSON.stringify(errorResponse)}\n`;
    }

    this.writeLogToFile(this.errorLogFilePath, 'error', log);
  }

  warn(message: string) {
    this.writeLogToFile(this.logFilePath, 'warn', message);
  }

  debug(message: string) {
    if (this.shouldLog('debug')) {
      this.writeLogToFile(this.logFilePath, 'debug', message);
    }
  }

  verbose(message: string) {
    if (this.shouldLog('verbose')) {
      this.writeLogToFile(this.logFilePath, 'verbose', message);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const logLevelValues: Record<LogLevel, number> = {
      log: 0,
      error: 1,
      warn: 2,
      debug: 3,
      verbose: 4,
    };

    return logLevelValues[level] >= logLevelValues[this.currentLogLevel];
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
}
