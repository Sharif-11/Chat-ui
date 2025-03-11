import { checkLogin } from "@/Api/auth.api";
import { setAuthToken } from "@/axios/axiosInstance";
import { socketURL } from "@/axios/urls";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";

import { createContext, useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { io, Socket } from "socket.io-client";

// ... (other imports remain same)

interface AuthContextType {
  user: User | null;
  socket: Socket | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSocket: (socket: Socket | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  // Initialize socket when user is authenticated
  useEffect(() => {
    let newSocket: Socket;

    const initializeSocket = async () => {
      if (user) {
        try {
          newSocket = io(socketURL, {
            query: { ...user },
            transports: ["websocket"],
          });

          newSocket.on("connect", () => {
            console.log("Socket connected");
            newSocket.emit("agent_join", { userId: user.userId });
          });

          newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
          });

          newSocket.on("notify_agents", (data) => {
            // Handle incoming chat request notification
            console.log("New chat request:", data);
          });

          setSocket(newSocket);
          navigation.dispatch(
            StackActions.replace("agents") // Replace with your login route name
          );
        } catch (error) {
          console.error("Socket connection error:", error);
        }
      }
      if (!user) {
        if (newSocket) {
          newSocket.disconnect();
          setSocket(null);
        }
      }
    };

    initializeSocket();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setAuthToken(token);
          const { success, data } = await checkLogin();
          if (success && data) {
            setUser(data);
          }
        } else {
          navigation.dispatch(
            StackActions.replace("index") // Replace with your login route name
          );
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={{ user, loading, setUser, socket, setSocket }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
export { AuthProvider, useAuth };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
});
