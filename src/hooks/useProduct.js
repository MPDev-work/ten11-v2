import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebaseClient';

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return undefined;
    return onSnapshot(doc(db, 'products', productId), (snapshot) => {
      setProduct(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    }, () => setLoading(false));
  }, [productId]);

  return { product, loading };
}
