import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWLtGdsifR6ThNku5vYC9KjyzPCXvgYMc",
  authDomain: "adanbarbosaportifolio.firebaseapp.com",
  projectId: "adanbarbosaportifolio",
  storageBucket: "adanbarbosaportifolio.firebasestorage.app",
  messagingSenderId: "736080890002",
  appId: "1:736080890002:web:189475acbe25f942e07e4b",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy };
