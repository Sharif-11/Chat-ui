import { useAuth } from "@/Contexts/authContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={80}
              label={user?.name?.charAt(0) || ""}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.agentId}>Agent ID: {user?.userId}</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => console.log("Edit Profile")}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#6200ea",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  agentId: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    width: "90%",
  },
});
