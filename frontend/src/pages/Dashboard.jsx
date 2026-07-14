import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Dashboard = () => {
  const { dbUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!dbUser) {
      navigate("/login", { replace: true });
      return;
    }

    if (!dbUser.role) {
      navigate("/choose-role", { replace: true });
    } else if (dbUser.role === "client") {
      navigate("/client/dashboard", { replace: true });
    } else if (dbUser.role === "freelancer") {
      navigate("/freelancer/dashboard", { replace: true });
    }
  }, [dbUser, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
};

export default Dashboard;
