import { logout } from "@/Api/auth.api";
import { baseURL, removeAuthToken } from "@/axios/axiosInstance";
import { useAuth } from "@/Contexts/authContext";
import { RootStackParamList } from "@/Types/rootStackParams";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Divider,
  Menu,
  Text,
} from "react-native-paper";
import { io, Socket } from "socket.io-client";

const ChatList: React.FC = () => {
  const { user, setUser } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatRequests, setChatRequests] = useState<
    {
      userId: string;
      userName: string;
      lastMessage: string;
      lastMessageSender: string; // Added sender name
      lastMessageTime: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // For three-dot menu
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Dummy data for debugging
  const dummyChatRequests = [
    {
      userId: "1",
      userName: "John Doe",
      lastMessage: "Hello, how can I help you?",
      lastMessageSender: "John Doe", // Added sender name
      lastMessageTime: "2023-10-25T14:30:00Z",
    },
    {
      userId: "2",
      userName: "Jane Smith",
      lastMessage: "Thanks for the support!",
      lastMessageSender: "Jane Smith", // Added sender name
      lastMessageTime: "2023-10-24T10:15:00Z",
    },
    {
      userId: "3",
      userName: "Alice Johnson",
      lastMessage: "I have a question about my order.",
      lastMessageSender: "Alice Johnson", // Added sender name
      lastMessageTime: "2023-10-23T09:45:00Z",
    },
    {
      userId: "4",
      userName: "Bob Brown",
      lastMessage: "Can you check the status of my request?",
      lastMessageSender: "Bob Brown", // Added sender name
      lastMessageTime: "2023-10-22T16:20:00Z",
    },
  ];

  useEffect(() => {
    // Simulate loading dummy data
    setChatRequests(dummyChatRequests);
    setLoading(false);

    // Connect to the Socket.io server (optional for debugging)
    const newSocket = io(baseURL);
    setSocket(newSocket);

    // Notify server that agent has joined
    newSocket.emit("agent_join", { userId: user?.userId });

    // Listen for new chat requests (optional for debugging)
    newSocket.on("notify_agents", (data) => {
      const newRequest = {
        userId: data.userId,
        userName: data.userName || `User ${data.userId}`,
        lastMessage: data.lastMessage || "New chat request",
        lastMessageSender: data.lastMessageSender || "User", // Added sender name
        lastMessageTime: new Date().toISOString(),
      };
      setChatRequests((prevRequests) => [...prevRequests, newRequest]);
    });

    // Handle chat assignment (optional for debugging)
    newSocket.on("chat_assigned", ({ userId }) => {
      alert(`Chat with user ${userId} has been assigned.`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleChatPress = (userId: string) => {
    // navigation.navigate("ChatScreen", { userId });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const { success, message } = await logout();
      // alert(JSON.stringify({ success, message }));
      if (success) {
        setUser(null);
        await AsyncStorage.removeItem("token");
        removeAuthToken();
        navigation.navigate("Login");
      } else {
        console.error("Logout error:", message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };
  if (!user) {
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      {/* Three-dot menu */}
      <View style={styles.menuContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Text style={styles.menuIcon}>⋮</Text>
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate("Profile"); // Navigate to profile
            }}
            title="Profile"
          />
          <Divider />
          {user?.role === "admin" && (
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("AgentList"); // Navigate to agent list
              }}
              title="Agent List"
            />
          )}
          <Menu.Item
            onPress={() => {
              handleLogout();
              setMenuVisible(false);
            }}
            title={loggingOut ? "Loading..." : "Logout"}
          />
        </Menu>
      </View>

      {loading ? (
        <ActivityIndicator animating size="large" />
      ) : chatRequests.length === 0 ? (
        <Text style={styles.noRequests}>No chat requests at the moment.</Text>
      ) : (
        <FlatList
          data={chatRequests}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <Card
              style={styles.card}
              onPress={() => handleChatPress(item.userId)}
            >
              <Card.Content>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.lastMessage}>
                  {item.lastMessageSender}: {item.lastMessage}
                </Text>
                <Text style={styles.lastMessageTime}>
                  {formatTime(item.lastMessageTime)}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  menuContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
  },
  noRequests: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  lastMessageTime: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    textAlign: "right",
  },
});

export default ChatList;
