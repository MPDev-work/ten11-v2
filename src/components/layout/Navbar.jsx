import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  ArrowUpRight,
  Bell,
  Handbag,
  Heart,
  LogOut,
  Search as SearchIcon,
  X,
  UserRound,
  Menu,
} from 'lucide-react';
import { brandData } from '../../data/brands';
import { auth } from '../../lib/firebaseClient';
import { useProducts } from '../../hooks/useProducts';
import { useShop } from '../../hooks/useShop';
import { useStoreSettings } from '../../hooks/useStoreSettings';
import ActionModal from '../common/ActionModal';

const panelContent = {
  favorites: {
    title: 'Your favorites',
    icon: Heart,
    heading: 'Save the pieces you love',
    detail:
      'Your favorite items will appear here so they are easy to find later.',
  },
  notifications: {
    title: 'Notifications',
    icon: Bell,
    heading: 'You are all caught up',
    detail: 'New offers, order updates, and style news will appear here.',
  },
  bag: {
    title: 'Shopping bag',
    icon: Handbag,
    heading: 'Your bag is empty',
    detail: 'Add something you love and it will be ready for checkout here.',
  },
};

function HeaderButton({ label, icon: Icon, onClick, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative grid size-10 place-items-center text-black transition duration-150 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
    >
      <Icon size={20} strokeWidth={1.7} />
      {badge && (
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-rose-500" />
      )}
    </button>
  );
}

function Navbar({ setOpenFav, openFav }) {
  const [activeModal, setActiveModal] = useState(null);
  const [isSideBar, setIsSideBar] = useState(false);
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { products } = useProducts();
  const {
    cart,
    favorites,
    removeFromCart,
    updateCartQuantity,
    toggleFavorite,
  } = useShop();
  const { storeName, formatPrice } = useStoreSettings();
  const isOpen = activeModal !== null || openFav;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth)
      document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [isOpen]);

  useEffect(() => {
    if (activeModal === 'search') inputRef.current?.focus();
  }, [activeModal]);

  const openModal = (name) => {
    setOpenFav(false);
    setActiveModal(name);
  };

  const closeModal = () => {
    setActiveModal(null);
    setOpenFav(false);
    setQuery('');
  };

  const openFavorites = () => {
    setActiveModal(null);
    setOpenFav(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (authError) {
      console.error('Firebase logout error:', authError);
      window.alert('Unable to log out. Please try again.');
    }
  };

  const username =
    auth.currentUser?.displayName.slice(
      0,
      auth.currentUser?.displayName.indexOf(' '),
    ) ||
    user?.email?.split('@')[0] ||
    '';
  const displayName = username.slice(0, 1).toUpperCase() + username.slice(1);
  const userInitial = username.charAt(0).toUpperCase();
  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((product) =>
        [product.title, product.storeID, product.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term)),
      )
      .slice(0, 8);
  }, [products, query]);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => {
    const price = Number(item.price || 0) * (1 - Number(item.dis || 0) / 100);
    return total + price * item.quantity;
  }, 0);

  const panel =
    activeModal && activeModal !== 'search'
      ? panelContent[activeModal]
      : panelContent.favorites;
  const PanelIcon = panel.icon;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[999] bg-white">
        <nav className="relative flex h-12 items-center justify-between pl-5 pr-1">
          <ul className="hidden items-center gap-6 xl:flex">
            {['men', 'women', 'kids', 'accessories', 'z.home', 'brands'].map(
              (item) => (
                <li key={item}>
                  <Link
                    to={item === 'z.home' ? '/z.home' : `/${item}`}
                    className="text-base font-semibold uppercase text-black transition duration-150 hover:text-gray-500"
                  >
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <button
            onClick={() => setIsSideBar((prev) => !prev)}
            className="absolute left-2.5 flex lg:hidden"
          >
            <Menu size={20} className="text-black" />
          </button>
          <Link
            to="/"
            className="absolute left-10 lg:left-1/2 lg:-translate-x-1/2 text-2xl lg:text-4xl font-semibold uppercase text-black"
          >
            {storeName}
          </Link>
          <div className="ml-auto flex items-center gap-1">
            {/* {!user ? (
              <button
                type="button"
                onClick={() => openModal('search')}
                className="hidden h-9 items-center gap-2 rounded-sm border border-gray-300 pl-4 pr-20 text-base font-medium text-gray-300 transition duration-150 hover:border-gray-400 hover:text-gray-500 sm:flex"
                aria-label="Search"
              >
                <SearchIcon size={20} className="text-gray-400" />{' '}
                <span>Search</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openModal('search')}
                className="cursor-pointer mr-2.5"
                aria-label="Search"
              >
                <SearchIcon size={20} className="text-black" />{' '}
              </button>
            )} */}
            <button
              type="button"
              onClick={() => openModal('search')}
              className="cursor-pointer hidden h-9 items-center gap-2 rounded-sm border border-gray-300 pl-4 pr-20 text-base font-medium text-gray-300 transition duration-150 hover:border-gray-400 hover:text-gray-500 sm:flex"
              aria-label="Search"
            >
              <SearchIcon size={20} className="text-gray-400" />{' '}
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={() => openModal('search')}
              className="grid size-10 place-items-center transition hover:bg-gray-100 sm:hidden"
              aria-label="Search"
            >
              <SearchIcon size={20} />
            </button>
            <HeaderButton
              label="Open favorites"
              icon={Heart}
              badge={favorites.length > 0}
              onClick={openFavorites}
            />
            {/* <HeaderButton
              label="Open notifications"
              icon={Bell}
              badge
              onClick={() => openModal('notifications')}
            /> */}
            <HeaderButton
              label="Open shopping bag"
              icon={Handbag}
              badge={cartCount > 0}
              onClick={() => openModal('bag')}
            />
            {!user && (
              <Link
                to="/login"
                className="h-full w-8 flex items-center justify-center lg:hidden"
              >
                <UserRound size={20} />
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="cursor-pointer hidden h-10 items-center gap-2 px-2 text-sm font-semibold text-black md:flex"
                  aria-label={`Signed in as ${displayName}`}
                >
                  <span className="grid size-8 place-items-center rounded-full bg-black text-sm font-bold text-white">
                    {userInitial}
                  </span>
                  <div
                    className="flex flex-col justify-center gap-1
                  "
                  >
                    <span className="Capitalize leading-[1]">
                      {displayName}
                    </span>
                    <span className="Capitalize text-[10px] text-blue-500 leading-[1]">
                      Active
                    </span>
                  </div>
                </Link>
                {/* <Link
                  to="/orders"
                  className="hidden px-2 text-sm font-semibold uppercase text-black transition hover:text-slate-500 md:block"
                >
                  Orders
                </Link> */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden h-10 items-center gap-1.5 px-3 text-sm font-semibold uppercase text-black transition duration-150 hover:bg-gray-100 md:flex"
                >
                  <LogOut size={17} strokeWidth={1.8} />
                </button>
              </>
            ) : (
              <Link
                className="hidden h-10 px-3 text-sm font-semibold uppercase text-black transition duration-150 hover:bg-gray-100 md:flex md:items-center"
                to="/login"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      <ActionModal
        isOpen={activeModal === 'search'}
        onClose={closeModal}
        title="Search"
        variant="search"
      >
        <div className="mx-auto w-full max-w-3xl px-5 py-5 sm:py-7">
          <div className="flex items-center gap-3 border-b-2 border-slate-950 pb-3">
            <SearchIcon size={21} />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands and categories"
              className="min-w-0 flex-1 text-base outline-none placeholder:text-slate-400 sm:text-lg"
            />
            <button
              type="button"
              onClick={closeModal}
              className="grid size-9 place-items-center rounded-full hover:bg-slate-100"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
          <div className="pt-6 pb-3">
            {query.trim() && (
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Products
                </p>
                {searchResults.length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        state={{ product }}
                        onClick={closeModal}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-100"
                      >
                        <img
                          src={product.src || product.imageUrl}
                          alt=""
                          className="h-14 w-12 rounded-lg object-cover"
                        />
                        <span className="min-w-0">
                          <b className="block truncate">{product.title}</b>
                          <small className="text-slate-500">
                            {product.storeID} · {formatPrice(product.price)}
                          </small>
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No matching products found.
                  </p>
                )}
              </div>
            )}
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Popular brands
            </p>
            <div className="flex flex-wrap gap-2">
              {brandData.slice(0, 8).map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setQuery(brand.name)}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium transition hover:bg-slate-200"
                >
                  {brand.name}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={
          openFav || activeModal === 'notifications' || activeModal === 'bag'
        }
        onClose={closeModal}
        title={panel.title}
      >
        {openFav ? (
          <div className="flex flex-1 flex-col overflow-y-auto p-5">
            {favorites.length ? (
              favorites.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 border-b py-3"
                >
                  <Link
                    to={`/products/${product.id}`}
                    state={{ product }}
                    onClick={closeModal}
                  >
                    <img
                      src={product.src || product.imageUrl}
                      alt=""
                      className="h-20 w-16 object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate">{product.title}</b>
                    <p className="text-sm text-slate-500">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(product)}
                    className="text-sm underline"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <EmptyPanel
                icon={Heart}
                title="Save the pieces you love"
                detail="Your favorite products will appear here."
              />
            )}
          </div>
        ) : activeModal === 'bag' ? (
          <div className="flex flex-1 flex-col overflow-y-auto p-5">
            {cart.length ? (
              <>
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center gap-3 border-b py-3"
                  >
                    <img
                      src={item.src || item.imageUrl}
                      alt=""
                      className="h-20 w-16 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <b className="block truncate">{item.title}</b>
                      <p className="text-sm text-slate-500">
                        {item.size && `Size ${item.size} · `}
                        {item.color && `Color ${item.color} · `}
                        {formatPrice(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1,
                            )
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity + 1,
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.id, item.size, item.color)
                      }
                      className="text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="mt-auto pt-5">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      navigate('/checkout');
                    }}
                    className="cursor-pointer mt-4 w-full rounded-full bg-black py-3 text-white"
                  >
                    Checkout
                  </button>
                </div>
              </>
            ) : (
              <EmptyPanel
                icon={Handbag}
                title="Your bag is empty"
                detail="Add a product to begin your order."
              />
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-8 pb-20 text-center">
            <div className="mb-6 grid size-16 place-items-center rounded-full bg-slate-100 text-slate-900">
              <PanelIcon size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {panel.heading}
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
              {panel.detail}
            </p>
            <button
              type="button"
              onClick={closeModal}
              className="mt-8 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Continue shopping
            </button>
          </div>
        )}
      </ActionModal>
      <SideBar
        setIsSideBar={setIsSideBar}
        isSideBar={isSideBar}
        handleLogout={handleLogout}
        user={user}
        displayName={displayName}
        userInitial={userInitial}
      />
    </>
  );
}

function SideBar({
  isSideBar,
  setIsSideBar,
  handleLogout,
  user,
  displayName,
  userInitial,
}) {
  return (
    <>
      <aside
        className={`fixed top-0 z-[1001] w-[75vw] h-dvh flex flex-col gap-2.5 p-2.5 bg-white transition duration-300 ${isSideBar ? `translate-x-0` : `-translate-x-[100%]`}`}
      >
        <div className="w-full flex justify-between items-center px-2.5">
          <h1 className="text-2xl font-semibold text-black">Ten11</h1>
          <button onClick={() => setIsSideBar((prev) => !prev)}>
            <X size={20} className="text-black" />
          </button>
        </div>
        <hr className="w-full border-t border-gray-300" />
        <div className="relative w-full h-max flex flex-col gap-2.5 px-2.5">
          <Link
            onClick={() => setTimeout(() => setIsSideBar((prev) => !prev), 200)}
            className="text-lg font-medium"
            to="/"
          >
            Home
          </Link>
          <Link
            onClick={() => setTimeout(() => setIsSideBar((prev) => !prev), 200)}
            className="text-lg font-medium"
            to="/men"
          >
            Men
          </Link>
          <Link
            onClick={() => setTimeout(() => setIsSideBar((prev) => !prev), 200)}
            className="text-lg font-medium"
            to="/women"
          >
            Women
          </Link>
          <Link
            onClick={() => setTimeout(() => setIsSideBar((prev) => !prev), 200)}
            className="text-lg font-medium"
            to="/kids"
          >
            Kids
          </Link>
          <Link
            onClick={() => setTimeout(() => setIsSideBar((prev) => !prev), 200)}
            className="text-lg font-medium"
            to="/accessories"
          >
            Accessories
          </Link>
          <Link
            onClick={() => setTimeout(() => setIsSideBar((prev) => !prev), 200)}
            className="text-lg font-medium"
            to="/brands"
          >
            Brands
          </Link>
        </div>
        {user && (
          <div className="absolute bottom-5 w-[calc(100%-20px)] flex justify-between items-center h-10">
            <Link
              onClick={() =>
                setTimeout(() => setIsSideBar((prev) => !prev), 200)
              }
              to="/orders"
              className="h-full w-full flex items-center gap-2.5"
            >
              <div className="upperbase h-10 w-12 bg-black text-xl text-white flex justify-center items-center rounded-full">
                {userInitial}
              </div>
              <div className="w-full flex flex-col justify-center">
                <p className="capitalize text-black text-xl leading-[1]">
                  {displayName}
                </p>
                <p className="text-xs text-gray-300 leading-[1]">
                  Orders history
                </p>
              </div>
            </Link>
            <div
              onClick={handleLogout}
              className="abosolute z-20 left-0 h-10 w-10 border border-gray-300 rounded-full flex items-center justify-center"
            >
              <LogOut size={20} className="text-black" />
            </div>
          </div>
          // <div
          //   onClick={handleLogout}
          //   className="absolute bottom-5 w-[calc(100%-20px)] border rounded-full h-10 text-sm text-black border-black flex justify-center items-center"
          // >
          //   Logout
          // </div>
          // <Link
          //   to="/orders"
          //   className="cursor-pointer hidden h-10 items-center gap-2 px-2 text-sm font-semibold text-black md:flex"
          //   aria-label={`Signed in as ${displayName}`}
          // >
          //   <span className="grid size-8 place-items-center rounded-full bg-black text-sm font-bold text-white">
          //     {userInitial}
          //   </span>
          //   <div
          //     className="flex flex-col justify-center gap-1
          //         "
          //   >
          //     <span className="Capitalize leading-[1]">{displayName}</span>
          //     <span className="Capitalize text-[10px] text-blue-500 leading-[1]">
          //       Active
          //     </span>
          //   </div>
          // </Link>
        )}
      </aside>
      <div
        onClick={() => setIsSideBar((prev) => !prev)}
        className={`fixed top-0 z-[1000] w-screen h-dvh bg-white/20 backdrop-blur-3xl transition duration-300 ${isSideBar ? `translate-x-0` : `-translate-x-[100%]`}`}
      ></div>
    </>
  );
}

function EmptyPanel({ icon: Icon, title, detail }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Icon size={30} />
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

export default Navbar;
