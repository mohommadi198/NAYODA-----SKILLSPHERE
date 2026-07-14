import React from "react";
import MessageButton from "./MessageButton";

function JobCard({ p, openProjectModal }) {
  const getBadge = () => {
    if (p.isUrgent)
      return "bg-red-100 text-red-600 border border-red-200";

    if (p.isFeatured)
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";

    return "bg-blue-100 text-blue-700 border border-blue-200";
  };

  return (
    <div
      onClick={() => openProjectModal(p._id)}
      className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadge()}`}
        >
          {p.workType}
        </span>

        <span className="text-xs text-gray-500">
          {p.proposals?.length || 0} Applicants
        </span>
      </div>

      {/* Title */}

      <h2 className="mt-4 line-clamp-2 text-xl font-bold text-gray-900">
        {p.title}
      </h2>

      {/* Description */}

      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
        {p.description}
      </p>

      {/* Client */}

      <div className="mt-5 flex items-center gap-3">
        <img
          src={
            p.client?.profileImage ||
            "https://ui-avatars.com/api/?name=User"
          }
          alt={p.client?.name}
          className="h-10 w-10 rounded-full border"
        />

        <div>
          <p className="font-medium text-gray-800">
            {p.client?.name}
          </p>

          <p className="text-xs text-gray-500">
            Client
          </p>
        </div>
      </div>

      {/* Meta */}

      <div className="mt-5 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>💰</span>

          <span className="font-medium">
            ₹{Number(p.budget).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>🎓</span>

          <span>{p.experience}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>🌍</span>

          <span>{p.workType}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>⏳</span>

          <span>{p.duration}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>📌</span>

          <span>{p.milestones?.length || 0} Milestones</span>
        </div>
      </div>

      {/* Skills */}

      <div className="mt-5 flex flex-wrap gap-2">
        {p.skills?.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between border-t pt-4 gap-3">
        <div>
          <p className="text-xs text-gray-500">
            Budget
          </p>

          <p className="text-xl font-bold text-blue-600">
            ₹{Number(p.budget).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {p.client?._id && (
            <MessageButton
              recipientId={p.client._id}
              projectId={p._id}
              label="Message Client"
              variant="ghost"
            />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProjectModal(p._id);
            }}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 font-medium text-white transition hover:scale-105"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;