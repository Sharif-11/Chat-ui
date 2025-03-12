import { logout } from "@/Api/auth.api";
import { baseURL, removeAuthToken } from "@/axios/axiosInstance";
import { useAuth } from "@/Contexts/authContext";
import { RootStackParamList } from "@/Types/rootStackParams";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
import { io, Socket } from "socket.io-client";

const ChatList: React.FC = () => {
  const { user, setUser } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatRequests, setChatRequests] = useState<
    {
      userId: string;
      userName: string;
      lastMessage: string;
      lastMessageSender: string;
      lastMessageTime: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationMenuVisible, setNotificationMenuVisible] = useState(false);
  const [newChatRequests, setNewChatRequests] = useState<
    {
      userId: string;
      userName: string;
    }[]
  >([
    {
      userId: "1",
      userName: "Kawsar",
    },
    {
      userId: "2",
      userName: "Ruhan",
    },
  ]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Dummy chat requests for testing
  const dummyChatRequests = [
    {
      userId: "1",
      userName: "John Doe",
      lastMessage: "Hello, how can I help you?",
      lastMessageSender: "John Doe",
      lastMessageTime: "2023-10-25T14:30:00Z",
    },
    {
      userId: "2",
      userName: "Jane Smith",
      lastMessage: "Thanks for the support!",
      lastMessageSender: "Jane Smith",
      lastMessageTime: "2023-10-24T10:15:00Z",
    },
    {
      userId: "3",
      userName: "Alice Johnson",
      lastMessage: "I have a question about my order.",
      lastMessageSender: "Alice Johnson",
      lastMessageTime: "2023-10-23T09:45:00Z",
    },
    {
      userId: "4",
      userName: "Bob Brown",
      lastMessage: "Can you check the status of my request?",
      lastMessageSender: "Bob Brown",
      lastMessageTime: "2023-10-22T16:20:00Z",
    },
  ];

  useEffect(() => {
    // Simulate loading dummy data
    setChatRequests(dummyChatRequests);
    setLoading(false);

    // Connect to the Socket.io server
    const newSocket = io(baseURL);
    setSocket(newSocket);

    // Notify server that agent has joined
    newSocket.emit("agent_join", { userId: user?.userId });

    // Listen for new chat requests
    newSocket.on("notify_agents", (data) => {
      const newRequest = {
        userId: data.userId,
        userName: data.userName || `User ${data.userId}`,
      };
      setNewChatRequests((prevRequests) => [...prevRequests, newRequest]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleChatPress = (userId: string) => {
    // navigation.navigate("ChatScreen", { userId });
  };

  const handleAcceptChat = (userId: string) => {
    // Handle accepting the chat request
    setNewChatRequests((prevRequests) =>
      prevRequests.filter((request) => request.userId !== userId)
    );
    alert(`Chat with user ${userId} has been accepted.`);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const { success, message } = await logout();
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
      {/* Header with Notification Icon and Three-Dot Menu */}
      <View style={styles.header}>
        {/* Notification Icon */}
        <TouchableOpacity
          style={styles.notificationIconContainer}
          onPress={() => setNotificationMenuVisible((pre) => !pre)}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          {newChatRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{newChatRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Three-Dot Menu */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Dropdown */}
      {notificationMenuVisible && (
        <View style={styles.notificationMenu}>
          {newChatRequests.length === 0 ? (
            <Text style={styles.noNotificationText}>No new chat requests</Text>
          ) : (
            newChatRequests.map((request) => (
              <View key={request.userId} style={styles.notificationItem}>
                <Text style={styles.notificationText}>
                  {request.userName} wants to talk with you
                </Text>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptChat(request.userId)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}

      {/* Three-Dot Menu Dropdown */}
      {menuVisible && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate("Profile");
            }}
          >
            <Text>Profile</Text>
          </TouchableOpacity>
          <Divider />
          {user?.role === "admin" && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("AgentList");
              }}
            >
              <Text>Agent List</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleLogout();
              setMenuVisible(false);
            }}
          >
            <Text>{loggingOut ? "Loading..." : "Logout"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chat List */}
      {loading ? (
        <ActivityIndicator animating size="large" />
      ) : chatRequests.length === 0 ? (
        <Text style={styles.noRequests}>No chat requests at the moment.</Text>
      ) : (
        <FlatList
          data={chatRequests}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => handleChatPress(item.userId)}
            >
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.lastMessage}>
                {item.lastMessageSender}: {item.lastMessage}
              </Text>
              <Text style={styles.lastMessageTime}>
                {formatTime(item.lastMessageTime)}
              </Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  notificationIconContainer: {
    position: "relative",
    marginRight: 20, // Space between notification icon and three-dot menu
  },
  notificationIcon: {
    fontSize: 16,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
  },
  notificationMenu: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 3,
    padding: 10,
    zIndex: 1,
  },
  noNotificationText: {
    fontSize: 14,
    color: "gray",
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    padding: 5,
  },
  notificationText: {
    fontSize: 14,
  },
  acceptButton: {
    backgroundColor: "#6200ee",
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  menuDropdown: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
    padding: 10,
    zIndex: 1,
  },
  menuItem: {
    paddingVertical: 10,
  },
  noRequests: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  chatItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
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
