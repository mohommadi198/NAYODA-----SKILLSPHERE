import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFreelancerActiveJobs } from "../services/jobsServices";
import { getMyProposals } from "../services/proposalServices";
import MessageButton from "../components/MessageButton";
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  FileText, 
  Search, 
  ChevronRight
} from "lucide-react";

export default function FreelancerDashboard() {
  const [activeJobs, setActiveJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("contracts"); // 'contracts' or 'proposals'

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const jobsData = await getFreelancerActiveJobs();
        setActiveJobs(jobsData.data || []);

        const propsData = await getMyProposals();
        setProposals(propsData || []);
      } catch (err) {
        console.error("Error loading freelancer dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Calculate earnings from paid milestones
  let totalEarnings = 0;
  activeJobs.forEach((job) => {
    job.milestones?.forEach((m) => {
      if (m.status === "Paid") {
        totalEarnings += Number(m.amount || 0);
      }
    });
  });

  const activeContractsCount = activeJobs.filter(j => j.status === "In Progress" || j.status === "in-progress").length;
  const pendingBidsCount = proposals.filter(p => p.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Freelancer Portal</h1>
              <p className="text-slate-500 mt-1">Track your active work contracts, submit milestones, and manage proposals.</p>
            </div>
            <div>
              <Link
                to="/browse/jobs"
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 font-semibold shadow-lg shadow-indigo-100 transition-all"
              >
                <Search size={18} /> Find New Work
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Active Gigs</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{activeContractsCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Submitted Bids</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{proposals.length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Pending Offers</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{pendingBidsCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Earnings Cleared</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">₹{totalEarnings}</h3>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("contracts")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 transition ${
              activeTab === "contracts"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            My Active Contracts ({activeJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 transition ${
              activeTab === "proposals"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            My Submitted Proposals ({proposals.length})
          </button>
        </div>

        {/* Contracts Tab Panel */}
        {activeTab === "contracts" && (
          <div className="space-y-6">
            {activeJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <Briefcase className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-slate-900">No active contracts</h3>
                <p className="text-slate-500 text-sm mt-1">Browse jobs and submit proposals to get hired.</p>
                <Link to="/browse/jobs" className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 font-bold text-sm">
                  Explore Gigs &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeJobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          job.status === "In Progress" || job.status === "in-progress" ? "bg-indigo-100 text-indigo-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {job.status}
                        </span>
                        <span className="text-slate-400 text-xs">Contract Started: {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={job.client?.profileImage || "https://img.freepik.com/free-psd/3d-rendered-user-icon-blue-circle_84443-55891.jpg"}
                          alt={job.client?.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-slate-600 text-xs font-semibold">Client: {job.client?.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Contract Budget</p>
                        <p className="text-lg font-bold text-slate-900 mt-0.5">₹{job.budget}</p>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/project-workspace/${job._id}`}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm transition"
                        >
                          Workspace
                        </Link>
                        <MessageButton
                          recipientId={job?.client?._id}
                          projectId={job?._id}
                          variant="icon"
                          label=""
                          ariaLabel="Message Client"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Proposals Tab Panel */}
        {activeTab === "proposals" && (
          <div className="space-y-6">
            {proposals.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <FileText className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-slate-900">No proposals submitted</h3>
                <p className="text-slate-500 text-sm mt-1">Submit bids to open client requirements to start earning.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {proposals.map((prop) => (
                  <div key={prop._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          prop.status === "pending" ? "bg-amber-100 text-amber-700" :
                          prop.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {prop.status}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mt-2">{prop.job?.title}</h4>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">My Bid Amount</p>
                          <p className="text-base font-bold text-slate-900 mt-0.5">₹{prop.bidAmount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Delivery Time</p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">{prop.deliveryTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                      <p className="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line">{prop.coverLetter}</p>
                    </div>

                    {prop.attachments && prop.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {prop.attachments.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                          >
                            Portfolio Link {idx + 1} <ChevronRight size={12} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
