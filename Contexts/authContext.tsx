import { checkLogin } from "@/Api/auth.api";
import { setAuthToken } from "@/axios/axiosInstance";
import { socketURL } from "@/axios/urls";
import { ChatRequest } from "@/Types/chat.types";
import { RootStackParamList } from "@/Types/rootStackParams";
import { NewChatRequest } from "@/Types/utils.types";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

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
  newChatRequests: NewChatRequest[];
  setNewChatRequests: (newChatRequests: ChatRequest[]) => void;
  handleAcceptChat: (chatRequest: ChatRequest) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newChatRequests, setNewChatRequests] = useState<ChatRequest[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Initialize socket when user is authenticated
  useEffect(() => {
    let newSocket: Socket;

    const initializeSocket = async () => {
      if (user) {
        try {
          newSocket = io(socketURL, {
            query: { ...user, userName: user.name },
            transports: ["websocket"],
          });

          newSocket.on("connect", () => {
            console.log("Socket connected");
            newSocket.emit("agent_join", { userId: user.userId });
          });

          newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
          });
          newSocket.emit("agent_join", {
            userId: user?.userId,
            userName: user?.name,
            role: user?.role,
          });

          newSocket.on("notify_agents", (data) => {
            // Handle incoming chat request notification
            console.log("New chat request:", data);
            setNewChatRequests((prevRequests) => [
              ...prevRequests,
              { userId: data.userId, userName: data.userName },
            ]);
          });
          newSocket.on("chat_already_accepted", ({ userId }) => {
            setNewChatRequests((prev) =>
              prev.filter((request) => request.userId !== userId)
            );
            alert(
              `Chat with user ${userId} was already accepted by another agent`
            );
          });
          newSocket.on(
            "chat_accepted_by_other",
            ({ userId, userName, agentName }) => {
              if (
                newChatRequests.some((request) => request.userId === userId)
              ) {
                setNewChatRequests((prev) =>
                  prev.filter((request) => request.userId !== userId)
                );
                alert(`User ${userName} was claimed by agent ${agentName}`);
              }
            }
          );
          newSocket.on("chat_assigned", ({ userId, userName }) => {
            navigation.navigate("ChatBox", {
              userId,
              userName,
              agentId: user.userId,
              agentName: user.name,
            });
          });
          newSocket.on("chat_already_accepted", ({ userName }) => {
            alert(
              `Chat with user ${userName} has already been accepted by another agent.`
            );
          });
          setSocket(newSocket);
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
            // navigation.navigate("ChatList");
          }
        } else {
          // navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);
  useEffect(() => {
    !user && navigation.navigate("Login");
  }, [user]);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const handleAcceptChat = ({ userId, userName }: ChatRequest) => {
    if (!socket || !user?.userId) return;

    // Show pending state immediately
    setNewChatRequests((prev) => prev.filter((user) => user.userId !== userId));

    socket.emit("accept_chat", {
      agentId: user.userId,
      agentName: user.name,
      userId,
      userName,
    });
    return () => {
      socket.off("accept_chat");
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        socket,
        setSocket,
        newChatRequests,
        setNewChatRequests,
        handleAcceptChat,
      }}
    >
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
