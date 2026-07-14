import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { changeRole } from "../services/userServices";
import { ROLE, ROLE_LABELS, ROLE_HOME } from "../utils/roles";


const RoleSelect = () => {
  const { dbUser, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // If user already has a role, send them to their role home
  useEffect(() => {
    if (dbUser === undefined) return; // still loading
    if (dbUser?.role) {
      navigate(ROLE_HOME[dbUser.role] || "/", { replace: true });
    }
  }, [dbUser, navigate]);

  const selectRole = async (role) => {
    if (loading) return;

    try {
      setLoading(true);
      // Persist the chosen role on the backend, then refresh the local
      // profile so Navbar / routing / permissions update immediately.
      await changeRole(role);
      await refreshProfile();

      // Land the user directly in the correct dashboard.
      navigate(ROLE_HOME[role] || "/profile", { replace: true });
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to update role. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show spinner while profile is still loading
  if (dbUser === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-600">SkillSphere</h1>
          <p className="mt-2 text-gray-600">
            Choose how you want to use the platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[ROLE.CLIENT, ROLE.FREELANCER].map((role) => (
            <button
              key={role}
              disabled={loading}
              onClick={() => selectRole(role)}
              className="rounded-2xl border bg-white p-8 shadow transition hover:border-indigo-500 disabled:opacity-50"
            >
              <div className="mb-4 text-5xl">
                {role === ROLE.CLIENT ? "📢" : "💼"}
              </div>
              <h2 className="text-xl font-bold">{ROLE_LABELS[role]}</h2>
              <p className="mt-2 text-sm text-gray-500">
                {role === ROLE.CLIENT
                  ? "Post projects and hire freelancers."
                  : "Find projects and earn money."}
              </p>
            </button>
          ))}
        </div>

        {loading && (
          <p className="mt-6 text-center text-gray-500">
            Updating your profile…
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleSelect;