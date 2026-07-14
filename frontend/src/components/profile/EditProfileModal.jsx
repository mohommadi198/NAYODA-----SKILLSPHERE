import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaXmark,
  FaPlus,
  FaTrash,
  FaUserPen,
  FaCode,
} from "react-icons/fa6";

/**
 * Modern, multi-section edit modal.
 *
 * Edits a deep copy of the normalised profile so the parent's state is only
 * mutated when the user clicks "Save". Each section exposes an edit button
 * in the profile UI that opens the modal focused on that section
 * (via the `initialSection` prop). The `onSave` callback receives the merged
 * profile and is where the backend call will live.
 *
 * @param {object} props
 * @param {boolean} props.open - Visibility.
 * @param {() => void} props.onClose - Close handler.
 * @param {object} props.profile - Normalised profile to edit.
 * @param {string} [props.initialSection] - Section key to open first.
 * @param {(profile:object) => void} props.onSave - Persist handler.
 */
const SECTION_TABS = {
  basics: { label: "Basics", Icon: FaUserPen },
  role: { label: "Role", Icon: FaCode },
};

const clone = (v) => JSON.parse(JSON.stringify(v));

const EditProfileModal = ({ open, onClose, profile, initialSection = "basics", onSave }) => {
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState(initialSection);
  const [saving, setSaving] = useState(false);

  // Reset the draft whenever the modal opens with a (possibly new) profile.
  useEffect(() => {
    if (open && profile) {
      setDraft(clone(profile));
      setActiveTab(SECTION_TABS[initialSection] ? initialSection : "basics");
    }
  }, [open, profile, initialSection]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const isFreelancer = draft?.role === "freelancer";
  const isClient = draft?.role === "client";

  // ── Generic field helpers ──────────────────────────────────────────────
  const setTop = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const setNested = (group, key, value) =>
    setDraft((d) => ({ ...d, [group]: { ...d[group], [key]: value } }));
  const setHiring = (key, value) =>
    setDraft((d) => ({
      ...d,
      client: { ...d.client, hiringPreferences: { ...d.client.hiringPreferences, [key]: value } },
    }));

  const updateArrayItem = (group, index, field, value) =>
    setDraft((d) => {
      const next = [...d[group]];
      next[index] = { ...next[index], [field]: value };
      return { ...d, [group]: next };
    });
  const addArrayItem = (group, blank) =>
    setDraft((d) => ({ ...d, [group]: [...d[group], { _id: Math.random().toString(36).slice(2), ...blank }] }));
  const removeArrayItem = (group, index) =>
    setDraft((d) => ({ ...d, [group]: d[group].filter((_, i) => i !== index) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.(draft);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const tabs = useMemo(() => {
    const t = [SECTION_TABS.basics];
    if (isFreelancer || isClient) t.push(SECTION_TABS.role);
    return t;
  }, [isFreelancer, isClient]);

  return (
    <AnimatePresence>
      {open && draft && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Edit profile"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
                aria-label="Close"
              >
                <FaXmark className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-100 px-4">
              {tabs.map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(label.toLowerCase())}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition ${
                    activeTab === label.toLowerCase()
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {activeTab === "basics" && (
                <div className="space-y-4">
                  <Field label="Full name">
                    <input className="input" value={draft.name} onChange={(e) => setTop("name", e.target.value)} />
                  </Field>
                  <Field label="Headline">
                    <input
                      className="input"
                      value={draft.freelancer?.headline || ""}
                      onChange={(e) => setNested("freelancer", "headline", e.target.value)}
                      placeholder="e.g. Product Designer & React Engineer"
                    />
                  </Field>
                  <Field label="Bio">
                    <textarea
                      rows={3}
                      className="input resize-none"
                      value={draft.bio}
                      onChange={(e) => setTop("bio", e.target.value)}
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Location">
                      <input className="input" value={draft.location} onChange={(e) => setTop("location", e.target.value)} />
                    </Field>
                    <Field label="Profile image URL">
                      <input
                        className="input"
                        value={draft.profileImage}
                        onChange={(e) => setTop("profileImage", e.target.value)}
                        placeholder="https://…"
                      />
                    </Field>
                  </div>
                  <Field label="Social links">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {["linkedin", "github", "twitter", "website"].map((k) => (
                        <input
                          key={k}
                          className="input capitalize"
                          placeholder={k}
                          value={draft.socialLinks?.[k] || ""}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, socialLinks: { ...d.socialLinks, [k]: e.target.value } }))
                          }
                        />
                      ))}
                    </div>
                  </Field>
                </div>
              )}

              {activeTab === "role" && isFreelancer && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Hourly rate ($)">
                      <input
                        type="number"
                        className="input"
                        value={draft.freelancer?.hourlyRate || 0}
                        onChange={(e) => setNested("freelancer", "hourlyRate", Number(e.target.value))}
                      />
                    </Field>
                    <Field label="Availability">
                      <select
                        className="input"
                        value={draft.freelancer?.availability || ""}
                        onChange={(e) => setNested("freelancer", "availability", e.target.value)}
                      >
                        <option value="">—</option>
                        <option value="Available">Available</option>
                        <option value="Partially Available">Partially Available</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Skills (comma separated)">
                    <input
                      className="input"
                      value={(draft.freelancer?.skills || []).join(", ")}
                      onChange={(e) =>
                        setNested(
                          "freelancer",
                          "skills",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </Field>

                  <Field label="Languages (comma separated)">
                    <input
                      className="input"
                      value={(draft.freelancer?.languages || []).join(", ")}
                      onChange={(e) =>
                        setNested(
                          "freelancer",
                          "languages",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </Field>

                  <ArrayEditor
                    title="Portfolio"
                    items={draft.freelancer?.portfolio || []}
                    onAdd={() => addArrayItem("freelancer.portfolio", { title: "", url: "", imageUrl: "", description: "" })}
                    addLabel="Add project"
                    fields={[
                      { key: "title", label: "Title", type: "text" },
                      { key: "url", label: "Project URL", type: "text" },
                      { key: "imageUrl", label: "Image URL", type: "text" },
                      { key: "description", label: "Description", type: "textarea" },
                    ]}
                    onChange={(g, i, f, v) => updateArrayItem("freelancer.portfolio", i, f, v)}
                    onRemove={(i) => removeArrayItem("freelancer.portfolio", i)}
                  />

                  <ArrayEditor
                    title="Experience"
                    items={draft.freelancer?.experience || []}
                    addLabel="Add role"
                    fields={[
                      { key: "title", label: "Title", type: "text" },
                      { key: "company", label: "Company", type: "text" },
                      { key: "startDate", label: "Start", type: "text" },
                      { key: "endDate", label: "End", type: "text" },
                      { key: "current", label: "Current", type: "checkbox" },
                      { key: "description", label: "Description", type: "textarea" },
                    ]}
                    onChange={(group, i, f, v) => updateArrayItem("freelancer.experience", i, f, v)}
                    onAdd={() =>
                      addArrayItem("freelancer.experience", {
                        title: "",
                        company: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                        description: "",
                      })
                    }
                    onRemove={(i) => removeArrayItem("freelancer.experience", i)}
                  />

                  <ArrayEditor
                    title="Education"
                    items={draft.freelancer?.education || []}
                    addLabel="Add education"
                    fields={[
                      { key: "school", label: "School", type: "text" },
                      { key: "degree", label: "Degree", type: "text" },
                      { key: "fieldOfStudy", label: "Field", type: "text" },
                      { key: "startDate", label: "Start", type: "text" },
                      { key: "endDate", label: "End", type: "text" },
                    ]}
                    onChange={(group, i, f, v) => updateArrayItem("freelancer.education", i, f, v)}
                    onAdd={() =>
                      addArrayItem("freelancer.education", {
                        school: "",
                        degree: "",
                        fieldOfStudy: "",
                        startDate: "",
                        endDate: "",
                      })
                    }
                    onRemove={(i) => removeArrayItem("freelancer.education", i)}
                  />

                  <ArrayEditor
                    title="Certifications"
                    items={draft.freelancer?.certifications || []}
                    addLabel="Add certification"
                    fields={[
                      { key: "name", label: "Name", type: "text" },
                      { key: "issuer", label: "Issuer", type: "text" },
                      { key: "year", label: "Year", type: "text" },
                      { key: "url", label: "URL", type: "text" },
                    ]}
                    onChange={(group, i, f, v) => updateArrayItem("freelancer.certifications", i, f, v)}
                    onAdd={() =>
                      addArrayItem("freelancer.certifications", { name: "", issuer: "", year: "", url: "" })
                    }
                    onRemove={(i) => removeArrayItem("freelancer.certifications", i)}
                  />
                </div>
              )}

              {activeTab === "role" && isClient && (
                <div className="space-y-4">
                  <Field label="Company">
                    <input
                      className="input"
                      value={draft.client?.company || ""}
                      onChange={(e) => setNested("client", "company", e.target.value)}
                    />
                  </Field>
                  <Field label="Organization">
                    <input
                      className="input"
                      value={draft.client?.organization || ""}
                      onChange={(e) => setNested("client", "organization", e.target.value)}
                    />
                  </Field>
                  <Field label="Industry">
                    <input
                      className="input"
                      value={draft.client?.industry || ""}
                      onChange={(e) => setNested("client", "industry", e.target.value)}
                    />
                  </Field>
                  <Field label="Website">
                    <input
                      className="input"
                      value={draft.client?.website || ""}
                      onChange={(e) => setNested("client", "website", e.target.value)}
                    />
                  </Field>
                  <Field label="Business description">
                    <textarea
                      rows={3}
                      className="input resize-none"
                      value={draft.client?.businessDescription || ""}
                      onChange={(e) => setNested("client", "businessDescription", e.target.value)}
                    />
                  </Field>
                  <Field label="Preferred skills (comma separated)">
                    <input
                      className="input"
                      value={(draft.client?.hiringPreferences?.preferredSkills || []).join(", ")}
                      onChange={(e) =>
                        setHiring(
                          "preferredSkills",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Budget range">
                      <input
                        className="input"
                        value={draft.client?.hiringPreferences?.budgetRange || ""}
                        onChange={(e) => setHiring("budgetRange", e.target.value)}
                      />
                    </Field>
                    <Field label="Engagement">
                      <select
                        className="input"
                        value={draft.client?.hiringPreferences?.engagementType || ""}
                        onChange={(e) => setHiring("engagementType", e.target.value)}
                      >
                        <option value="">—</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Either">Either</option>
                      </select>
                    </Field>
                    <Field label="Remote only">
                      <label className="flex h-[42px] items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={Boolean(draft.client?.hiringPreferences?.remoteOnly)}
                          onChange={(e) => setHiring("remoteOnly", e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                        />
                        Yes
                      </label>
                    </Field>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-indigo-300 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </motion.div>

          {/* Shared input styles injected once */}
          <style>{`.input{border:1px solid #e2e8f0;border-radius:0.75rem;padding:0.55rem 0.8rem;width:100%;font-size:0.875rem;color:#334155;outline:none;transition:border-color .15s,box-shadow .15s;}.input:focus{border-color:#a5b4fc;box-shadow:0 0 0 3px rgba(165,180,252,.25);}`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** Labelled field wrapper. */
const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
    {children}
  </label>
);

/**
 * Reusable array editor (portfolio / experience / education / certifications).
 * Renders each item as a collapsible card with remove + add controls.
 */
const ArrayEditor = ({ title, items, fields, onChange, onAdd, onRemove, addLabel = "Add" }) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-semibold text-slate-600">{title}</span>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
      >
        <FaPlus className="h-3 w-3" /> {addLabel}
      </button>
    </div>
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item._id || i} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Item {i + 1}</span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 transition hover:text-rose-600"
            >
              <FaTrash className="h-3 w-3" /> Remove
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.key} className={f.type === "textarea" ? "sm:col-span-2 block" : "block"}>
                <span className="mb-1 block text-xs text-slate-500">{f.label}</span>
                {f.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(item[f.key])}
                    onChange={(e) => onChange("x", i, f.key, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                  />
                ) : f.type === "textarea" ? (
                  <textarea
                    rows={2}
                    className="input resize-none"
                    value={item[f.key] || ""}
                    onChange={(e) => onChange("x", i, f.key, e.target.value)}
                  />
                ) : (
                  <input
                    type={f.type || "text"}
                    className="input"
                    value={item[f.key] || ""}
                    onChange={(e) => onChange("x", i, f.key, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-200 py-4 text-center text-xs text-slate-400">
          Nothing added yet.
        </p>
      )}
    </div>
  </div>
);

export default EditProfileModal;
