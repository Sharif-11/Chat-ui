import { checkLogin } from "@/Api/auth.api";
import { setAuthToken } from "@/axios/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define user type

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;

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
  const navigation = useNavigation();
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setAuthToken(token);
          const { success, message, data } = await checkLogin();
          if (success) {
            setUser(data!);
            (navigation as any).navigate("agents");
          }
        }
      } catch {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Function to log in a user

  // Function to log out a user
  //   const logout = async () => {
  //     await AsyncStorage.removeItem("authToken");
  //     setAuthToken(null);
  //     setUser(null);
  //   };

  return (
    <AuthContext.Provider value={{ user, loading }}>
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
