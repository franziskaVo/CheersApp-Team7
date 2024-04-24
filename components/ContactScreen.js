import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllContactsScreen from "./AllContactsScreen";
import FriendListScreen from "./FriendListScreen"; // Import FriendListScreen component
import { db } from "../firebase"; // Import db and userRef from firebase.js
import { getDocs, collection } from "firebase/firestore";

const Tab = createMaterialTopTabNavigator();

const ContactScreen = ({ navigation, route, userId }) => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = collection(db, "user");
        const querySnapshot = await getDocs(userRef);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="All Contacts">
        {(props) => (
          <AllContactsScreen {...props} userData={userData} loading={loading} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Friend List">
        {(props) => <FriendListScreen {...props} userId={userId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default ContactScreen;
