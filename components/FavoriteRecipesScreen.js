import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert,TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { moderateScale } from "../Metrics";

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
            {item.quantities.map((quantities, index) => (
              <Text key={index.toString()} style={styles.info}>
                {quantities}
              </Text>
            ))}
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
    padding: moderateScale(20),
    alignItems:'center',
    backgroundColor:'#f7f7f7'
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: moderateScale(20),
  },
  infoText:{
    textAlign:'center',
    fontSize: moderateScale(14),
    padding: moderateScale(10),
  },
  favoriteItem: {
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: moderateScale(25),
    backgroundColor:'#f0c7ce',
    width: moderateScale(340),
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: moderateScale(10),
    color:'#4b4545'
  },
  infoHeader: {
    fontWeight:'bold',
    fontSize: moderateScale(15),
    paddingTop: moderateScale(5),
    color:'#4b4545'
  },
  info: {
    fontSize: moderateScale(13),
    paddingBottom: moderateScale(1),
    color:'#4b4545'
  },
  listContainer: {
    flexGrow: 1,
    
  },
  emptyText: {
    fontSize: moderateScale(16),
    textAlign: "center",
  },
  clearButton: {
    width: moderateScale(250),
    flexDirection: "row",
    backgroundColor: "#f43f5e",
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(30),
    marginTop: moderateScale(25),
    borderWidth: moderateScale(4),
    borderColor:'#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center'
  },
  clearButtonText: {
    textAlign:'center',
    color:"#ffffff",
    fontSize: moderateScale(16),
    fontWeight:'bold',
  },
});

export default FavoriteRecipesScreen;
