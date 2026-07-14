const mongoose = require("mongoose");

// Shared sub-schema for social links (common to every role)
const socialLinksSchema = new mongoose.Schema(
  {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { _id: false },
);

// ── Freelancer-only profile ────────────────────────────────────────────────
const portfolioItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    url: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: true },
);

const experienceItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { _id: true },
);

const educationItemSchema = new mongoose.Schema(
  {
    school: { type: String, default: "" },
    degree: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
  },
  { _id: true },
);

const certificationItemSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    issuer: { type: String, default: "" },
    year: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: true },
);

const freelancerSchema = new mongoose.Schema(
  {
    headline: { type: String, default: "" }, // e.g. "Full-stack React & Node developer"
    skills: [{ type: String }],
    hourlyRate: { type: Number, default: 0 },
    availability: {
      type: String,
      enum: ["", "Available", "Partially Available", "Unavailable"],
      default: "",
    },
    languages: [{ type: String }],
    portfolio: [portfolioItemSchema],
    experience: [experienceItemSchema],
    education: [educationItemSchema],
    certifications: [certificationItemSchema],
  },
  { _id: false },
);

// ── Client-only profile ────────────────────────────────────────────────────
const hiringPreferencesSchema = new mongoose.Schema(
  {
    preferredSkills: [{ type: String }],
    budgetRange: { type: String, default: "" }, // e.g. "₹10k - ₹50k"
    engagementType: {
      type: String,
      enum: ["", "Hourly", "Fixed", "Either"],
      default: "Either",
    },
    remoteOnly: { type: Boolean, default: false },
  },
  { _id: false },
);

const clientSchema = new mongoose.Schema(
  {
    company: { type: String, default: "" },
    organization: { type: String, default: "" },
    businessDescription: { type: String, default: "" },
    industry: { type: String, default: "" },
    website: { type: String, default: "" },
    hiringPreferences: hiringPreferencesSchema,
  },
  { _id: false },
);

// ── Admin-only profile (reserved for the future) ───────────────────────────
const adminSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["", "moderator", "admin", "superadmin"],
      default: "",
    },
    permissions: [{ type: String }],
  },
  { _id: false },
);

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  Main User schema
 *  One authentication account per real person. `role` selects which
 *  sub-document is active/visible. Common identity fields live at the top
 *  level so every role shares them.
 * ─────────────────────────────────────────────────────────────────────────
 */
const userSchema = new mongoose.Schema({
  authId: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true },
  name: { type: String, required: true },
  profileImage: { type: String, default: "" },

  // Single source of truth for the active role.
  role: {
    type: String,
    enum: ["client", "freelancer", "admin"],
    default: null,
  },

  // Common (shared) profile fields — relevant to every role
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  socialLinks: socialLinksSchema,

  // Role-specific profiles
  freelancer: freelancerSchema,
  client: clientSchema,
  admin: adminSchema,

  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
