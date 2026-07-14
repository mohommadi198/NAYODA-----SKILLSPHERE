/**
 * Normalisation + formatting helpers for the unified User profile.
 *
 * The backend returns a single User document whose `role` selects which
 * sub-document (freelancer / client / admin) is active. These helpers
 * flatten that document into a guaranteed-shape object the UI can render
 * without defensive optional chaining, while preserving the raw
 * role-specific sub-objects for the dedicated section components.
 */

const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;

/** True for a valid MongoDB ObjectId (used to short-circuit bad ?userId values). */
export const isValidObjectId = (id) =>
  typeof id === "string" && OBJECT_ID_RE.test(id);

const asArray = (v) => (Array.isArray(v) ? v : []);
const asString = (v) => (typeof v === "string" ? v : "");
const asBool = (v) => Boolean(v);
const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Validate that a string is a safe http(s) URL before rendering it as a link. */
export const isValidUrl = (url) => {
  if (typeof url !== "string" || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/** Two-letter initials for the avatar fallback. */
export const getInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/** Deterministic avatar placeholder derived from the user's name. */
export const getAvatarUrl = (name = "User") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=4F46E5&color=ffffff&bold=true&size=256`;

/** Human-friendly "Member since" label. */
export const formatMemberSince = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

/** Format a single date string/object as "Mon YYYY" (falls back to the raw value). */
export const formatExperienceDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return String(value);
};

/** Build a human date range, e.g. "Jan 2020 — Present". */
export const formatDateRange = (start, end, current) => {
  const s = formatExperienceDate(start);
  const e = current ? "Present" : formatExperienceDate(end);
  if (s && e) return `${s} — ${e}`;
  if (s) return s;
  if (e) return e;
  return "";
};

/** Visual metadata (label + gradient) for each role. */
export const ROLE_META = {
  client: { label: "Client", gradient: "from-sky-500 to-blue-600" },
  freelancer: { label: "Freelancer", gradient: "from-violet-500 to-fuchsia-600" },
  admin: { label: "Admin", gradient: "from-amber-500 to-orange-600" },
};

/** Map an availability enum value to a colour + label. */
export const AVAILABILITY_META = {
  Available: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200" },
  "Partially Available": { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200" },
  Unavailable: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50", ring: "ring-rose-200" },
  "": { dot: "bg-slate-400", text: "text-slate-500", bg: "bg-slate-100", ring: "ring-slate-200" },
};

export const getRoleLabel = (role) => ROLE_META[role]?.label ?? "Member";

/**
 * Flatten a raw User document into a normalised profile object.
 * Returns null for falsy input. Every array / nested object is guaranteed
 * to exist so section components can map without null checks.
 *
 * @param {object} raw - Raw document from the API (or mock data).
 * @returns {object|null}
 */
export const normalizeProfile = (raw) => {
  if (!raw) return null;

  const social = raw.socialLinks || {};
  const freelancer = raw.freelancer || {};
  const client = raw.client || {};
  const hiring = client.hiringPreferences || {};

  return {
    id: raw._id || raw.id || "",
    authId: asString(raw.authId),
    name: asString(raw.name).trim() || "Unnamed User",
    email: asString(raw.email),
    profileImage: asString(raw.profileImage),
    role: asString(raw.role) || null,
    bio: asString(raw.bio),
    location: asString(raw.location),
    isVerified: asBool(raw.isVerified),
    isBanned: asBool(raw.isBanned),
    createdAt: raw.createdAt || null,
    socialLinks: {
      linkedin: asString(social.linkedin),
      github: asString(social.github),
      twitter: asString(social.twitter),
      website: asString(social.website),
    },
    freelancer: {
      headline: asString(freelancer.headline),
      skills: asArray(freelancer.skills).map(asString).filter(Boolean),
      hourlyRate: asNumber(freelancer.hourlyRate),
      availability: asString(freelancer.availability),
      languages: asArray(freelancer.languages).map(asString).filter(Boolean),
      portfolio: asArray(freelancer.portfolio).map((p) => ({
        _id: p?._id || Math.random().toString(36).slice(2),
        title: asString(p?.title),
        url: asString(p?.url),
        imageUrl: asString(p?.imageUrl),
        description: asString(p?.description),
      })),
      experience: asArray(freelancer.experience).map((e) => ({
        _id: e?._id || Math.random().toString(36).slice(2),
        title: asString(e?.title),
        company: asString(e?.company),
        startDate: asString(e?.startDate),
        endDate: asString(e?.endDate),
        current: asBool(e?.current),
        description: asString(e?.description),
      })),
      education: asArray(freelancer.education).map((e) => ({
        _id: e?._id || Math.random().toString(36).slice(2),
        school: asString(e?.school),
        degree: asString(e?.degree),
        fieldOfStudy: asString(e?.fieldOfStudy),
        startDate: asString(e?.startDate),
        endDate: asString(e?.endDate),
      })),
      certifications: asArray(freelancer.certifications).map((c) => ({
        _id: c?._id || Math.random().toString(36).slice(2),
        name: asString(c?.name),
        issuer: asString(c?.issuer),
        year: asString(c?.year),
        url: asString(c?.url),
      })),
    },
    client: {
      company: asString(client.company),
      organization: asString(client.organization),
      businessDescription: asString(client.businessDescription),
      industry: asString(client.industry),
      website: asString(client.website),
      hiringPreferences: {
        preferredSkills: asArray(hiring.preferredSkills).map(asString).filter(Boolean),
        budgetRange: asString(hiring.budgetRange),
        engagementType: asString(hiring.engagementType),
        remoteOnly: asBool(hiring.remoteOnly),
      },
    },
    // Allow the backend to inject real analytics; otherwise we show placeholders.
    stats: raw.stats || null,
  };
};

/** Deterministic seed from a string (stable mock numbers per user). */
const seedFromId = (id = "") => {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
};

/**
 * Return analytics for a profile. Uses real `stats` when present, otherwise
 * returns stable, plausible placeholder values (per the design spec).
 *
 * @param {object} profile - Normalised profile.
 */
export const getProfileStats = (profile) => {
  if (profile?.stats) return profile.stats;
  const seed = seedFromId(profile?.id || profile?.name || "skillsphere");
  const rating = (3.8 + (seed % 12) / 10).toFixed(1); // 3.8 – 4.9
  return {
    projectsCompleted: 40 + (seed % 160),
    profileViews: 1200 + (seed % 8800),
    responseRate: 90 + (seed % 10), // 90 – 99 %
    successRate: 95 + (seed % 5), // 95 – 99 %
    rating: Number(rating),
    reviews: 12 + (seed % 120),
  };
};

/**
 * Compute a 0–100 profile-completion score from the fields that are present.
 * Drives the circular progress ring in the sidebar.
 *
 * @param {object} profile - Normalised profile.
 * @returns {number}
 */
export const computeProfileCompletion = (profile) => {
  if (!profile) return 0;
  const socialOk = Boolean(
    profile.socialLinks?.linkedin ||
      profile.socialLinks?.github ||
      profile.socialLinks?.twitter ||
      profile.socialLinks?.website
  );
  const roleChecks =
    profile.role === "freelancer"
      ? [
          Boolean(profile.freelancer?.headline),
          profile.freelancer?.skills?.length > 0,
          profile.freelancer?.hourlyRate > 0,
          Boolean(
            profile.freelancer?.portfolio?.length ||
              profile.freelancer?.experience?.length ||
              profile.freelancer?.education?.length
          ),
        ]
      : [
          Boolean(profile.client?.company),
          Boolean(profile.client?.businessDescription),
          Boolean(profile.client?.industry),
          profile.client?.hiringPreferences?.preferredSkills?.length > 0,
        ];

  const checks = [
    Boolean(profile.profileImage),
    Boolean(profile.bio),
    Boolean(profile.location),
    socialOk,
    ...roleChecks,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
};

/**
 * Convert a normalised profile back into the API payload shape expected by
 * `PUT /users/profile`. Only the editable top-level + role sub-documents.
 *
 * @param {object} p - Normalised profile.
 */
export const toApiPayload = (p) => ({
  name: p.name,
  profileImage: p.profileImage,
  bio: p.bio,
  location: p.location,
  socialLinks: p.socialLinks,
  freelancer: p.freelancer,
  client: p.client,
});
