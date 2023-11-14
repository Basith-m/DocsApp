// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAw2z3w3147ePibCV4wLTioeAhKrCHWC90",
  authDomain: "documentation-app-ee3ce.firebaseapp.com",
  projectId: "documentation-app-ee3ce",
  storageBucket: "documentation-app-ee3ce.appspot.com",
  messagingSenderId: "548107867642",
  appId: "1:548107867642:web:f8f941715922ecb8fc8043",
  measurementId: "G-4VPP34WXQX"
};

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Get authentication and Firestore instances
const auth = getAuth(app);
const firestore = getFirestore();

// Export the initialized Firestore instance
export { auth, firestore };
