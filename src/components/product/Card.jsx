import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function Card({ product }) {
  const getDisc = (price, dis) => {
    return ((price * dis) / 100).toFixed(2);
  };
  return (
    <div className="relative flex flex-col items-center gap-4">
      <Link
        to={`/products/${product.id}`}
        className="w-full flex justify-center items-center"
      >
        <img
          loading="lazy"
          className="w-full h-max object-cover"
          src={product.src}
        />
      </Link>
      <div className="w-full flex flex-col gap2.5 px-3">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2.5 items-end">
            <h1 className="text-lg font-semibold text-red-600">
              US $
              {product.dis && product.dis > 0
                ? getDisc(product.price, product.dis)
                : product.price}
            </h1>
            <h1
              style={{
                display: product.dis && product.dis > 0 ? 'block' : 'none',
              }}
              className="text-lg text-gray-500 line-through"
            >
              US ${product.price}
            </h1>
          </div>
          <button className="cursor-pointer h-[18px] w-[18px] felx justify-center items-center">
            <Heart className="w-full h-full object-contain" />
          </button>
        </div>
        <p className="text-base">{product.title}</p>
        <div className="flex gap-2.5 mt-2.5">
          {product.colors.map((color) => {
            return (
              <div
                key={color}
                style={{ background: color }}
                className="h-[15px] w-[15px] border-[0.5px] border-gray-400 rounded-[4px]"
              ></div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          display: product.dis && product.dis > 0 ? 'block' : 'none',
        }}
        className="absolute top-2.5 left-2.5 text-sm bg-red-600 text-white p-[2px_10px] rounded-sm"
      >
        {product.dis}%
      </div>
    </div>
  );
}

export default Card;
