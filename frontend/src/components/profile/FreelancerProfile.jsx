import React from "react";
import { motion } from "framer-motion";
import { FaSackDollar, FaLanguage, FaCircleCheck, FaGlobe } from "react-icons/fa6";
import ProfileHeader from "./ProfileHeader";
import ProfileSidebar from "./ProfileSidebar";
import ProfileStats from "./ProfileStats";
import SkillsSection from "./SkillsSection";
import PortfolioGrid from "./PortfolioGrid";
import ExperienceTimeline from "./ExperienceTimeline";
import EducationSection from "./EducationSection";
import CertificationSection from "./CertificationSection";
import { AVAILABILITY_META } from "./profileUtils";

/** Availability pill shown in the overview. */
const AvailabilityPill = ({ availability }) => {
  const meta = AVAILABILITY_META[availability] || AVAILABILITY_META[""];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}>
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
      {availability || "Availability not set"}
    </span>
  );
};

/**
 * Freelancer profile layout.
 *
 * Composition:
 *   - Cover + identity header (shared)
 *   - Overview card (headline / availability / rate / languages)
 *   - Sticky sidebar (completion ring + details)
 *   - Stats grid + Skills + Portfolio + Experience + Education + Certifications
 *
 * @param {object} props
 * @param {object} props.profile - Normalised profile.
 * @param {boolean} props.isOwnProfile
 * @param {boolean} [props.online]
 * @param {(section?:string)=>void} props.onEdit - Open edit modal (optional section).
 * @param {() => void} props.onShare
 * @param {() => void} props.onMessage
 * @param {() => void} props.onHire
 * @param {() => void} props.onDownloadResume
 * @param {number} props.completion
 */
const FreelancerProfile = ({
  profile,
  isOwnProfile,
  online = false,
  onEdit,
  onShare,
  onMessage,
  onHire,
  onDownloadResume,
  completion,
}) => {
  const f = profile.freelancer || {};

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        online={online}
        onEdit={isOwnProfile ? () => onEdit?.() : undefined}
        onShare={onShare}
        onMessage={onMessage}
        onHire={onHire}
        onDownloadResume={onDownloadResume}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sticky sidebar */}
        <ProfileSidebar profile={profile} completion={completion} online={online} />

        {/* Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Professional overview */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-xl sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {f.headline || "Professional headline"}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <AvailabilityPill availability={f.availability} />
                  {f.hourlyRate > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      <FaSackDollar className="h-3.5 w-3.5" /> ${f.hourlyRate}/hr
                    </span>
                  )}
                </div>
              </div>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => onEdit?.("basics")}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  Edit
                </button>
              )}
            </div>

            {f.languages?.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                  <FaLanguage className="h-4 w-4 text-indigo-400" /> Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {f.languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      <FaGlobe className="h-3 w-3 text-slate-400" /> {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.section>

          <ProfileStats profile={profile} />

          <SkillsSection skills={f.skills} onEdit={isOwnProfile ? () => onEdit?.("role") : undefined} />
          <PortfolioGrid items={f.portfolio} onEdit={isOwnProfile ? () => onEdit?.("role") : undefined} />
          <ExperienceTimeline items={f.experience} onEdit={isOwnProfile ? () => onEdit?.("role") : undefined} />
          <EducationSection items={f.education} onEdit={isOwnProfile ? () => onEdit?.("role") : undefined} />
          <CertificationSection items={f.certifications} onEdit={isOwnProfile ? () => onEdit?.("role") : undefined} />
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
