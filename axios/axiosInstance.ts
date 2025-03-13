import axios from "axios";

// Create an Axios instance with a base URL
// export const baseURL = "https://chat-server-0322.onrender.com/";
// export const baseURL = "https://magazine-chat-app-api.onrender.com";
export const baseURL = "http://localhost:3000";
const api = axios.create({
  baseURL, // Replace with your actual API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set Authorization header after login
export const setAuthToken = async (token: string | null) => {
  try {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      // Clear authorization header if no token found
      delete api.defaults.headers.common["Authorization"];
    }
  } catch (error) {
    console.error("Error retrieving token from storage:", error);
    delete api.defaults.headers.common["Authorization"];
  }
};
export const removeAuthToken = async () => {
  try {
    delete api.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Error removing token from storage:", error);
  }
};

export default api;
