export interface ILoggingError {
  message: string;
  trace?: string;
  statusCode?: number;
  url?: string;
  method?: string;
  headers?: any;
  query?: any;
  body?: any;
  errorResponse?: any;
}
