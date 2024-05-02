import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "../Metrics";

const AllContactsScreen = ({ userData, loading }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [filteredData, setFilteredData] = useState(userData); // State to store filtered data

  // Function to handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (userData) {
      // Filter userData based on search query
      const filtered = userData.filter(
        (user) =>
          user.name &&
          typeof user.name === "string" &&
          user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    setFilteredData(userData);
  }, [userData]);

  // Function to store user data in AsyncStorage
  const storeUserData = async (data) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(data));
      console.log("User data stored successfully.");
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const addToFriendList = async (user) => {
    try {
      // Retrieve existing friend list from AsyncStorage
      const existingFriendList = await AsyncStorage.getItem("friendList");
      let friendList = [];
      if (existingFriendList) {
        friendList = JSON.parse(existingFriendList);
      }

      // Check if the user is already in the friend list
      const isAlreadyFriend = friendList.some(
        (friend) => friend.id === user.id
      );
      if (isAlreadyFriend) {
        alert("User already in friends!");
      } else {
        // Add the user to the friend list
        friendList.push(user);
        // Update friend list in AsyncStorage
        await AsyncStorage.setItem("friendList", JSON.stringify(friendList));
        console.log("User added to friends successfully.");
        alert("User added to friends!");
      }
    } catch (error) {
      console.error("Error adding user to friends:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {loading ? (
          <Text>Loading user data...</Text>
        ) : filteredData && filteredData.length > 0 ? (
          filteredData.map((user, index) => (
            <View style={styles.container} key={index}>
              <View style={styles.userContainer}>
                <View style={styles.avatarContainer}>
                  {user.profileImage ? (
                    <Image
                      source={{ uri: user.profileImage }}
                      style={styles.profileImage}
                      onError={(e) =>
                        console.log("Error loading image:", e.nativeEvent.error)
                      }
                    />
                  ) : (
                    <Ionicons
                      name="person-circle-outline"
                      size={80}
                      color="#555"
                    />
                  )}
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.userInfo}>Name: {user.name}</Text>
                  <Text style={styles.userInfo}>Age: {user.age}</Text>
                  <Text style={styles.userInfo}>Hobby: {user.hobby}</Text>
                  <Text style={styles.userInfo}>
                    Favorite Drink: {user.favoriteDrink}
                  </Text>
                </View>
              </View>
              {/* Add Friend button */}
              <TouchableOpacity
                style={styles.addToFavoritesButton}
                onPress={() => addToFriendList(user)}
              >
                <Text style={styles.buttonText}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No matching contacts found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: "#f7f7f7",
  },
  userContainer: {
    flexDirection: "row",
    borderRadius: moderateScale(15),
    padding: moderateScale(10),
    marginBottom: moderateScale(5),
    backgroundColor: "#f0c7ce",
    marginLeft: moderateScale(30),
    marginRight: moderateScale(10),
    marginTop: moderateScale(5),
    width: moderateScale(330),
  },
  userInfo: {
    marginBottom: moderateScale(5),
    color:'#4b4545'
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    marginBottom: moderateScale(10),
  },
  addToFavoritesButton: {
    alignItems:'center',
    backgroundColor: "#f43f5e",
    width:'40%',
    textAlign:'center',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    padding: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor:"#f43f5e",
    borderRadius: moderateScale(10),
    marginBottom:moderateScale(25),
    marginTop:moderateScale(5),
    marginLeft:moderateScale(30),
  },
  buttonText:{
    color: "#ffffff",
    fontWeight:'bold',
  },
  searchContainer: {
    justifyContent:'center',
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(25),
    marginTop: moderateScale(20),
  },
  searchInput: {   
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding:moderateScale(15),
    borderRadius: moderateScale(20),
    width: moderateScale(330),
  },
  contactTextContainer: {
    flex: 1,
    paddingVertical: moderateScale(12),
    padding: moderateScale(20),
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(10),
    marginLeft: moderateScale(10),
  },
});

export default AllContactsScreen;
