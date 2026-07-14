import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import MessageButton from "../components/MessageButton";
import { 
  getJobById, 
  activateMilestone, 
  submitMilestone, 
  approveMilestone, 
  requestChangesMilestone, 
  resubmitMilestone, 
  payMilestone 
} from "../services/jobsServices";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowLeft, 
  MessageSquare,
  Sparkles
} from "lucide-react";

export default function ProjectWorkspace() {
  const { jobId } = useParams();
  const { dbUser } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);

  const fetchJobDetails = async () => {
    try {
      const data = await getJobById(jobId);
      setJob(data?.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load project workspace details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const handleActivate = async (milestoneId) => {
    try {
      await activateMilestone(jobId, milestoneId);
      alert("Milestone activated!");
      fetchJobDetails();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmitMilestone = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;

    try {
      await submitMilestone(jobId, selectedMilestoneId, { freelancerNotes: notes });
      alert("Milestone submitted successfully!");
      setSubmitModalOpen(false);
      setNotes("");
      fetchJobDetails();
    } catch (err) {
      alert("Error submitting: " + (err.response?.data?.message || err.message));
    }
  };

  const handleApprove = async (milestoneId) => {
    try {
      await approveMilestone(jobId, milestoneId);
      alert("Milestone approved!");
      fetchJobDetails();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRequestChanges = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    try {
      await requestChangesMilestone(jobId, selectedMilestoneId, { feedback });
      alert("Changes requested successfully.");
      setChangesModalOpen(false);
      setFeedback("");
      fetchJobDetails();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleResubmit = async (milestoneId) => {
    try {
      await resubmitMilestone(jobId, milestoneId);
      alert("Milestone resubmitted!");
      fetchJobDetails();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handlePay = async (milestoneId) => {
    try {
      await payMilestone(jobId, milestoneId);
      alert("Payment released successfully!");
      fetchJobDetails();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-slate-500 bg-slate-50 gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-xl font-bold text-slate-800">{error || "Project Not Found"}</h2>
        <button onClick={() => navigate(-1)} className="text-indigo-600 font-semibold">Go Back</button>
      </div>
    );
  }

  const isClient = dbUser.role === "client";
  const isFreelancer = dbUser.role === "freelancer";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Back and Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <MessageButton
            recipientId={isClient ? job?.freelancer?._id : job?.client?._id}
            projectId={job?._id}
            label={`Message ${isClient ? "Freelancer" : "Client"}`}
          />
        </div>

        {/* Project Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Active Contract
              </span>
              <span className="text-slate-400 text-xs">Gigs ID: {job._id}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
            <p className="text-slate-600 text-sm">{job.description}</p>
          </div>

          <div className="shrink-0 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-center min-w-[180px]">
            <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider">Contract Budget</p>
            <p className="text-3xl font-extrabold text-indigo-950 mt-1">₹{job.budget}</p>
          </div>
        </div>

        {/* Milestones Management */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={22} />
            <h2 className="text-xl font-bold text-slate-900">Project Workspace Milestones</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {job.milestones?.map((m, index) => {
              return (
                <div key={m._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left phase info */}
                  <div className="flex-1 flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-extrabold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-950">{m.title}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          m.status === "Pending" ? "bg-slate-100 text-slate-500" :
                          m.status === "Active" ? "bg-indigo-100 text-indigo-700" :
                          m.status === "Submitted" ? "bg-amber-100 text-amber-700" :
                          m.status === "Changes Requested" ? "bg-rose-100 text-rose-700" :
                          m.status === "Approved" ? "bg-cyan-100 text-cyan-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-bold">Allocated Release Budget: ₹{m.amount}</p>
                      
                      {/* Notes / Feedback */}
                      {m.freelancerNotes && (
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                          <p className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                            <FileText size={12} /> Freelancer Submission Notes:
                          </p>
                          <p className="text-slate-600 font-medium whitespace-pre-line">{m.freelancerNotes}</p>
                        </div>
                      )}

                      {m.clientFeedback && (
                        <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100/50 text-xs">
                          <p className="font-bold text-rose-700 flex items-center gap-1.5 mb-1">
                            <AlertCircle size={12} /> Client Feedback:
                          </p>
                          <p className="text-rose-600 font-medium whitespace-pre-line">{m.clientFeedback}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="shrink-0 flex items-center gap-3 border-t lg:border-t-0 pt-4 lg:pt-0">
                    {/* CLIENT ACTIONS */}
                    {isClient && (
                      <>
                        {m.status === "Pending" && (
                          <button
                            onClick={() => handleActivate(m._id)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                          >
                            Activate Milestone
                          </button>
                        )}
                        {m.status === "Submitted" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedMilestoneId(m._id);
                                setChangesModalOpen(true);
                              }}
                              className="px-4 py-2 hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-lg transition"
                            >
                              Request Changes
                            </button>
                            <button
                              onClick={() => handleApprove(m._id)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                            >
                              Approve Milestone
                            </button>
                          </div>
                        )}
                        {m.status === "Approved" && (
                          <button
                            onClick={() => handlePay(m._id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                          >
                            Release Payment
                          </button>
                        )}
                      </>
                    )}

                    {/* FREELANCER ACTIONS */}
                    {isFreelancer && (
                      <>
                        {m.status === "Active" && (
                          <button
                            onClick={() => {
                              setSelectedMilestoneId(m._id);
                              setSubmitModalOpen(true);
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                          >
                            Submit Deliverable
                          </button>
                        )}
                        {m.status === "Changes Requested" && (
                          <button
                            onClick={() => handleResubmit(m._id)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                          >
                            Resubmit Work
                          </button>
                        )}
                      </>
                    )}

                    {m.status === "Paid" && (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-extrabold uppercase">
                        <CheckCircle2 size={16} /> Paid Released
                      </span>
                    )}

                    {/* Default Status Info */}
                    {((isClient && m.status === "Active") || (isClient && m.status === "Changes Requested") || (isFreelancer && m.status === "Pending") || (isFreelancer && m.status === "Submitted") || (isFreelancer && m.status === "Approved")) && (
                      <span className="flex items-center gap-1 text-slate-400 text-xs font-bold italic">
                        <Clock size={14} /> Waiting
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FREELANCER SUBMIT DELIVERABLE MODAL */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Submit Milestone Deliverable</h3>
            </div>
            <form onSubmit={handleSubmitMilestone} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Submission Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide links to files, GitHub repository, or describe details of your completed work..."
                  className="w-full rounded-xl border border-slate-200 p-3 outline-none text-sm transition focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Submit Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT REQUEST CHANGES MODAL */}
      {changesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Request Changes</h3>
            </div>
            <form onSubmit={handleRequestChanges} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Change Request Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Explain what adjustments or corrections are needed before this milestone can be approved..."
                  className="w-full rounded-xl border border-slate-200 p-3 outline-none text-sm transition focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setChangesModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
