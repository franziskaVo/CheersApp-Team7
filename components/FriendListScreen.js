import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Image, Alert, Pressable } from "react-native";
import { db } from "../firebase"; // Import db and userRef from firebase.js
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const FriendListScreen = ({ userId }) => {
  const [friendList, setFriendList] = useState([]); // State to store friend list
  const [friendsData, setFriendsData] = useState([]); // State to store friend details
  const navigation = useNavigation();


  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const userRef = doc(db, "user", userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFriendList(userData.friends || []);
        }
      } catch (error) {
        console.error("Error fetching friend list:", error);
      }
    };

    fetchFriendList();
  }, [userId]);

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const friendsDataPromises = friendList.map(async (friendId) => {
          const friendRef = doc(db, "user", friendId);
          const friendDoc = await getDoc(friendRef);
          return friendDoc.data();
        });
        const friendsData = await Promise.all(friendsDataPromises);
        setFriendsData(friendsData.filter((friend) => friend)); // Filter out null values
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    };

    fetchFriendsData();
  }, [friendList]);


  //---------get data from async storage and display it--------


  const fetchFriendList = useCallback(async () => {
    try {
      const friendsData = await AsyncStorage.getItem("friendList");
      if (friendsData) {
        setFriendsData(JSON.parse(friendsData));
      }
    } catch (error) {
      console.error("Error fetching friendsData: ", error);
    }
  }, []);
  

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchFriendList();
    });
    return unsubscribe;
  }, [navigation, fetchFriendList]);

  

  const clearFriendsList = async () => {
    try {
      await AsyncStorage.removeItem("friendList"); // Corrected key name
      setFriendsData([]);
      Alert.alert("Friends list cleared!");
    } catch (error) {
      console.error("Error clearing friends list: ", error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {friendsData && friendsData.length > 0 ? (
          friendsData.map((friend, index) => (
            <View style={styles.friendContainer} key={index}>
              {friend.profileImage && (
                <Image
                  source={{ uri: friend.profileImage }}
                  style={styles.profileImage}
                />
              )}
              <Text style={styles.friendInfoHeader}>Name:</Text>
              <Text style={styles.friendInfo}>{friend.name}</Text>
              <Text style={styles.friendInfoHeader}>Age:</Text>
              <Text style={styles.friendInfo}>{friend.age}</Text>
              <Text style={styles.friendInfoHeader}>Hobby:</Text>
              <Text style={styles.friendInfo}>{friend.hobby}</Text>
              <Text style={styles.friendInfoHeader}>Favorite Drink:</Text>
              <Text style={styles.friendInfo}>{friend.favoriteDrink}</Text>
            </View>
          ))
        ) : (
          <Text>No friends found.</Text>
        )}
        <Pressable style={styles.clearButton} onPress={clearFriendsList}>
                <Text style={styles.scoreButtonText}>CLEAR LIST</Text>
              </Pressable>
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
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  friendContainer: {
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    marginTop:20,
    width: 330,
    backgroundColor:'#fbd6dc',
  },
  friendInfoHeader: {
    fontWeight:'bold',
    fontSize: 15,
    color:'#4b4545',
    paddingTop:5,
  },
  friendInfo: {
    fontSize: 15,
    color:'#4b4545',
    //color: "#000000",
    paddingBottom:1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  clearButton: {
    flexDirection: "row",
    width: 250,
    //padding: 10,
    backgroundColor: "#f43f5e",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 25,
    borderWidth:4,
    borderColor:'#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center'
  },
  scoreButtonText: {
    textAlign:'center',
    color:"#ffffff",
    fontSize: 16,
    fontWeight:'bold',
  },
});

export default FriendListScreen;
