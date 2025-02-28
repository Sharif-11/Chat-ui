import { login } from "@/Api/auth.api";
import { setAuthToken } from "@/axios/axiosInstance";

import React, { createContext, ReactNode, useContext, useState } from "react";

// Define user type

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginHandler: (credentials: {
    agentId: string;
    password: string;
  }) => Promise<void>;
  loginError: string | null;

  //   logout: () => Promise<void>;
}

// Create AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props type for provider
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  //   useEffect(() => {
  //     const loadUser = async () => {
  //       try {
  //         const token = await AsyncStorage.getItem("authToken");
  //         if (token) {
  //           setAuthToken(token);
  //           const response = await api.get<User>("/user/profile"); // Fetch user data
  //           setUser(response.data);
  //         }
  //       } catch {
  //         setLoginError("An error occurred. Please try again later.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     loadUser();
  //   }, []);

  // Function to log in a user
  const loginHandler = async (credentials: {
    agentId: string;
    password: string;
  }) => {
    try {
      const { success, message, data } = await login(credentials);
      if (success) {
        setAuthToken(data!.token);

        setUser(data!);
        alert("Login successful");
        if (data!.role === "admin") {
          // navigate to admin dashboard
        }
        if (data!.role === "agent") {
          // navigate to user dashboard
        }
      }
    } catch {
      setLoginError("An error occurred. Please try again later.");
    }
  };

  // Function to log out a user
  //   const logout = async () => {
  //     await AsyncStorage.removeItem("authToken");
  //     setAuthToken(null);
  //     setUser(null);
  //   };

  return (
    <AuthContext.Provider value={{ user, loading, loginHandler, loginError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
