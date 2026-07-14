import React from "react";
import { motion } from "framer-motion";

/** A single shimmering bar. */
const Bar = ({ className = "" }) => (
  <div className={`animate-pulse rounded-full bg-slate-200/80 ${className}`} />
);

/**
 * Animated skeleton loader that mirrors the real profile layout
 * (cover banner + avatar header, sticky sidebar, and content columns) so
 * the page doesn't jump when data arrives.
 */
const ProfileSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-12"
  >
    {/* Cover banner */}
    <div className="h-40 w-full animate-pulse rounded-3xl bg-gradient-to-r from-indigo-200 via-violet-200 to-sky-200 sm:h-48" />

    {/* Header row */}
    <div className="-mt-12 flex flex-col gap-4 px-2 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-end gap-4">
        <div className="h-24 w-24 animate-pulse rounded-full border-4 border-white bg-slate-200 sm:h-28 sm:w-28" />
        <div className="pb-2">
          <Bar className="h-5 w-40" />
          <Bar className="mt-2 h-3 w-24" />
        </div>
      </div>
      <div className="flex gap-2">
        <Bar className="h-9 w-24" />
        <Bar className="h-9 w-24" />
      </div>
    </div>

    {/* Body grid */}
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Sidebar */}
      <div className="space-y-4 lg:col-span-1">
        <div className="h-56 animate-pulse rounded-3xl bg-white/70" />
        <div className="h-40 animate-pulse rounded-3xl bg-white/70" />
      </div>

      {/* Content */}
      <div className="space-y-6 lg:col-span-2">
        <div className="h-32 animate-pulse rounded-3xl bg-white/70" />
        <div className="h-40 animate-pulse rounded-3xl bg-white/70" />
        <div className="h-64 animate-pulse rounded-3xl bg-white/70" />
        <div className="h-48 animate-pulse rounded-3xl bg-white/70" />
      </div>
    </div>
  </motion.div>
);

export default ProfileSkeleton;
