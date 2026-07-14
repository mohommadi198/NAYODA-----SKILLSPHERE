import React from "react";
import { motion } from "framer-motion";
import { FaSliders, FaSackDollar, FaClock, FaWifi } from "react-icons/fa6";
import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";

/** A small labelled tag. */
const Tag = ({ children, tone = "indigo" }) => {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-700",
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone] || tones.indigo}`}>
      {children}
    </span>
  );
};

/**
 * Client-only hiring preferences: preferred skills, budget range,
 * engagement type, and a remote-only flag.
 *
 * @param {object} props
 * @param {object} props.preferences - Normalised `client.hiringPreferences`.
 * @param {() => void} [props.onEdit] - Opens the edit modal.
 */
const HiringPreferences = ({ preferences = {}, onEdit }) => {
  const { preferredSkills = [], budgetRange = "", engagementType = "", remoteOnly = false } = preferences;
  const hasContent = preferredSkills.length || budgetRange || engagementType || remoteOnly;

  return (
    <SectionCard title="Hiring Preferences" subtitle="What they're looking for" icon={FaSliders} onEdit={onEdit} id="hiring">
      {!hasContent ? (
        <EmptyState icon={FaSliders} title="No hiring preferences set" message="Define preferred skills and budget to get matched faster." />
      ) : (
        <div className="space-y-5">
          {preferredSkills.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-600">Preferred Skills</p>
              <div className="flex flex-wrap gap-2">
                {preferredSkills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {budgetRange && (
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <FaSackDollar className="h-3.5 w-3.5" /> Budget Range
                </p>
                <p className="mt-1 font-semibold text-slate-800">{budgetRange}</p>
              </div>
            )}
            {engagementType && (
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <FaClock className="h-3.5 w-3.5" /> Engagement
                </p>
                <p className="mt-1 font-semibold text-slate-800">{engagementType}</p>
              </div>
            )}
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <FaWifi className="h-3.5 w-3.5" /> Work Mode
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {remoteOnly ? <Tag tone="emerald">Remote only</Tag> : <span className="text-slate-500">Any</span>}
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default HiringPreferences;
