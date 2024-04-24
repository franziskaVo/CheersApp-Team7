import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db, auth } from "../firebase"; // Import db and userRef from firebase.js
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { FontAwesome5 } from "@expo/vector-icons";

const ProfileScreen = ({
  userId,
  email,
  password,
  profileImage,
  setProfileImage,
}) => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility
  const [editing, setEditing] = useState(false); // State to track editing mode
  const [editedUserData, setEditedUserData] = useState(null); // State to store edited user data
  const [editedEmail, setEditedEmail] = useState(""); // State to store edited email
  const [editedPassword, setEditedPassword] = useState(""); // State to store edited password

  const userRef = collection(db, "user");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(userRef);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const currentUserData = data.filter((user) => user.id === userId);
        setUserData(currentUserData);
        setEditedUserData({
          ...currentUserData[0],
          profileImage: currentUserData[0].profileImage,
        });
        setProfileImage(currentUserData[0].profileImage);
        setEditedEmail(currentUserData[0].email); // Initialize edited email with current user email
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "user", editedUserData.id);
      await updateDoc(userDocRef, editedUserData);
      // Update user's email if it has been edited
      if (editedEmail !== userData[0].email) {
        await auth.currentUser.updateEmail(editedEmail);
      }
      // Update user's password if it has been edited
      if (editedPassword) {
        await auth.currentUser.updatePassword(editedPassword);
      }
      setUserData([editedUserData]); // Update displayed user data with edited data
      setEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleChange = (key, value) => {
    setEditedUserData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

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
        setEditedUserData((prevData) => ({
          ...prevData,
          profileImage: selectedAsset.uri, // Update profileImage field
        }));
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Failed to pick an image");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading user data...</Text>
      ) : userData && userData.length > 0 ? (
        <View style={styles.userContainer}>
          {!editing && (
            <>
              <TouchableOpacity
                onPress={editing ? pickImage : null}
                disabled={!editing}
              >
                <View style={styles.profileImageContainer}>
                  <Image
                    style={styles.profileImage}
                    source={{ uri: profileImage }}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.userInfo}>Name: {userData[0].name}</Text>
              <Text style={styles.userInfo}>Email: {email}</Text>
              <View style={styles.passwordContainer}>
                <Text style={styles.userInfo}>
                  Password: {showPassword ? password : "******"}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FontAwesome5 name="eye" size={15} color="#007bff" />
                  ) : (
                    <FontAwesome5 name="eye-slash" size={15} color="#007bff" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.userInfo}>Age: {userData[0].age}</Text>
              <Text style={styles.userInfo}>Hobby: {userData[0].hobby}</Text>
              <Text style={styles.userInfo}>
                Favorite Drink: {userData[0].favoriteDrink}
              </Text>
            </>
          )}
          {editing && (
            <>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  style={styles.profileImage}
                  source={{ uri: profileImage }}
                />
                <FontAwesome5
                  name="camera"
                  size={24}
                  color="#ffffff"
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={editedUserData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="Enter new name"
              />
              <TextInput
                style={styles.input}
                value={editedEmail}
                onChangeText={(text) => setEditedEmail(text)}
                placeholder="Enter new email"
                editable={editing} // Make the TextInput editable only when in editing mode
              />

              {/* Password section */}
              <TextInput
                style={styles.input}
                value={editedPassword}
                onChangeText={(text) => setEditedPassword(text)}
                placeholder="Enter new password"
                secureTextEntry={!showPassword} // Hide/show password functionality
                editable={editing} // Make the TextInput editable only when in editing mode
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={!editing}
              >
                <FontAwesome5
                  name={showPassword ? "eye-slash" : "eye"}
                  size={24}
                  color="#007bff"
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={editedUserData.age.toString()}
                onChangeText={(text) =>
                  handleChange("age", parseInt(text) || 0)
                }
                placeholder="Enter new age"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={editedUserData.hobby}
                onChangeText={(text) => handleChange("hobby", text)}
                placeholder="Enter new hobby"
              />
              <TextInput
                style={styles.input}
                value={editedUserData.favoriteDrink}
                onChangeText={(text) => handleChange("favoriteDrink", text)}
                placeholder="Enter new favorite drink"
              />
              <Button title="Save" onPress={handleSave} />
            </>
          )}
          {!editing && <Button title="Edit" onPress={handleEdit} />}
        </View>
      ) : (
        <Text>No user data available.</Text>
      )}
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
  userContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  userInfo: {
    marginBottom: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  profileImageContainer: {
    position: "relative",
    overflow: "hidden", // Ensure the icon doesn't overflow the container
  },
  cameraIcon: {
    position: "absolute",
    bottom: 42,
    right: 33,
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Add background to the icon for better visibility
    padding: 5, // Add padding to the icon for better touch area
  },
});

export default ProfileScreen;
