import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { useStoreSettings } from '../../hooks/useStoreSettings';

function Card({ product }) {
  const { isFavorite, toggleFavorite } = useShop();
  const { formatPrice } = useStoreSettings();

  const getDisc = (price, dis) => {
    return (price - (price * dis) / 100).toFixed(2);
  };
  return (
    <div className="relative flex flex-col items-center gap-4">
      <Link
        to={`/products/${product.id}`}
        state={{ product }}
        className="relative block h-[400px] overflow-hidden"
      >
        <img
          loading="lazy"
          className="w-full h-full object-cover"
          src={product.src || product.imageUrl}
          alt={product.title}
        />

        <div className="absolute z-10 right-0 -bottom-12 w-5 h-32 flex items-center overflow-visible -rotate-90 origin-left">
          <p className="text-center uppercase text-black text-base leading-none whitespace-nowrap">
            {product.storeID} | {product.category}
          </p>
        </div>
      </Link>
      <div className="w-full flex flex-col gap2.5 px-3">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2.5 items-end">
            <h1 className="text-lg font-semibold text-red-600">
              {formatPrice(
                product.dis && product.dis > 0
                  ? getDisc(product.price, product.dis)
                  : product.price,
              )}
            </h1>
            <h1
              style={{
                display: product.dis && product.dis > 0 ? 'block' : 'none',
              }}
              className="text-lg text-gray-500 line-through"
            >
              {formatPrice(product.price)}
            </h1>
          </div>
          <button
            type="button"
            aria-label={
              isFavorite(product.id)
                ? 'Remove from favorites'
                : 'Add to favorites'
            }
            onClick={() => toggleFavorite(product)}
            className="cursor-pointer h-[18px] w-[18px] flex justify-center items-center"
          >
            <Heart
              className="w-full h-full object-contain"
              fill={isFavorite(product.id) ? 'currentColor' : 'none'}
            />
          </button>
        </div>
        <p className="text-base w-full overflow-hidden text-nowrap text-ellipsis">
          {product.title}
        </p>
        <div className="flex gap-2.5 mt-2.5">
          {(product.colors || []).map((color) => {
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
