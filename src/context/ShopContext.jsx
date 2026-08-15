import { useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';
import { ShopContext } from './shopContext';

const EMPTY_SHOP = { cart: [], favorites: [] };
const asArray = (value) => (Array.isArray(value) ? value : []);

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(EMPTY_SHOP.cart);
  const [favorites, setFavorites] = useState(EMPTY_SHOP.favorites);
  const [isShopReady, setIsShopReady] = useState(false);
  const activeUserId = useRef(null);
  const shopReady = useRef(false);
  const cartRef = useRef([]);
  const favoritesRef = useRef([]);

  useEffect(() => {
    // Legacy data was shared by every person using this browser. Never migrate it.
    localStorage.removeItem('ten11-cart');
    localStorage.removeItem('ten11-favorites');

    let unsubscribeShop = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeShop();
      activeUserId.current = user?.uid ?? null;
      shopReady.current = false;
      setIsShopReady(false);
      cartRef.current = [];
      favoritesRef.current = [];
      setCart([]);
      setFavorites([]);
      if (!user) return;

      unsubscribeShop = onSnapshot(
        doc(db, 'userShops', user.uid),
        (snapshot) => {
          if (activeUserId.current !== user.uid) return;
          const data = snapshot.data() ?? EMPTY_SHOP;
          cartRef.current = asArray(data.cart);
          favoritesRef.current = asArray(data.favorites);
          setCart(cartRef.current);
          setFavorites(favoritesRef.current);
          shopReady.current = true;
          setIsShopReady(true);
        },
        (error) => {
          console.error(
            'Unable to load the customer cart and wishlist:',
            error,
          );
          if (activeUserId.current === user.uid) {
            shopReady.current = true;
            setIsShopReady(true);
          }
        },
      );
    });

    return () => {
      unsubscribeShop();
      unsubscribeAuth();
    };
  }, []);

  const saveShop = (changes) => {
    const uid = activeUserId.current;
    if (!uid || !shopReady.current) return;
    setDoc(
      doc(db, 'userShops', uid),
      {
        ...changes,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ).catch((error) => {
      console.error('Unable to save the customer cart and wishlist:', error);
    });
  };

  const value = useMemo(
    () => ({
      cart,
      favorites,
      isShopReady,
      addToCart(product, quantity = 1, size = '', color = '') {
        if (!activeUserId.current || !shopReady.current) return;
        const existing = cartRef.current.find(
          (item) =>
            item.id === product.id &&
            item.size === size &&
            item.color === color,
        );
        const nextCart = existing
          ? cartRef.current.map((item) =>
              item.id === product.id &&
              item.size === size &&
              item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            )
          : [...cartRef.current, { ...product, quantity, size, color }];
        cartRef.current = nextCart;
        setCart(nextCart);
        saveShop({ cart: nextCart });
      },
      updateCartQuantity(id, size, color, quantity) {
        if (!activeUserId.current || !shopReady.current) return;
        const nextCart =
          quantity < 1
            ? cartRef.current.filter(
                (item) =>
                  item.id !== id || item.size !== size || item.color !== color,
              )
            : cartRef.current.map((item) =>
                item.id === id && item.size === size && item.color === color
                  ? { ...item, quantity }
                  : item,
              );
        cartRef.current = nextCart;
        setCart(nextCart);
        saveShop({ cart: nextCart });
      },
      removeFromCart(id, size, color) {
        if (!activeUserId.current || !shopReady.current) return;
        const nextCart = cartRef.current.filter(
          (item) =>
            item.id !== id || item.size !== size || item.color !== color,
        );
        cartRef.current = nextCart;
        setCart(nextCart);
        saveShop({ cart: nextCart });
      },
      toggleFavorite(product) {
        if (!activeUserId.current || !shopReady.current) return;
        const nextFavorites = favoritesRef.current.some(
          (item) => item.id === product.id,
        )
          ? favoritesRef.current.filter((item) => item.id !== product.id)
          : [...favoritesRef.current, product];
        favoritesRef.current = nextFavorites;
        setFavorites(nextFavorites);
        saveShop({ favorites: nextFavorites });
      },
      isFavorite(id) {
        return favorites.some((item) => item.id === id);
      },
    }),
    [cart, favorites, isShopReady],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
