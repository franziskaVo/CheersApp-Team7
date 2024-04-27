// export default SelectScreen;
import React, { useState, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { FirebaseAuth, FirebaseRTDB } from "../firebase";
import { getDatabase, ref, set } from "firebase/database";
import MapsScreen from "./MapsScreen";


const SelectScreen = () => {
  const [drinks, setDrinks] = useState([
    {
      name: "Mocktail",
      selected: false,
      image: require("../pictures/Mocktail.png"),
      style: styles.drinkImage,
    },
    {
      name: "Tea",
      selected: false,
      image: require("../pictures/Tea.png"),
      style: styles.drinkImage,
    },
    {
      name: "Coffee",
      selected: false,
      image: require("../pictures/Coffee.png"),
      style: styles.drinkImage,
    },
    {
      name: "Beer",
      selected: false,
      image: require("../pictures/Beer.png"),
      style: styles.drinkImage,
    },
    {
      name: "Champagne",
      selected: false,
      image: require("../pictures/Champagne.png"),
      style: styles.drinkImage,
    },
    {
      name: "Drink",
      selected: false,
      image: require("../pictures/Drink.png"),
      style: styles.drinkImage,
    },
    {
      name: "Longdrink",
      selected: false,
      image: require("../pictures/Longdrink.png"),
      style: styles.drinkImage,
    },
    {
      name: "Magherita",
      selected: false,
      image: require("../pictures/Magherita.png"),
      style: styles.drinkImage,
    },
    {
      name: "Martini",
      selected: false,
      image: require("../pictures/Martini.png"),
      style: styles.drinkImage,
    },
    {
      name: "Slushy",
      selected: false,
      image: require("../pictures/Slushy.png"),
      style: styles.drinkImage,
    },
    {
      name: "Whisky",
      selected: false,
      image: require("../pictures/Whisky.png"),
      style: styles.drinkImage,
    },
    {
      name: "Wine",
      selected: false,
      image: require("../pictures/Mocktail.png"),
      style: styles.drinkImage,
    },
  ]);

  const timeOptions = [
    { label: "15 min", value: 15 },
    { label: "30 min", value: 30 },
    { label: "45 min", value: 45 },
    { label: "60 min", value: 60 },
  ];

  const [selectedDrink, setSelectedDrink] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [drinkPickerVisible, setDrinkPickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const navigation = useNavigation();

  const handleNavigateToRecipes = () => {
    navigation.navigate("RecipeScreen");
  };

  useEffect(() => {
    // Request permission to access the user's location
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      // Get the user's current location
      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);

        // Store the user's location in Firebase Realtime Database
        //  const user = FirebaseAuth.currentUser;
        //  if (user) {
        //    await set(ref(FirebaseRTDB, `users/${user.uid}/location`), {
        //      latitude: location.coords.latitude,
        //      longitude: location.coords.longitude
        //    });
        //  }
      } catch (error) {
        console.error("Error getting user's location:", error.message);
        Alert.alert("Error", "Failed to get user's location.");
      }
    };

    getLocation();
  }, []);

  // Trigger getLocation when component mounts
  // useEffect(() => {
  //   getLocation();
  // }, []);

  // useFocusEffect(() => {
  //   getLocation();
  // });

  const selectDrink = (drink) => {
    const updatedDrinks = drinks.map((d) =>
      d.name === drink.name
        ? { ...d, selected: true }
        : { ...d, selected: false }
    );
    setSelectedDrink(drink);
    setDrinkPickerVisible(false);
    console.log("Selected drink:", drink.name);
    setDrinks(updatedDrinks);
  };

  const selectTime = (time) => {
    setSelectedTime(time);
    setTimePickerVisible(false);
  };

  const saveDataToRealtimeDB = async () => {
    try {
      const user = FirebaseAuth.currentUser;

      if (userLocation) {
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        // const db = getDatabase(); // Initialize the Realtime Database instance

        // Save data to Realtime Database
        await set(ref(FirebaseRTDB, `select/${user.uid}`), {
          userId: user.uid,
          selectedDrink: selectedDrink ? selectedDrink.name : null, // Check if selectedDrink is not null
          selectedTime: selectedTime,
          location: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          },
          timestamp: timestamp,
        });

        setSelectedDrink(null);
        setSelectedTime(null);
        setUserLocation(null);

        const updatedDrinks = drinks.map((drink) => ({
          ...drink,
          selected: false,
        }));
        setDrinks(updatedDrinks);


        console.log("Location:", userLocation); // Log the location


        navigation.navigate("Maps", {
          selectedDrink: selectedDrink ? selectedDrink.name : null, // Pass selectedDrink name if not null
          location: userLocation,
        });
      } else {
        console.error("User is not authenticated.");
        Alert.alert("Error", "User is not authenticated.");
      }
    } catch (error) {
      console.error("Error saving data to Realtime Database:", error.message);
      Alert.alert("Error saving data to Realtime Database:", error.message);
    }
  };

  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.optionsContainer}>
          {drinks.map((drink, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.drinkOption,
                drink.selected ? styles.selectedOption : null,
              ]}
              onPress={() => selectDrink(drink)}
            >
              <Image source={drink.image} style={styles.drinkImage} />
              <Text style={styles.drinkName}>{drink.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToRecipes}
        >
          <Text style={styles.buttonText}>Go to Recipes</Text>
        </TouchableOpacity>
        <View style={styles.timePickerContainer}>
          <Text style={styles.title}>Select Drinking Time</Text>
          <View style={styles.pickerButtonContainer}>
            <TouchableOpacity
              style={styles.selectedTime}
              onPress={() => setTimePickerVisible(true)}
            >
              <Text style={styles.selectedTimeText}>
                {selectedTime ? `${selectedTime} min` : "Select Time"}
              </Text>
            </TouchableOpacity>
            {timePickerVisible && (
              <Picker
                selectedValue={selectedTime}
                onValueChange={(itemValue) => selectTime(itemValue)}
                style={styles.picker}
              >
                {timeOptions.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={saveDataToRealtimeDB}>
          <Text style={styles.buttonText}>Add Drink</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  drinkOption: {
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 10,
    width: "23%",
    borderRadius: 8,
  },
  drinkName: {
    fontSize: 12,
    marginBottom: 5,
  },
  drinkImage: {
    width: 75,
    height: 75,
    // marginBottom: 5,
  },
  selectedOption: {
    backgroundColor: "#6FCF97",
  },
  button: {
    backgroundColor: "#6FCF97",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 35,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  timePickerContainer: {
    alignItems: "center",
  },
  selectedTime: {
    height: 50,
    width: 200,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 20,
    paddingHorizontal: 10,
  },
  selectedTimeText: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: 200,
    marginBottom: 20,
  },
  pickerButtonContainer: {
    marginBottom: 50, // Adjust this value as needed
  },
});

export default SelectScreen;
