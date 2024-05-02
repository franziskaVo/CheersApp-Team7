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
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, storage, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, put, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back button
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { moderateScale } from "../Metrics";

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
      Alert.alert("Failed to pick an image");
    }
  };

  const handleCreateAccount = async () => {
    // Validation: Check if any field is empty
    if (
      !email ||
      !password ||
      !name ||
      !age ||
      !hobby ||
      !favoriteDrink ||
      !profileImage
    ) {
      Alert.alert("Please fill out all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      handleUserId(userCredential);

      // Upload image to Firebase Storage
      const response = await fetch(profileImage);
      const blob = await response.blob();
      const imageRef = ref(
        storage,
        `profile_images/${userCredential.user.uid}`
      );
      await uploadBytes(imageRef, blob);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(imageRef);

      // Save user information including profile image download URL in Firestore
      await setDoc(doc(db, "user", userCredential.user.uid), {
        userId: userCredential.user.uid,
        email: email,
        name: name,
        age: age,
        hobby: hobby,
        favoriteDrink: favoriteDrink,
        profileImage: downloadURL,
      });

      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error creating account:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color="black" />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        extraScrollHeight={Platform.select({ ios: 50, android: 0 })}
        enableOnAndroid={true}
      >
        <View style={styles.buttonContainer}>
          {profileImage && (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          )}
          <TouchableOpacity
            style={styles.selectPictureButton}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>Select Profile Picture</Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateAccount}
          >
            <Text style={styles.buttonText}>CreateAccount</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(15),
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: moderateScale(35),
  },
  scrollViewContent: {
    paddingTop: moderateScale(2),
  },
  label: {
    fontWeight: "bold",
    marginBottom: moderateScale(5),
    color: "#4b4545",
    marginLeft: moderateScale(10),
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: moderateScale(20),
    padding: moderateScale(15),
    marginBottom: moderateScale(15),
    width: moderateScale(320),
  },
  buttonContainer: {
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#f43f5e",
    width: moderateScale(250),
    borderWidth: moderateScale(4),
    borderColor: "#f43f5e",
    alignItems: "center",
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(5),
    marginTop: moderateScale(10),
  },
  imagePickerText: {
    color: "#fff",
    textAlign: "center",
  },
  selectPictureButton: {
    backgroundColor: "#f43f5e",
    width: moderateScale(200),
    borderWidth: moderateScale(1),
    borderColor: "#f43f5e",
    alignItems: "center",
    paddingVertical: moderateScale(7),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(18),
    marginTop: moderateScale(5),
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    marginBottom: moderateScale(5),
  },
});

export default CreateAccountScreen;