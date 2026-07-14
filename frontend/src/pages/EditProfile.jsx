import React, { useEffect, useState } from "react";
import { updateProfile } from "../services/userServices";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { isFreelancer, isClient } from "../utils/roles";
import { Plus, Trash2, Loader2 } from "lucide-react";

function EditProfile() {
  const { dbUser, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const freelancer = dbUser?.freelancer || {};
  const client = dbUser?.client || {};

  const [form, setForm] = useState({
    // Common
    name: "",
    profileImage: "",
    bio: "",
    location: "",
    socialLinks: { linkedin: "", github: "", twitter: "", website: "" },
    // Freelancer
    headline: "",
    skills: "",
    hourlyRate: "",
    availability: "",
    languages: "",
    portfolio: [],
    experience: [],
    education: [],
    certifications: [],
    // Client
    company: "",
    organization: "",
    businessDescription: "",
    industry: "",
    website: "",
    hiringPreferences: {
      preferredSkills: "",
      budgetRange: "",
      engagementType: "Either",
      remoteOnly: false,
    },
  });

  // ── Initialise form from the user document ─────────────────────────
  useEffect(() => {
    if (!dbUser) return;

    setForm((prev) => ({
      ...prev,
      name: dbUser.name || "",
      profileImage: dbUser.profileImage || "",
      bio: dbUser.bio || "",
      location: dbUser.location || "",
      socialLinks: {
        linkedin: dbUser.socialLinks?.linkedin || "",
        github: dbUser.socialLinks?.github || "",
        twitter: dbUser.socialLinks?.twitter || "",
        website: dbUser.socialLinks?.website || "",
      },
      headline: freelancer.headline || "",
      skills: (freelancer.skills || []).join(", "),
      hourlyRate: freelancer.hourlyRate ?? "",
      availability: freelancer.availability || "",
      languages: (freelancer.languages || []).join(", "),
      portfolio: freelancer.portfolio || [],
      experience: freelancer.experience || [],
      education: freelancer.education || [],
      certifications: freelancer.certifications || [],
      company: client.company || "",
      organization: client.organization || "",
      businessDescription: client.businessDescription || "",
      industry: client.industry || "",
      website: client.website || "",
      hiringPreferences: {
        preferredSkills: (client.hiringPreferences?.preferredSkills || []).join(
          ", "
        ),
        budgetRange: client.hiringPreferences?.budgetRange || "",
        engagementType: client.hiringPreferences?.engagementType || "Either",
        remoteOnly: Boolean(client.hiringPreferences?.remoteOnly),
      },
    }));

    setLoading(false);
  }, [dbUser]); // eslint-disable-line

  // ── Generic field handler ───────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocial = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleHiring = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      hiringPreferences: {
        ...prev.hiringPreferences,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  // ── Dynamic array-item helpers (portfolio / experience / …) ─────────
  const updateListItem = (key, index, field, value) => {
    setForm((prev) => {
      const list = [...(prev[key] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [key]: list };
    });
  };

  const addListItem = (key, empty) => {
    setForm((prev) => ({ ...prev, [key]: [...(prev[key] || []), empty] }));
  };

  const removeListItem = (key, index) => {
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== index),
    }));
  };

  // ── Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);

    // Common payload (always sent)
    const payload = {
      name: form.name.trim(),
      profileImage: form.profileImage,
      bio: form.bio,
      location: form.location,
      socialLinks: form.socialLinks,
    };

    // Role-specific payload (only the active role's fields)
    if (isFreelancer(dbUser)) {
      payload.headline = form.headline;
      payload.skills = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      payload.hourlyRate = Number(form.hourlyRate) || 0;
      payload.availability = form.availability;
      payload.languages = form.languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      payload.portfolio = form.portfolio;
      payload.experience = form.experience;
      payload.education = form.education;
      payload.certifications = form.certifications;
    } else if (isClient(dbUser)) {
      payload.company = form.company;
      payload.organization = form.organization;
      payload.businessDescription = form.businessDescription;
      payload.industry = form.industry;
      payload.website = form.website;
      payload.hiringPreferences = {
        preferredSkills: form.hiringPreferences.preferredSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        budgetRange: form.hiringPreferences.budgetRange,
        engagementType: form.hiringPreferences.engagementType,
        remoteOnly: form.hiringPreferences.remoteOnly,
      };
    }

    try {
      await updateProfile(payload);
      await refreshProfile(); // reflect changes everywhere immediately
      alert("✅ Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">Edit Profile</h1>
        <p className="mb-8 text-sm text-slate-500">
          You are editing your{" "}
          <span className="font-semibold capitalize text-indigo-600">
            {dbUser?.role}
          </span>{" "}
          profile.
        </p>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── COMMON FIELDS ───────────────────────────────────────── */}
          <Section title="Basic Information">
            <Field label="Full Name">
              <input name="name" value={form.name} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Profile Image URL">
              <input name="profileImage" value={form.profileImage} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Location">
              <input name="location" value={form.location} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Bio">
              <textarea name="bio" rows={4} value={form.bio} onChange={handleChange} className={inputCls} />
            </Field>
          </Section>

          {/* ── FREELANCER FIELDS ───────────────────────────────────── */}
          {isFreelancer(dbUser) && (
            <Section title="Freelancer Details">
              <Field label="Professional Headline">
                <input name="headline" value={form.headline} onChange={handleChange} placeholder="e.g. Full-stack React & Node developer" className={inputCls} />
              </Field>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Skills (comma separated)">
                  <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" className={inputCls} />
                </Field>
                <Field label="Hourly Rate (₹)">
                  <input name="hourlyRate" type="number" value={form.hourlyRate} onChange={handleChange} className={inputCls} />
                </Field>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Availability">
                  <select name="availability" value={form.availability} onChange={handleChange} className={inputCls}>
                    <option value="">Select…</option>
                    <option value="Available">Available</option>
                    <option value="Partially Available">Partially Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </Field>
                <Field label="Languages (comma separated)">
                  <input name="languages" value={form.languages} onChange={handleChange} placeholder="English, Hindi" className={inputCls} />
                </Field>
              </div>

              <RepeatableList
                title="Portfolio"
                items={form.portfolio}
                empty={{ title: "", url: "", imageUrl: "", description: "" }}
                onAdd={() => addListItem("portfolio", { title: "", url: "", imageUrl: "", description: "" })}
                onRemove={(i) => removeListItem("portfolio", i)}
                fields={[
                  { key: "title", label: "Title", type: "text" },
                  { key: "url", label: "URL", type: "text" },
                  { key: "imageUrl", label: "Image URL", type: "text" },
                  { key: "description", label: "Description", type: "textarea" },
                ]}
                onField={(i, f, v) => updateListItem("portfolio", i, f, v)}
              />

              <RepeatableList
                title="Experience"
                items={form.experience}
                empty={{ title: "", company: "", startDate: "", endDate: "", current: false, description: "" }}
                onAdd={() => addListItem("experience", { title: "", company: "", startDate: "", endDate: "", current: false, description: "" })}
                onRemove={(i) => removeListItem("experience", i)}
                fields={[
                  { key: "title", label: "Role", type: "text" },
                  { key: "company", label: "Company", type: "text" },
                  { key: "startDate", label: "Start", type: "text" },
                  { key: "endDate", label: "End", type: "text" },
                  { key: "current", label: "Current role", type: "checkbox" },
                  { key: "description", label: "Description", type: "textarea" },
                ]}
                onField={(i, f, v) => updateListItem("experience", i, f, v)}
              />

              <RepeatableList
                title="Education"
                items={form.education}
                empty={{ school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" }}
                onAdd={() => addListItem("education", { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" })}
                onRemove={(i) => removeListItem("education", i)}
                fields={[
                  { key: "school", label: "School", type: "text" },
                  { key: "degree", label: "Degree", type: "text" },
                  { key: "fieldOfStudy", label: "Field", type: "text" },
                  { key: "startDate", label: "Start", type: "text" },
                  { key: "endDate", label: "End", type: "text" },
                ]}
                onField={(i, f, v) => updateListItem("education", i, f, v)}
              />

              <RepeatableList
                title="Certifications"
                items={form.certifications}
                empty={{ name: "", issuer: "", year: "", url: "" }}
                onAdd={() => addListItem("certifications", { name: "", issuer: "", year: "", url: "" })}
                onRemove={(i) => removeListItem("certifications", i)}
                fields={[
                  { key: "name", label: "Name", type: "text" },
                  { key: "issuer", label: "Issuer", type: "text" },
                  { key: "year", label: "Year", type: "text" },
                  { key: "url", label: "URL", type: "text" },
                ]}
                onField={(i, f, v) => updateListItem("certifications", i, f, v)}
              />
            </Section>
          )}

          {/* ── CLIENT FIELDS ───────────────────────────────────────── */}
          {isClient(dbUser) && (
            <Section title="Client / Company Details">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Company">
                  <input name="company" value={form.company} onChange={handleChange} className={inputCls} />
                </Field>
                <Field label="Organization">
                  <input name="organization" value={form.organization} onChange={handleChange} className={inputCls} />
                </Field>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Industry">
                  <input name="industry" value={form.industry} onChange={handleChange} className={inputCls} />
                </Field>
                <Field label="Website">
                  <input name="website" value={form.website} onChange={handleChange} className={inputCls} />
                </Field>
              </div>

              <Field label="Business Description">
                <textarea name="businessDescription" rows={4} value={form.businessDescription} onChange={handleChange} className={inputCls} />
              </Field>

              <Section title="Hiring Preferences" nested>
                <Field label="Preferred Skills (comma separated)">
                  <input
                    name="preferredSkills"
                    value={form.hiringPreferences.preferredSkills}
                    onChange={handleHiring}
                    className={inputCls}
                  />
                </Field>
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Budget Range">
                    <input
                      name="budgetRange"
                      value={form.hiringPreferences.budgetRange}
                      onChange={handleHiring}
                      placeholder="e.g. ₹10k - ₹50k"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Engagement Type">
                    <select
                      name="engagementType"
                      value={form.hiringPreferences.engagementType}
                      onChange={handleHiring}
                      className={inputCls}
                    >
                      <option value="Either">Either</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                  </Field>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="remoteOnly"
                    checked={form.hiringPreferences.remoteOnly}
                    onChange={handleHiring}
                  />
                  Remote only
                </label>
              </Section>
            </Section>
          )}

          {/* ── SOCIAL LINKS (all roles) ────────────────────────────── */}
          <Section title="Social Links">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="LinkedIn">
                <input name="linkedin" value={form.socialLinks.linkedin} onChange={handleSocial} className={inputCls} />
              </Field>
              <Field label="GitHub">
                <input name="github" value={form.socialLinks.github} onChange={handleSocial} className={inputCls} />
              </Field>
              <Field label="Twitter">
                <input name="twitter" value={form.socialLinks.twitter} onChange={handleSocial} className={inputCls} />
              </Field>
              <Field label="Website">
                <input name="website" value={form.socialLinks.website} onChange={handleSocial} className={inputCls} />
              </Field>
            </div>
          </Section>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Saving…
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Small presentational helpers ─────────────────────────────────────── */
const inputCls =
  "w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:outline-none";

const Section = ({ title, nested, children }) => (
  <div className={nested ? "" : "border-t border-slate-100 pt-6"}>
    <h2 className="mb-4 text-lg font-semibold text-slate-700">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">
      {label}
    </label>
    {children}
  </div>
);

const RepeatableList = ({ title, items, empty, onAdd, onRemove, fields, onField }) => (
  <div className="rounded-2xl border border-slate-200 p-4">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
      >
        <Plus size={14} /> Add
      </button>
    </div>

    {items.length === 0 && (
      <p className="text-sm text-slate-400">Nothing added yet.</p>
    )}

    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
            >
              <Trash2 size={12} /> Remove
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) =>
              f.type === "textarea" ? (
                <textarea
                  key={f.key}
                  rows={2}
                  placeholder={f.label}
                  value={item[f.key] || ""}
                  onChange={(e) => onField(i, f.key, e.target.value)}
                  className={inputCls}
                />
              ) : f.type === "checkbox" ? (
                <label key={f.key} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(item[f.key])}
                    onChange={(e) => onField(i, f.key, e.target.checked)}
                  />
                  {f.label}
                </label>
              ) : (
                <input
                  key={f.key}
                  type={f.type || "text"}
                  placeholder={f.label}
                  value={item[f.key] || ""}
                  onChange={(e) => onField(i, f.key, e.target.value)}
                  className={inputCls}
                />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EditProfile;