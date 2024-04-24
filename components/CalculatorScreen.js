import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender:</Text>
        <TouchableOpacity
          onPress={toggleGenderPicker}
          style={[styles.input, { flex: 1 }]}
        >
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
        <Text style={[styles.input, { flex: 1 }]}>{weight}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={200}
        step={1}
        value={weight}
        onValueChange={(value) => setWeight(value)}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Drink Type:</Text>
        <TouchableOpacity
          onPress={toggleDrinkTypePicker}
          style={[styles.input, { flex: 1 }]}
        >
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
        <Text style={styles.label}>Drink Size (ml):</Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={drinkVolume.toString()}
          onChangeText={(text) => setDrinkVolume(parseInt(text) || 0)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Drink Alcohol Percentage:</Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={drinkAlcoholPercentage.toString()}
          onChangeText={(text) =>
            setDrinkAlcoholPercentage(parseInt(text) || 0)
          }
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount of Drinks:</Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={drinkAmount.toString()}
          onChangeText={(text) => setDrinkAmount(parseInt(text) || 0)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Alcohol in Grams:</Text>
        <Text style={[styles.input, { flex: 1 }]}>{alcoholInGrams}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Calculate BAC" onPress={calculateBAC} />
        <Button title="Clear" onPress={clearInputs} />
      </View>
      {result !== "" && (
        <Text style={styles.result}>
          Blood Alcohol Concentration (per mille): {result}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  picker: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginTop: 8,
  },
  slider: {
    width: "100%",
    marginTop: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});

export default CalculatorScreen;
