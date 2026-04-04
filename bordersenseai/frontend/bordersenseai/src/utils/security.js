export const addCSRFToken = (headers) => {
  const csrfToken = localStorage.getItem('csrf_token');
  if (csrfToken) {
    return { 'X-CSRF-Token': csrfToken };
  }
  return {};
};

export const generateCSRFToken = () => {
  const token = crypto.randomUUID();
  localStorage.setItem('csrf_token', token);
  return token;
};