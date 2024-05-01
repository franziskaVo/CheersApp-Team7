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
        ) : 
        filteredData && filteredData.length > 0 ? (
          filteredData.map((user, index) => (
            <View style={styles.container}>
            <View style={styles.userContainer} key={index}>
              {user.profileImage && (
                <Image
                  source={{ uri: user.profileImage }}
                  style={styles.profileImage}
                  onError={(e) => console.log("Error loading image:", e.nativeEvent.error)}
                />
              )}
              <Text style={styles.userInfo}>Name: {user.name}</Text>
              <Text style={styles.userInfo}>Age: {user.age}</Text>
              <Text style={styles.userInfo}>Hobby: {user.hobby}</Text>
              <Text style={styles.userInfo}>Favorite Drink: {user.favoriteDrink}</Text>
            </View>
              {/* Add Friend button */}
              <TouchableOpacity  style={styles.addToFavoritesButton} onPress={() => addToFriendList(user)}>
                <Text style={styles.buttonText} >Add Friend</Text>
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
    borderRadius: 15,
    padding: 10,
    marginBottom: 5,
    backgroundColor:'#f0c7ce',
    marginLeft:30,
    marginRight:10,
    marginTop:5,
    width: 330,
    
  },
  userInfo: {
    marginBottom: 5,
    color:'#4b4545'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  addToFavoritesButton: {
    alignItems:'center',
    backgroundColor: "#f43f5e",
    width:'40%',
    textAlign:'center',
    fontSize: 10,
    fontWeight: 'bold',
    padding: 10,
    borderWidth: 1,
    borderColor:"#f43f5e",
    borderRadius: 10,
    marginBottom:25,
    marginTop:5,
    marginLeft:30,
  },
  buttonText:{
    color: "#ffffff",
    fontWeight:'bold',
  },
  searchContainer: {
    justifyContent:'center',
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 20,
  },
  searchInput: {   
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 20,
    width: 330,
  },
});

export default AllContactsScreen;
