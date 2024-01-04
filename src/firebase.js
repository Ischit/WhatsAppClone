import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlIy-6Whc-AO1o1_vF5DCEDr5-NpBw5Ws",
  authDomain: "whatsapp-5843f.firebaseapp.com",
  projectId: "whatsapp-5843f",
  storageBucket: "whatsapp-5843f.appspot.com",
  messagingSenderId: "1001340172128",
  appId: "1:1001340172128:web:5dcaabcd44b11244b19005",
  measurementId: "G-CLS3NZ6QHX",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider };
export default db;
