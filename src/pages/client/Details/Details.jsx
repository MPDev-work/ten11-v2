import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Card from '../../../components/product/Card';
import { layoutData } from '../../../data/layoutData';
import { useShop } from '../../../hooks/useShop';
import { useStoreSettings } from '../../../hooks/useStoreSettings';
import { useProduct } from '../../../hooks/useProduct';
import { useProducts } from '../../../hooks/useProducts';
import { Handbag, Heart } from 'lucide-react';

function Details() {
  const { addToCart, isFavorite, toggleFavorite } = useShop();
  const { formatPrice } = useStoreSettings();
  const { productId } = useParams();
  const { state } = useLocation();
  const { product: firestoreProduct, loading } = useProduct(productId);
  const fallbackProduct = layoutData
    .flatMap((layout) => layout.products)
    .find((item) => String(item.id) === productId);
  const product = {
    size: [],
    colors: [],
    ...fallbackProduct,
    ...firestoreProduct,
    ...state?.product,
  };
  const { products } = useProducts(product.category);
  const [qty, setQty] = useState(1);
  const [isSize, setIsSize] = useState(product.size[0] || '');
  const [isColor, setIsColor] = useState(product.colors[0] || '');
  const [isAlert, setIsAlert] = useState(false);
  const colorCount = (product.colors || []).length;
  const hasDiscount = product.dis > 0;
  const displayPrice = hasDiscount
    ? product.price - (product.price * product.dis) / 100
    : product.price;

  const storeName =
    product.storeID.slice(0, 1).toUpperCase() + product.storeID.slice(1);
  const storeDisplayName = storeName.slice(0, 1);

  if (loading && !state?.product && !fallbackProduct) {
    return (
      <section className="min-h-screen w-screen pt-20 text-center text-slate-500">
        Loading product…
      </section>
    );
  }

  if (!state?.product && !fallbackProduct && !firestoreProduct) {
    return (
      <section className="min-h-screen w-screen pt-20 text-center text-slate-500">
        Product not found.
      </section>
    );
  }

  return (
    <section className="w-screen h-max flex flex-col mt-12">
      <div className="w-full h-max lg:h-[calc(100vh-48px)] min-h-[calc(630px-56px)] flex flex-col lg:flex-row justify-center lg:px-5 p-5">
        <div className="w-full h-[80dvh] lg:w-1/2 flex justify-center items-center overflow-hidden">
          <img
            className="w-full h-full lg:h-[90%] lg:w-max aspect-[3/4] object-cover"
            src={product.src}
          />
        </div>
        <div className="lg:h-full h-max w-full lg:w-1/2 flex flex-col justify-center gap-2.5 py-7 lg:py-0">
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
              {formatPrice(displayPrice)}
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
                  {formatPrice(product.price)}
                </h1>
              </>
            )}
          </div>
          <p className="text-lg font-medium text-black">{product.title}</p>
          <div className="w-full flex flex-col gap-2.5 mt-6">
            <p className="text-lg text-black font-medium">
              {colorCount} colors available
            </p>
            <div className="flex gap-2.5">
              {product.colors.map((color) => {
                return (
                  <ColorSelect
                    key={color}
                    color={color}
                    isColor={isColor}
                    setIsColor={setIsColor}
                  />
                );
              })}
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
          <div className="flex w-full lg:w-3/4 gap-2.5 lg:pt-0 pt-5">
            <button
              type="button"
              onClick={() => {
                addToCart(product, qty, isSize, isColor);
                setIsAlert((prev) => !prev);
                setTimeout(() => {
                  setIsAlert(false);
                }, 5000);
              }}
              className="cursor-pointer  h-12 flex-1 rounded-full bg-black text-white flex justify-center items-center gap-2 transition duration-100 hover:bg-black/80 active:bg-black/50"
            >
              <Handbag size={20} /> Add to cart
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(product)}
              aria-label="Toggle favorite"
              className="grid h-12 w-12 place-items-center rounded-full border border-black"
            >
              {isFavorite(product.id) ? (
                <Heart fill="black" size={20} />
              ) : (
                <Heart size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
      <Suggest currentProduct={product} products={products} />
      {isAlert && <Alert message={'Product add ot card successfully'} />}
      {/* {toggleFavorite && (
        <Alert message={'Product add to wishlist successfully'} />
      )} */}
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

function ColorSelect({ color, isColor, setIsColor }) {
  return (
    <button
      type="button"
      onClick={() => setIsColor(color)}
      aria-label={`Select ${color}`}
      style={{
        backgroundColor: color,
        outline: isColor === color ? '2px solid #ef4444' : '',
        outlineOffset: '2px',
      }}
      className={`h-7 w-7 cursor-pointer rounded-full ${isColor !== color && color === 'white' ? 'border border-gray-500' : ''}`}
    />
  );
}

function Suggest({ currentProduct, products }) {
  const suggestions = products.filter(
    (product) =>
      product.category === currentProduct.category &&
      product.id !== currentProduct.id &&
      product.storeID === currentProduct.storeID,
  );
  // console.log(suggestions.length);
  return (
    <div
      className={`w-full h-max ${suggestions.length + 1 !== 1 ? `flex` : `hidden`} flex-col items-center gap-8 px-2.5 mt-16 `}
    >
      <div className="relative w-full flex items-center pl-20">
        <h1 className="absolute z-10 bg-white px-1 uppercase text-xl lg:text-3xl font-semibold">
          SIMILAR ITEMS
        </h1>
        <hr className="absolute left-0 z-0 w-full border-t-1 border-gray-200" />
      </div>
      <div className="w-full h-max grid grid-cols-2 lg:grid-cols-4 grid-flow-row gap-5">
        {suggestions.slice(0, 4).map((product) => (
          <Card key={`${product.id}`} product={product} />
        ))}
      </div>
    </div>
  );
}
function Alert({ message }) {
  return (
    <div className="animate_drop_down fixed top-0 z-[1002] left-1/2 -translate-x-1/2 h-8  px-2.5 flex items-center justify-center gap-2 rounded-full bg-black border-gray-300 text-sm text-white">
      {message} <Handbag size={16} />
    </div>
  );
}
export default Details;
