const PROD_API_ORIGIN = "https://taskmanagerapi-sxsn.onrender.com";
const DEV_API_ORIGIN = "http://localhost:3000";

export const API_ORIGIN = window.location.hostname.includes("onrender.com")
  ? PROD_API_ORIGIN
  : DEV_API_ORIGIN;
export const TASKS_API = `${API_ORIGIN}/tasks`;
export const LOGIN_API = `${API_ORIGIN}/login`;
export const LOGOUT_API = `${API_ORIGIN}/logout`;
