import { logout } from "@/Api/auth.api";
import { removeAuthToken } from "@/axios/axiosInstance";
import { useAuth } from "@/Contexts/authContext";
import { RootStackParamList } from "@/Types/rootStackParams";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setErrorMessage(null);
      const { success, message } = await logout();
      if (success) {
        setUser(null);
        await AsyncStorage.removeItem("token");
        removeAuthToken();
        navigation.navigate("Login");
      } else {
        console.error("Logout error:", message);
        setErrorMessage(message);
      }
    } catch (error) {
      alert("Logout Error");
    } finally {
      setLoggingOut(false);
    }
  };

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
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? "Loading..." : "Logout"}
      </Button>
      <p style={styles.errorText}>{errorMessage}</p>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
});
