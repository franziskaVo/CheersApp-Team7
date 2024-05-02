// // import React, { useState, useEffect } from "react";
// // import { View, StyleSheet, Text, ActivityIndicator, Image } from "react-native";
// // import MapView, { Marker } from "react-native-maps";
// // import { FirebaseRTDB, db } from "../firebase";
// // import { ref, onValue } from "firebase/database";
// // import Constants from "expo-constants";
// // import { collection, getDocs } from "firebase/firestore";
// // import * as Location from "expo-location"; // Import Location module
// // import { moderateScale } from "../Metrics";

// // const MapsScreen = () => {
// //   const [userLocations, setUserLocations] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [initialRegion, setInitialRegion] = useState({
// //     latitude: 0, // Default latitude
// //     longitude: 0, // Default longitude
// //     latitudeDelta: 0.0922,
// //     longitudeDelta: 0.0421,
// //   });

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const usersRef = ref(FirebaseRTDB, "select");
// //         onValue(usersRef, async (snapshot) => {
// //           const data = snapshot.val();
// //           if (data) {
// //             const locations = Object.values(data).map(async (userData) => {
// //               const userId = userData.userId;
// //               const userDoc = await getDocs(collection(db, "user"));
// //               const userDataSnapshot = userDoc.docs.find(
// //                 (doc) => doc.id === userId
// //               );
// //               const user = userDataSnapshot.data();
// //               return {
// //                 id: user.uid,
// //                 latitude: userData.location.latitude,
// //                 longitude: userData.location.longitude,
// //                 selectedDrink: userData.selectedDrink,
// //                 name: user.name,
// //                 profileImage: user.profileImage,
// //               };
// //             });
// //             const resolvedLocations = await Promise.all(locations);
// //             setUserLocations(resolvedLocations);
// //           }
// //         });

// //         // Fetch user's current location
// //         let { status } = await Location.requestForegroundPermissionsAsync();
// //         if (status !== "granted") {
// //           setError("Permission to access location was denied");
// //           setIsLoading(false);
// //           return;
// //         }

// //         let location = await Location.getCurrentPositionAsync({});
// //         setInitialRegion({
// //           latitude: location.coords.latitude,
// //           longitude: location.coords.longitude,
// //           latitudeDelta: 0.0922,
// //           longitudeDelta: 0.0421,
// //         });

// //         setIsLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //         setError("Error fetching data");
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   if (isLoading) {
// //     return (
// //       <View style={styles.container}>
// //         <ActivityIndicator size="large" color="#f43f5e" />
// //       </View>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <View style={styles.container}>
// //         <Text>Error: {error}</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <MapView style={styles.map} initialRegion={initialRegion}>
// //         {userLocations.map((userLocation) => (
// //           <Marker
// //             key={userLocation.id}
// //             coordinate={{
// //               latitude: userLocation.latitude,
// //               longitude: userLocation.longitude,
// //             }}
// //             title={`Name: ${userLocation.name}, Drink: ${userLocation.selectedDrink}`}
// //           >
// //             <Image
// //               source={{ uri: userLocation.profileImage }}
// //               style={styles.image}
// //             />
// //           </Marker>
// //         ))}
// //       </MapView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     paddingTop: Constants.statusBarHeight,
// //   },
// //   map: {
// //     ...StyleSheet.absoluteFillObject,
// //   },
// //   image: {
// //     width: moderateScale(45),
// //     height: moderateScale(45),
// //     borderRadius: moderateScale(50),
// //     borderWidth: moderateScale(1),
// //     borderColor: "#ffffff",
// //   },
// // });

// // export default MapsScreen;

// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, Text, ActivityIndicator, Image } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { FirebaseRTDB, db } from "../firebase";
// import { ref, onValue, set } from "firebase/database";
// import Constants from "expo-constants";
// import { collection, getDocs } from "firebase/firestore";
// import * as Location from "expo-location"; // Import Location module
// import { moderateScale } from "../Metrics";
// import { getAuth } from "firebase/auth";

// const MapsScreen = () => {
//   const [userLocations, setUserLocations] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [initialRegion, setInitialRegion] = useState({
//     latitude: 0, // Default latitude
//     longitude: 0, // Default longitude
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const auth = getAuth();
//         const currentUser = auth.currentUser;

//         if (currentUser) {
//           const userId = currentUser.uid;

//           const usersRef = ref(FirebaseRTDB, "select");
//           onValue(usersRef, async (snapshot) => {
//             const data = snapshot.val();
//             if (data) {
//               const locations = Object.values(data).map(async (userData) => {
//                 const userId = userData.userId;
//                 const userDoc = await getDocs(collection(db, "user"));
//                 const userDataSnapshot = userDoc.docs.find(
//                   (doc) => doc.id === userId
//                 );
//                 const user = userDataSnapshot.data();

//                 // Check if the timestamp is within the selected time
//                 const currentTime = new Date();
//                 const timestamp = new Date(userData.timestamp);
//                 const elapsedTime = (currentTime - timestamp) / 60000; // Convert milliseconds to minutes
//                 const selectedTime = userData.selectedTime; // Fetch selectedTime from userData

//                 if (elapsedTime <= selectedTime) {
//                   return {
//                     id: user.uid,
//                     latitude: userData.location.latitude,
//                     longitude: userData.location.longitude,
//                     selectedDrink: userData.selectedDrink,
//                     selectedTime: selectedTime,
//                     name: user.name,
//                     timestamp: userData.timestamp,
//                     profileImage: user.profileImage,
//                   };
//                 } else {
//                   // Remove location from Realtime Database
//                   await set(ref(FirebaseRTDB, `select/${userId}`), null);
//                 }
//               });
//               const resolvedLocations = await Promise.all(locations);
//               setUserLocations(
//                 resolvedLocations.filter((location) => location !== undefined)
//               );
//             }
//           });

//           // Fetch user's current location
//           let { status } = await Location.requestForegroundPermissionsAsync();
//           if (status !== "granted") {
//             setError("Permission to access location was denied");
//             setIsLoading(false);
//             return;
//           }

//           let location = await Location.getCurrentPositionAsync({});
//           setInitialRegion({
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           });

//           setIsLoading(false);
//         } else {
//           // Handle the case when there's no authenticated user
//           setIsLoading(false);
//           setError("No authenticated user found.");
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Error fetching data");
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#f43f5e" />
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
//       <MapView style={styles.map} initialRegion={initialRegion}>
//         {userLocations.map((userLocation) => (
//           <Marker
//             key={userLocation.id}
//             coordinate={{
//               latitude: userLocation.latitude,
//               longitude: userLocation.longitude,
//             }}
//             title={`Name: ${userLocation.name}, Drink: ${userLocation.selectedDrink},  Time: ${userLocation.timestamp}`}
//           >
//             <Image
//               source={{ uri: userLocation.profileImage }}
//               style={styles.image}
//             />
//           </Marker>
//         ))}
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
//   image: {
//     width: moderateScale(45),
//     height: moderateScale(45),
//     borderRadius: moderateScale(50),
//     borderWidth: moderateScale(1),
//     borderColor: "#ffffff",
//   },
// });

// export default MapsScreen;

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FirebaseRTDB, db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import Constants from "expo-constants";
import { collection, getDocs } from "firebase/firestore";
import * as Location from "expo-location";
import { moderateScale } from "../Metrics";
import { getAuth } from "firebase/auth";

const MapsScreen = () => {
  const [userLocations, setUserLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userId = currentUser.uid;

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

                const currentTime = new Date();
                const timestamp = new Date(userData.timestamp);
                const elapsedTime = (currentTime - timestamp) / 60000;
                const selectedTime = userData.selectedTime;

                if (elapsedTime <= selectedTime) {
                  return {
                    id: user.uid,
                    latitude: userData.location.latitude,
                    longitude: userData.location.longitude,
                    selectedDrink: userData.selectedDrink,
                    selectedTime: selectedTime,
                    name: user.name,
                    timestamp: userData.timestamp,
                    profileImage: user.profileImage,
                  };
                } else {
                  await set(ref(FirebaseRTDB, `select/${userId}`), null);
                }
              });
              const resolvedLocations = await Promise.all(locations);
              setUserLocations(
                resolvedLocations.filter((location) => location !== undefined)
              );
            }
          });

          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setError("Permission to access location was denied");
            setIsLoading(false);
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          setInitialRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });

          setIsLoading(false);
        } else {
          setIsLoading(false);
          setError("No authenticated user found.");
        }
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
        <ActivityIndicator size="large" color="#f43f5e" />
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
      <MapView style={styles.map} initialRegion={initialRegion}>
        {userLocations.map((userLocation) => (
          <Marker
            key={userLocation.id}
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title={`Name: ${userLocation.name}, Drink: ${userLocation.selectedDrink}, Time: ${userLocation.timestamp}`}
          >
            <Image
              source={{ uri: userLocation.profileImage }}
              style={styles.image}
            />
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
    width: moderateScale(45),
    height: moderateScale(45),
    borderRadius: moderateScale(50),
    borderWidth: moderateScale(1),
    borderColor: "#ffffff",
  },
});

export default MapsScreen;