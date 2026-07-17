// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "coretex-multiagent-ai.firebaseapp.com",
    projectId: "coretex-multiagent-ai",
    storageBucket: "coretex-multiagent-ai.firebasestorage.app",
    messagingSenderId: "304922838578",
    appId: "1:304922838578:web:21eb0512083e0151f85e2b"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()