import { Link } from 'react-router-dom';
import { brandData } from '../../../data/brands';

function Brands() {
  return (
    <section className="min-h-screen w-screen px-5 pt-20">
      <h1 className="mb-6 text-2xl font-semibold uppercase">Brands</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {brandData.map((brand) => (
          <Link
            key={brand.id}
            to={`/brands/${brand.link.slice(1)}`}
            className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-slate-200 p-4 transition hover:border-black"
          >
            <img
              src={brand.src}
              alt={brand.name}
              className="h-24 w-full object-contain"
            />
            <span className="mt-3 text-sm font-medium">{brand.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Brands;
