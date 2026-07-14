import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFolderOpen, FaArrowUpRightFromSquare } from "react-icons/fa6";
import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";
import Lightbox from "./Lightbox";
import { isValidUrl } from "./profileUtils";

/**
 * Portfolio grid: responsive cards with image, title, description and a
 * "Visit Project" link. Clicking the image opens a full-screen lightbox.
 *
 * @param {object} props
 * @param {Array} props.items - Portfolio items ({ title, url, imageUrl, description }).
 * @param {() => void} [props.onEdit] - Opens the edit modal.
 */
const PortfolioGrid = ({ items = [], onEdit }) => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <SectionCard title="Portfolio" subtitle="Selected work & case studies" icon={FaFolderOpen} onEdit={onEdit} id="portfolio">
      {items.length === 0 ? (
        <EmptyState
          icon={FaFolderOpen}
          title="No portfolio added yet"
          message="Showcase your best projects to attract more clients."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.article
              key={item._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.25) }}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-lg shadow-indigo-100/40 backdrop-blur"
            >
              <button
                type="button"
                onClick={() => item.imageUrl && setLightbox(item.imageUrl)}
                className="relative block aspect-[16/10] w-full overflow-hidden focus:outline-none"
                aria-label={`Open ${item.title} preview`}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-300">
                    <FaFolderOpen className="h-10 w-10" />
                  </div>
                )}
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-indigo-600 opacity-0 transition group-hover:opacity-100">
                  <FaArrowUpRightFromSquare className="h-4 w-4" />
                </span>
              </button>

              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</p>
                )}
                {isValidUrl(item.url) && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
                    Visit Project
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </SectionCard>
  );
};

export default PortfolioGrid;
