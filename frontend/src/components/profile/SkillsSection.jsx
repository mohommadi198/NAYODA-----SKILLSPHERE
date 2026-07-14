import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCode, FaMagnifyingGlass } from "react-icons/fa6";
import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";

/**
 * Skills section: a searchable grid of animated skill chips.
 *
 * @param {object} props
 * @param {string[]} props.skills - List of skill names.
 * @param {() => void} [props.onEdit] - Opens the edit modal.
 */
const SkillsSection = ({ skills = [], onEdit }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter((s) => s.toLowerCase().includes(q));
  }, [skills, query]);

  return (
    <SectionCard title="Skills" subtitle="What this freelancer brings to the table" icon={FaCode} onEdit={onEdit} id="skills">
      {skills.length === 0 ? (
        <EmptyState icon={FaCode} title="No skills added yet" message="Add the technologies and disciplines you work with." />
      ) : (
        <>
          <div className="relative mb-4 max-w-xs">
            <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter skills…"
              className="w-full rounded-full border border-slate-200 bg-white/80 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            {(filtered.length ? filtered : skills).map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                whileHover={{ scale: 1.06, y: -2 }}
                className="group relative cursor-default rounded-full border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                {skill}
                {/* Decorative progress shimmer */}
                <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 opacity-0 transition group-hover:opacity-100" />
              </motion.span>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-slate-400">No skills match “{query}”.</p>
            )}
          </div>
        </>
      )}
    </SectionCard>
  );
};

export default SkillsSection;
