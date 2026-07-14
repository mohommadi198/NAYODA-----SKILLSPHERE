import React from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

/**
 * Reusable glassmorphism section wrapper used by every profile block.
 *
 * Features:
 *  - Optional icon + title + subtitle header.
 *  - Optional "Edit" affordance (owner only) that bubbles up via `onEdit`.
 *  - Scroll-reveal entrance via Framer Motion `whileInView`.
 *
 * @param {object}   props
 * @param {string}   props.title        - Section heading.
 * @param {string}   [props.subtitle]   - Supporting line under the title.
 * @param {React.ComponentType} [props.icon] - Lucide icon component.
 * @param {() => void} [props.onEdit]   - Opens the edit modal for this section.
 * @param {string}   [props.editLabel]  - Aria/visible label for the edit button.
 * @param {React.ReactNode} props.children
 * @param {string}   [props.className]  - Extra classes for the card.
 * @param {string}   [props.bodyClassName] - Extra classes for the body wrapper.
 * @param {string}   [props.id]         - DOM id (used for scroll-to on edit).
 */
const SectionCard = ({
  title,
  subtitle,
  icon: Icon,
  onEdit,
  editLabel = "Edit",
  children,
  className = "",
  bodyClassName = "",
  id,
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={
      "rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-xl sm:p-8 " +
      className
    }
  >
    {(title || onEdit) && (
      <header className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label={editLabel}
          >
            <Pencil className="h-3.5 w-3.5" />
            {editLabel}
          </button>
        )}
      </header>
    )}
    <div className={bodyClassName}>{children}</div>
  </motion.section>
);

export default SectionCard;
