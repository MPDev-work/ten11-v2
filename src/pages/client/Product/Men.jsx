import Card from '../../../components/product/Card';
import FilterBar from '../../../components/filterBar/FilterBar';
import cardImage from '../../../assets/card/imgi_87_PTAK6547-cr-450x672.jpg';
import { useEffect, useState } from 'react';

const products = [
  {
    id: 1,
    title: `Relaxed Striped Polo T-Shirt`,
    src: cardImage,
    price: 15.59,
    dis: 50,
    colors: [`white`, `black`, `gray`],
  },
  {
    id: 2,
    title: `Relaxed Striped Polo T-Shirt`,
    src: cardImage,
    price: 15.59,
    dis: 50,
    colors: [`white`, `black`, `gray`],
  },
  {
    id: 3,
    title: `Relaxed Striped Polo T-Shirt`,
    src: cardImage,
    price: 15.59,
    dis: 50,
    colors: [`white`, `black`, `gray`],
  },
  {
    id: 4,
    title: `Relaxed Striped Polo T-Shirt`,
    src: cardImage,
    price: 15.59,
    dis: 50,
    colors: [`white`, `black`, `gray`],
  },
  {
    id: 5,
    title: `Relaxed Striped Polo T-Shirt`,
    src: cardImage,
    price: 15.59,
    dis: 50,
    colors: [`white`, `black`, `gray`],
  },
  {
    id: 6,
    title: `Relaxed Striped Polo T-Shirt`,
    src: cardImage,
    price: 15.59,
    dis: 50,
    colors: [`white`, `black`, `gray`],
  },
  {
    id: 7,
    title: `Relaxed Striped Polo T-Shirt`,
    src: cardImage,
    price: 15.59,
    dis: 50,
    colors: [`white`, `black`, `gray`],
  },
  {
    id: 8,
    title: `Relaxed Striped Polo T-Shirt`,
    src: cardImage,
    price: 15.59,
    dis: 50,
    colors: [`white`, `black`, `gray`],
  },
];

function Men() {
  const [active, setActive] = useState(true);

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
    <section className="ralative w-screen h-max grid grid-cols-4 grid-flow-row gap-5 px-2.5 mt-34">
      <FilterBar active={active} />
      {products.map((product) => {
        return <Card key={product.id} product={product} />;
      })}
    </section>
  );
}

export default Men;
