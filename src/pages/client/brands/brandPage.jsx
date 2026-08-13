import { Link, useParams } from 'react-router-dom';
import Card from '../../../components/product/Card';
import { useBrands } from '../../../hooks/useBrands';

function BrandPage() {
  const { brandSlug } = useParams();
  const { brand, products, loading, error } = useBrands(brandSlug);

  if (!brand) {
    return (
      <section className="min-h-screen w-screen px-5 pt-20">
        Brand not found.
      </section>
    );
  }

  return (
    <section className="min-h-screen w-screen px-2.5 pt-20">
      <div className="mb-5 flex items-center gap-4 px-1">
        <Link to="/brands" className="text-sm font-medium hover:underline">
          All brands
        </Link>
        <h1 className="text-2xl font-semibold uppercase">{brand.name}</h1>
      </div>
      {loading ? (
        <p className="px-1 text-slate-500">Loading products…</p>
      ) : error ? (
        <p className="px-1 text-red-600">{error}</p>
      ) : products.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="px-1 text-slate-500">
          No products are available for this brand yet.
        </p>
      )}
    </section>
  );
}

export default BrandPage;
