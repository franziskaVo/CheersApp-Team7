// RecipeTabNavigator.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ProfileScreen from "./ProfileScreen";
import JourneyScreen from "./Journey";

const Tab = createMaterialTopTabNavigator();

const UserScreen = ({
  userId,
  email,
  setEmail,
  password,
  setPassword,
  profileImage,
  setProfileImage,
}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileScreen
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
      <Tab.Screen name="Journey" component={JourneyScreen} />
    </Tab.Navigator>
  );
};

export default UserScreen;
