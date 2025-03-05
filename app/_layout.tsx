import { AuthProvider } from "@/Contexts/authContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="agents" options={{ headerShown: false }} />
        // In your RootLayout component
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animation: "fade", // Optional: Add nice transition
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
