import { useEffect, useMemo, useState } from 'react';
import { ShopContext } from './shopContext';
const readSaved = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readSaved('ten11-cart'));
  const [favorites, setFavorites] = useState(() =>
    readSaved('ten11-favorites'),
  );

  useEffect(
    () => localStorage.setItem('ten11-cart', JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () => localStorage.setItem('ten11-favorites', JSON.stringify(favorites)),
    [favorites],
  );

  const value = useMemo(
    () => ({
      cart,
      favorites,
      addToCart(product, quantity = 1, size = '', color = '') {
        setCart((items) => {
          const existing = items.find(
            (item) =>
              item.id === product.id &&
              item.size === size &&
              item.color === color,
          );
          if (existing)
            return items.map((item) =>
              item.id === product.id &&
              item.size === size &&
              item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          return [...items, { ...product, quantity, size, color }];
        });
      },
      updateCartQuantity(id, size, color, quantity) {
        setCart((items) =>
          quantity < 1
            ? items.filter(
                (item) =>
                  item.id !== id || item.size !== size || item.color !== color,
              )
            : items.map((item) =>
                item.id === id && item.size === size && item.color === color
                  ? { ...item, quantity }
                  : item,
              ),
        );
      },
      removeFromCart(id, size, color) {
        setCart((items) =>
          items.filter(
            (item) =>
              item.id !== id || item.size !== size || item.color !== color,
          ),
        );
      },
      toggleFavorite(product) {
        setFavorites((items) =>
          items.some((item) => item.id === product.id)
            ? items.filter((item) => item.id !== product.id)
            : [...items, product],
        );
      },
      isFavorite(id) {
        return favorites.some((item) => item.id === id);
      },
    }),
    [cart, favorites],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
