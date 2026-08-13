import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export function useAllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    return onSnapshot(collection(db, 'products'), (snapshot) =>
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
    );
  }, []);

  return products;
}
