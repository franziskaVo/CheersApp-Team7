import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Alert, Image, ImageBackground, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


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
      console.error("Error logging in:", error.message);
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
          source={require('/Users/franziskavogele/Documents/BIS/2. Semester Finnland/AppProject/Cheers-main-latest/pictures/backgroundWhole.png')}
        ></ImageBackground>
          {!keyboardOpen && (
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require("/Users/franziskavogele/Documents/BIS/2. Semester Finnland/AppProject/Cheers-main-latest/pictures/Logo-.png")} />
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
    top: 0,
    left: 0,
    width: '100%',
    height: '95%',
  },
  logoContainer: {
    flex: 1,
    marginTop: 290,
    marginBottom:250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 125,
    width: 125,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  formContainerKeyboardOpen: {
    justifyContent: 'flex-start',
    alignItems:'center',
    paddingTop: 150,
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 20,
    borderRadius: 20,
    width: '97%',
    marginBottom: 20,
  },
  input: {
    color: 'black',
  },
  logInButton: {
    backgroundColor: "#f43f5e",
    width: 200,
    borderWidth: 1,
    borderColor: "#f43f5e",
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#f43f5e",
    width: 250,
    borderWidth: 4,
    borderColor: "#f43f5e",
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
});

export default LoginScreen;
