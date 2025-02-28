import { createStackNavigator } from "@react-navigation/stack";
import Agents from "./createAgent";
import Login from "./login";
import ProfileScreen from "./profile";
const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Agents" component={Agents} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
