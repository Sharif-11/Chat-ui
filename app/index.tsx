import { createStackNavigator } from "@react-navigation/stack";
import Login from "./login";
const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}
