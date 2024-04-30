import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert,TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const FavoriteRecipesScreen = (cocktail) => { //cocktail was not in the brackets I think
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
            <Text style={styles.infoHeader}>Alcohol:</Text>
            <Text style={styles.info}>{item.alcohol}</Text>
            <Text style={styles.infoHeader}>Glass:</Text>
            <Text style={styles.info}>{item.glass}</Text>
            <Text style={styles.infoHeader}>Ingrediants:</Text>
            <Text style={styles.info}>{item.ingredients}</Text>
            <Text style={styles.infoHeader}>Instructions:</Text>
            <Text style={styles.info}>{item.instructions}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorite drinks yet.</Text>}
      />
      <Pressable style={styles.clearButton} onPress={clearFavoritesList}>
        <Text style={styles.clearButtonText}>CLEAR LIST</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems:'center',
    backgroundColor:'#ffffff'
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoText:{
    //fontWeight:'bold',
    textAlign:'center',
    fontSize:14,
    padding:10,
  },
  favoriteItem: {
    borderWidth: 2,
    borderColor: "#f43f5e",
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    backgroundColor:'#f5b5bf',
    width: 350,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine:'underline',
  },
  infoHeader: {
    fontWeight:'bold',
    fontSize: 15,
    color: "#000000",
    paddingTop:5,
    //paddingBottom:2,
  },
  info: {
    fontSize: 13,
    color: "#000000",
    paddingBottom:1,
  },
  listContainer: {
    flexGrow: 1,
    
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  clearButton: {
    width: 250,
    flexDirection: "row",
    //padding: 10,
    backgroundColor: "#f43f5e",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 25,
    borderWidth:4,
    borderColor:'#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center'
  },
  clearButtonText: {
    textAlign:'center',
    color:"#ffffff",
    fontSize: 16,
    fontWeight:'bold',
  },
});

export default FavoriteRecipesScreen;
