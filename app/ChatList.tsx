import { logout } from "@/Api/auth.api";
import { getChatRequests } from "@/Api/chat.api";
import { removeAuthToken } from "@/axios/axiosInstance";
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
import { ActivityIndicator } from "react-native-paper";

const ChatList: React.FC = () => {
  const {
    user,
    setUser,
    newChatRequests,
    setNewChatRequests,
    handleAcceptChat,
  } = useAuth();

  const [chatLists, setChatLists] = useState<
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

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Dummy chat requests for testing

  const fetchChatRequests = async () => {
    try {
      const { success, message, data } = await getChatRequests();
      if (success) {
        // alert(JSON.stringify(data));
        setNewChatRequests(data!);
      } else {
        alert(message);
      }
    } catch (error) {
      alert("Failed to load chat requests");
    }
  };

  useEffect(() => {
    fetchChatRequests();
  }, []);

  // const handleChatPress = (userId: string) => {
  //   navigation.navigate("ChatBox", { userId });
  // };

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
          onPress={() => {
            setNotificationMenuVisible((pre) => !pre);
            if (menuVisible) {
              setMenuVisible(false);
            }
          }}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          {newChatRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{newChatRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Three-Dot Menu */}
        <TouchableOpacity
          onPress={() => {
            setMenuVisible((pre) => !pre);
            if (notificationMenuVisible) {
              setNotificationMenuVisible(false);
            }
          }}
        >
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
                  onPress={() => handleAcceptChat(request)}
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
      ) : chatLists.length === 0 ? (
        <Text style={styles.noRequests}>No chat requests at the moment.</Text>
      ) : (
        <FlatList
          data={chatLists}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              // onPress={() => handleChatPress(item.userId)}
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
    paddingHorizontal: 16,
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
