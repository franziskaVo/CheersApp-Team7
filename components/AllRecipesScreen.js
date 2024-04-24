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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AllRecipesScreen = ({ cocktailData, loading }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [filteredData, setFilteredData] = useState([]); // Initialize as empty array

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
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => addToFavorites(cocktail)}
              key={index}
            >
              <Image
                source={{ uri: cocktail.image }}
                style={styles.cardImage}
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{cocktail.name}</Text>
                <Text style={styles.cardInfo}>Alcohol: {cocktail.alcohol}</Text>
                <Text style={styles.cardInfo}>Glass: {cocktail.glass}</Text>
              </View>
              {/* Button to add to favorites */}
              <TouchableOpacity onPress={() => addToFavorites(cocktail)}>
                <Text style={styles.addToFavoritesButton}>Add to Favorites</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultText}>No matching cocktails found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    padding: 10,
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
    color: "blue",
    fontWeight: "bold",
    marginLeft: "auto",
  },
  noResultText: {
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});

export default AllRecipesScreen;
