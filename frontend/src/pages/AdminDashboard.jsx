import React from "react";
import { useAuth } from "../Context/AuthContext";
import { ROLE_LABELS } from "../utils/roles";

export default function AdminDashboard() {
  const { dbUser } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
            {ROLE_LABELS.admin || "Admin"}
          </span>
          <h1 className="text-3xl font-bold text-slate-900">
            Administration
          </h1>
        </div>

        <p className="mt-4 text-slate-600">
          Signed in as <strong>{dbUser?.name}</strong>. The role-based
          permission system is fully wired — admin-only routes, API guards,
          and profile handling are ready. Real moderation tooling can be
          added here.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            "User management",
            "Job & proposal moderation",
            "Dispute resolution",
            "Platform analytics",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-400"
            >
              {item} — coming soon
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
