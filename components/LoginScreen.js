import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Alert, Image, ImageBackground, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { moderateScale } from "../Metrics";


const LoginScreen = ({
  navigation,
  email,
  password,
  setPassword,
  setEmail,
  handleUserId,
  userId, // New prop to handle userId
}) => {

  //-------Keyboard------
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);



  //-------LogIn-------
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Call handleUserId and pass the userCredential
      handleUserId(userCredential);
      // Navigate to the desired screen upon successful login
      navigation.navigate("Main", { userId: userId });
    } catch (error) {
      Alert.alert("Error", "Invalid email or password. Please try again.");
    }
  };

  const goToCreateAccount = () => {
    // Navigate to the CreateAccountScreen
    navigation.navigate("CreateAccount");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      
        <ImageBackground
          style={styles.backgroundImage}
          source={require('../pictures/backgroundWhole.png')}
        ></ImageBackground>
          {!keyboardOpen && (
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require("../pictures/Logo-.png")} />
          </View>
        
      )}
      <View style={keyboardOpen ? styles.formContainerKeyboardOpen : styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email"
            placeholderTextColor={'gray'}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Enter your password"
            placeholderTextColor={'gray'}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.logInButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.linkContainer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity style={styles.button} onPress={goToCreateAccount}>
            <Text style={styles.buttonText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: moderateScale(0),
    left: moderateScale(0),
    width: '100%',
    height: '95%',
  },
  logoContainer: {
    marginTop: moderateScale(290),
    alignItems: 'center',
  },
  logo: {
    height: moderateScale(125),
    width: moderateScale(125),
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  formContainerKeyboardOpen: {
    justifyContent: 'flex-start',
    alignItems:'center',
    paddingTop: moderateScale(150),
    paddingHorizontal: moderateScale(20),
  },
  inputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: moderateScale(17),
    borderRadius: moderateScale(20),
    width:moderateScale(320),
    marginTop:5,
    marginBottom: moderateScale(20),
  },
  input: {
    color: 'black',
  },
  button: {
    backgroundColor: "#f43f5e",
    width: moderateScale(200),
    borderWidth: moderateScale(1),
    borderColor: "#f43f5e",
    alignItems: 'center',
    paddingVertical: moderateScale(7),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    marginTop: moderateScale(10),
  },
  logInButton: {
    backgroundColor: "#f43f5e",
    width: moderateScale(250),
    borderWidth: moderateScale(4),
    borderColor: "#f43f5e",
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(40),
    marginTop: moderateScale(5),
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  linkContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(50),
  },
});

export default LoginScreen;
