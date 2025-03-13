import { AuthProvider, useAuth } from "@/Contexts/authContext";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  ActivityIndicator,
  Provider as PaperProvider,
} from "react-native-paper";
import Agents from "./Agent";
import ChatBox from "./ChatBox";
import ChatList from "./ChatList";
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
  const { user, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator />; // or some other loading component
  }
  return (
    <PaperProvider>
      <Stack.Navigator initialRouteName={"Login"}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatList}
          options={{ title: "Chat List" }}
        />
        <Stack.Screen
          name="ChatBox"
          component={ChatBox}
          options={{ headerShown: false }}
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
      </Stack.Navigator>
    </PaperProvider>
  );
};
