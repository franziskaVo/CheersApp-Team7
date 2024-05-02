// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Button,
//   Alert,
//   Platform,
//   KeyboardAvoidingView,
//   Keyboard,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { db, auth } from "../firebase";
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
// import { FontAwesome5 } from "@expo/vector-icons";
// import { moderateScale } from "../Metrics";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

// const UserScreen = ({
//   userId,
//   email,
//   password,
//   profileImage,
//   setProfileImage,
// }) => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [editedUserData, setEditedUserData] = useState(null);
//   const [editedEmail, setEditedEmail] = useState("");
//   const [editedPassword, setEditedPassword] = useState("");
//   const [keyboardOpen, setKeyboardOpen] = useState(false);

//   const userRef = collection(db, "user");

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//       setKeyboardOpen(true);
//     });
//     const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardOpen(false);
//     });

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const querySnapshot = await getDocs(userRef);
//         const data = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         const currentUserData = data.filter((user) => user.id === userId);
//         setUserData(currentUserData);
//         setEditedUserData({
//           ...currentUserData[0],
//           profileImage: currentUserData[0].profileImage,
//         });
//         setProfileImage(currentUserData[0].profileImage);
//         setEditedEmail(currentUserData[0].email);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   const handleEdit = () => {
//     setEditing(true);
//   };

//   const handleSave = async () => {
//     try {
//       // Check if any required field is empty
//       if (!editedUserData.name.trim()) {
//         Alert.alert("Name field is required. Please fill in your name.");
//         return;
//       }
//       if (!editedEmail.trim()) {
//         Alert.alert("Email field is required. Please fill in your email.");
//         return;
//       }
//       // if (!editedPassword.trim()) {
//       //   Alert.alert("Password field is required. Please fill in your password.");
//       //   return;
//       // }
//       if (!editedUserData.age.toString().trim()) {
//         Alert.alert("Age field is required. Please fill in your age.");
//         return;
//       }
//       if (!editedUserData.hobby.trim()) {
//         Alert.alert("Hobby field is required. Please fill in your hobby.");
//         return;
//       }
//       if (!editedUserData.favoriteDrink.trim()) {
//         Alert.alert("Favorite Drink field is required. Please fill in your favorite drink.");
//         return;
//       }
  
//       const userDocRef = doc(db, "user", editedUserData.id);
//       await updateDoc(userDocRef, editedUserData);
//       if (editedEmail !== userData[0].email) {
//         await auth.currentUser.updateEmail(editedEmail);
//       }
//       if (editedPassword) {
//         await auth.currentUser.updatePassword(editedPassword);
//       }
//       setUserData([editedUserData]);
//       setEditing(false);
//     } catch (error) {
//       console.error("Error updating user data:", error);
//     }
//   };

//   const handleChange = (key, value) => {
//     setEditedUserData((prevData) => ({
//       ...prevData,
//       [key]: value,
//     }));
//   };

//   const pickImage = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permissionResult.granted) {
//         Alert.alert("Permission to access media library is required!");
//         return;
//       }

//       const pickerResult = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!pickerResult.cancelled && pickerResult.assets.length > 0) {
//         const selectedAsset = pickerResult.assets[0];
//         setProfileImage(selectedAsset.uri);
//         setEditedUserData((prevData) => ({
//           ...prevData,
//           profileImage: selectedAsset.uri,
//         }));
//       }
//     } catch (error) {
//       Alert.alert("Failed to pick an image");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <KeyboardAwareScrollView
//        contentContainerStyle={styles.scrollViewContent}
//       extraScrollHeight={Platform.select({ ios: 50, android: 0 })}
//       enableOnAndroid={true}
//       >
//       <View style={styles.userContainer}>
//         {loading ? (
//           <Text>Loading user data...</Text>
//         ) : userData && userData.length > 0 ? (
//           <>
//             <View style={styles.profileImageContainer}>
//               <TouchableOpacity onPress={pickImage} disabled={!editing}>
//                 <Image style={styles.profileImage} source={{ uri: profileImage }} />
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.userInfo}> Name: </Text>
//             <TextInput
//               style={styles.userInfo1}
//               value={editing ? editedUserData.name : userData[0].name}
//               onChangeText={(text) => handleChange("name", text)}
//               placeholder="Enter new name"
//               editable={editing}
//             />

//             <Text style={styles.userInfo}> Email: </Text>
//             <TextInput
//               style={styles.userInfo1}
//               value={editedEmail}
//               onChangeText={(text) => setEditedEmail(text)}
//               placeholder="Enter new email"
//               editable={editing}
//             />

//             <Text style={styles.userInfo}> Password: </Text>
//             <TextInput
//               style={styles.userInfo1}
//               value={editedPassword || "******"}
//               onChangeText={(text) => setEditedPassword(text)}
//               placeholder="Enter new password"
//               secureTextEntry={!showPassword}
//               editable={editing}
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={!editing}>
//               <FontAwesome5
//                 name={showPassword ? "eye" : "eye-slash"}
//                 size={20}
//                 color="#f43f5e"
//               />
//             </TouchableOpacity>

//             <Text style={styles.userInfo}> Age: </Text>
//             <TextInput
//               style={styles.userInfo1}
//               value={editing ? editedUserData.age.toString() : userData[0].age.toString()}
//               onChangeText={(text) => handleChange("age", parseInt(text) || 0)}
//               placeholder="Enter new age"
//               keyboardType="numeric"
//               editable={editing}
//             />

//             <Text style={styles.userInfo}> Hobby: </Text>
//             <TextInput
//               style={styles.userInfo1}
//               value={editing ? editedUserData.hobby : userData[0].hobby}
//               onChangeText={(text) => handleChange("hobby", text)}
//               placeholder="Enter new hobby"
//               editable={editing}
//             />

//             <Text style={styles.userInfo}> Favorite Drink: </Text>
//             <TextInput
//               style={styles.userInfo1}
//               value={editing ? editedUserData.favoriteDrink : userData[0].favoriteDrink}
//               onChangeText={(text) => handleChange("favoriteDrink", text)}
//               placeholder="Enter new favorite drink"
//               editable={editing}
//             />

//             <View style={styles.buttonContainer}>
//               {editing ? (
//                 <TouchableOpacity style={styles.button} onPress={handleSave}>
//                   <Text style={styles.buttonText}>Save</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity style={styles.button} onPress={handleEdit}>
//                   <Text style={styles.buttonText}>Edit</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </>
//         ) : (
//           <Text>No user data available.</Text>
//         )}
//       </View>
//       </KeyboardAwareScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f7f7f7",
//   },
//   userContainer: {
//     marginBottom: moderateScale(5),
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     alignItems: 'center',
//     marginTop: moderateScale(30),
//   },
//   button: {
//     backgroundColor: "#f43f5e",
//     width: moderateScale(200),
//     borderWidth: moderateScale(1),
//     borderColor: "#f43f5e",
//     alignItems: 'center',
//     paddingVertical: moderateScale(7),
//     borderRadius: moderateScale(10),
//     marginBottom: moderateScale(10),
//   },
//   buttonText: {
//     color: "#ffffff",
//     fontWeight: 'bold',
//   },
//   userInfo: {
//     marginBottom: moderateScale(5),
//     marginTop: moderateScale(17),
//     fontSize: moderateScale(14),
//     fontWeight: "bold",
//     color: '#4b4545',
//   },
//   userInfo1: {
//     height: moderateScale(35),
//     width: moderateScale(250),
//     borderColor: "#f5b5bf",
//     paddingLeft: moderateScale(10),
//     paddingRight: moderateScale(10),
//     paddingTop: moderateScale(8),
//     paddingBottom: moderateScale(8),
//     borderWidth: moderateScale(1),
//     justifyContent: "center",
//     borderRadius: moderateScale(10),
//     color: '#4b4545',
//   },
//   profileImage: {
//     width: moderateScale(85),
//     height: moderateScale(85),
//     borderRadius: moderateScale(50),
//     marginBottom: moderateScale(10),
//     marginTop: moderateScale(10),
//   },
//   profileImageContainer: {
//     alignItems: 'center',
//     position: "relative",
//     overflow: "hidden",
//     marginBottom: moderateScale(20),
//   },
//   scrollViewContent: {
//     paddingTop: moderateScale(2), 
//   },
// });

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
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db, auth, storage } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { moderateScale } from "../Metrics";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const UserScreen = ({
  userId,
  email,
  setEmail,
  password,
  setPassword,
  profileImage,
  setProfileImage,
}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [profileImageURL, setProfileImageURL] = useState(null);

  const userRef = collection(db, "user");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
        setEditedEmail(currentUserData[0].email);

        if (currentUserData[0].profileImage) {
          const storageRef = ref(storage, currentUserData[0].profileImage);
          getDownloadURL(storageRef)
            .then((url) => {
              setProfileImageURL(url);
            })
            .catch((error) => {
              console.error("Error fetching profile image URL:", error);
            });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleSave = async () => {
    try {
      const user = auth.currentUser; // Get the currently authenticated user

      // Check if the user is authenticated
      if (!user) {
        console.error("User is not authenticated.");
        return;
      }

      // Validate input fields
      if (!editedUserData.name.trim()) {
        Alert.alert("Name field is required. Please fill in your name.");
        return;
      }

      // Check if the old password is provided
      if (!editedPassword || !editedPassword.oldPassword) {
        Alert.alert("Please enter your old password.");
        return;
      }

      // Re-authenticate the user with the old password
      const credential = EmailAuthProvider.credential(
        user.email,
        editedPassword.oldPassword // Provide the old password here
      );
      await reauthenticateWithCredential(user, credential);

      // Update user data in Firestore
      const userDocRef = doc(db, "user", editedUserData.id);
      await updateDoc(userDocRef, editedUserData);

      // Update the email if it has been changed
      if (editedEmail !== userData[0].email) {
        await user.updateEmail(editedEmail);
      }

      // Update the password if it has been changed
      if (editedPassword.newPassword) {
        // This check ensures that updatePassword is available in the current version of Firebase SDK
        if (typeof user.updatePassword === "function") {
          await user.updatePassword(editedPassword.newPassword);
        } else {
          console.error(
            "updatePassword is not available in the current Firebase SDK version."
          );
        }
      }

      setEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error.code, error.message);
      // Provide more specific error messages based on the error code
      if (error.code === "auth/wrong-password") {
        Alert.alert("Invalid old password. Please try again.");
      } else {
        Alert.alert("Error updating user data. Please try again later.");
      }
    }
  };

  const handleEdit = () => {
    setEditing(true);
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
        setEditedUserData((prevData) => ({
          ...prevData,
          profileImage: selectedAsset.uri,
        }));
      }
    } catch (error) {
      Alert.alert("Failed to pick an image");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        extraScrollHeight={Platform.select({ ios: 50, android: 0 })}
        enableOnAndroid={true}
      >
        <View style={styles.userContainer}>
          {loading ? (
            <Text>Loading user data...</Text>
          ) : userData && userData.length > 0 ? (
            <>
              <View style={styles.profileImageContainer}>
                <TouchableOpacity onPress={pickImage} disabled={!editing}>
                  <Image
                    style={styles.profileImage}
                    source={{
                      uri: profileImageURL || userData[0].profileImage,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.userInfo}>Name:</Text>
              <TextInput
                style={styles.userInfo1}
                value={editing ? editedUserData.name : userData[0].name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="Enter new name"
                editable={editing}
              />

              <Text style={styles.userInfo}>Email:</Text>
              <TextInput
                style={styles.userInfo1}
                value={editing ? editedEmail : userData[0].email}
                onChangeText={(text) => setEditedEmail(text)}
                placeholder="Enter new email"
                editable={editing}
              />

              {!editing ? (
                <>
                  <Text style={styles.userInfo}>Password:</Text>
                  <View style={styles.userInfo1}>
                    <TextInput
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      style={{ flex: 1 }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      {showPassword ? (
                        <FontAwesome5 name="eye" size={15} color="#f43f5e" />
                      ) : (
                        <FontAwesome5
                          name="eye-slash"
                          size={15}
                          color="#f43f5e"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.userInfo}>Old Password:</Text>
                  <TextInput
                    style={styles.userInfo1}
                    value={editedPassword.oldPassword}
                    onChangeText={(text) =>
                      setEditedPassword((prevState) => ({
                        ...prevState,
                        oldPassword: text,
                      }))
                    }
                    placeholder="Enter old password"
                    secureTextEntry={!showPassword}
                    editable={editing}
                  />
                  <Text style={styles.userInfo}>New Password:</Text>
                  <View style={styles.userInfo1}>
                    <TextInput
                      value={editedPassword.newPassword}
                      onChangeText={(text) =>
                        setEditedPassword((prevState) => ({
                          ...prevState,
                          newPassword: text,
                        }))
                      }
                      placeholder="Enter new password"
                      secureTextEntry={!showPassword}
                      style={{ flex: 1 }}
                      editable={editing}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      {showPassword ? (
                        <FontAwesome5 name="eye" size={15} color="#f43f5e" />
                      ) : (
                        <FontAwesome5
                          name="eye-slash"
                          size={15}
                          color="#f43f5e"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <Text style={styles.userInfo}>Age:</Text>
              <TextInput
                style={styles.userInfo1}
                value={
                  editing
                    ? editedUserData.age.toString()
                    : userData[0].age.toString()
                }
                onChangeText={(text) => handleChange("age", parseInt(text))}
                keyboardType="number-pad"
                placeholder="Enter new age"
                editable={editing}
              />

              <Text style={styles.userInfo}>Hobby:</Text>
              <TextInput
                style={styles.userInfo1}
                value={editing ? editedUserData.hobby : userData[0].hobby}
                onChangeText={(text) => handleChange("hobby", text)}
                placeholder="Enter new hobby"
                editable={editing}
              />

              <Text style={styles.userInfo}>Favorite Drink:</Text>
              <TextInput
                style={styles.userInfo1}
                value={
                  editing
                    ? editedUserData.favoriteDrink
                    : userData[0].favoriteDrink
                }
                onChangeText={(text) => handleChange("favoriteDrink", text)}
                placeholder="Enter new favorite drink"
                editable={editing}
              />
              {editing && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setEditing(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
              {!editing && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <Text>No user data found.</Text>
          )}
        </View>
      </KeyboardAwareScrollView>
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
    marginBottom: moderateScale(5),
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: moderateScale(30),
  },
  button: {
    backgroundColor: "#f43f5e",
    width: moderateScale(200),
    borderWidth: moderateScale(1),
    borderColor: "#f43f5e",
    alignItems: "center",
    paddingVertical: moderateScale(7),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  userInfo: {
    marginBottom: moderateScale(5),
    marginTop: moderateScale(17),
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#4b4545",
  },
  userInfo1: {
    height: moderateScale(35),
    width: moderateScale(250),
    borderColor: "#f5b5bf",
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(8),
    borderWidth: moderateScale(1),
    justifyContent: "center",
    borderRadius: moderateScale(10),
    color: "#4b4545",
  },
  profileImage: {
    width: moderateScale(85),
    height: moderateScale(85),
    borderRadius: moderateScale(50),
    marginBottom: moderateScale(10),
    marginTop: moderateScale(10),
  },
  profileImageContainer: {
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    marginBottom: moderateScale(20),
  },
  scrollViewContent: {
    paddingTop: moderateScale(2),
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    alignSelf: "center",
  },
});

export default UserScreen;