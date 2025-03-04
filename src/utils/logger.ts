export class Logger {
  static info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  static error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error(error);
    }
  }

  static success(message: string): void {
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`);
  }

  static warning(message: string): void {
    console.warn(`[WARNING] ${new Date().toISOString()} - ${message}`);
  }
}
