import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebaseClient';
import Men from './Men';
function useProductsByCategory(category, field = 'createdAt') {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category),
      orderBy(field, 'desc'),
    );
    return onSnapshot(q, (snapshot) =>
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
    );
  }, [category, field]);

  return products;
}

function Products() {
  return <Men products={useProductsByCategory('men')} />;
}

export default Products;
