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
      const isAlreadyFriend = friendList.some((friend) => friend.id === user.id);
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
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {loading ? (
          <Text>Loading user data...</Text>
        ) : filteredData && filteredData.length > 0 ? (
          filteredData.map((user, index) => (
            <View style={styles.userContainer} key={index}>
              {user.profilePicture && (
                <Image
                  source={{ uri: user.profilePicture }}
                  style={styles.profileImage}
                />
              )}
              <Text style={styles.userInfo}>Name: {user.name}</Text>
              <Text style={styles.userInfo}>Age: {user.age}</Text>
              <Text style={styles.userInfo}>Hobby: {user.hobby}</Text>
              <Text style={styles.userInfo}>
                Favorite Drink: {user.favoriteDrink}
              </Text>
              {/* Add Friend button */}
              <TouchableOpacity onPress={() => addToFriendList(user)}>
                <Text style={styles.addFriendButton}>Add Friend</Text>
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
  addFriendButton: {
    marginTop: 5,
    color: "blue", // You can style this button as needed
    textDecorationLine: "underline",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
});

export default AllContactsScreen;
