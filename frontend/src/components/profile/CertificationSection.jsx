import React from "react";
import { motion } from "framer-motion";
import { FaCertificate, FaArrowUpRightFromSquare } from "react-icons/fa6";
import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";
import { isValidUrl } from "./profileUtils";

/**
 * Certifications section for freelancers.
 *
 * @param {object} props
 * @param {Array} props.items - Certification items ({ name, issuer, year, url }).
 * @param {() => void} [props.onEdit] - Opens the edit modal.
 */
const CertificationSection = ({ items = [], onEdit }) => (
  <SectionCard title="Certifications" subtitle="Credentials & licenses" icon={FaCertificate} onEdit={onEdit} id="certifications">
    {items.length === 0 ? (
      <EmptyState icon={FaCertificate} title="No certifications added yet" message="Add credentials to stand out." />
    ) : (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((cert, i) => (
          <motion.div
            key={cert._id || i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
            whileHover={{ y: -3 }}
            className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm shadow-indigo-100/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <FaCertificate className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900">{cert.name}</h3>
              <p className="text-sm text-indigo-600">
                {cert.issuer}
                {cert.year ? ` · ${cert.year}` : ""}
              </p>
              {isValidUrl(cert.url) && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <FaArrowUpRightFromSquare className="h-3 w-3" />
                  View Credential
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </SectionCard>
);

export default CertificationSection;
