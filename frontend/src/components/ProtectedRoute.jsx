// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";

// const ProtectedRoute = ({ adminOnly = false }) => {
//   const { user, loading, dbUser, profileLoading } = useAuth();
//   const location = useLocation();
//   // Wait until Firebase auth and Firestore profile finish loading
//   if (loading || profileLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   // User is not logged in
//   if (!user) {
//     return (
//       <Navigate
//         to="/login"
//         replace
//         state={{ from: location }}
//       />
//     );
//   }

//   // User logged in but profile doesn't exist
//   if (dbUser === null) {
//     if (location.pathname !== "/choose-role") {
//       return <Navigate to="/choose-role" replace />;
//     }

//     return <Outlet />;
//   }

//   // Profile exists but role not selected
//   if (dbUser && !dbUser.role) {
//     if (location.pathname !== "/choose-role") {
//       return <Navigate to="/choose-role" replace />;
//     }

//     return <Outlet />;
//   }

//   // Admin routes
//   if (adminOnly && dbUser.role !== "admin") {
//     return <Navigate to="/" replace />;
//   }

  
//   console.log({
//   loading,
//   profileLoading,
//   user,
//   dbUser,
//   pathname: location.pathname
// });


//   return <Outlet />;
// };

// export default ProtectedRoute;



import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getRoleHome } from "../utils/roles";

const ProtectedRoute = ({ adminOnly = false, requireRole = null }) => {
  const { user, loading, dbUser, profileLoading } = useAuth();
  const location = useLocation();

  // ── 1. Still loading — show spinner ──────────────────────────────────────
  if (loading || profileLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600" />
      </div>
    );
  }

  // ── 2. Not authenticated → /login ────────────────────────────────────────
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ── 3. No profile yet → /choose-role ─────────────────────────────────────
  //    Allow the user to stay on /choose-role to avoid a loop.
  if (!dbUser) {
    if (location.pathname !== "/choose-role") {
      return <Navigate to="/choose-role" replace />;
    }
    return <Outlet />;
  }

  // ── 4. Profile exists but role not set → /choose-role ────────────────────
  if (!dbUser.role) {
    if (location.pathname !== "/choose-role") {
      return <Navigate to="/choose-role" replace />;
    }
    return <Outlet />;
  }

  // ── 5. Admin-only route ──────────────────────────────────────────────────
  if (adminOnly && dbUser.role !== "admin") {
    return <Navigate to={getRoleHome(dbUser) || "/"} replace />;
  }

  // ── 6. Role-restricted route ─────────────────────────────────────────────
  //    Admins may access any role-restricted route (future-proofing).
  if (
    requireRole &&
    dbUser.role !== requireRole &&
    dbUser.role !== "admin"
  ) {
    return <Navigate to={getRoleHome(dbUser) || "/"} replace />;
  }

  // ── All checks passed — render child routes ──────────────────────────────
  return <Outlet />;
};

export default ProtectedRoute;