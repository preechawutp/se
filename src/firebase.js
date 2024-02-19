
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyArngwzT3-9iPN9fGtIUEqsTqX_MjaS6hA",
  authDomain: "se-project-87de4.firebaseapp.com",
  projectId: "se-project-87de4",
  storageBucket: "se-project-87de4.appspot.com",
  messagingSenderId: "1044138830726",
  appId: "1:1044138830726:web:f495e84e53343174d65a07",
  measurementId: "G-HXN45W8JYR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {db,app,auth,provider}