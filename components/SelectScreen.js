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
import { FirebaseAuth, FirebaseRTDB, FirebaseFirestore } from "../firebase";
import { ref, set } from "firebase/database";
import { moderateScale } from "../Metrics";

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
      image: require("../pictures/Wine.png"),
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
  
  const navigation = useNavigation();

  const handleNavigateToRecipes = () => {
    navigation.navigate("COCKTAILS");
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      setLocationPermission(false);
      return;
    }

    try {
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData.coords); // Update location with coordinates
    } catch (error) {
      console.error("Error getting location:", error.message);
      Alert.alert("Error", "Failed to get location");
    }
  };

  // Trigger getLocation when component mounts
  useEffect(() => {
    getLocation();
  }, []);

  

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

      if (user) {
        // Save data to Realtime Database
        await set(ref(FirebaseRTDB, `select/${user.uid}`), {
          userId: user.uid,
          selectedDrink: selectedDrink ? selectedDrink.name : null,
          selectedTime: selectedTime,
          location: location, // Update to use the location state

          timestamp: new Date().toISOString(),
        });

        console.log(location);

        // Reset selections and navigate
        setSelectedDrink(null);
        setSelectedTime(null);
        setLocation(null);
        navigation.navigate("Maps", { location: location });
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
        <TouchableOpacity
          style={[
            styles.addButton,
            (!selectedDrink || !selectedTime) && styles.button,  //vorheriger style disabeldButton
          ]}
          onPress={saveDataToRealtimeDB}
          disabled={!selectedDrink || !selectedTime}
        >
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
    backgroundColor: "#f7f7f7",
    paddingHorizontal: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginVertical: moderateScale(10),
    color:'#4b4545',
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: moderateScale(15),
  },
  drinkOption: {
    alignItems: "center",
    marginHorizontal: moderateScale(5),
    marginBottom: moderateScale(10),
    width: '25%', //'25%'
    height:'25%',
    borderRadius: moderateScale(8),
  },
  drinkName: {
    fontSize: moderateScale(12),
    marginBottom: moderateScale(5),
    color:'#4b4545'
  },
  drinkImage: {
    width: moderateScale(75),
    height: moderateScale(75),
  },
  selectedOption: {
    backgroundColor:'#f5b5bf',
  },
  button: {
    backgroundColor: "#f43f5e",
    width: moderateScale(250),
    borderWidth: 4,
    borderColor:"#f43f5e",
    alignItems: 'center',
    paddingVertical: moderateScale(7), 
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(25),
    marginTop: moderateScale(50),
  },
  addButton: {
    backgroundColor: "#f43f5e",
    width: moderateScale(250),
    borderWidth: moderateScale(4),
    borderColor:"#f43f5e",
    alignItems: 'center',
    paddingVertical: moderateScale(7),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(30),
    marginTop: moderateScale(18),
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  timePickerContainer: {
    alignItems: "center",
  },
  selectedTime: {
    height: moderateScale(50),
    width: moderateScale(200),
    backgroundColor: "#f5b5bf",
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
  },
  selectedTimeText: {
    fontSize: moderateScale(16),
  },
  picker: {
    height: moderateScale(50),
    width: moderateScale(200),
    marginBottom: moderateScale(20),
  },
  pickerButtonContainer: {
    marginBottom: moderateScale(50),
  },
  disabledButton: {
    backgroundColor: "#ccc",
    
  },
});

export default SelectScreen;
