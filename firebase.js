// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const env = "dev"; // CHANGE THIS TO prod IF YOU WANT TO MERGE TO MAIN BRANCH

// Your web app's Firebase configuration
const firebaseConfigDev = {
    apiKey: "AIzaSyBsxO6b9xJDcv0fRYL8DXPGRAjD6Xb87m8",
    authDomain: "depfit-311ae.firebaseapp.com",
    projectId: "depfit-311ae",
    storageBucket: "depfit-311ae.appspot.com",
    messagingSenderId: "938565214214",
    appId: "1:938565214214:web:4eb97e8e3483a865882387",
    measurementId: "G-NQ17D55NWM"
};

const firebaseConfigProd = {
    apiKey: "AIzaSyBRePvnfs64zmiaKTdqxXL7i1gGmSc0GgQ",
    authDomain: "depfit-production.firebaseapp.com",
    projectId: "depfit-production",
    storageBucket: "depfit-production.appspot.com",
    messagingSenderId: "1027764719317",
    appId: "1:1027764719317:web:8504e4241068898d3cdc5c",
    measurementId: "G-ZTH9R1BDNZ"
}

// Use firebase app based on branch
let firebaseApp;
if (env == "prod") firebaseApp = firebase.initializeApp(firebaseConfigProd);
else firebaseApp = firebase.initializeApp(firebaseConfigDev);

const db = firebaseApp.firestore();

// Services
const auth = firebase.auth();

export { auth, db };