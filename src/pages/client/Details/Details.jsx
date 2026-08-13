import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Card from '../../../components/product/Card';
import { layoutData } from '../../../data/layoutData';
import { useShop } from '../../../hooks/useShop';

const defaultProduct = {
  storeID: 'zando',
  size: ['S', 'M', 'L', 'XL', 'XXL'],
  stock: 20,
};

function Details() {
  const { addToCart, isFavorite, toggleFavorite } = useShop();
  const { productId } = useParams();
  const { state } = useLocation();
  const fallbackProduct = layoutData
    .flatMap((layout) => layout.products)
    .find((item) => String(item.id) === productId);
  const product = { ...defaultProduct, ...fallbackProduct, ...state?.product };
  const [qty, setQty] = useState(1);
  const [isSize, setIsSize] = useState(product.size[0]);
  const colorCount = (product.colors || []).length;
  const hasDiscount = product.dis > 0;
  const displayPrice = hasDiscount
    ? product.price - (product.price * product.dis) / 100
    : product.price;

  const storeName =
    product.storeID.slice(0, 1).toUpperCase() + product.storeID.slice(1);
  const storeDisplayName = storeName.slice(0, 1);

  return (
    <section className="w-screen h-max flex flex-col mt-12">
      <div className="w-full h-screen min-h-[650px] grid grid-cols-2 items-center px-5 gap-10">
        <div className="h-full flex justify-center items-center overflow-hidden">
          <img className="w-full h-full object-cover" src={product.src} />
        </div>
        <div className="h-full flex flex-col pt-10 gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-red-500 rounded-full flex justify-center items-center">
              <p className="text-xl font-medium text-white">
                {storeDisplayName}
              </p>
            </div>
            <p className="text-base font-medium text-black">{storeName}</p>
          </div>
          <div className="flex items-start gap-2">
            <h1 className="text-3xl font-bold text-black">
              US ${displayPrice.toFixed(2)}
            </h1>
            {hasDiscount && (
              <>
                <div className="flex items-start">
                  <h1 className="text-3xl font-bold text-red-500">
                    %{product.dis}
                  </h1>
                  <p className="uppercase text-sm text-red-500">off</p>
                </div>
                <h1 className="text-xl font-medium text-red-500 line-through">
                  US ${product.price}
                </h1>
              </>
            )}
          </div>
          <p className="text-lg font-medium text-black">{product.title}</p>
          <div className="w-full flex flex-col gap-2.5 mt-6">
            <p className="text-lg text-black font-medium">
              {colorCount} colors available
            </p>
            <div className="grid grid-cols-5 grid-flow-row gap-2.5">
              <img
                className="w-full aspect-[3/4] object-cover"
                src={product.src}
              />
              <img
                className="w-full aspect-[3/4] object-cover"
                src={product.src}
              />
              <img
                className="w-full aspect-[3/4] object-cover"
                src={product.src}
              />
              <img
                className="w-full aspect-[3/4] object-cover"
                src={product.src}
              />
            </div>
          </div>
          <h1 className="text-xl font-bold">Size</h1>
          <div className="w-full flex flex-wrap items-center gap-2.5">
            {product.size.map((size) => {
              return (
                <SizeSelect
                  key={size}
                  props={size}
                  isSize={isSize}
                  onSelect={setIsSize}
                />
              );
            })}
          </div>
          <h1 className="text-xl font-bold mt-5">Quantity</h1>
          <div className="w-max flex items-center gap-1">
            <button
              style={{ cursor: qty == 1 ? 'not-allowed' : 'pointer' }}
              onClick={() => setQty(qty >= 2 ? qty - 1 : qty)}
              className="cursor-pointer h-12 w-12 rounded-l-full flex justify-center items-center text-xl bg-[#f2f2f6] transition duration-150 active:bg-grau-200"
            >
              -
            </button>
            <div className="w-[67px] h-12 flex justify-center items-center bg-[#f2f2f6]">
              {qty}
            </div>
            <button
              style={{
                cursor: qty == product.stock ? 'not-allowed' : 'pointer',
              }}
              onClick={() => setQty(qty == product.stock ? qty : qty + 1)}
              className="cursor-pointer h-12 w-12 rounded-r-full flex justify-center items-center text-xl bg-[#f2f2f6] transition duration-150 active:bg-grau-200"
            >
              +
            </button>
          </div>
          {qty >= 10 && (
            <p
              style={{ color: qty == product.stock ? 'red' : 'black' }}
              className="text-sm"
            >
              Stock available {product.stock}
            </p>
          )}
          <div className="flex w-3/4 gap-2.5">
            <button
              type="button"
              onClick={() => addToCart(product, qty, isSize)}
              className="cursor-pointer h-12 flex-1 rounded-full bg-black text-white transition duration-100 hover:bg-black/80 active:bg-black/50"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(product)}
              aria-label="Toggle favorite"
              className="grid h-12 w-12 place-items-center rounded-full border border-black"
              >
              {isFavorite(product.id) ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
      <Suggest currentProduct={product} />
    </section>
  );
}

function SizeSelect({ props, isSize, onSelect }) {
  return (
    <button
      onClick={() => onSelect(props)}
      style={{
        background: isSize === props ? 'black' : '',
        color: isSize === props ? 'white' : '',
      }}
      className="cursor-pointer px-6 h-10 flex justify-center items-center text-sm text-black bg-[#f2f2f6] transition duration-150 hover:bg-gray-200 hover:border-black"
    >
      {props}
    </button>
  );
}

function Suggest({ currentProduct }) {
  const suggestions = layoutData
    .flatMap((layout) => layout.products)
    .filter((product) => product !== currentProduct)
    .slice(0, 4);

  return (
    <div className="w-full h-max flex flex-col items-center gap-8 px-2.5 mt-16">
      <div className="relative w-full flex items-center pl-20">
        <h1 className="absolute z-10 bg-white px-1 uppercase text-3xl font-semibold">
          SIMILAR ITEMS
        </h1>
        <hr className="absolute left-0 z-0 w-full border-t-1 border-gray-200" />
      </div>
      <div className="w-full h-max grid grid-cols-4 grid-flow-row gap-5">
        {suggestions.map((product, index) => (
          <Card key={`${product.id}-${index}`} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Details;
