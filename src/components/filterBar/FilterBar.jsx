function FilterBar({ active, products = [], selectedBrand, onBrandChange }) {
  const brands = [...new Set(products.map((product) => product.storeID).filter(Boolean))];

  return (
    <div
      style={{ translate: active ? `0 0` : '0 -100%' }}
      className="fixed z-[998] inset-x-0 top-12 h-14 flex items-center overflow-scroll scrollbar-none bg-white transition ease-[cubic-bezier(0.78, 0.01, 0.00, 0.99)] duration-500"
    >
      <div className="h-full flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <p>{products.length} items</p>
        </div>
        <button
          type="button"
          onClick={() => onBrandChange('')}
          className={`cursor-pointer h-8 px-2.5 border rounded-lg flex items-center ${!selectedBrand ? 'border-black bg-black text-white' : 'border-gray-300'}`}
        >
          All brands
        </button>
      </div>
      <div className="h-full w-max flex items-center gap-4 px-2.5">
        {brands.map((brand) => (
          <button
            type="button"
            key={brand}
            onClick={() => onBrandChange(brand)}
            className={`cursor-pointer h-8 whitespace-nowrap px-2.5 border rounded-lg text-base font-medium transition ${selectedBrand === brand ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}
          >
            {brand} ({products.filter((product) => product.storeID === brand).length})
          </button>
        ))}
      </div>
    </div>
  );
}
export default FilterBar;
