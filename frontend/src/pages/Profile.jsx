import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { useChat } from "../Context/ChatContext";
import { getUserById, updateProfile as updateProfileApi } from "../services/userServices";
import chatServices from "../services/chatServices";

import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import EmptyState from "../components/profile/EmptyState";
import FreelancerProfile from "../components/profile/FreelancerProfile";
import ClientProfile from "../components/profile/ClientProfile";
import EditProfileModal from "../components/profile/EditProfileModal";
import { normalizeProfile, isValidObjectId, computeProfileCompletion, toApiPayload } from "../components/profile/profileUtils";
import { mockProfiles, mockClientJobs } from "../data/mockProfiles";

/**
 * Profile page.
 *
 * Status state machine:
 *   - "loading"   → skeleton
 *   - "success"   → role-based profile (Freelancer | Client)
 *   - "not_found" → empty state (missing / invalid id)
 *   - "error"     → empty state with retry (network / server failure)
 *   - "no_role"   → gentle prompt to pick a role (own profile only)
 *
 * Preview mode: `/profile?demo=freelancer` or `/profile?demo=client` renders
 * mock data without hitting the API (handy for design review).
 */
function Profile() {
  const { dbUser } = useAuth();
  const { onlineUsers } = useChat();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const viewingUserId = searchParams.get("userId");
  const demo = searchParams.get("demo"); // "freelancer" | "client"

  const [status, setStatus] = useState("loading");
  const [rawUser, setRawUser] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null); // local optimistic copy
  const [editOpen, setEditOpen] = useState(false);
  const [editSection, setEditSection] = useState("basics");
  const [toast, setToast] = useState(null);
  const [retryNonce, setRetryNonce] = useState(0);

  const statusRef = useRef(status);
  const setStatusSafe = useCallback((next) => {
    statusRef.current = next;
    setStatus(next);
  }, []);
  const lastLoadedIdRef = useRef(null);

  const profile = useMemo(
    () => normalizeProfile(editedProfile || rawUser),
    [editedProfile, rawUser]
  );

  const isOwnProfile = useMemo(
    () => Boolean(profile && dbUser && String(profile.id) === String(dbUser._id)),
    [profile, dbUser]
  );

  const completion = useMemo(() => computeProfileCompletion(profile), [profile]);

  const online = useMemo(() => {
    if (!profile) return false;
    if (isOwnProfile) return true;
    return Boolean(onlineUsers?.[profile.id]);
  }, [profile, isOwnProfile, onlineUsers]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  // ── Data loading ───────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    // Demo preview (no API call).
    if (demo === "freelancer" || demo === "client") {
      lastLoadedIdRef.current = `demo-${demo}`;
      setRawUser(mockProfiles[demo]);
      setStatusSafe("success");
      return () => {
        cancelled = true;
      };
    }

    const isSelf = !viewingUserId || (dbUser && viewingUserId === dbUser._id);

    // Own profile — wait for auth, then use dbUser.
    if (isSelf) {
      if (dbUser === undefined) {
        setStatusSafe("loading");
        return () => {
          cancelled = true;
        };
      }
      if (!dbUser) {
        setRawUser(null);
        setStatusSafe("not_found");
        return () => {
          cancelled = true;
        };
      }
      lastLoadedIdRef.current = dbUser._id;
      setRawUser(dbUser);
      setStatusSafe("success");
      return () => {
        cancelled = true;
      };
    }

    // Another user — validate id, then fetch.
    if (!isValidObjectId(viewingUserId)) {
      setRawUser(null);
      setStatusSafe("not_found");
      return () => {
        cancelled = true;
      };
    }
    if (lastLoadedIdRef.current === viewingUserId && statusRef.current === "success") {
      return () => {
        cancelled = true;
      };
    }

    lastLoadedIdRef.current = viewingUserId;
    setStatusSafe("loading");

    getUserById(viewingUserId)
      .then((res) => {
        if (cancelled) return;
        const data = res?.data ?? res;
        if (!data) {
          setRawUser(null);
          setStatusSafe("not_found");
          return;
        }
        setRawUser(data);
        setStatusSafe("success");
      })
      .catch((err) => {
        if (cancelled) return;
        const code = err?.response?.status;
        setRawUser(null);
        setStatusSafe(code === 404 ? "not_found" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [viewingUserId, demo, dbUser, retryNonce, setStatusSafe]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleEdit = useCallback((section = "basics") => {
    setEditSection(section);
    setEditOpen(true);
  }, []);

  const handleShare = useCallback(() => {
    const url =
      isOwnProfile && profile?.id
        ? `${window.location.origin}/profile?userId=${profile.id}`
        : window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => showToast("Profile link copied!"),
        () => showToast("Couldn't copy link")
      );
    } else {
      showToast("Profile link copied!");
    }
  }, [isOwnProfile, profile, showToast]);

  const handleMessage = useCallback(async () => {
    if (!profile?.id) return;
    try {
      await chatServices.createOrGetConversation(profile.id);
      navigate("/chat");
    } catch {
      navigate("/chat");
    }
  }, [profile, navigate]);

  const handleHire = useCallback(() => {
    // Hiring starts with a conversation in this MVP.
    handleMessage();
  }, [handleMessage]);

  const handleDownloadResume = useCallback(() => {
    if (!profile) return;
    const lines = [
      profile.name,
      profile.freelancer?.headline || profile.client?.company || "",
      profile.location || "",
      "—",
      profile.bio || "",
      "—",
      "Skills: " + (profile.freelancer?.skills || []).join(", "),
      "Experience: " + (profile.freelancer?.experience || []).map((e) => `${e.title} @ ${e.company}`).join("; "),
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${profile.name.replace(/\s+/g, "_")}_profile.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("Resume downloaded");
  }, [profile, showToast]);

  const handleSave = useCallback(
    async (updated) => {
      // Optimistic local update.
      setEditedProfile(updated);
      if (isOwnProfile) {
        try {
          await updateProfileApi(toApiPayload(updated));
          showToast("Profile updated");
        } catch (err) {
          console.error("Update failed", err);
          showToast("Saved locally — sync pending");
        }
      }
    },
    [isOwnProfile, showToast]
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-indigo-50/40">
      {/* Decorative gradient blobs for the glassmorphism backdrop */}
      <div className="pointer-events-none absolute -left-24 -top-32 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-fuchsia-300/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" aria-hidden="true" />

      {status === "loading" && <ProfileSkeleton />}

      {status === "not_found" && (
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12">
          <EmptyState variant="not_found" onBack={() => navigate(-1)} />
        </div>
      )}

      {status === "error" && (
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12">
          <EmptyState variant="error" onRetry={() => { lastLoadedIdRef.current = null; setRetryNonce((n) => n + 1); }} />
        </div>
      )}

      {status === "success" && profile && (profile.role === "freelancer" || profile.role === "client") && (
        profile.role === "freelancer" ? (
          <FreelancerProfile
            profile={profile}
            isOwnProfile={isOwnProfile}
            online={online}
            onEdit={handleEdit}
            onShare={handleShare}
            onMessage={handleMessage}
            onHire={handleHire}
            onDownloadResume={handleDownloadResume}
            completion={completion}
          />
        ) : (
          <ClientProfile
            profile={profile}
            isOwnProfile={isOwnProfile}
            online={online}
            onEdit={handleEdit}
            onShare={handleShare}
            onMessage={handleMessage}
            onDownloadResume={handleDownloadResume}
            completion={completion}
            jobs={mockClientJobs}
          />
        )
      )}

      {/* Own profile with no role chosen yet */}
      {status === "success" && profile && !profile.role && (
        <div className="relative z-10 mx-auto mt-24 max-w-xl px-4">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-10 text-center shadow-xl shadow-indigo-100/50 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-slate-900">Finish setting up your profile</h2>
            <p className="mt-2 text-sm text-slate-500">
              Choose how you'll use SkillSphere to unlock your personalized profile.
            </p>
            <button
              type="button"
              onClick={() => navigate("/choose-role")}
              className="mt-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-indigo-300"
            >
              Choose a role
            </button>
          </div>
        </div>
      )}

      {/* Edit modal (owner only) */}
      {isOwnProfile && profile && (
        <EditProfileModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          profile={profile}
          initialSection={editSection}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Profile;
