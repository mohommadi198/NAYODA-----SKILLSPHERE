import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa6";
import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";
import { formatDateRange } from "./profileUtils";

/**
 * Education section for freelancers.
 *
 * @param {object} props
 * @param {Array} props.items - Education items ({ school, degree, fieldOfStudy, startDate, endDate }).
 * @param {() => void} [props.onEdit] - Opens the edit modal.
 */
const EducationSection = ({ items = [], onEdit }) => (
  <SectionCard title="Education" subtitle="Academic background" icon={FaGraduationCap} onEdit={onEdit} id="education">
    {items.length === 0 ? (
      <EmptyState icon={FaGraduationCap} title="No education added yet" message="Add schools, degrees, or courses." />
    ) : (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((edu, i) => (
          <motion.div
            key={edu._id || i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
            className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm shadow-indigo-100/40"
          >
            <h3 className="font-semibold text-slate-900">{edu.school}</h3>
            <p className="text-sm text-indigo-600">
              {edu.degree}
              {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
            </p>
            <p className="mt-1 text-xs text-slate-400">{formatDateRange(edu.startDate, edu.endDate)}</p>
          </motion.div>
        ))}
      </div>
    )}
  </SectionCard>
);

export default EducationSection;
