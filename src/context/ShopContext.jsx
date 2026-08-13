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
  const [favorites, setFavorites] = useState(() => readSaved('ten11-favorites'));

  useEffect(() => localStorage.setItem('ten11-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('ten11-favorites', JSON.stringify(favorites)), [favorites]);

  const value = useMemo(() => ({
    cart,
    favorites,
    addToCart(product, quantity = 1, size = '') {
      setCart((items) => {
        const existing = items.find((item) => item.id === product.id && item.size === size);
        if (existing) return items.map((item) => item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + quantity } : item);
        return [...items, { ...product, quantity, size }];
      });
    },
    updateCartQuantity(id, size, quantity) {
      setCart((items) => quantity < 1 ? items.filter((item) => item.id !== id || item.size !== size) : items.map((item) => item.id === id && item.size === size ? { ...item, quantity } : item));
    },
    removeFromCart(id, size) {
      setCart((items) => items.filter((item) => item.id !== id || item.size !== size));
    },
    toggleFavorite(product) {
      setFavorites((items) => items.some((item) => item.id === product.id) ? items.filter((item) => item.id !== product.id) : [...items, product]);
    },
    isFavorite(id) {
      return favorites.some((item) => item.id === id);
    },
  }), [cart, favorites]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
