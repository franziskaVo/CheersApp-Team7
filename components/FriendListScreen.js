import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  Pressable,
  Modal,
} from "react-native";
import { db, userDetails } from "../firebase"; // Import db and userRef from firebase.js
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { moderateScale } from "../Metrics";

const FriendListScreen = ({ userId }) => {
  const [friendList, setFriendList] = useState([]); // State to store friend list
  const [friendsData, setFriendsData] = useState([]); // State to store friend details
  const [selectedFriend, setSelectedFriend] = useState(null); // State to store the selected friend
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
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

  const openFriendDetails = (friend) => {
    setSelectedFriend(friend);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {friendsData && friendsData.length > 0 ? (
          friendsData.map((friend, index) => (
            <Pressable
              style={styles.friendContainer}
              onPress={() => openFriendDetails(friend)}
              key={index}
            >
              <Text style={styles.friendInfoHeader}>{friend.name}</Text>
            </Pressable>
          ))
        ) : (
          <Text>No friends found.</Text>
        )}
        <Pressable style={styles.clearButton} onPress={clearFriendsList}>
          <Text style={styles.scoreButtonText}>CLEAR LIST</Text>
        </Pressable>

        {/* Modal to display friend details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {selectedFriend && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTextHeader}>Friend Details</Text>
                <Text style={styles.modalText}>
                  Name: {selectedFriend.name}
                </Text>
                <Text style={styles.modalText}>Age: {selectedFriend.age}</Text>
                <Text style={styles.modalText}>
                  Hobby: {selectedFriend.hobby}
                </Text>
                <Text style={styles.modalText}>
                  Favorite Drink: {selectedFriend.favoriteDrink}
                </Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButton}>Close</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Modal>
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
    paddingHorizontal: moderateScale(20),
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: moderateScale(10),
  },
  friendContainer: {
    borderRadius: moderateScale(15),
    padding: moderateScale(10),
    marginBottom: moderateScale(10),
    marginTop:moderateScale(20),
    width: moderateScale(330),
    backgroundColor:'#fbd6dc',
  },
  friendInfoHeader: {
    fontWeight:'bold',
    fontSize: moderateScale(15),
    color:'#4b4545',
    paddingTop: moderateScale(5),
  },
  friendInfo: {
    fontSize: moderateScale(15),
    color:'#4b4545',
    //color: "#000000",
    paddingBottom: moderateScale(1),
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    marginBottom: moderateScale(10),
  },
  clearButton: {
    flexDirection: "row",
    width: moderateScale(250),
    backgroundColor: "#f43f5e",
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(30),
    marginTop: moderateScale(25),
    borderWidth: moderateScale(4),
    borderColor:'#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center'
  },
  scoreButtonText: {
    textAlign:'center',
    color:"#ffffff",
    fontSize: moderateScale(16),
    fontWeight:'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "rgba(0, 0, 0, 0.5)",
    backgroundColor:'rgba(255, 193, 193, 0.5)'
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    width:moderateScale(300),
    maxHeight: moderateScale(400),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: moderateScale(10),
    textDecorationLine:'underline',
    //color: "#f43f5e",
  },
  modalTextHeader: {
    fontSize: moderateScale(16),
    fontWeight:'bold',
    marginBottom: moderateScale(2),
  },
  modalText: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(10),
  },
  closeButton: {
    alignSelf: "flex-end",
    color: "#f43f5e",
    fontSize: moderateScale(16),
  },
});

export default FriendListScreen;
