// src/services/auth.js

// Store JWT token
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove JWT token (used on logout)
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};
