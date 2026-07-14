import React from "react";
import { motion } from "framer-motion";
import { FaUserSlash, FaTriangleExclamation, FaPlus } from "react-icons/fa6";

/**
 * Friendly empty / error state used both at the page level and inside
 * individual profile sections.
 *
 * Page-level variants:
 *   - "not_found" : profile missing or invalid id (renders a Back button).
 *   - "error"     : network / server failure (renders a Retry button).
 *
 * Section-level variant ("section"):
 *   - Inline placeholder for an empty part of a profile (e.g. no portfolio
 *     yet). Pass `title`, `message`, and an optional `actionLabel`/`onAction`.
 *
 * @param {object} props
 * @param {"not_found"|"error"|"section"} [props.variant="section"]
 * @param {React.ComponentType} [props.icon] - Custom icon (defaults per variant).
 * @param {string} [props.title]
 * @param {string} [props.message]
 * @param {string} [props.actionLabel]
 * @param {() => void} [props.onAction]
 * @param {() => void} [props.onRetry]
 * @param {() => void} [props.onBack]
 */
const EmptyState = ({
  variant = "section",
  icon: CustomIcon,
  title,
  message,
  actionLabel,
  onAction,
  onRetry,
  onBack,
}) => {
  // ── Page-level variants ──────────────────────────────────────────────
  if (variant === "not_found" || variant === "error") {
    const isError = variant === "error";
    const Icon = CustomIcon || (isError ? FaTriangleExclamation : FaUserSlash);
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-10 max-w-xl rounded-3xl border border-white/60 bg-white/70 p-10 text-center shadow-xl shadow-indigo-100/50 backdrop-blur-xl"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {title || (isError ? "Something went wrong" : "Profile not found")}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          {message ||
            (isError
              ? "We couldn't load this profile. Please check your connection and try again."
              : "The profile you're looking for doesn't exist or the link is invalid.")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {isError && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Retry
            </button>
          )}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Go back
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // ── Inline section variant ───────────────────────────────────────────
  const Icon = CustomIcon || FaPlus;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-slate-600">
        {title || "Nothing here yet"}
      </p>
      {message && <p className="mt-1 max-w-xs text-xs text-slate-400">{message}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
        >
          <FaPlus className="h-3 w-3" />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
