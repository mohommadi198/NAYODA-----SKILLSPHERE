import "./App.css";
import "./styles/Chat.css";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./Context/AuthContext";
import { ChatProvider } from "./Context/ChatContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// ── Lazy-loaded page components ──────────────────────────────────────────────
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BrowseJobs = lazy(() => import("./pages/BrowseJobs"));
const BrowseFreelancers = lazy(() => import("./pages/BrowserFreelancer"));
const RoleSelect = lazy(() => import("./pages/RoleSelect"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Blog = lazy(() => import("./pages/Blog"));
const SubmitProposal = lazy(() => import("./pages/SubmitProposal"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const FreelancerDashboard = lazy(() => import("./pages/FreelancerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreateGig = lazy(() => import("./pages/CreateGig"));
const RealTimeChat = lazy(() => import("./pages/RealTimeChat"));
const ProjectWorkspace = lazy(() => import("./pages/ProjectWorkspace"));
const PaymentsFinances = lazy(() => import("./pages/PaymentsFinances"));

// ── Shared loading spinner ───────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
  </div>
);

/** Wraps a lazy component in <Suspense> with a consistent fallback */
const Lazy = ({ Component }) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        {/*
          Single <Routes> tree — Layout renders Navbar + <Outlet/> + Footer
          so every page automatically gets the shared chrome.
        */}
        <Routes>
          <Route element={<Layout />}>
          {/* ── Public Routes ─────────────────────────────────────────── */}
          <Route index element={<Lazy Component={Home} />} />
          <Route path="login" element={<Lazy Component={Login} />} />
          <Route path="signup" element={<Lazy Component={Signup} />} />
          <Route path="faq" element={<Lazy Component={FAQ} />} />
          <Route path="pricing" element={<Lazy Component={Pricing} />} />
          <Route path="blog" element={<Lazy Component={Blog} />} />
          <Route path="browse/jobs" element={<Lazy Component={BrowseJobs} />} />
          <Route path="browse/freelancers" element={<Lazy Component={BrowseFreelancers} />} />

          {/* ── Protected Routes (require auth + optional role) ──────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Lazy Component={Dashboard} />} />
            <Route path="profile" element={<Lazy Component={Profile} />} />
            <Route path="edit-profile" element={<Lazy Component={EditProfile} />} />
            <Route path="choose-role" element={<Lazy Component={RoleSelect} />} />
            <Route path="chat" element={<Lazy Component={RealTimeChat} />} />
            <Route path="payments" element={<Lazy Component={PaymentsFinances} />} />
            <Route path="project-workspace/:jobId" element={<Lazy Component={ProjectWorkspace} />} />
          </Route>

          {/* ── Client-only routes ───────────────────────────────────── */}
          <Route element={<ProtectedRoute requireRole="client" />}>
            <Route
              path="client/dashboard"
              element={<Lazy Component={ClientDashboard} />}
            />
            <Route
              path="create-gig"
              element={<Lazy Component={CreateGig} />}
            />
          </Route>

          {/* ── Freelancer-only routes ──────────────────────────────── */}
          <Route element={<ProtectedRoute requireRole="freelancer" />}>
            <Route
              path="freelancer/dashboard"
              element={<Lazy Component={FreelancerDashboard} />}
            />
            <Route
              path="submit-proposal/:projectId"
              element={<Lazy Component={SubmitProposal} />}
            />
          </Route>

          {/* ── Admin-only route (future) ───────────────────────────── */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route
              path="admin"
              element={<Lazy Component={AdminDashboard} />}
            />
          </Route>

          {/* ── 404 Catch-all ────────────────────────────────────────── */}
          <Route path="*" element={<Lazy Component={NotFound} />} />
        </Route>
      </Routes>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
