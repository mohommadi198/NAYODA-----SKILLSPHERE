import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyJobs } from "../services/jobsServices";
import { getJobProposals, acceptProposal, rejectProposal } from "../services/proposalServices";
import MessageButton from "../components/MessageButton";
import { 
  Plus, 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText
} from "lucide-react";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [proposalsMap, setProposalsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs' or 'proposals'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const jobsData = await getMyJobs();
        const jobsList = jobsData.data || [];
        setJobs(jobsList);

        // Fetch proposals for all open jobs
        const proposalsPromises = jobsList
          .filter((job) => job.status === "Open")
          .map(async (job) => {
            try {
              const props = await getJobProposals(job._id);
              return { jobId: job._id, proposals: props };
            } catch (err) {
              return { jobId: job._id, proposals: [] };
            }
          });

        const proposalsResults = await Promise.all(proposalsPromises);
        const pMap = {};
        proposalsResults.forEach((res) => {
          pMap[res.jobId] = res.proposals;
        });
        setProposalsMap(pMap);
      } catch (err) {
        console.error("Error loading client dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAcceptProposal = async (proposalId, jobId) => {
    if (!window.confirm("Are you sure you want to accept this proposal? This will hire the freelancer and set the gig to In Progress.")) return;
    try {
      await acceptProposal(proposalId);
      alert("Proposal accepted successfully!");
      // Reload dashboard data
      window.location.reload();
    } catch (err) {
      alert("Failed to accept proposal: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectProposal = async (proposalId) => {
    if (!window.confirm("Are you sure you want to reject this proposal?")) return;
    try {
      await rejectProposal(proposalId);
      alert("Proposal rejected.");
      // Reload dashboard data
      window.location.reload();
    } catch (err) {
      alert("Failed to reject proposal.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Calculate statistics
  const totalPosted = jobs.length;
  const inProgressJobs = jobs.filter(j => j.status === "In Progress" || j.status === "in-progress").length;
  const openJobs = jobs.filter(j => j.status === "Open" || j.status === "open").length;
  const totalProposals = Object.values(proposalsMap).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Client Hub</h1>
              <p className="text-slate-500 mt-1">Manage your active projects, budgets, and hire freelancers.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/create-gig"
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 font-semibold shadow-lg shadow-indigo-100 transition-all"
              >
                <Plus size={20} /> Post a Gig
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Stats Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Posted Gigs</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalPosted}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Active Contracts</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{inProgressJobs}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Open Job Gigs</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{openJobs}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Proposals</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalProposals}</h3>
            </div>
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 transition ${
              activeTab === "jobs"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            My Projects & Jobs ({totalPosted})
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 transition ${
              activeTab === "proposals"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Candidate Proposals ({totalProposals})
          </button>
        </div>

        {/* Tab 1: My Jobs list */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            {jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <Briefcase className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-slate-900">No gigs posted yet</h3>
                <p className="text-slate-500 text-sm mt-1">Post a gig to hire talented freelancers.</p>
                <Link to="/create-gig" className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 font-bold text-sm">
                  Create a Gig Now &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {jobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          job.status === "Open" ? "bg-amber-100 text-amber-700" :
                          job.status === "In Progress" || job.status === "in-progress" ? "bg-indigo-100 text-indigo-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {job.status}
                        </span>
                        <span className="text-slate-400 text-xs">{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition">
                        {job.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {job.skills.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Project Budget</p>
                        <p className="text-lg font-bold text-slate-900 mt-0.5">₹{job.budget}</p>
                      </div>

                      <div className="flex gap-2">
                        {(job.status === "In Progress" || job.status === "in-progress" || job.status === "Completed") ? (
                          <Link
                            to={`/project-workspace/${job._id}`}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition"
                          >
                            Workspace
                          </Link>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveTab("proposals");
                              window.scrollTo({ top: 400, behavior: "smooth" });
                            }}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
                          >
                            View {proposalsMap[job._id]?.length || 0} Proposals
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Proposals list */}
        {activeTab === "proposals" && (
          <div className="space-y-8">
            {Object.keys(proposalsMap).every(jobId => proposalsMap[jobId].length === 0) ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <Users className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-slate-900">No proposals received yet</h3>
                <p className="text-slate-500 text-sm mt-1">Your open gigs are waiting for freelancers to place bids.</p>
              </div>
            ) : (
              jobs.filter(j => j.status === "Open").map((job) => {
                const list = proposalsMap[job._id] || [];
                if (list.length === 0) return null;

                return (
                  <div key={job._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-extrabold text-slate-900">
                        Proposals for: <span className="text-indigo-600">{job.title}</span>
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">Budget Allocation: ₹{job.budget}</p>
                    </div>

                    <div className="space-y-6">
                      {list.map((prop) => (
                        <div key={prop._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50 flex flex-col md:flex-row gap-6">
                          <img
                            src={prop.freelancer?.profileImage || "https://img.freepik.com/free-psd/3d-rendered-user-icon-blue-circle_84443-55891.jpg"}
                            alt={prop.freelancer?.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h4 className="text-base font-bold text-slate-900">{prop.freelancer?.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{prop.freelancer?.email}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-left sm:text-right">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">Freelancer Bid</p>
                                  <p className="text-base font-extrabold text-slate-900 mt-0.5">₹{prop.bidAmount}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">Delivery</p>
                                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{prop.deliveryTime}</p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-200/50">
                              <p className="text-slate-700 text-sm font-medium leading-relaxed whitespace-pre-line">{prop.coverLetter}</p>
                            </div>

                            {prop.attachments && prop.attachments.length > 0 && (
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Attached Links</span>
                                <div className="flex flex-wrap gap-2">
                                  {prop.attachments.map((link, idx) => (
                                    <a
                                      key={idx}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 bg-white border border-slate-200 text-indigo-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition"
                                    >
                                      Portfolio Link {idx + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                              <MessageButton
                                recipientId={prop.freelancer?._id}
                                projectId={job._id}
                                label="Chat"
                                variant="ghost"
                              />
                              <button
                                onClick={() => handleRejectProposal(prop._id)}
                                className="flex items-center gap-1.5 px-4 py-2 hover:bg-red-50 text-red-600 text-xs font-bold rounded-lg transition"
                              >
                                <XCircle size={14} /> Reject
                              </button>
                              <button
                                onClick={() => handleAcceptProposal(prop._id, job._id)}
                                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                              >
                                <CheckCircle size={14} /> Accept & Hire
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
