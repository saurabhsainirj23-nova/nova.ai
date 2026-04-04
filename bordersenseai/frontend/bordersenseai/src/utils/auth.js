export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setAccessToken = (token) => localStorage.setItem('access_token', token);
export const removeTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};