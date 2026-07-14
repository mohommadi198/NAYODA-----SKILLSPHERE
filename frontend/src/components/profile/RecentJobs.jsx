import React from "react";
import { motion } from "framer-motion";
import { FaBriefcase, FaUsers, FaCircleCheck, FaHourglassHalf } from "react-icons/fa6";
import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";

/** Map a status string to a colour token. */
const STATUS_TONE = {
  Open: "bg-emerald-50 text-emerald-700",
  "In Review": "bg-amber-50 text-amber-700",
  Closed: "bg-slate-100 text-slate-500",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[status] || STATUS_TONE.Closed}`}>
    {status === "Open" ? <FaCircleCheck className="h-3 w-3" /> : <FaHourglassHalf className="h-3 w-3" />}
    {status}
  </span>
);

/**
 * Client-only recent job postings. Renders `jobs` when provided, otherwise
 * falls back to a friendly empty state.
 *
 * @param {object} props
 * @param {Array} [props.jobs] - Job items ({ title, budget, applicants, status, postedDate }).
 * @param {() => void} [props.onEdit] - Opens the edit modal.
 */
const RecentJobs = ({ jobs = [], onEdit }) => (
  <SectionCard title="Recent Jobs" subtitle="Roles this client is hiring for" icon={FaBriefcase} onEdit={onEdit} id="jobs">
    {jobs.length === 0 ? (
      <EmptyState icon={FaBriefcase} title="No jobs posted yet" message="Post a role to start receiving proposals." />
    ) : (
      <div className="space-y-3">
        {jobs.map((job, i) => (
          <motion.div
            key={job._id || i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
            whileHover={{ x: 4 }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm shadow-indigo-100/40"
          >
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900">{job.title}</h3>
              <p className="mt-0.5 flex items-center gap-3 text-xs text-slate-400">
                <span className="font-medium text-slate-600">{job.budget}</span>
                <span className="inline-flex items-center gap-1">
                  <FaUsers className="h-3 w-3" /> {job.applicants} applicants
                </span>
                <span>
                  Posted {new Date(job.postedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </p>
            </div>
            <StatusBadge status={job.status} />
          </motion.div>
        ))}
      </div>
    )}
  </SectionCard>
);

export default RecentJobs;
