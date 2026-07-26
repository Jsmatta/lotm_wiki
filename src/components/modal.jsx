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
    <div className="modal modal-open z-1000" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-box w-11/12 max-w-md border border-accent"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId(title)}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id={titleId(title)} className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
