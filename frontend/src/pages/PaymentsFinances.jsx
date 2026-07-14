import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { getMyJobs, getFreelancerActiveJobs } from "../services/jobsServices";
import { useNavigate } from "react-router-dom";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  Briefcase,
  TrendingUp,
  FileText
} from "lucide-react";

export default function PaymentsFinances() {
  const { dbUser } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        if (dbUser.role === "client") {
          const res = await getMyJobs();
          setJobs(res.data || []);
        } else {
          const res = await getFreelancerActiveJobs();
          setJobs(res.data || []);
        }
      } catch (err) {
        console.error("Error loading finances data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [dbUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isClient = dbUser.role === "client";

  // Calculate stats dynamically
  let totalCleared = 0; // Freelancer: Earnings, Client: Spent
  let pendingBalance = 0; // Freelancer: Pending release, Client: Escrow active
  const transactions = [];

  jobs.forEach((job) => {
    job.milestones?.forEach((m) => {
      if (m.status === "Paid") {
        totalCleared += Number(m.amount || 0);
        transactions.push({
          id: m._id,
          jobTitle: job.title,
          milestoneTitle: m.title,
          amount: m.amount,
          date: m.paidAt ? new Date(m.paidAt) : new Date(job.updatedAt),
          type: isClient ? "debit" : "credit",
          status: "Cleared",
        });
      } else if (m.status === "Approved" || m.status === "Submitted" || m.status === "Active") {
        pendingBalance += Number(m.amount || 0);
        transactions.push({
          id: m._id,
          jobTitle: job.title,
          milestoneTitle: m.title,
          amount: m.amount,
          date: m.submittedAt ? new Date(m.submittedAt) : new Date(job.updatedAt),
          type: isClient ? "escrow" : "pending",
          status: m.status,
        });
      }
    });
  });

  // Sort transactions by date desc
  transactions.sort((a, b) => b.date - a.date);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Finances & Payments</h1>
              <p className="text-slate-500 mt-1">Track payments, active escrow balances, and release transaction history.</p>
            </div>
          </div>
        </div>

        {/* Financial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isClient ? "Total Funds Disbursed" : "Earnings Cleared"}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isClient ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                {isClient ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-950">₹{totalCleared}</p>
              <p className="text-xs text-slate-400 mt-1">Completed milestones payments</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isClient ? "Escrow Balance" : "Pending Approvals"}
              </span>
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Clock size={20} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-950">₹{pendingBalance}</p>
              <p className="text-xs text-slate-400 mt-1">Funds held in active project contracts</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Contracts
              </span>
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase size={20} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-950">{jobs.length}</p>
              <p className="text-xs text-slate-400 mt-1">All ongoing and paid gigs</p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={20} /> Transaction Statement History
            </h3>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
              Statement generated: {new Date().toLocaleDateString()}
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FileText className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-sm">No transaction records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-8 py-4">Transaction Item / Gig</th>
                    <th className="px-8 py-4">Milestone Detail</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {transactions.map((tx) => {
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-4">
                          <p className="font-bold text-slate-900">{tx.jobTitle}</p>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-slate-600 font-medium">{tx.milestoneTitle}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            tx.status === "Cleared" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {tx.status === "Cleared" ? <CheckCircle2 size={12} /> : <Clock size={12} />} {tx.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-slate-400 text-xs">
                          {tx.date.toLocaleDateString()}
                        </td>
                        <td className={`px-8 py-4 text-right font-extrabold text-base ${
                          tx.type === "credit" ? "text-emerald-600" : tx.type === "debit" ? "text-rose-600" : "text-slate-700"
                        }`}>
                          {tx.type === "credit" ? "+" : tx.type === "debit" ? "-" : ""}₹{tx.amount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
