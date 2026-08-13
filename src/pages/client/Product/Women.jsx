import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Card from '../../../components/product/Card';
import { db } from '../../../lib/firebaseClient';
import FilterBar from '../../../components/filterBar/FilterBar';
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

function Men() {
  const [active, setActive] = useState(true);
  const products = useProductsByCategory('women');
  const newIn = products.length;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setActive(false);
      } else if (currentScrollY < lastScrollY) {
        setActive(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="w-screen px-2.5 mt-26">
      <FilterBar active={active} newIn={newIn} product={products} />
      <div className="w-full grid grid-cols-4 gap-5">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default Men;
