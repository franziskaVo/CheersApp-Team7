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
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, storage, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, put, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back button
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

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
      //delet here to come to previous version
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `profile_images/${userCredential.user.uid}`);
      const snapshot = await putString(imageData, 'data_url');
      const downloadURL = await getDownloadURL(imageRef);

      await setDoc(doc(db, "user", userCredential.user.uid), {
        userId: userCredential.user.uid,
        email: email,
        name: name,
        age: age,
        hobby: hobby,
        favoriteDrink: favoriteDrink,
        profileImage: downloadURL, //change to profileImage 
      });

      navigation.navigate("Login");
    } catch (error) {
      console.error("Error creating account:", error.message);
      Alert.alert("Error creating account:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/*<StatusBar barStyle="dark-content" />*/}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
       /*style={styles.content}*/
       /*style={styles.container}*/
       contentContainerStyle={styles.scrollViewContent}
      extraScrollHeight={Platform.select({ ios: 50, android: 0 })}
      enableOnAndroid={true}
      >
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
          <Text style={styles.buttonText}>Select Profile Picture</Text>
        </TouchableOpacity>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        <TouchableOpacity style={styles.imagePicker} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>CreateAccount</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
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
    marginTop: 35,
  },
  content: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    //marginTop: 20, // Adjust the content position
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20, // Adjust the content position
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color:'#ff6d7e'
    
  },
  input: {
    //borderWidth: 1,
    //borderColor: "#fcb5bd",
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
    padding:20,
    //paddingVertical: 12,
    //paddingHorizontal: 16,
    marginBottom: 20,
    width: "100%",
    
  },
  imagePicker: {
    backgroundColor: "#f43f5e",
    width: 250,
    borderWidth: 4,
    borderColor: "#f43f5e",
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  imagePickerText: {
    color: "#fff",
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default CreateAccountScreen;
