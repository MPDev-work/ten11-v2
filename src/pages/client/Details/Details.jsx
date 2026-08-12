import { useState } from 'react';
import cardImage from '../../../assets/card/imgi_87_PTAK6547-cr-450x672.jpg';
import Card from '../../../components/product/Card';
const products = {
  id: 1,
  title: `Relaxed Striped Polo T-Shirt`,
  src: cardImage,
  price: 15.59,
  dis: 50,
  colors: [`white`, `black`, `gray`],
  size: ['S', 'M', 'L', 'XL', 'XXL'],
  stock: 20,
};

const defaultProductSize = products.size.at(0);

function Details() {
  const [qty, setQty] = useState(1);
  const [isSize, setIsSize] = useState(defaultProductSize);
  const colorCount = products.colors.length;
  const getDisPrice = products.price - (products.price * products.dis) / 100;
  return (
    <section className="w-screen h-max flex flex-col mt-12">
      <div className="w-full h-screen min-h-[650px] grid grid-cols-2 items-center px-5 gap-10">
        <div className="h-full flex justify-center items-center overflow-hidden">
          <img className="w-full h-full object-cover" src={products.src} />
        </div>
        <div className="h-full flex flex-col pt-10 gap-2.5">
          <div className="flex items-start gap-2">
            <h1 className="text-3xl font-bold text-black">
              US ${getDisPrice.toFixed(2)}
            </h1>
            <div className="flex items-start">
              <h1 className="text-3xl font-bold text-red-500">
                %{products.dis}
              </h1>
              <p className="uppercase text-sm text-red-500">off</p>
            </div>
            <h1 className="text-xl font-medium text-red-500 line-through">
              US ${products.price}
            </h1>
          </div>
          <p className="text-lg font-medium text-black">{products.title}</p>
          <div className="w-full flex flex-col gap-2.5 mt-6">
            <p className="text-lg text-black font-medium">
              {colorCount} colors available
            </p>
            <div className="grid grid-cols-5 grid-flow-row gap-2.5">
              <img
                className="w-full aspect-[3/4] object-cover"
                src={products.src}
              />
              <img
                className="w-full aspect-[3/4] object-cover"
                src={products.src}
              />
              <img
                className="w-full aspect-[3/4] object-cover"
                src={products.src}
              />
              <img
                className="w-full aspect-[3/4] object-cover"
                src={products.src}
              />
            </div>
          </div>
          <h1 className="text-xl font-bold">Size</h1>
          <div className="w-full flex flex-wrap items-center gap-2.5">
            {products.size.map((size, i) => {
              return (
                <SizeSelect
                  key={i}
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
                cursor: qty == products.stock ? 'not-allowed' : 'pointer',
              }}
              onClick={() => setQty(qty == products.stock ? qty : qty + 1)}
              className="cursor-pointer h-12 w-12 rounded-r-full flex justify-center items-center text-xl bg-[#f2f2f6] transition duration-150 active:bg-grau-200"
            >
              +
            </button>
          </div>
          {qty >= 10 && (
            <p
              style={{ color: qty == products.stock ? 'red' : 'black' }}
              className="text-sm"
            >
              Stock available {products.stock}
            </p>
          )}
          <button className="cursor-pointer w-3/4 h-12 flex justify-center items-center rounded-full bg-black text-white mt-2.5 transition duration-100 hover:bg-black/80 active:bg-black/50">
            Add to card
          </button>
        </div>
      </div>
      <Suggest />
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

function Suggest() {
  return (
    <div className="w-full h-max flex flex-col items-center gap-8 px-2.5 mt-16">
      <div className="relative w-full flex items-center pl-20">
        <h1 className="absolute z-10 bg-white px-1 uppercase text-3xl font-semibold">
          SIMILAR ITEMS
        </h1>
        <hr className="absolute left-0 z-0 w-full border-t-1 border-gray-200" />
      </div>
      <div className="w-full h-max grid grid-cols-4 grid-flow-row gap-5">
        <Card key={products.id} product={products} />
        <Card key={products.id} product={products} />
        <Card key={products.id} product={products} />
        <Card key={products.id} product={products} />
      </div>
    </div>
  );
}

export default Details;
