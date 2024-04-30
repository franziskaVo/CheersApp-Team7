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
        <Text style={styles.infoText}>Press on cocktail box to see ingredients and preparing instructions.</Text>

        {filteredData && filteredData.length > 0 ? (
          filteredData.map((cocktail, index) => (
            <View key={cocktail.id} style={styles.container}>
            <TouchableOpacity onPress={() => showRecipeDetails(cocktail)}>
            <View key={cocktail.id} style={styles.cardContainer}>
              <Image source={{ uri: cocktail.image }} style={styles.cardImage} />
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
              <Text style={styles.modalText}>{selectedCocktail?.ingredients}</Text>
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
    //justifyContent: "center",
    //alignItems: "center",
    //paddingHorizontal: 20,
    backgroundColor: '#ffffff'
  },
  searchContainer: {
    justifyContent:'center',
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  searchInput: {
    // flex: 1,
    // borderWidth: 1,
    // borderColor: "#fcb5bd",
    // borderRadius: 5,
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    //backgroundColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor:'#fbd6dc',
    padding: 15,
    borderRadius: 20,
    width: '97%',
    //marginBottom: 20,
  },
  infoText:{
    //fontWeight:'bold',
    textAlign:'center',
    fontSize:14,
    padding:10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f43f5e",
    borderRadius: 15,
    marginBottom: 5,
    marginLeft:10,
    marginRight:10,
    marginTop:5,
    width: 370,
    height:120,
    padding: 10,
    backgroundColor:'#f5b5bf'
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  cardTextContainer: {
    flex: 1,
    paddingVertical: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 14,
    color: "#666",
  },
  addToFavoritesButton: {
    alignItems:'center',
    backgroundColor: "#f43f5e",
    width:'40%',
    textAlign:'center',
    fontSize: 10,
    fontWeight: 'bold',
    padding: 10,
    borderWidth: 1,
    borderColor:"#f43f5e",
    borderRadius: 10,
    marginBottom:20,
    marginTop:5,
    marginLeft:10,
    //marginLeft: "auto",
  },
  buttonText:{
    color: "#ffffff",
    fontWeight:'bold',
  },
  noResultText: {
    marginTop: 20,
    fontSize: 16,
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
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textDecorationLine:'underline',
    //color: "#f43f5e",
  },
  modalTextHeader: {
    fontSize: 16,
    fontWeight:'bold',
    marginBottom: 2,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    color: "#f43f5e",
    fontSize: 16,
  },
});

export default AllRecipesScreen;
