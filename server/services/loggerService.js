// services/loggerService.js
import { format } from 'date-fns';

class Logger {
  static info(message, ...args) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.log(`[INFO] ${timestamp} - ${message}`, ...args);
  }

  static error(message, error) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.error(`[ERROR] ${timestamp} - ${message}`, error?.message || error);
  }

  static debug(message, ...args) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      console.debug(`[DEBUG] ${timestamp} - ${message}`, ...args);
    }
  }
}

export default Logger;