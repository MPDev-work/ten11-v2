import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAtfrKtQw6GkeAdNbR4ALbvcu6LilRD6Fw',
  authDomain: 'react-part2.firebaseapp.com',
  projectId: 'react-part2',
  storageBucket: 'react-part2.firebasestorage.app',
  messagingSenderId: '1018595800466',
  appId: '1:1018595800466:web:4038bece4994f9c5e7fd4b',
  measurementId: 'G-KS5P4VKGQM',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
