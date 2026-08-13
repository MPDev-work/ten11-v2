import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../lib/firebaseClient';

/** Subscribes to the products collection and optionally limits products by category. */
export function useProducts(brand) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        setAllProducts(
          snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort(
              (a, b) =>
                (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
            ),
        );
        setLoading(false);
        setError('');
      },
      () => {
        setError('Products could not be loaded. Please try again shortly.');
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const products = useMemo(
    () =>
      brand
        ? allProducts.filter((product) => product.brand === brand)
        : allProducts,
    [allProducts, brand],
  );

  return { products, loading, error };
}
