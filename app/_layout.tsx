import { AuthProvider, useAuth } from "@/Contexts/authContext";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Agents from "./Agent";
import ChatList from "./ChatBox";
import Login from "./login";
import Profile from "./profile";

const Stack = createStackNavigator();
export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
const StackLayout = () => {
  const { user } = useAuth();
  return (
    <PaperProvider>
      <Stack.Navigator initialRouteName={user ? "ChatList" : "Login"}>
        {!user && (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen
          name="ChatList"
          component={ChatList}
          options={{ title: "Chat List" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "Profile" }}
        />
        {user?.role === "admin" && (
          <Stack.Screen
            name="AgentList"
            component={Agents}
            options={{ title: "Agent List" }}
          />
        )}
        {/* Add other screens here */}
      </Stack.Navigator>
    </PaperProvider>
  );
};
