// // RecipeTabNavigator.js
// import React from "react";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import ProfileScreen from "./ProfileScreen";
// import JourneyScreen from "./Journey";

// const Tab = createMaterialTopTabNavigator();

// const UserScreen = ({
//   userId,
//   email,
//   setEmail,
//   password,
//   setPassword,
//   profileImage,
//   setProfileImage,
// }) => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Profile">
//         {(props) => (
//           <ProfileScreen
//             {...props}
//             userId={userId}
//             email={email}
//             setEmail={setEmail}
//             password={password}
//             setPassword={setPassword}
//             profileImage={profileImage}
//             setProfileImage={setProfileImage}
//           />
//         )}
//       </Tab.Screen>
      
//     </Tab.Navigator>
//   );
// };

// export default UserScreen;
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

const UserScreen = ({
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

              <Text style={styles.userInfo}> Name: </Text>
              <Text style={styles.userInfo1}>{userData[0].name}</Text>
              
              <Text style={styles.userInfo}> Email: </Text>
              <Text style={styles.userInfo1}>{email}</Text>

              {/*<View style={styles.passwordContainer}>*/}
                <Text style={styles.userInfo}> Password: </Text>
                <Text style={styles.userInfo1}>
                  {showPassword ? password : "******"}
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FontAwesome5 name="eye" size={15} color="#f43f5e" paddingLeft={30} paddingVertical={15}/>
                  ) : (
                    <FontAwesome5 name="eye-slash" size={15} color="#f43f5e" paddingLeft={30} paddingVertical={15}/>
                  )}
                </TouchableOpacity>
                </Text>
                
              {/*</View>*/}

              <Text style={styles.userInfo}> Age: </Text>
              <Text style={styles.userInfo1}> {userData[0].age}</Text>

              <Text style={styles.userInfo}> Hobby: </Text>
              <Text style={styles.userInfo1}> {userData[0].hobby}</Text>


              <Text style={styles.userInfo}> Favorite Drink: </Text>
              <Text style={styles.userInfo1}>{userData[0].favoriteDrink}</Text>
            </>
          )}
          {editing && (
            <>
            <View style={styles.profileImageContainer}>
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
            </View>
            <Text style={styles.userInfo}> Name: </Text>
              <TextInput
                style={styles.userInfo1}
                value={editedUserData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="Enter new name"
              />
              <Text style={styles.userInfo}> Email: </Text>
              <TextInput
                style={styles.userInfo1}
                value={editedEmail}
                onChangeText={(text) => setEditedEmail(text)}
                placeholder="Enter new email"
                editable={editing} // Make the TextInput editable only when in editing mode
              />

              {/* Password section */}
              <Text style={styles.userInfo}> Password: </Text>
              <TextInput
                style={styles.userInfo1}
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
                  name={showPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="#f43f5e"
                />
              </TouchableOpacity>
              <Text style={styles.userInfo}> Age: </Text>
              <TextInput
                style={styles.userInfo1}
                value={editedUserData.age.toString()}
                onChangeText={(text) =>
                  handleChange("age", parseInt(text) || 0)
                }
                placeholder="Enter new age"
                keyboardType="numeric"
              />
              <Text style={styles.userInfo}> Hobby: </Text>
              <TextInput
                style={styles.userInfo1}
                value={editedUserData.hobby}
                onChangeText={(text) => handleChange("hobby", text)}
                placeholder="Enter new hobby"
              />
              <Text style={styles.userInfo}> Favorite Drink: </Text>
              <TextInput
                style={styles.userInfo1}
                value={editedUserData.favoriteDrink}
                onChangeText={(text) => handleChange("favoriteDrink", text)}
                placeholder="Enter new favorite drink"
              />
              <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSave} >
                <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {!editing && 
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleEdit}>  
          <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          </View>
          }
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
    backgroundColor: "#f7f7f7",
  },
  userContainer: {
    marginBottom: 5,
    //alignItems: "center",
    //justifyContent:'center'
  },
  buttonContainer: {
    alignItems:'center',
  },
  button:{
    backgroundColor: "#f43f5e",
    width: 200,
    borderWidth: 1,
    borderColor: "#f43f5e",
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  buttonText:{
    color: "#ffffff",
    fontWeight:'bold',
  },
  userInfo: {
    marginBottom: 5,
    marginTop:17,
    fontSize:14,
    //textAlign: 'center',
    fontWeight: "bold",
    color:'#4b4545'
  },
  userInfo1: {
    height:35, 
    width:250,
    borderColor:"#f5b5bf",
    paddingLeft:10,
    paddingRight:10,
    paddingTop:8,
    paddingBottom:8,
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 10,
    color:'#4b4545'
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 50,
    marginBottom: 10,
    marginTop:10
  },
  passwordContainer: {
    //flexDirection: "row",
    //alignItems: "center",
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
    alignItems:'center',
    position: "relative",
    overflow: "hidden", // Ensure the icon doesn't overflow the container
  },
  cameraIcon: {
    position: "absolute",
    bottom: 38,
    right: 25,
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Add background to the icon for better visibility
    padding: 5, // Add padding to the icon for better touch area
  },
});

export default UserScreen;
