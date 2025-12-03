export class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  debug(message: string, ...args: any[]): void {
    console.log(`[${this.getTimestamp()}] [DEBUG] ${message}`, ...args);
  }

  info(message: string, ...args: any[]): void {
    console.info(`[${this.getTimestamp()}] [INFO] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[${this.getTimestamp()}] [WARN] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[${this.getTimestamp()}] [ERROR] ${message}`, ...args);
  }
}

export const logger = new Logger();