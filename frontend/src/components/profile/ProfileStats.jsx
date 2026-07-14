import React from "react";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaEye,
  FaReply,
  FaTrophy,
  FaStar,
  FaCommentDots,
} from "react-icons/fa6";
import AnimatedCounter from "./AnimatedCounter";
import { getProfileStats } from "./profileUtils";

/** One statistic tile. */
const StatCard = ({ icon: Icon, label, value, suffix = "", decimals = 0, gradient, format }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-lg shadow-indigo-100/40 backdrop-blur-xl"
  >
    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white ${gradient}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="text-2xl font-bold text-slate-900">
      <AnimatedCounter value={value} suffix={suffix} decimals={decimals} format={format} />
    </div>
    <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
  </motion.div>
);

/**
 * Freelancer analytics grid: projects completed, profile views, response
 * rate, success rate, rating, and reviews. Numbers animate on scroll-in.
 *
 * @param {object} props
 * @param {object} props.profile - Normalised profile (used for seeded placeholders).
 */
const ProfileStats = ({ profile }) => {
  const s = getProfileStats(profile);
  const stats = [
    { icon: FaBriefcase, label: "Projects Completed", value: s.projectsCompleted, gradient: "from-indigo-500 to-violet-500" },
    { icon: FaEye, label: "Profile Views", value: s.profileViews, gradient: "from-sky-500 to-blue-500" },
    { icon: FaReply, label: "Response Rate", value: s.responseRate, suffix: "%", gradient: "from-emerald-500 to-teal-500" },
    { icon: FaTrophy, label: "Success Rate", value: s.successRate, suffix: "%", gradient: "from-amber-500 to-orange-500" },
    { icon: FaStar, label: "Rating", value: s.rating, decimals: 1, gradient: "from-fuchsia-500 to-pink-500", format: (n) => `${n} ★` },
    { icon: FaCommentDots, label: "Reviews", value: s.reviews, gradient: "from-rose-500 to-red-500" },
  ];

  return (
    <section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="rounded-3xl border border-white/60 bg-white/40 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-xl sm:p-8"
    >
      <h2 className="mb-5 text-lg font-bold text-slate-900 sm:text-xl">Statistics</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default ProfileStats;
