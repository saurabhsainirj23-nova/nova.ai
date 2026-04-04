export const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

export const SECURITY_EVENTS = {
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INFO: 'INFO',
  ERROR: 'ERROR',
};

export const logSecurityEvent = (event, level, message, data = {}) => {
  const log = {
    event,
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  console.log('[Security]', JSON.stringify(log));
};

export const monitorSuspiciousActivity = (data) => {
  const suspiciousPatterns = [
    /<script>/i,
    /javascript:/i,
    /onerror=/i,
    /onclick=/i,
  ];
  
  const inputStr = data.input || '';
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(inputStr)) {
      logSecurityEvent(
        SECURITY_EVENTS.WARNING,
        LOG_LEVELS.WARNING,
        'Suspicious input detected',
        data
      );
      break;
    }
  }
};