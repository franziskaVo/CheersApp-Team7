// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database"; // Import the database module
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDby5iYr3_DFrwBrteTnSk_xHUnCVdorkQ",
  authDomain: "cheers-app-fe0c6.firebaseapp.com",
  projectId: "cheers-app-fe0c6",
  storageBucket: "cheers-app-fe0c6.appspot.com",
  messagingSenderId: "579054527462",
  appId: "1:579054527462:web:6b1325fa4246f6b4206c27",
  measurementId: "G-RXBXJ0Z07X",
  databaseURL:
    "https://cheers-app-fe0c6-default-rtdb.europe-west1.firebasedatabase.app/", // Update with your database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const cocktailrecipy = "cocktails";

const FirebaseAuth = getAuth(app);
const FirebaseRTDB = getDatabase(app);

export { db, app, storage, auth, cocktailrecipy, FirebaseAuth, FirebaseRTDB };
