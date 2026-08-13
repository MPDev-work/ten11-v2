import { useEffect, useState } from 'react';
import FilterBar from '../../../components/filterBar/FilterBar';
import Card from '../../../components/product/Card';
import { useProducts } from '../../../hooks/useProducts';

const categoryTitles = {
  men: 'Men',
  women: 'Women',
  kids: 'Kids',
  accessory: 'Accessories',
  'z.home': 'Z.Home',
};

function ProductPage({ category }) {
  const { products, loading, error } = useProducts(category);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [filterVisible, setFilterVisible] = useState(true);
  const visibleProducts = selectedBrand
    ? products.filter((product) => product.storeID === selectedBrand)
    : products;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setFilterVisible(window.scrollY <= lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-screen min-h-screen px-2.5 mt-26">
      <FilterBar
        active={filterVisible}
        products={products}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
      />
      <div className="mb-5 px-1">
        {/* <h1 className="text-2xl font-semibold uppercase">
          {category ? categoryTitles[category] : 'All products'}
        </h1> */}
      </div>
      {loading ? (
        <p className="px-1 text-slate-500">Loading products…</p>
      ) : error ? (
        <p className="px-1 text-red-600">{error}</p>
      ) : visibleProducts.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {visibleProducts.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-104px)] flex justify-center items-center">
          <p className="px-1 text-slate-500">
            No products are available in this section yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default ProductPage;
