import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import { moderateScale } from "../Metrics";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

const CalculatorScreen = () => {
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState(50); // Default weight value
  const [drinkType, setDrinkType] = useState("");
  const [drinkVolume, setDrinkVolume] = useState("");
  const [drinkAlcoholPercentage, setDrinkAlcoholPercentage] = useState("");
  const [alcoholInGrams, setAlcoholInGrams] = useState("");
  const [result, setResult] = useState("");
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showDrinkTypePicker, setShowDrinkTypePicker] = useState(false);
  const [drinkSize, setDrinkSize] = useState(0);
  const [drinkAmount, setDrinkAmount] = useState(0);

  const drinkOptions = [
    { name: "Beer", alcoholPercentage: 5, volume: 355 }, // 355ml (12oz) of beer typically has 5% alcohol
    { name: "Wine", alcoholPercentage: 12, volume: 150 }, // 150ml of wine typically has 12% alcohol
    { name: "Vodka", alcoholPercentage: 40, volume: 44 }, // A standard shot of vodka (44ml) typically has 40% alcohol
    // Add more drink options as needed
  ];

  useEffect(() => {
    // Update alcohol in grams when alcohol percentage changes
    if (drinkVolume && drinkAlcoholPercentage) {
      const alcoholInGrams =
        ((drinkVolume * drinkAlcoholPercentage) / 100) * 0.789;
      setAlcoholInGrams(alcoholInGrams.toFixed(2));
    }
  }, [drinkVolume, drinkAlcoholPercentage]);

  const toggleGenderPicker = () => {
    setShowGenderPicker(!showGenderPicker);
  };

  const toggleDrinkTypePicker = () => {
    setShowDrinkTypePicker(!showDrinkTypePicker);
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setShowGenderPicker(false); // Hide the picker after selecting gender
  };

  const handleDrinkTypeSelect = (selectedDrinkType) => {
    setDrinkType(selectedDrinkType);
    setShowDrinkTypePicker(false); // Hide the picker after selecting drink type

    // Fetch alcohol percentage and volume based on the selected drink type
    const selectedDrink = drinkOptions.find(
      (drink) => drink.name === selectedDrinkType
    );
    if (selectedDrink) {
      setDrinkAlcoholPercentage(selectedDrink.alcoholPercentage.toString());
      setDrinkVolume(selectedDrink.volume.toString());

      // Calculate alcohol in grams
      const alcoholInGrams =
        ((selectedDrink.volume * selectedDrink.alcoholPercentage) / 100) *
        0.789;
      setAlcoholInGrams(alcoholInGrams.toFixed(2));
    }
  };

  const calculateBAC = () => {
    // Check if any required field is empty
  if (!gender || !drinkType || !drinkVolume || !drinkAlcoholPercentage || !drinkAmount) {
    Alert.alert("Please fill in all fields.");
    return;
  }
    const genderFactor = gender === "male" ? 0.7 : 0.6;
    const alcoholGrams =
      ((drinkVolume * drinkAlcoholPercentage) / 100) * 0.789 * drinkAmount;
    const bodyFluid = weight * genderFactor;
    const bac = alcoholGrams / bodyFluid;
    setResult(bac.toFixed(2));
  };

  const clearInputs = () => {
    setGender("");
    setWeight(50);
    setDrinkType("");
    setDrinkVolume("");
    setDrinkAlcoholPercentage("");
    setAlcoholInGrams("");
    setDrinkSize(0);
    setDrinkAmount(0);
    setResult("");
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
       contentContainerStyle={styles.scrollViewContent}
      extraScrollHeight={Platform.select({ ios: 50, android: 0 })}
      enableOnAndroid={true}
      >
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender:</Text>
        <TouchableOpacity onPress={toggleGenderPicker} style={styles.input}>
          <Text style={styles.inputText}>{gender || "Select gender"}</Text>
        </TouchableOpacity>
      </View>
      {showGenderPicker && (
        <Picker
          style={styles.picker}
          selectedValue={gender}
          onValueChange={(itemValue, itemIndex) =>
            handleGenderSelect(itemValue)
          }
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight (kg):</Text>
        <Text style={styles.weightInput}>{weight}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={200}
        step={1}
        value={weight}
        onValueChange={(value) => setWeight(value)}
        maximumTrackTintColor={"#f5b5bf"}
        minimumTrackTintColor={"#f43f5e"}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Drink Type:</Text>
        <TouchableOpacity onPress={toggleDrinkTypePicker} style={styles.input}>
          <Text style={styles.inputText}>
            {drinkType || "Select drink type"}
          </Text>
        </TouchableOpacity>
      </View>
      {showDrinkTypePicker && (
        <Picker
          style={styles.picker}
          selectedValue={drinkType}
          onValueChange={(itemValue, itemIndex) =>
            handleDrinkTypeSelect(itemValue)
          }
        >
          <Picker.Item label="Select Drink Type" value="" />
          <Picker.Item label="Beer" value="Beer" />
          <Picker.Item label="Wine" value="Wine" />
          <Picker.Item label="Vodka" value="Vodka" />
          {/* Add more drink options as needed */}
        </Picker>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Size (ml):</Text>
        <TextInput
          style={styles.input}
          value={drinkVolume.toString()}
          onChangeText={(text) => setDrinkVolume(parseInt(text) || 0)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Alcohol (%):</Text>
        <TextInput
          style={styles.input}
          value={drinkAlcoholPercentage.toString()}
          onChangeText={(text) =>
            setDrinkAlcoholPercentage(parseInt(text) || 0)
          }
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Drink Amount:</Text>
        <TextInput
          style={styles.input}
          value={drinkAmount.toString()}
          onChangeText={(text) => setDrinkAmount(parseInt(text) || 0)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Alcohol (g):</Text>
        <Text style={[styles.alcoholInput]}>{alcoholInGrams}</Text>
      </View>
      {result !== "" && <Text style={styles.result}>Per mille: {result}</Text>}
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={calculateBAC}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={clearInputs}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>
      </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    //paddingVertical: moderateScale(20),
    //paddingHorizontal: moderateScale(30),
    backgroundColor: "#f7f7f7",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: "center",
    marginBottom: moderateScale(20),
    //marginRight: moderateScale(10),
    //marginLeft: moderateScale(10),
  },
  label: {
    flex:1,
    fontSize: moderateScale(18),
    marginRight: moderateScale(10), // Adjust this value as needed for spacing between label and input
    textAlign: 'right', // Align the text to the right
    fontWeight: "bold",
    //marginRight: moderateScale(10),
    color:'#4b4545'
  },
  input: {
    flex:2,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(10),
    marginTop: moderateScale(10),
    marginBottom: moderateScale(3),
    width: moderateScale(160),
    marginLeft: moderateScale(5),
    },
  weightInput: {
    flex: 1,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(20),
    backgroundColor: "#f7f7f7",
    marginTop: moderateScale(10),
    marginBottom: moderateScale(5),
  },
  alcoholInput: {
    flex: 2,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(20),
    marginTop: moderateScale(10),
    marginBottom: moderateScale(2),
    backgroundColor:'#f7f7f7',
    fontSize: moderateScale(14),
    fontWeight:'bold'
  },
  inputText: {
    fontSize: moderateScale(16),
    color: "#333",
  },
  picker: {
    width: moderateScale(250),
    marginTop: moderateScale(8),
  },
  slider: {
    width: moderateScale(300),
    marginBottom: moderateScale(30),
  },
  result: {
    marginTop: moderateScale(20),
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: moderateScale(30),
  },
  button: {
    backgroundColor: "#f43f5e",
    width: moderateScale(250),
    borderWidth: moderateScale(4),
    borderColor:"#f43f5e",
    alignItems: 'center',
    paddingVertical: moderateScale(7),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(10),
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  scrollViewContent: {
    paddingTop: moderateScale(2), 
  },
});

export default CalculatorScreen;
