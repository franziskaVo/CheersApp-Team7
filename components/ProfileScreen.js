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
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { db, auth } from "../firebase"; // Import db and userRef from firebase.js
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
// import { FontAwesome5 } from "@expo/vector-icons";

// const ProfileScreen = ({
//   userId,
//   email,
//   password,
//   profileImage,
//   setProfileImage,
// }) => {
//   const [userData, setUserData] = useState(null); // State to store user data
//   const [loading, setLoading] = useState(true); // State to track loading status
//   const [showPassword, setShowPassword] = useState(false); // State to track password visibility
//   const [editing, setEditing] = useState(false); // State to track editing mode
//   const [editedUserData, setEditedUserData] = useState(null); // State to store edited user data
//   const [editedEmail, setEditedEmail] = useState(""); // State to store edited email
//   const [editedPassword, setEditedPassword] = useState(""); // State to store edited password

//   const userRef = collection(db, "user");

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
//         setEditedEmail(currentUserData[0].email); // Initialize edited email with current user email
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
//       const userDocRef = doc(db, "user", editedUserData.id);
//       await updateDoc(userDocRef, editedUserData);
//       // Update user's email if it has been edited
//       if (editedEmail !== userData[0].email) {
//         await auth.currentUser.updateEmail(editedEmail);
//       }
//       // Update user's password if it has been edited
//       if (editedPassword) {
//         await auth.currentUser.updatePassword(editedPassword);
//       }
//       setUserData([editedUserData]); // Update displayed user data with edited data
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
//       const permissionResult =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
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
//           profileImage: selectedAsset.uri, // Update profileImage field
//         }));
//       }
//     } catch (error) {
//       console.error("Image picker error:", error);
//       Alert.alert("Failed to pick an image");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <Text>Loading user data...</Text>
//       ) : userData && userData.length > 0 ? (
//         <View style={styles.userContainer}>
//           {!editing && (
//             <>
//               <TouchableOpacity
//                 onPress={editing ? pickImage : null}
//                 disabled={!editing}
//               >
//                 <View style={styles.profileImageContainer}>
//                   <Image
//                     style={styles.profileImage}
//                     source={{ uri: profileImage }}
//                   />
//                 </View>
//               </TouchableOpacity>

//               <Text style={styles.userInfo}> Name: </Text>
//               <Text style={styles.userInfo1}>{userData[0].name}</Text>
              
//               <Text style={styles.userInfo}> Email: </Text>
//               <Text style={styles.userInfo1}>{email}</Text>

//               {/*<View style={styles.passwordContainer}>*/}
//                 <Text style={styles.userInfo}> Password: </Text>
//                 <Text style={styles.userInfo1}>
//                   {showPassword ? password : "******"}
//                   <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                   {showPassword ? (
//                     <FontAwesome5 name="eye" size={15} color="#f43f5e" paddingLeft={30} paddingVertical={15}/>
//                   ) : (
//                     <FontAwesome5 name="eye-slash" size={15} color="#f43f5e" paddingLeft={30} paddingVertical={15}/>
//                   )}
//                 </TouchableOpacity>
//                 </Text>
                
//               {/*</View>*/}

//               <Text style={styles.userInfo}> Age: </Text>
//               <Text style={styles.userInfo1}> {userData[0].age}</Text>

//               <Text style={styles.userInfo}> Hobby: </Text>
//               <Text style={styles.userInfo1}> {userData[0].hobby}</Text>


//               <Text style={styles.userInfo}> Favorite Drink: </Text>
//               <Text style={styles.userInfo1}>{userData[0].favoriteDrink}</Text>
//             </>
//           )}
//           {editing && (
//             <>
//             <View style={styles.profileImageContainer}>
//               <TouchableOpacity onPress={pickImage}>
//                 <Image
//                   style={styles.profileImage}
//                   source={{ uri: profileImage }}
//                 />
//                 <FontAwesome5
//                   name="camera"
//                   size={24}
//                   color="#ffffff"
//                   style={styles.cameraIcon}
//                 />
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.userInfo}> Name: </Text>
//               <TextInput
//                 style={styles.userInfo1}
//                 value={editedUserData.name}
//                 onChangeText={(text) => handleChange("name", text)}
//                 placeholder="Enter new name"
//               />
//               <Text style={styles.userInfo}> Email: </Text>
//               <TextInput
//                 style={styles.userInfo1}
//                 value={editedEmail}
//                 onChangeText={(text) => setEditedEmail(text)}
//                 placeholder="Enter new email"
//                 editable={editing} // Make the TextInput editable only when in editing mode
//               />

//               {/* Password section */}
//               <Text style={styles.userInfo}> Password: </Text>
//               <TextInput
//                 style={styles.userInfo1}
//                 value={editedPassword}
//                 onChangeText={(text) => setEditedPassword(text)}
//                 placeholder="Enter new password"
//                 secureTextEntry={!showPassword} // Hide/show password functionality
//                 editable={editing} // Make the TextInput editable only when in editing mode
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 disabled={!editing}
//               >
//                 <FontAwesome5
//                   name={showPassword ? "eye" : "eye-slash"}
//                   size={20}
//                   color="#f43f5e"
//                 />
//               </TouchableOpacity>
//               <Text style={styles.userInfo}> Age: </Text>
//               <TextInput
//                 style={styles.userInfo1}
//                 value={editedUserData.age.toString()}
//                 onChangeText={(text) =>
//                   handleChange("age", parseInt(text) || 0)
//                 }
//                 placeholder="Enter new age"
//                 keyboardType="numeric"
//               />
//               <Text style={styles.userInfo}> Hobby: </Text>
//               <TextInput
//                 style={styles.userInfo1}
//                 value={editedUserData.hobby}
//                 onChangeText={(text) => handleChange("hobby", text)}
//                 placeholder="Enter new hobby"
//               />
//               <Text style={styles.userInfo}> Favorite Drink: </Text>
//               <TextInput
//                 style={styles.userInfo1}
//                 value={editedUserData.favoriteDrink}
//                 onChangeText={(text) => handleChange("favoriteDrink", text)}
//                 placeholder="Enter new favorite drink"
//               />
//               <TouchableOpacity style={styles.button} onPress={handleSave} >
//                 <Text style={styles.buttonText}>Save</Text>
//                 </TouchableOpacity>
//             </>
//           )}
//           {!editing && 
//           <TouchableOpacity style={styles.button} onPress={handleEdit}>  
//           <Text style={styles.buttonText}>Edit</Text>
//           </TouchableOpacity>
//           }
//         </View>
//       ) : (
//         <Text>No user data available.</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#ffffffff",
//   },
//   userContainer: {
//     marginBottom: 5,
//     alignItems: "center",
//     justifyContent:'center'
//   },
//   button:{
//     alignItems:'center',
//     backgroundColor: "#f43f5e",
//     width:200,
//     textAlign:'center',
//     fontSize: 10,
//     fontWeight: 'bold',
//     padding: 10,
//     borderWidth: 1,
//     borderColor:"#f43f5e",
//     borderRadius: 10,
//     marginBottom:20,
//     marginTop:5,
//   },
//   buttonText:{
//     color: "#ffffff",
//     fontWeight:'bold',
//   },
//   userInfo: {
//     marginBottom: 6,
//     fontSize:16,
//     textAlign: 'center',
//     fontWeight: "bold",
//   },
//   userInfo1: {
//     height:40, 
//     width:250,
//     borderColor:"#f5b5bf",
//     padding:10,
//     borderWidth: 1,
//     justifyContent: "center",
//     borderRadius: 20,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   passwordContainer: {
//     //flexDirection: "row",
//     //alignItems: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//     width: "100%",
//   },
//   profileImageContainer: {
//     position: "relative",
//     overflow: "hidden", // Ensure the icon doesn't overflow the container
//   },
//   cameraIcon: {
//     position: "absolute",
//     bottom: 42,
//     right: 33,
//     // backgroundColor: "rgba(0, 0, 0, 0.5)", // Add background to the icon for better visibility
//     padding: 5, // Add padding to the icon for better touch area
//   },
// });

// export default ProfileScreen;
