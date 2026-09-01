import { useEffect, useRef } from "preact/hooks";
import { createPortal } from "preact/compat";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function titleId(title) {
  return `modal-title-${title.toLowerCase().replace(/\s+/g, "-")}`;
}

export default function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const dialogNode = dialogRef.current;
    const focusable = dialogNode
      ? Array.from(dialogNode.querySelectorAll(FOCUSABLE_SELECTOR))
      : [];

    (focusable[0] ?? dialogNode)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-black/85 flex items-center justify-center p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        className="bg-base-200 border-2 border-base-content brutal-shadow-xl w-11/12 max-w-md p-6 relative rounded-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId(title)}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-base-content/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary border border-black"></span>
            <h3 id={titleId(title)} className="font-mono font-black uppercase text-base sm:text-lg text-base-content">
              {title}
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-xs btn-square bg-base-100 border-2 border-base-content rounded-none font-mono font-bold hover:bg-error hover:text-error-content"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="py-2">
          {children}
        </div>

        <div className="mt-4 pt-3 border-t-2 border-base-content/20">
          <button
            type="button"
            className="btn btn-sm btn-outline rounded-none border-2 border-base-content font-mono font-bold uppercase tracking-wider bg-base-100 w-full brutal-shadow-xs brutal-btn"
            onClick={onClose}
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
