import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileSidebar from "./ProfileSidebar";
import CompanyCard from "./CompanyCard";
import HiringPreferences from "./HiringPreferences";
import RecentJobs from "./RecentJobs";

/**
 * Client profile layout.
 *
 * Composition:
 *   - Cover + identity header (shared)
 *   - Sticky sidebar (completion ring + details)
 *   - Company card + Hiring preferences + Recent jobs
 *
 * @param {object} props
 * @param {object} props.profile - Normalised profile.
 * @param {boolean} props.isOwnProfile
 * @param {boolean} [props.online]
 * @param {(section?:string)=>void} props.onEdit - Open edit modal (optional section).
 * @param {() => void} props.onShare
 * @param {() => void} props.onMessage
 * @param {() => void} props.onDownloadResume
 * @param {number} props.completion
 * @param {Array} [props.jobs] - Recent job postings.
 */
const ClientProfile = ({
  profile,
  isOwnProfile,
  online = false,
  onEdit,
  onShare,
  onMessage,
  onDownloadResume,
  completion,
  jobs = [],
}) => (
  <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-12">
    <ProfileHeader
      profile={profile}
      isOwnProfile={isOwnProfile}
      online={online}
      onEdit={isOwnProfile ? () => onEdit?.() : undefined}
      onShare={onShare}
      onMessage={onMessage}
      onDownloadResume={onDownloadResume}
    />

    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <ProfileSidebar profile={profile} completion={completion} online={online} />

      <div className="space-y-6 lg:col-span-2">
        <CompanyCard client={profile.client} onEdit={isOwnProfile ? () => onEdit?.("role") : undefined} />
        <HiringPreferences
          preferences={profile.client?.hiringPreferences}
          onEdit={isOwnProfile ? () => onEdit?.("role") : undefined}
        />
        <RecentJobs jobs={jobs} />
      </div>
    </div>
  </div>
);

export default ClientProfile;
