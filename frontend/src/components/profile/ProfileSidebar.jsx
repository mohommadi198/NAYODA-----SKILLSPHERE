import React from "react";
import { motion } from "framer-motion";
import { FaLocationDot, FaEnvelope, FaCircleCheck, FaCalendarDays } from "react-icons/fa6";
import ProfileCompletionRing from "./ProfileCompletionRing";
import { formatMemberSince, getRoleLabel } from "./profileUtils";

/** A single meta row inside the sidebar. */
const MetaRow = ({ icon: Icon, label, value, href }) => {
  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-right font-medium text-indigo-600 hover:underline">
      {value}
    </a>
  ) : (
    <span className="text-right font-medium text-slate-700">{value}</span>
  );
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4 text-slate-400" />
        {label}
      </span>
      {content}
    </div>
  );
};

/**
 * Sticky profile sidebar. Shows profile completion, verification status,
 * and key identity meta (location / email / role / joined date).
 *
 * @param {object} props
 * @param {object} props.profile - Normalised profile.
 * @param {number} props.completion - 0–100 completion score.
 * @param {boolean} [props.online] - Live presence indicator.
 */
const ProfileSidebar = ({ profile, completion, online = false }) => (
  <motion.aside
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="lg:sticky lg:top-24 space-y-6"
  >
    {/* Completion card */}
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 text-center shadow-xl shadow-indigo-100/50 backdrop-blur-xl">
      <ProfileCompletionRing value={completion} />
      <p className="mt-3 text-sm text-slate-500">
        Complete your profile to get 3× more invites.
      </p>
    </div>

    {/* Details card */}
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-xl">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-400">
        Details
      </h3>
      <div className="divide-y divide-slate-100">
        <div className="flex items-center justify-between py-2.5">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <FaCircleCheck className="h-4 w-4 text-slate-400" />
            Verification
          </span>
          {profile.isVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <FaCircleCheck className="h-3 w-3" /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              Pending
            </span>
          )}
        </div>

        <MetaRow icon={FaLocationDot} label="Location" value={profile.location || "—"} />
        <MetaRow
          icon={FaEnvelope}
          label="Email"
          value={profile.email || "—"}
          href={profile.email ? `mailto:${profile.email}` : undefined}
        />
        <MetaRow icon={FaCircleCheck} label="Role" value={getRoleLabel(profile.role)} />
        <MetaRow
          icon={FaCalendarDays}
          label="Joined"
          value={formatMemberSince(profile.createdAt)}
        />
        {online && (
          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Status
            </span>
            <span className="text-right text-sm font-medium text-emerald-600">Online</span>
          </div>
        )}
      </div>
    </div>
  </motion.aside>
);

export default ProfileSidebar;
