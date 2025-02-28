import { checkLogin } from "@/Api/auth.api";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Text,
} from "react-native-paper";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { success, message, data } = await checkLogin();
      alert(success);
      if (success) {
        setUser(data!);
      } else {
        setError(message);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

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
        Edit Profile
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
