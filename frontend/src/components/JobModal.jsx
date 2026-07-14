import React from "react";
import {
  X,
  IndianRupee,
  Clock3,
  Briefcase,
  User,
  CheckCircle2,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

function JobModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ height: "85%" }}
        className="relative flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
      >
        {/* Header */}

        <div className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur px-8 py-6">
          <div
            className="flex items-start justify-between gap-6"
            style={{ height: "70%" }}
          >
            <div>
              <span className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                {project.workType}
              </span>

              <h2 className="mt-4 text-4xl font-bold text-gray-900">
                {project.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 hover:rotate-90 hover:bg-red-100 hover:text-red-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
            <img
              src={
                project.client?.profileImage ||
                "https://ui-avatars.com/api/?name=User"
              }
              alt={project.client?.name}
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow"
            />

            <div>
              <p className="flex items-center gap-2 font-semibold text-gray-900">
                <User size={18} />
                {project.client?.name || "Unknown Client"}
              </p>

              <p className="text-sm text-gray-500">Client</p>
            </div>
          </div>

          {/* Description */}

          <section>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Project Description
            </h3>

            <p className="leading-8 text-gray-600">{project.description}</p>
          </section>

          {/* Information */}

          <section>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                icon={<IndianRupee size={20} />}
                title="Budget"
                value={`₹${Number(project.budget).toLocaleString("en-IN")}`}
              />

              <InfoCard
                icon={<Clock3 size={20} />}
                title="Duration"
                value={project.duration}
              />

              <InfoCard
                icon={<Briefcase size={20} />}
                title="Experience"
                value={project.experience}
              />

              <InfoCard
                icon={<CheckCircle2 size={20} />}
                title="Work Type"
                value={project.workType}
              />
            </div>
          </section>

          {/* Skills */}

          <section>
            <h3 className="mb-4 text-2xl font-bold">Required Skills</h3>

            <div className="flex flex-wrap gap-3">
              {project.skills?.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-600 hover:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Milestones */}

          <section>
            <h3 className="mb-6 text-2xl font-bold">Project Milestones</h3>

            <div className="space-y-5">
              {project.milestones?.map((milestone, index) => (
                <div
                  key={milestone._id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-xl font-semibold">
                        {index + 1}. {milestone.title}
                      </h4>

                      <p className="mt-2 text-gray-600">
                        {milestone.description}
                      </p>
                    </div>

                    <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 text-lg font-bold text-white shadow">
                      ₹{Number(milestone.amount).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
                      Status : {milestone.status}
                    </span>
                  </div>

                  {milestone.attachments?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {milestone.attachments.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 font-medium text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                        >
                          <ExternalLink size={18} />
                          Attachment {i + 1}
                        </a>
                      ))}
                    </div>
                  )}

                  {milestone.freelancerNotes && (
                    <div className="mt-5 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
                      <div className="flex gap-3">
                        <FileText className="text-blue-600" size={22} />

                        <div>
                          <h5 className="font-semibold">Freelancer Notes</h5>

                          <p className="mt-2 text-gray-600">
                            {milestone.freelancerNotes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {project.milestones?.length === 0 || !project.milestones ? (
                <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
                  No milestones available.
                </div>
              ) : null}
            </div>
          </section>
        </div>

        {/* Footer */}

        <div className="sticky bottom-0 border-t bg-white px-8 py-6">
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100"
            >
              Close
            </button>

            <Link
              to={`/submit-proposal/${project?._id}`}
              className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Submit Proposal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-2 text-blue-600">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </p>
      </div>

      <h4 className="mt-3 text-xl font-bold text-gray-900">{value}</h4>
    </div>
  );
}

export default JobModal;
