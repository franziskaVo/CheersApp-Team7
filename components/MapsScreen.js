// import React, { useState, useEffect } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { FirebaseRTDB, FirebaseAuth } from "../firebase";
// import { ref, get } from "firebase/database";
// import Constants from "expo-constants";

// const MapScreen = () => {
//   const [personalLocation, setPersonalLocation] = useState(null);
//   const [personalDrink, setPersonalDrink] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPersonalLocation = async () => {
//       try {
//         const user = FirebaseAuth.currentUser;
//         const personalLocationRef = ref(
//           FirebaseRTDB,
//           `select/${user.uid}/location`
//         );
//         const snapshot = await get(personalLocationRef);
//         if (snapshot.exists()) {
//           const { latitude, longitude } = snapshot.val();
//           setPersonalLocation({ latitude, longitude });
//         } else {
//           setError("Location data not found");
//         }
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching personal location:", error.message);
//         setError("Error fetching location data");
//         setIsLoading(false);
//       }
//     };

//     fetchPersonalLocation();
//   }, []);


//   useEffect(() => {
//     const fetchPersonalDrink = async () => {
//       try {
//         const user = FirebaseAuth.currentUser;
//         const personalDrinkRef = ref(
//           FirebaseRTDB,
//           `select/${user.uid}/selectedDrink`
//         );
//         const snapshot = await get(personalDrinkRef);
//         if (snapshot.exists()) {
//           const  selectedDrink  = snapshot.val();
//           setPersonalDrink( selectedDrink);
//           console.log("personalDrink:", selectedDrink);
//         } else {
//           setError("Drink data not found");
//          }
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching personal drink:", error.message);
//         setError("Error fetching drink data");
//         setIsLoading(false);
//       }
//     };

//     fetchPersonalDrink();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#6FCF97" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: personalLocation ? personalLocation.latitude : 0,
//           longitude: personalLocation ? personalLocation.longitude : 0,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         {personalLocation && (
//           <Marker
//             coordinate={{
//               latitude: personalLocation.latitude,
//               longitude: personalLocation.longitude,
//             }}
//             title={personalDrink ? `Drink: ${personalDrink} Name: ` : "Your Location" } // Set the title to the selected drink if available, otherwise "Your Location"
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: Constants.statusBarHeight,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

// export default MapScreen;

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FirebaseRTDB, db } from "../firebase";
import { ref, onValue } from "firebase/database";
import Constants from "expo-constants";
import { collection, getDocs } from "firebase/firestore";

const MapsScreen = () => {
  const [userLocations, setUserLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = ref(FirebaseRTDB, "select");
        onValue(usersRef, async (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const locations = Object.values(data).map(async (userData) => {
              const userId = userData.userId;
              const userDoc = await getDocs(collection(db, "user"));
              const userDataSnapshot = userDoc.docs.find(
                (doc) => doc.id === userId
              );
              const user = userDataSnapshot.data();
              return {
                id: user.uid,
                latitude: userData.location.latitude,
                longitude: userData.location.longitude,
                selectedDrink: userData.selectedDrink,
                name: user.name,
                profileImage: user.profileImage,
              };
            });
            const resolvedLocations = await Promise.all(locations);
            setUserLocations(resolvedLocations);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setIsLoading(false);
      }
    };

    fetchData();
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
          latitude: userLocations.length > 0 ? userLocations[0].latitude : 0,
          longitude: userLocations.length > 0 ? userLocations[0].longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocations.map((userLocation) => (
          <Marker
            key={userLocation.id} // Provide a unique key for each Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title={`Name: ${userLocation.name}, Drink: ${userLocation.selectedDrink}`} // Fixed title syntax
          >
            <Image
              source={{ uri: userLocation.profileImage }}
              style={styles.image}
            />
            {/* <Text>{userLocation.name}</Text> */}
          </Marker>
        ))}
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
  image: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
});

export default MapsScreen;
