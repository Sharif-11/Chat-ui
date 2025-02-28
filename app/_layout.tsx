import { AuthProvider } from "@/Contexts/authContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      ></Stack>
    </AuthProvider>
  );
}
