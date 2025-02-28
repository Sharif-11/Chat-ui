import { createAgent } from "@/Api/auth.api";
import { Formik } from "formik";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import * as yup from "yup";

// Define navigation types

// Define validation schema
const agentSchema = yup.object({
  agentId: yup
    .string()
    .required("Agent ID is required")
    .min(6, "Minimum 6 characters")
    .max(6, "Maximum 6 characters"),
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters"),
});

export default function Agents() {
  const handleCreateAgent = async (values: {
    agentId: string;
    name: string;
    password: string;
  }) => {
    try {
      const { success, message, data } = await createAgent({
        userId: values.agentId,
        name: values.name,
        password: values.password,
      });
      if (success) {
        alert("Agent created successfully");
      } else {
        alert(message);
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Agent</Text>
      <Formik
        initialValues={{ agentId: "", name: "", password: "" }}
        validationSchema={agentSchema}
        onSubmit={handleCreateAgent}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <TextInput
              label="Agent ID"
              mode="outlined"
              onChangeText={handleChange("agentId")}
              onBlur={handleBlur("agentId")}
              value={values.agentId}
              error={!!errors.agentId}
              style={styles.input}
            />
            {errors.agentId && (
              <Text style={styles.errorText}>{errors.agentId}</Text>
            )}

            <TextInput
              label="Name"
              mode="outlined"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              error={!!errors.name}
              style={styles.input}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              error={!!errors.password}
              style={styles.input}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.button}
            >
              Create Agent
            </Button>

            <Button mode="text" style={styles.backButton}>
              Back to Profile
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    width: "100%",
  },
  backButton: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
