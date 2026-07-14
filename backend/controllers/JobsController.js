const Jobs = require("../models/Jobs");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const createJob = async (req, res) => {
  try {
    // Only clients can create jobs
    if (req.user.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can create jobs.",
      });
    }

    let {
      client,
      title,
      description,
      skills,
      budget,
      milestones,
      experience,
      workType,
      duration,
      deadline,
      status,
    } = req.body;

    // Validation
    if (!title || !description || budget === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, description and budget are required.",
      });
    }

    // Budget validation
    if (isNaN(budget) || Number(budget) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be greater than 0.",
      });
    }

    // Skills validation
    if (!Array.isArray(skills)) {
      skills = [];
    }

    skills = skills
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    const job = await Jobs.create({
      client: req.user._id,
      title: title.trim(),
      description: description.trim(),
      skills,
      budget: Number(budget),
      milestones,
      experience,
      workType,
      duration,
      deadline,
      status,
    });

    const createdJob = await Jobs.findById(job._id)
      .populate("client", "name email profileImage")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Job created successfully.",
      data: createdJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create job.",
      error: error.message,
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Jobs.find()
      .populate("client", "name profileImage")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error tracking jobs", error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID",
      });
    }

    const job = await Jobs.findById(jobId)
      .populate("client", "name email profileImage")
      .populate("freelancer", "name email profileImage")
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchJobs = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      status,
      experience,
      workType,
      sort = "newest",
    } = req.query;

    const filter = {};

    // Search
    if (search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");

      filter.$or = [
        { title: regex },
        { description: regex },
        { skills: { $in: [regex] } },
        { experience: regex },
        { workType: regex },
        { duration: regex },
        { status: regex },
      ];
    }

    // Filters
    if (status) filter.status = status;
    if (experience) filter.experience = experience;
    if (workType) filter.workType = workType;

    // Sorting
    let sortOption = { createdAt: -1 };

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "budget_high":
        sortOption = { budget: -1 };
        break;

      case "budget_low":
        sortOption = { budget: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const pageNumber = Math.max(1, Number(page));
    const pageLimit = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * pageLimit;

    const [jobs, total] = await Promise.all([
      Jobs.find(filter)
        .populate("client", "name profileImage")
        .sort(sortOption)
        .skip(skip)
        .limit(pageLimit)
        .lean(),

      Jobs.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageLimit),
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search jobs",
      error: error.message,
    });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const clientId = req.user._id;

    const jobs = await Jobs.find({ client: clientId })
      .populate("client", "name email profileImage")
      .populate("freelancer", "name email profileImage")
      .lean();

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to GET Your own Posted job.",
      error: error.message,
    });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const jobId = req.params.id;

    const updatedJob = await Jobs.findByIdAndUpdate(
      jobId,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job status updated successfully.",
      data: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update job status.",
      error: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    let {
      title,
      description,
      skills,
      budget,
      milestones,
      experience,
      workType,
      duration,
      deadline,
    } = req.body;

    const updatedJob = await Jobs.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        skills,
        budget,
        milestones,
        experience,
        workType,
        duration,
        deadline,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      data: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update job.",
      error: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const deletedJob = await Jobs.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete job.",
      error: error.message,
    });
  }
};

const getFreelancerJobs = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const jobs = await Jobs.find({ freelancer: freelancerId })
      .populate("client", "name email profileImage")
      .lean();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get active jobs.",
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  searchJobs,
  getMyJobs,
  getFreelancerJobs,
  updateJob,
  updateJobStatus,
  deleteJob,
};
