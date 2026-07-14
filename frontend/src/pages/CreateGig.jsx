import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, HelpCircle, Loader2 } from "lucide-react";
import { createJob } from "../services/jobsServices";

export default function CreateGig() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    experience: "Intermediate",
    workType: "Remote",
    duration: "Less than 1 month",
    deadline: "",
  });

  const [milestones, setMilestones] = useState([
    { title: "Initial Draft / Design", amount: "" },
  ]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const addMilestone = () => {
    setMilestones((prev) => [...prev, { title: "", amount: "" }]);
  };

  const removeMilestone = (index) => {
    if (milestones.length === 1) return;
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.description || !form.budget) {
      setError("Please fill out all required fields.");
      return;
    }

    const totalBudget = Number(form.budget);
    const milestonesSum = milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);

    if (milestonesSum !== totalBudget) {
      setError(`Milestone amounts (₹${milestonesSum}) must sum up to the total budget (₹${totalBudget}).`);
      return;
    }

    setLoading(true);

    try {
      const skillsArray = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const jobData = {
        ...form,
        budget: totalBudget,
        skills: skillsArray,
        milestones: milestones.map((m) => ({
          title: m.title,
          amount: Number(m.amount),
          status: "Pending",
        })),
      };

      await createJob(jobData);
      setSuccess("Gig posted successfully! Redirecting...");
      setTimeout(() => {
        navigate("/client/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create gig. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Post a New Gig</h1>
            <p className="text-slate-500 mt-1">Hire the best freelancers on SkillSphere</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-slate-600 hover:text-indigo-600 font-semibold transition"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Build a Full-Stack E-Commerce Platform"
                className="w-full rounded-xl border border-slate-200 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={6}
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the project requirements, deliverables, and scope..."
                className="w-full rounded-xl border border-slate-200 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Required Skills <span className="text-slate-400 font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Tailwind CSS, MongoDB"
                className="w-full rounded-xl border border-slate-200 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Grid for Budget, Exp, WorkType */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Total Budget (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="budget"
                  required
                  min="1"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="10000"
                  className="w-full rounded-xl border border-slate-200 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Experience Level
                </label>
                <select
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Work Type
                </label>
                <select
                  name="workType"
                  value={form.workType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 bg-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            {/* Grid for Duration, Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Project Duration
                </label>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 bg-white"
                >
                  <option value="Less than 1 month">Less than 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="More than 6 months">More than 6 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            {/* Milestones Sections */}
            <div className="border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Project Milestones</h3>
                  <div className="group relative">
                    <HelpCircle className="text-slate-400 cursor-pointer" size={16} />
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg">
                      Split your project into manageable phases. The total budget must be fully allocated to milestones.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Plus size={16} /> Add Milestone
                </button>
              </div>

              <div className="space-y-4">
                {milestones.map((m, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Milestone Description (e.g. Design Wireframes)"
                        value={m.title}
                        required
                        onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-indigo-500"
                      />
                    </div>
                    <div className="w-36 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={m.amount}
                        required
                        min="1"
                        onChange={(e) => handleMilestoneChange(index, "amount", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 py-3 pl-7 pr-3 outline-none transition focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      disabled={milestones.length === 1}
                      className="p-3 text-slate-400 hover:text-red-500 transition disabled:opacity-30"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-slate-100 bg-slate-50 px-8 py-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Posting...
                </>
              ) : (
                "Post Gig"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
