const mongoose = require("mongoose");
const Jobs = require("../models/Jobs");

const activateMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(jobId) ||
      !mongoose.Types.ObjectId.isValid(milestoneId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });
    }

    if (req.user.role.toLowerCase() != "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can request changes.",
      });
    }

    const job = await Jobs.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Only the job owner (client) can activate
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const milestone = job.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found.",
      });
    }

    if (milestone.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Milestone is already active or completed.",
      });
    }

    milestone.status = "Active";

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Milestone activated successfully.",
      data: milestone,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const submitMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;
    const { freelancerNotes, attachments = [] } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(jobId) ||
      !mongoose.Types.ObjectId.isValid(milestoneId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });
    }

    const job = await Jobs.findById(jobId).populate(
      "client",
      "name email profileImage",
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (req.user.role.toLowerCase() != "freelancer") {
      return res.status(403).json({
        success: false,
        message: "Only freelancers can submit milestones.",
      });
    }

    const milestone = job.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found.",
      });
    }

    // Only Active milestone can be submitted
    if (milestone.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: `Milestone is ${milestone.status}. It cannot be submitted.`,
      });
    }

    milestone.status = "Submitted";
    milestone.submittedAt = new Date();

    if (freelancerNotes) {
      milestone.freelancerNotes = freelancerNotes;
    }

    if (Array.isArray(attachments)) {
      milestone.attachments = attachments;
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Milestone submitted successfully.",
      data: milestone,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit milestone.",
      error: error.message,
    });
  }
};

const approveMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;

    const job = await Jobs.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (req.user.role.toLowerCase() != "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can request changes.",
      });
    }

    const milestone = job.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found.",
      });
    }

    if (milestone.status !== "Submitted") {
      return res.status(400).json({
        success: false,
        message: "Milestone has not been submitted yet.",
      });
    }

    milestone.status = "Approved";
    milestone.approvedAt = new Date();

    await job.save();

    res.status(200).json({
      success: true,
      message: "Milestone approved.",
      data: milestone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const requestChanges = async (req, res) => {
  const { feedback } = req.body;

  const job = await Jobs.findById(req.params.jobId);

  if (req.user.role.toLowerCase() != "client") {
    return res.status(403).json({
      success: false,
      message: "Only clients can request changes.",
    });
  }

  const milestone = job.milestones.id(req.params.milestoneId);

  milestone.status = "Changes Requested";
  milestone.clientFeedback = feedback;

  await job.save();

  res.json({
    success: true,
    message: "Changes requested.",
    data: milestone,
  });
};

const resubmitMilestone = async (req, res) => {
  const job = await Jobs.findById(req.params.jobId);

  const milestone = job.milestones.id(req.params.milestoneId);

  if (milestone.status !== "Changes Requested") {
    return res.status(400).json({
      success: false,
      message: "This milestone cannot be resubmitted.",
    });
  }

  if (req.user.role.toLowerCase() != "freelancer") {
    return res.status(403).json({
      success: false,
      message: "Only freelancers can submit milestones.",
    });
  }

  milestone.status = "Submitted";
  milestone.submittedAt = new Date();

  await job.save();

  res.json({
    success: true,
    message: "Milestone resubmitted.",
    data: milestone,
  });
};

const payMilestone = async (req, res) => {
  const job = await Jobs.findById(req.params.jobId);

  const milestone = job.milestones.id(req.params.milestoneId);

  if (milestone.status !== "Approved") {
    return res.status(400).json({
      success: false,
      message: "Milestone must be approved first.",
    });
  }

  if (req.user.role.toLowerCase() != "client") {
    return res.status(403).json({
      success: false,
      message: "Only clients can pay for milestones.",
    });
  }

  milestone.status = "Paid";
  milestone.paidAt = new Date();

  await job.save();

  res.json({
    success: true,
    message: "Payment released.",
    data: milestone,
  });
};


module.exports = {
  activateMilestone,
  submitMilestone,
  approveMilestone,
  requestChanges,
  resubmitMilestone,
  payMilestone,
};
