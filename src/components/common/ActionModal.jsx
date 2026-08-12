import { useEffect } from 'react';
import { X } from 'lucide-react';

function ActionModal({ isOpen, onClose, title, variant = 'drawer', children }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSearch = variant === 'search';

  return (
    <div
      className="fixed inset-0 z-[1000] bg-[#f2f2f6]/20 backdrop-blur-lg"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-modal-title"
        className={`absolute bg-white ${
          isSearch
            ? 'inset-x-0 top-0 border-b border-gray-200 motion-safe:animate-[navbar-slide-down_500ms_cubic-bezier(0.80,0,0,1)]'
            : 'right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-gray-200 motion-safe:animate-[navbar-slide-left_300ms_ease-in-out] sm:w-1/2 sm:max-w-none'
        }`}
      >
        {!isSearch && (
          <header className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <h2
              id="action-modal-title"
              className="text-lg font-semibold tracking-tight text-black"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="grid size-10 place-items-center text-black transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label={`Close ${title}`}
            >
              <X size={20} />
            </button>
          </header>
        )}
        {children}
      </section>
    </div>
  );
}

export default ActionModal;
