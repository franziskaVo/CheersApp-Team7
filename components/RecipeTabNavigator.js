// RecipeTabNavigator.js
//import React from "react";
import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllRecipesScreen from "./AllRecipesScreen";
import FavoriteRecipesScreen from "./FavoriteRecipesScreen";
import { db } from "../firebase"; // Import db and userRef from firebase.js
import { getDocs, collection } from "firebase/firestore";

const Tab = createMaterialTopTabNavigator();

const RecipeTabNavigator = ({ navigation, route, cocktailId }) => {
  const [cocktailData, setCocktailData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cocktailRef = collection(db, "cocktails");
        const querySnapshot = await getDocs(cocktailRef);
        const cocktails = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCocktailData(cocktails);
      } catch (error) {
        console.error("Error fetching cocktail data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Recipies">
        {(props) => (
          <AllRecipesScreen
            {...props}
            cocktailData={cocktailData}
            loading={loading}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Favorits List">
        {(props) => (
          <FavoriteRecipesScreen {...props} cocktailId={cocktailId} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default RecipeTabNavigator;
