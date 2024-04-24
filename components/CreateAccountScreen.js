import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, storage, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, put, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back button

const CreateAccountScreen = ({
  navigation,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  age,
  setAge,
  hobby,
  setHobby,
  favoriteDrink,
  setFavoriteDrink,
  profileImage,
  setProfileImage,
  handleUserId,
}) => {
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission to access media library is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.cancelled && pickerResult.assets.length > 0) {
        const selectedAsset = pickerResult.assets[0];
        setProfileImage(selectedAsset.uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Failed to pick an image");
    }
  };

  const handleCreateAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      handleUserId(userCredential);

      await setDoc(doc(db, "user", userCredential.user.uid), {
        userId: userCredential.user.uid,
        email: email,
        name: name,
        age: age,
        hobby: hobby,
        favoriteDrink: favoriteDrink,
        profileImage: profileImage,
      });

      navigation.navigate("Login");
    } catch (error) {
      console.error("Error creating account:", error.message);
      Alert.alert("Error creating account:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
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
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Enter your name"
        />
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={(text) => setAge(text)}
          placeholder="Enter your age"
          keyboardType="numeric"
        />
        <Text style={styles.label}>Hobby:</Text>
        <TextInput
          style={styles.input}
          value={hobby}
          onChangeText={(text) => setHobby(text)}
          placeholder="Enter your hobby"
        />
        <Text style={styles.label}>Favorite Drink:</Text>
        <TextInput
          style={styles.input}
          value={favoriteDrink}
          onChangeText={(text) => setFavoriteDrink(text)}
          placeholder="Enter your favorite drink"
        />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Select Profile Picture</Text>
        </TouchableOpacity>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        <Button title="Create Account" onPress={handleCreateAccount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20, // Adjust the content position
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
  imagePicker: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#fff",
    textAlign: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default CreateAccountScreen;
