import axios from "axios";

// Create an Axios instance with a base URL
export const baseURL = "http://192.168.0.101:3000";
const api = axios.create({
  baseURL, // Replace with your actual API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set Authorization header after login
export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export default api;
