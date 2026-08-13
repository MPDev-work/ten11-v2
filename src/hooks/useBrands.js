import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { brandData } from '../data/brands';
import { db } from '../lib/firebaseClient';

const brandKey = (value = '') => value.trim().toLowerCase();

export function useBrands(slug) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const brand = useMemo(
    () => brandData.find((item) => item.link.slice(1) === slug),
    [slug],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        setAllProducts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
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

  const products = useMemo(() => {
    if (!brand) return [];
    return allProducts
      .filter((product) => brandKey(product.storeID) === brandKey(brand.name))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [allProducts, brand]);

  return { brand, products, loading, error };
}
