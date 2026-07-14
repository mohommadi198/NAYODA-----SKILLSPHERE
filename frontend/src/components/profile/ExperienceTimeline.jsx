import React from "react";
import { motion } from "framer-motion";
import { FaBriefcase, FaCircleCheck } from "react-icons/fa6";
import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";
import { formatDateRange } from "./profileUtils";

/**
 * Vertical experience timeline for freelancers.
 *
 * @param {object} props
 * @param {Array} props.items - Experience items ({ title, company, startDate, endDate, current, description }).
 * @param {() => void} [props.onEdit] - Opens the edit modal.
 */
const ExperienceTimeline = ({ items = [], onEdit }) => (
  <SectionCard title="Experience" subtitle="Where they've worked" icon={FaBriefcase} onEdit={onEdit} id="experience">
    {items.length === 0 ? (
      <EmptyState icon={FaBriefcase} title="No experience added yet" message="Add roles to build trust with clients." />
    ) : (
      <ol className="relative ml-3 border-l-2 border-indigo-100">
        {items.map((exp, i) => (
          <motion.li
            key={exp._id || i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
            className="relative mb-7 pl-7 last:mb-0"
          >
            {/* Timeline node */}
            <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-violet-500 shadow" />
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900">{exp.title}</h3>
              {exp.current && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <FaCircleCheck className="h-3 w-3" /> Current
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-indigo-600">{exp.company}</p>
            <p className="text-xs text-slate-400">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
            {exp.description && <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{exp.description}</p>}
          </motion.li>
        ))}
      </ol>
    )}
  </SectionCard>
);

export default ExperienceTimeline;
