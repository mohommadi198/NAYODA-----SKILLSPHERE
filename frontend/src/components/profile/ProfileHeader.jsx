import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaCircleCheck,
  FaLocationDot,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGlobe,
  FaPen,
  FaShare,
  FaMessage,
  FaHandshake,
  FaDownload,
} from "react-icons/fa6";
import { getInitials, getAvatarUrl, formatMemberSince, ROLE_META, isValidUrl } from "./profileUtils";

/** Social link metadata used to render icons + safe anchors. */
const SOCIALS = [
  { key: "linkedin", Icon: FaLinkedin, label: "LinkedIn" },
  { key: "github", Icon: FaGithub, label: "GitHub" },
  { key: "twitter", Icon: FaTwitter, label: "Twitter" },
  { key: "website", Icon: FaGlobe, label: "Website" },
];

/**
 * Common profile header rendered for every role.
 *
 * Layout: gradient cover banner → overlapping circular avatar (with an
 * online-status dot) → name + verified badge + role pill → location /
 * member-since meta → bio → social links → action buttons.
 *
 * @param {object} props
 * @param {object} props.profile - Normalised profile.
 * @param {boolean} [props.isOwnProfile] - Controls Edit vs Message/Hire.
 * @param {boolean} [props.online] - Live presence indicator.
 * @param {() => void} [props.onEdit] - Owner: open edit modal.
 * @param {() => void} [props.onShare] - Copy profile link.
 * @param {() => void} [props.onMessage] - Start a conversation.
 * @param {() => void} [props.onHire] - Hire (freelancer only).
 * @param {() => void} [props.onDownloadResume] - Trigger resume download.
 */
const ProfileHeader = ({
  profile,
  isOwnProfile = false,
  online = false,
  onEdit,
  onShare,
  onMessage,
  onHire,
  onDownloadResume,
}) => {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleImgError = useCallback(() => setImgError(true), []);
  const handleShare = useCallback(() => {
    onShare?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [onShare]);

  const showImage = profile.profileImage && !imgError;
  const avatarFallback = getAvatarUrl(profile.name);
  const role = ROLE_META[profile.role] || ROLE_META.client;
  const isFreelancer = profile.role === "freelancer";

  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-xl shadow-indigo-100/50 backdrop-blur-xl"
    >
      {/* Cover banner */}
      <div className="relative h-36 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 sm:h-48">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35)_0,transparent_42%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.25)_0,transparent_38%)]"
          aria-hidden="true"
        />
        {isOwnProfile && onDownloadResume && (
          <button
            type="button"
            onClick={onDownloadResume}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <FaDownload className="h-3.5 w-3.5" />
            Resume
          </button>
        )}
      </div>

      <div className="px-5 pb-6 pt-0 sm:px-8">
        {/* Avatar + name row */}
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative">
              {showImage ? (
                <img
                  src={profile.profileImage}
                  alt={`${profile.name} profile picture`}
                  onError={handleImgError}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl font-bold text-white shadow-lg sm:h-28 sm:w-28">
                  {getInitials(profile.name)}
                </div>
              )}
              {/* Online / availability dot */}
              <span
                className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${
                  online ? "bg-emerald-500" : "bg-slate-300"
                }`}
                title={online ? "Online" : "Offline"}
                aria-label={online ? "Online" : "Offline"}
              />
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {profile.name}
                </h1>
                {profile.isVerified && (
                  <span title="Verified" className="text-indigo-500">
                    <FaCircleCheck className="h-5 w-5" />
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white shadow-sm ${role.gradient}`}
                >
                  {role.label}
                </span>
                {profile.location && (
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <FaLocationDot className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                )}
                <span className="text-sm text-slate-400">
                  Member since {formatMemberSince(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {isOwnProfile ? (
              <>
                {onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <FaPen className="h-3.5 w-3.5" />
                    Edit Profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <FaShare className="h-3.5 w-3.5" />
                  {copied ? "Copied!" : "Share"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onShare}
                  className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <FaShare className="h-3.5 w-3.5" />
                  {copied ? "Copied!" : "Share"}
                </button>
                {onMessage && (
                  <button
                    type="button"
                    onClick={onMessage}
                    className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <FaMessage className="h-3.5 w-3.5" />
                    Message
                  </button>
                )}
                {isFreelancer && onHire && (
                  <button
                    type="button"
                    onClick={onHire}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <FaHandshake className="h-3.5 w-3.5" />
                    Hire
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-slate-600">
            {profile.bio}
          </p>
        )}

        {/* Social links */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {SOCIALS.map(({ key, Icon, label }) => {
            const url = profile.socialLinks?.[key];
            if (!url) return null;
            const safe = isValidUrl(url);
            return (
              <a
                key={key}
                href={safe ? url : undefined}
                target={safe ? "_blank" : undefined}
                rel={safe ? "noopener noreferrer" : undefined}
                onClick={(e) => !safe && e.preventDefault()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                title={label}
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600"
              title="Email"
              aria-label="Email"
            >
              <FaEnvelope className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{profile.email}</span>
            </a>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default ProfileHeader;
