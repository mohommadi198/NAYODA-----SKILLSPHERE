import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import MessageButton from "../components/MessageButton";
import { getUserById } from "../services/userServices";

function Profile() {
  const { dbUser, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const viewingUserId = searchParams.get("userId");

  useEffect(() => {
    const load = async () => {
      // Viewing another user's public profile
      if (viewingUserId && viewingUserId !== dbUser?._id) {
        setLoading(true);
        try {
          const res = await getUserById?.(viewingUserId);
          setUser(res?.data || res || null);
        } catch (err) {
          console.error("Failed to load user profile", err);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else if (dbUser) {
        setUser(dbUser);
      }
    };
    load();
  }, [viewingUserId, dbUser]);

  const handleLogout = () => {
    if (logout) logout();
  };

  const isOwnProfile =
    !viewingUserId || viewingUserId === dbUser?._id;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          {/* Cover */}
          <div className="h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

          {/* Content */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="-mt-16">
              <img
                src={
                  user.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name,
                  )}`
                }
                alt={user.name}
                className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            </div>

            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:justify-between">
              {/* Left */}
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {user.name}
                </h1>

                <p className="mt-1 capitalize text-blue-600">{user.role}</p>

                <p className="mt-2 text-gray-500">📧 {user.email}</p>

                <p className="mt-2 text-gray-500">
                  📍 {user.location || "Location not specified"}
                </p>
              </div>

              {/* Right */}
              <div className="rounded-2xl bg-slate-50 p-6 text-center shadow-sm">
                <div className="text-sm text-gray-500">Hourly Rate</div>

                <div className="mt-2 text-4xl font-bold text-blue-600">
                  ₹{user.rate || 0}
                </div>

                <div className="text-gray-500">per hour</div>

                {!isOwnProfile && (
                  <div className="mt-5 flex justify-center">
                    <MessageButton
                      recipientId={user._id}
                      className="w-full justify-center"
                      label="Message"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-10">
              <h2 className="mb-3 text-xl font-semibold">About</h2>

              <p className="leading-7 text-gray-600">
                {user.bio || "No bio added yet."}
              </p>
            </div>

            {/* Skills */}
            <div className="mt-10">
              <h2 className="mb-3 text-xl font-semibold">Skills</h2>

              <div className="flex flex-wrap gap-3">
                {user.skills?.length ? (
                  user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No skills added.</span>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <h2 className="mb-3 text-xl font-semibold">Social Links</h2>

              <div className="flex flex-wrap gap-4">
                {user.socialLinks?.github && (
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                  >
                    GitHub
                  </a>
                )}

                {user.socialLinks?.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                  >
                    LinkedIn
                  </a>
                )}

                {user.socialLinks?.twitter && (
                  <a
                    href={user.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-12 flex justify-space" style={{ gap : 20 }}>
              <Link
                to={"/edit-profile"}
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {" "}
                Edit Profile
              </Link>

              <Link
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
