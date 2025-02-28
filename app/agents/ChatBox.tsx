import { baseURL } from "@/axios/axiosInstance";
import { useAuth } from "@/Contexts/authContext";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { io, Socket } from "socket.io-client";

const AgentWaitingScreen: React.FC = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatRequests, setChatRequests] = useState<{ userId: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to the Socket.io server
    const newSocket = io(baseURL);
    setSocket(newSocket);
    // // Notify server that agent has joined
    newSocket.emit("agent_join", { userId: user?.userId });
    // // Listen for new chat requests
    newSocket.on("notify_agents", (data) => {
      alert("New Chat Request");
      setChatRequests((prevRequests) => [
        ...prevRequests,
        { userId: data.message.split(" ")[1] },
      ]);
    });
    // // Handle chat assignment
    newSocket.on("chat_assigned", ({ userId }) => {
      alert(`Chat with user ${userId} has been assigned.`);
    });
    setLoading(false);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleAcceptChat = (userId: string) => {
    // if (socket) {
    //   socket.emit("accept_chat", { agentId: user?.userId, userId });
    //   Alert.alert(
    //     "Chat Accepted",
    //     `You have accepted chat with user ${userId}`
    //   );
    //   setChatRequests(
    //     chatRequests.filter((request) => request.userId !== userId)
    //   );
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waiting for Chat Requests...</Text>
      {loading ? (
        <ActivityIndicator animating size="large" />
      ) : chatRequests.length === 0 ? (
        <Text style={styles.noRequests}>No chat requests at the moment.</Text>
      ) : (
        <FlatList
          data={chatRequests}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text>User {item.userId} wants to chat</Text>
                <Button
                  mode="contained"
                  onPress={() => handleAcceptChat(item.userId)}
                  style={styles.button}
                >
                  Accept Chat
                </Button>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noRequests: {
    fontSize: 16,
    color: "gray",
  },
  card: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
  },
  button: {
    marginTop: 10,
  },
});

export default AgentWaitingScreen;
