import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6";

/**
 * Full-screen image lightbox with a blurred backdrop. Closes on backdrop
 * click, the close button, or the Escape key.
 *
 * @param {object} props
 * @param {string|null} props.src - Image URL to display (null = closed).
 * @param {string} [props.alt] - Alt text for the image.
 * @param {() => void} props.onClose - Close handler.
 */
const Lightbox = ({ src, alt = "", onClose }) => {
  useEffect(() => {
    if (!src) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Close preview"
          >
            <FaXmark className="h-5 w-5" />
          </button>
          <motion.img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="max-h-[85vh] max-w-4xl rounded-2xl object-contain shadow-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
