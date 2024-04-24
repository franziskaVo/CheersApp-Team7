import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const FavoriteRecipesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  const fetchFavorites = useCallback(async () => {
    try {
      const favoritesData = await AsyncStorage.getItem("favorites");
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      }
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchFavorites();
    });
    return unsubscribe;
  }, [navigation, fetchFavorites]);

  //Clear Favorites List
  const clearFavoritesList = async () => {
    try {
      await AsyncStorage.removeItem("favorites");
      setFavorites([]);
      Alert.alert("Favorites list cleared!");
    } catch (error) {
      console.error("Error clearing favorites list: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Drinks</Text>
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>Alcohol: {item.alcohol}</Text>
            <Text style={styles.info}>Glass: {item.glass}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorite drinks yet.</Text>}
      />
      {/* Button to clear favorites list */}
      <Pressable style={styles.clearButton} onPress={clearFavoritesList}>
        <Text style={styles.scoreButtonText}>CLEAR LIST</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  favoriteItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  clearButton: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#8b819b",
    width: 160,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  scoreButtonText: {
    textAlign:'center',
    color:"#ffffff",
    fontSize: 18,
  },
});

export default FavoriteRecipesScreen;
