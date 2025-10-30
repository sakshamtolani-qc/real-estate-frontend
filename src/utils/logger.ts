/**
 * Secure Logger Utility
 * 
 * This logger sanitizes sensitive data before logging and respects NODE_ENV.
 * In production, console logging is disabled entirely.
 */

const SENSITIVE_FIELDS = [
  'password',
  'token',
  'refresh',
  'refresh_token',
  'access',
  'userId',
  'email',
  'id',
  'phone',
  'credit_card',
  'ssn',
  'apiKey',
  'secret',
  'auth_token',
];

const SENSITIVE_PATHS = [
  'user',
  'currentUser',
  'response.user',
  'userData',
];

/**
 * Recursively sanitize an object by removing/masking sensitive fields
 */
function sanitizeObject(obj: any, depth = 0): any {
  // Prevent infinite recursion
  if (depth > 10) return '[Deep Object]';
  
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }

  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const lowerKey = key.toLowerCase();
      
      // Check if this field is sensitive
      if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeObject(obj[key], depth + 1);
      }
    }
  }

  return sanitized;
}

/**
 * Sanitize error objects
 */
function sanitizeError(error: any): any {
  if (!error) return error;

  const sanitized: any = {};

  if (error.message) {
    // Mask URLs that might contain auth tokens
    sanitized.message = error.message.replace(/token=[\w-]+/gi, 'token=[REDACTED]');
  }

  if (error.response) {
    sanitized.response = {
      status: error.response.status,
      statusText: error.response.statusText,
      data: sanitizeObject(error.response.data),
    };
  }

  if (error.request) {
    sanitized.request = '[Request Object]';
  }

  if (error.stack) {
    sanitized.stack = error.stack;
  }

  return sanitized;
}

/**
 * Check if logging should be enabled
 */
function isLoggingEnabled(): boolean {
  // Disable in production
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return true;
}

export const logger = {
  /**
   * Debug level logging - most verbose
   */
  debug: (message: string, data?: any): void => {
    if (!isLoggingEnabled()) return;
    
    const sanitized = data ? sanitizeObject(data) : undefined;
    console.debug(`[DEBUG] ${message}`, sanitized);
  },

  /**
   * Info level logging
   */
  info: (message: string, data?: any): void => {
    if (!isLoggingEnabled()) return;
    
    const sanitized = data ? sanitizeObject(data) : undefined;
    console.info(`[INFO] ${message}`, sanitized);
  },

  /**
   * Warning level logging
   */
  warn: (message: string, data?: any): void => {
    if (!isLoggingEnabled()) return;
    
    const sanitized = data ? sanitizeObject(data) : undefined;
    console.warn(`[WARN] ${message}`, sanitized);
  },

  /**
   * Error level logging - always shown (unless in production)
   */
  error: (message: string, error?: any): void => {
    if (!isLoggingEnabled()) return;
    
    const sanitized = error ? sanitizeError(error) : undefined;
    console.error(`[ERROR] ${message}`, sanitized);
  },

  /**
   * Log without any prefix (use sparingly)
   */
  raw: (message: string, data?: any): void => {
    if (!isLoggingEnabled()) return;
    
    const sanitized = data ? sanitizeObject(data) : undefined;
    console.log(message, sanitized);
  },
};

export default logger;
