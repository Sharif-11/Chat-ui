import AsyncStorage from "@react-native-async-storage/async-storage";
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
export const setAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

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

export default api;
