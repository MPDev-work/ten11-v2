import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  Handbag,
  Heart,
  Search as SearchIcon,
  X,
} from 'lucide-react';
import { brandData } from '../../data/brands';
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
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const isOpen = activeModal !== null || openFav;

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
            {['men', 'women', 'kids', 'accessories', 'z.home'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-base font-semibold uppercase text-black transition duration-150 hover:text-gray-500"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-4xl font-semibold uppercase text-black"
          >
            ten11
          </a>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => openModal('search')}
              className="hidden h-9 items-center gap-2 rounded-sm border border-gray-300 pl-4 pr-20 text-base font-medium text-gray-300 transition duration-150 hover:border-gray-400 hover:text-gray-500 sm:flex"
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
              onClick={openFavorites}
            />
            <HeaderButton
              label="Open notifications"
              icon={Bell}
              badge
              onClick={() => openModal('notifications')}
            />
            <HeaderButton
              label="Open shopping bag"
              icon={Handbag}
              onClick={() => openModal('bag')}
            />
            <a
              className="hidden h-10 px-3 text-sm font-semibold uppercase text-black transition duration-150 hover:bg-gray-100 md:flex md:items-center"
              href="#"
            >
              Login
            </a>
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
      </ActionModal>
    </>
  );
}

export default Navbar;
