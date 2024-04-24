import { ref, onValue, off } from "firebase/database";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FirebaseRTDB } from "../firebase"; // Import your Firebase Realtime Database instance

const MapsScreen = ({ route }) => {
  const { userId } = route.params ?? {};
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Reference to the user's location in the database
    const userLocationRef = ref(FirebaseRTDB, `select/${userId}/location`);

    // Listen for changes to the user's location in the database
    onValue(userLocationRef, (snapshot) => {
      const location = snapshot.val();
      console.log("User location from database:", location); // Log user location
      setUserLocation(location);
    });

    // Cleanup function to unsubscribe from the database listener
    return () => {
      off(userLocationRef);
    };
  }, [userId]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 0,
          longitude: userLocation ? userLocation.longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Display user marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="User Location"
          />
        )}
      </MapView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default MapsScreen;


