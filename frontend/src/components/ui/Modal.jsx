import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { cn } from "../../lib/cn";

export default function Modal({ open, onClose, title, children, className, position = "center" }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("input, textarea, button:not([data-close])")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100] flex justify-center bg-gray-950/50 p-4 backdrop-blur-sm animate-fade-in",
        position === "top" ? "items-start pt-[12vh]" : "items-center"
      )}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-fade-up dark:border-gray-800 dark:bg-gray-900",
          className
        )}
      >
        <button
          type="button"
          data-close
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
        >
          <HiXMark className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
