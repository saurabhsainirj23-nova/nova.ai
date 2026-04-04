const attempts = {};

export const recordAttempt = (key, options = {}) => {
  const { maxAttempts = 20, windowMs = 60000 } = options;
  
  if (!attempts[key]) {
    attempts[key] = { count: 0, startTime: Date.now() };
  }
  
  const attempt = attempts[key];
  
  if (Date.now() - attempt.startTime > windowMs) {
    attempt.count = 0;
    attempt.startTime = Date.now();
  }
  
  attempt.count++;
  
  if (attempt.count > maxAttempts) {
    return { blocked: true, message: 'Too many attempts. Please try again later.' };
  }
  
  return { blocked: false, remaining: maxAttempts - attempt.count };
};

export const generateRateLimitKey = (endpoint, identifier) => {
  return `${endpoint}:${identifier}:${Date.now()}`;
};

export const getRateLimit = (endpoint) => {
  const limits = {
    '/auth/login': { maxAttempts: 5, windowMs: 60000 },
    '/auth/register': { maxAttempts: 3, windowMs: 300000 },
  };
  return limits[endpoint] || { maxAttempts: 20, windowMs: 60000 };
};