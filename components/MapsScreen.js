import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FirebaseRTDB, FirebaseAuth } from "../firebase";
import { ref, get } from "firebase/database";
import Constants from "expo-constants";

const MapScreen = () => {
  const [personalLocation, setPersonalLocation] = useState(null);
  const [personalDrink, setPersonalDrink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalLocation = async () => {
      try {
        const user = FirebaseAuth.currentUser;
        const personalLocationRef = ref(
          FirebaseRTDB,
          `select/${user.uid}/location`
        );
        const snapshot = await get(personalLocationRef);
        if (snapshot.exists()) {
          const { latitude, longitude } = snapshot.val();
          setPersonalLocation({ latitude, longitude });
        } else {
          setError("Location data not found");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching personal location:", error.message);
        setError("Error fetching location data");
        setIsLoading(false);
      }
    };

    fetchPersonalLocation();
  }, []);


  useEffect(() => {
    const fetchPersonalDrink = async () => {
      try {
        const user = FirebaseAuth.currentUser;
        const personalDrinkRef = ref(
          FirebaseRTDB,
          `select/${user.uid}/selectedDrink`
        );
        const snapshot = await get(personalDrinkRef);
        if (snapshot.exists()) {
          const  selectedDrink  = snapshot.val();
          setPersonalDrink( selectedDrink);
          console.log("personalDrink:", selectedDrink);
        } else {
          setError("Drink data not found");
         }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching personal drink:", error.message);
        setError("Error fetching drink data");
        setIsLoading(false);
      }
    };

    fetchPersonalDrink();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6FCF97" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: personalLocation ? personalLocation.latitude : 0,
          longitude: personalLocation ? personalLocation.longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {personalLocation && (
          <Marker
            coordinate={{
              latitude: personalLocation.latitude,
              longitude: personalLocation.longitude,
            }}
            title={personalDrink ? `Drink: ${personalDrink} Name: ` : "Your Location" } // Set the title to the selected drink if available, otherwise "Your Location"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
