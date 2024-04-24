import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginScreen = ({
  navigation,
  email,
  password,
  setPassword,
  setEmail,
  handleUserId,
  userId, // New prop to handle userId
}) => {
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Call handleUserId and pass the userCredential
      handleUserId(userCredential);
      // Navigate to the desired screen upon successful login
      navigation.navigate("Main", { userId: userId });
    } catch (error) {
      console.error("Error logging in:", error.message);
      Alert.alert("Error", "Invalid email or password. Please try again.");
    }
  };

  const goToCreateAccount = () => {
    // Navigate to the CreateAccountScreen
    navigation.navigate("CreateAccount");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Enter your password"
        secureTextEntry={true}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Create an Account" onPress={goToCreateAccount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: "100%",
  },
});

export default LoginScreen;
