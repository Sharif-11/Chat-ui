import { createStackNavigator } from "@react-navigation/stack";
import CreateAgentScreen from "./createAgent";
import Login from "./login";
import ProfileScreen from "./profile";
const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Agents" component={CreateAgentScreen} />
    </Stack.Navigator>
  );
}
