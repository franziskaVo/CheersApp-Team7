import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, cocktailrecipy } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import RumSourImage from "../pictures/RumSour.png";
import BelmontImage from "../pictures/belmont.png";
import CranberryPunch from "../pictures/CranberryPunch.png";
import HibiscusSpritzImage from "../pictures/HibiscusSpritz.png";
import CasaBlancaImage from "../pictures/Drink6.png";
import GinTonicImage from "../pictures/Drink7.png";
import MoscowMuleMocktailImage from "../pictures/Drink8.png";
import BoraBoraImage from "../pictures/Drink9.png";
import BarracudaImage from "../pictures/Drink10.png";
import CaipirinhaImage from "../pictures/Drink11.png";
import TequilaSunriseImage from "../pictures/Drink12.png";
import PlanterisPunchImage from "../pictures/Drink1.png";
import NegroniImage from "../pictures/Drink2.png";
import MangoLassiImage from "../pictures/Drink3.png";
import CosmopolitanImage from "../pictures/Drink4.png";
import { moderateScale } from "../Metrics";


const AllRecipesScreen = ({ cocktailData, loading }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [filteredData, setFilteredData] = useState([]); // Initialize as empty array
  const [showRecipe, setShowRecipe] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState(null);

  // Function to handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (cocktailData) {
      // Filter cocktailData based on search query
      const filtered = cocktailData.filter(
        (cocktail) =>
          cocktail.name &&
          typeof cocktail.name === "string" &&
          cocktail.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    // Set filteredData to cocktailData initially
    setFilteredData(cocktailData);
  }, [cocktailData]);


  const renderImage = (drinkName) => {
    // Get the image from the images object based on the drink name
    return images[drinkName];
  };

  // Store Cocktail
  const storeCocktail = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("cocktailData", jsonValue);
      console.log("Cocktail data stored successfully:", jsonValue);
    } catch (e) {
      console.log("Error storing cocktail data:", e);
      // saving error
    }
  }

  // Save data in FavoritesList
const saveDataInFavoritesList = async (cocktail) => {
  try {
    // Retrieve existing favorites from AsyncStorage
    const existingFavorites = await AsyncStorage.getItem("favorites");
    let favorites = [];
    if (existingFavorites) {
      favorites = JSON.parse(existingFavorites);
    }

    // Check if the cocktail is already in favorites
    const isAlreadyFavorite = favorites.some((fav) => fav.id === cocktail.id);
    if (isAlreadyFavorite) {
      // If the cocktail is already in favorites, display an alert
      alert("Recipe already in favorites!");
    } else {
      // Add the cocktail to favorites
      favorites.push(cocktail);
      
      // Update favorites in AsyncStorage
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      console.log("Data saved in favorites successfully:", favorites);
      
      // Optionally, you can provide feedback to the user
      alert("Recipe added to favorites!");
    }
  } catch (error) {
    console.error("Error adding recipe to favorites: ", error);
  }
}


  // Function to handle adding a recipe to favorites
  const addToFavorites = async (cocktail) => {
    try {
      // Store the cocktail data
      await storeCocktail(cocktail);
      
      // Save the cocktail data in the favorites list
      await saveDataInFavoritesList(cocktail);
      
    } catch (error) {
      console.error("Error adding recipe to favorites: ", error);
    }
  };

  const showRecipeDetails = async (cocktail) => {
    try {
      const cocktailDocRef = doc(db, cocktailrecipy, cocktail.id);
      const cocktailDocSnap = await getDoc(cocktailDocRef);
      const cocktailData = cocktailDocSnap.data();

      if (!cocktailData || !cocktailData.instructions) {
        alert("Instructions not available");
      } else {
        setSelectedCocktail(cocktailData);
        setShowRecipe(true);
      }
    } catch (error) {
      console.error("Error fetching instructions:", error);
      alert("Failed to fetch instructions");
    }
  };

  const images = {
    "Rum Sour": RumSourImage,
    Belmont: BelmontImage,
    "Cranberry Punch": CranberryPunch,
    "Casa Blanca": CasaBlancaImage,
    "Gin Tonic": GinTonicImage,
    "Hibiscus Sprizz": HibiscusSpritzImage,
    "Moscow Mule Mocktail": MoscowMuleMocktailImage,
    "Bora Bora": BoraBoraImage,
    Barracuda: BarracudaImage,
    Caipirinha: CaipirinhaImage,
    Cosmopolitan: CosmopolitanImage,
    "Tequila Sunrise": TequilaSunriseImage,
    "Planterís Punch": PlanterisPunchImage,
    Negroni: NegroniImage,
    "Mango Lassi": MangoLassiImage,

    // Add other drinks similarly
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {loading && <ActivityIndicator size="small" color="#999" />}
          
        </View>

        {filteredData && filteredData.length > 0 ? (
          filteredData.map((cocktail, index) => (
            <View key={cocktail.id} style={styles.container}>
            <TouchableOpacity onPress={() => showRecipeDetails(cocktail)}>
            <View key={cocktail.id} style={styles.cardContainer}>
              
            <Image
                source={renderImage(cocktail.name)} // Use renderImage function
                style={styles.cardImage}
              />

              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{cocktail.name}</Text>
                <Text style={styles.cardInfo}>Alcohol: {cocktail.alcohol}</Text>
                <Text style={styles.cardInfo}>Glass: {cocktail.glass}</Text>
              </View>
              
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addToFavoritesButton} onPress={() => addToFavorites(cocktail)}>
            <Text style={styles.buttonText}>Add to Favorites</Text>
          </TouchableOpacity>
          </View>
          ))
        ) : (
          <Text style={styles.noResultText}>No matching cocktails found.</Text>
        )}

        {/* Modal for showing recipe details */}
        <Modal visible={showRecipe} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCocktail?.name}</Text>
              <Text style={styles.modalTextHeader}>Ingredients:</Text>
              <Text style={styles.modalText}>{selectedCocktail?.quantities}</Text>
              <Text style={styles.modalTextHeader}>Instructions:</Text>
              <Text style={styles.modalText}>{selectedCocktail?.instructions}</Text>
              <TouchableOpacity onPress={() => setShowRecipe(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#f7f7f7',
  },
  searchContainer: {
    justifyContent:'center',
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(25),
    marginTop: moderateScale(20),
  },
  searchInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: moderateScale(15),
    borderRadius: moderateScale(20),
    width: moderateScale(330),
  },
  infoText:{
    textAlign:'center',
    fontSize:moderateScale(14),
    padding: moderateScale(10),
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent:'center',
    alignItems: "center",
    borderRadius: moderateScale(15),
    marginBottom: moderateScale(5),
    marginLeft: moderateScale(30),
    marginRight: moderateScale(10),
    marginTop: moderateScale(5),
    width: moderateScale(330),
    height:moderateScale(120),
    padding: moderateScale(25),
    backgroundColor:'#f0c7ce',
  },
  cardImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(8),
  },
  cardTextContainer: {
    flex: 1,
    paddingVertical: moderateScale(12),
    padding:moderateScale(20),
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: moderateScale(4),
    color:'#4b4545'
  },
  cardInfo: {
    fontSize: moderateScale(14),
    color:'#4b4545'
  },
  addToFavoritesButton: {
    alignItems:'center',
    backgroundColor: "#f43f5e",
    width:'40%',
    textAlign:'center',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    padding: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor:"#f43f5e",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(5),
    marginLeft: moderateScale(30),
    //marginLeft: "auto",
  },
  buttonText:{
    color: "#ffffff",
    fontWeight:'bold',
  },
  noResultText: {
    marginTop: moderateScale(20),
    fontSize: moderateScale(16),
    color: "#999",
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

  cardImage: {
    // Image style
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(50),
    marginRight: moderateScale(10),
  },
  
});

export default AllRecipesScreen;
