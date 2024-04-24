// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsxO6b9xJDcv0fRYL8DXPGRAjD6Xb87m8",
    authDomain: "depfit-311ae.firebaseapp.com",
    projectId: "depfit-311ae",
    storageBucket: "depfit-311ae.appspot.com",
    messagingSenderId: "938565214214",
    appId: "1:938565214214:web:4eb97e8e3483a865882387",
    measurementId: "G-NQ17D55NWM"
};


// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };