const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // Client who created the job
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Freelancer assigned to the job (once proposal accepted)
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },


    // Job Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Job Description
    description: {
      type: String,
      required: true,
    },

    // Required Skills
    skills: [
      {
        type: String,
      },
    ],

    // Budget
    budget: {
      type: Number,
      required: true,
    },

    // Experience Level
    experience: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      default: "Intermediate",
    },

    // Work Type
    workType: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "Remote",
    },

    // Project Duration
    duration: {
      type: String,
      default: "Less than 1 month",
    },

    // Deadline
    deadline: {
      type: Date,
    },

    milestones: [
      {
        title: String,
        description: String,
        amount: Number,

        status: {
          type: String,
          enum: [
            "Pending",
            "Active",
            "Submitted",
            "Changes Requested",
            "Approved",
            "Paid",
          ],
          default: "Pending",
        },

        freelancerNotes: String,
        clientFeedback: String,

        attachments: [String],

        submittedAt: Date,
        approvedAt: Date,
        paidAt: Date,
      },
    ],

    // Job Status
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Jobs", jobSchema);
