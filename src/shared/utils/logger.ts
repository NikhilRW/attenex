export class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  debug(message: string, ...args: any[]): void {
    if (__DEV__) {
      console.log(`[${this.getTimestamp()}] [DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (__DEV__) {
      console.info(`[${this.getTimestamp()}] [INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (__DEV__) {
      console.warn(`[${this.getTimestamp()}] [WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (__DEV__) {
      console.error(`[${this.getTimestamp()}] [ERROR] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();
