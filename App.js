import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CalculatorScreen from "./components/CalculatorScreen";
import SelectScreen from "./components/SelectScreen";
import MapsScreen from "./components/MapsScreen";
import UserScreen from "./components/UserScreen";
import ContactScreen from "./components/ContactScreen";
import LoginScreen from "./components/LoginScreen";
import CreateAccountScreen from "./components/CreateAccountScreen";
import RecipeScreen from "./components/RecipeTabNavigator";
import initializeCocktails from "./initializeCocktails";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [hobby, setHobby] = useState("");
  const [favoriteDrink, setFavoriteDrink] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    initializeCocktails();
  }, []);

  const handleUserId = (userCredential) => {
    const userId = userCredential.user.uid; // Initialize userId after successful login
    console.log("User ID:", userId);
    setUserId(userId);
    // Navigate to the main screen or perform other actions
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => (
            <LoginScreen
              {...props}
              handleUserId={handleUserId}
              userId={userId}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="CreateAccount" options={{ headerShown: false }}>
          {(props) => (
            <CreateAccountScreen
              {...props}
              handleUserId={handleUserId}
              userId={userId}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              age={age}
              setAge={setAge}
              hobby={hobby}
              setHobby={setHobby}
              favoriteDrink={favoriteDrink}
              setFavoriteDrink={setFavoriteDrink}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {(props) => (
            <MainTabNavigator
              {...props}
              userId={userId}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              age={age}
              setAge={setAge}
              hobby={hobby}
              setHobby={setHobby}
              favoriteDrink={favoriteDrink}
              setFavoriteDrink={setFavoriteDrink}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="RecipeScreen" component={RecipeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainTabNavigator = ({
  userId,
  email,
  setEmail,
  setPassword,
  password,
  profileImage,
  setProfileImage,
}) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      // tabBarLabel: getTabLabel(route.name),
      tabBarVisible: route.state && route.state.index === 0,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Calculator") {
          iconName = focused ? "calculator" : "calculator-outline";
        } else if (route.name === "User") {
          iconName = focused ? "person" : "person-outline";
        } else if (route.name === "Contact") {
          iconName = focused ? "people" : "people-outline";
        } else if (route.name === "Maps") {
          iconName = focused ? "locate" : "locate-outline";
        } else if (route.name === "Select") {
          iconName = focused ? "apps" : "apps-outline";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Calculator" component={CalculatorScreen} />
    <Tab.Screen name="Select" component={SelectScreen} />
    <Tab.Screen name="Maps" component={MapsScreen} />
    <Tab.Screen name="Contact">
      {(props) => <ContactScreen {...props} userId={userId} />}
    </Tab.Screen>
    <Tab.Screen name="User">
      {(props) => (
        <UserScreen
          {...props}
          userId={userId}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
        />
      )}
    </Tab.Screen>
  </Tab.Navigator>
);

export default App;
