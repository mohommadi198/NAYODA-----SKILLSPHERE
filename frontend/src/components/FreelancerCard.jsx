import React from "react";
import { Link } from "react-router-dom";
import MessageButton from "./MessageButton";

function FreelancerCard({ f, openModal }) {
  const handleOpenModal = () => {
    if (typeof openModal === "function") {
      openModal("proposalModal");
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Banner */}
      <div className="h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

      {/* Avatar */}
      <div className="-mt-10 flex justify-center">
        <Link to={`/profile?userId=${f._id || f.id}`}>
          <img
            src={
              f.profileImage ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(f.name)
            }
            alt={f.name}
            className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg hover:opacity-90 transition"
          />
        </Link>
      </div>

      <div className="p-5 text-center">

        {/* Name */}
        <Link to={`/profile?userId=${f._id || f.id}`} className="hover:underline">
          <h2 className="text-lg font-bold text-slate-800">
            {f.name}
          </h2>
        </Link>

        {/* Role */}
        <p className="mt-1 text-sm text-blue-600 capitalize">
          {f.role}
        </p>

        {/* Location */}
        <p className="mt-2 text-sm text-slate-500">
          📍 {f.location || "Location not specified"}
        </p>

        {/* Bio */}
        <p className="mt-4 line-clamp-3 text-sm text-slate-600">
          {f.bio || "This freelancer hasn't added a bio yet."}
        </p>

        {/* Skills */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {f.skills?.length ? (
            f.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">
              No skills added
            </span>
          )}
        </div>

        {/* Rate */}
        <div className="mt-6">
          <span className="text-2xl font-bold text-blue-600">
            ₹{f.rate || 0}
          </span>
          <span className="text-slate-500"> / hour</span>
        </div>

        {/* Social Links */}
        {(f.socialLinks?.github ||
          f.socialLinks?.linkedin ||
          f.socialLinks?.twitter) && (
          <div className="mt-5 flex justify-center gap-4">

            {f.socialLinks.github && (
              <a
                href={f.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-black"
              >
                GitHub
              </a>
            )}

            {f.socialLinks.linkedin && (
              <a
                href={f.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-blue-700"
              >
                LinkedIn
              </a>
            )}

            {f.socialLinks.twitter && (
              <a
                href={f.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-sky-500"
              >
                Twitter
              </a>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-3">

          <MessageButton
            recipientId={f._id || f.id}
            className="flex-1 justify-center"
            label="Message"
            variant="ghost"
          />

          <button
            onClick={handleOpenModal}
            className="flex-1 rounded-xl bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Hire
          </button>

        </div>
      </div>
    </div>
  );
}

export default FreelancerCard;