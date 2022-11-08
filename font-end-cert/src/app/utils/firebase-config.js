import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.PRIVATE_KEY,
  authDomain: "project-certificate-eth.firebaseapp.com",
  projectId: "project-certificate-eth",
  storageBucket: "project-certificate-eth.appspot.com",
  messagingSenderId: "314293881939",
  appId: "1:314293881939:web:ea76ef84c43b0987a2caa6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
