
import { initializeApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { toast } from "sonner";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdi6DNR3akfTT1rTEGqcsObZatolpQReg",
  authDomain: "telecare-e3cbc.firebaseapp.com",
  projectId: "telecare-e3cbc",
  storageBucket: "telecare-e3cbc.appspot.com",
  messagingSenderId: "562175186012",
  appId: "1:562175186012:web:e7089adf7090c4eb4b0299",
  measurementId: "G-EX10Z2FCMH"
};

let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;
let analytics: Analytics;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  
  // Initialize Analytics if we're in a browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  
  // Note: The Firebase Admin SDK should be used in a secure backend environment only
  // For this demo project, we are simulating custom claims using localStorage
  // In a production environment, you would use the Firebase Admin SDK in a Node.js backend
  // to set and manage custom claims for user roles
  
} catch (error) {
  console.error('Error initializing Firebase:', error);
  toast.error('Failed to initialize Firebase. Please try again later.');
  
  // Create dummy objects to prevent null reference errors elsewhere in the code
  app = {} as FirebaseApp;
  auth = {} as Auth;
  storage = {} as FirebaseStorage;
  analytics = {} as Analytics;
}

export { auth, storage, analytics };
export default app;
