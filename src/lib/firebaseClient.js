import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCDv-pehVf5pf1j6QTMFjoSqDm5kOqG77M',
  authDomain: 'ten11-6f089.firebaseapp.com',
  databaseURL:
    'https://ten11-6f089-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ten11-6f089',
  storageBucket: 'ten11-6f089.firebasestorage.app',
  messagingSenderId: '696345781473',
  appId: '1:696345781473:web:ee44cf67c075fe1043c3a0',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
