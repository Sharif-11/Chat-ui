import { login } from "@/Api/auth.api";
import { useAuth } from "@/Contexts/authContext";
import { RootStackParamList } from "@/Types/rootStackParams";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Formik } from "formik";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";
import * as yup from "yup";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
const loginSchema = yup.object({
  agentId: yup
    .string()
    .required("Agent ID is required")
    .min(6, "Minimum 6 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters"),
});

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { loading, setUser } = useAuth();

  const handleSubmit = async (values: LoginRequest) => {
    try {
      const { success, data } = await login(values);
      if (success) {
        AsyncStorage.setItem("token", data!.token).then(() => {
          setUser(data!);
          navigation.navigate("agents");
        });
      } else {
        // handle error
      }
    } catch (error) {}
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Login</Text>
          <Formik
            initialValues={{ agentId: "abcdea", password: "123456" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <TextInput
                  label="Agent ID"
                  mode="outlined"
                  style={styles.input}
                  onChangeText={handleChange("agentId")}
                  onBlur={handleBlur("agentId")}
                  value={values.agentId}
                  error={touched.agentId && !!errors.agentId}
                />
                {touched.agentId && errors.agentId && (
                  <Text style={styles.errorText}>{errors.agentId}</Text>
                )}

                <TextInput
                  label="Password"
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  error={touched.password && !!errors.password}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  style={styles.button}
                >
                  Submit
                </Button>
              </>
            )}
          </Formik>
        </Card.Content>
      </Card>
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
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    padding: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
