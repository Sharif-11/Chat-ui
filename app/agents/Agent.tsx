import { createAgent, getAllAgents } from "@/Api/auth.api";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { Button, DataTable, Text, TextInput } from "react-native-paper";
import * as yup from "yup";

interface Agent {
  userId: string;
  name: string;
}

const agentSchema = yup.object({
  agentId: yup.string().required("Agent ID is required").min(6).max(6),
  name: yup.string().required("Name is required"),
  password: yup.string().required("Password is required").min(6),
});

export default function Agents() {
  const [modalVisible, setModalVisible] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const { success, message, data } = await getAllAgents();
      if (success) {
        setAgents(data!);
      } else {
        alert(message);
      }
    } catch (error) {
      alert("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (values: {
    agentId: string;
    name: string;
    password: string;
  }) => {
    try {
      setSubmitting(true);
      const { success, message } = await createAgent({
        userId: values.agentId,
        name: values.name,
        password: values.password,
      });
      if (success) {
        alert("Agent created successfully");
        setAgents([...agents, { userId: values.agentId, name: values.name }]);
        setModalVisible(false);
      } else {
        alert(message);
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agents List</Text>
      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#6200EE" />
      ) : (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={{ width: 100 }}>Agent ID</DataTable.Title>
            <DataTable.Title style={{ width: 200 }}>Name</DataTable.Title>
          </DataTable.Header>
          {agents.map((agent) => (
            <DataTable.Row key={agent.userId}>
              <DataTable.Cell style={{ width: 100 }}>
                {agent.userId}
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 200 }}>
                {agent.name}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      )}
      <Button
        mode="contained"
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        Add New Agent
      </Button>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
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
                    loading={submitting}
                    disabled={submitting}
                    style={styles.button}
                  >
                    {submitting ? "Creating..." : "Create Agent"}
                  </Button>
                </>
              )}
            </Formik>
            <Button
              onPress={() => setModalVisible(false)}
              style={styles.backButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  addButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
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
