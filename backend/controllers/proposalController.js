const Proposal = require("../models/Proposal");
const Jobs = require("../models/Jobs");

const postProposal = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res
        .status(403)
        .json({ message: "Only freelancers can submit proposals" });
    }

    const { jobId, coverLetter, bidAmount , attachments , deliveryTime } = req.body;
    if (!jobId || !coverLetter || !bidAmount) {
      return res
        .status(400)
        .json({ message: "jobId, coverLetter, and bidAmount are required" });
    }

    // Check if job exists and is open
    const job = await Jobs.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.status.toLocaleLowerCase().trim() !== "open") {
      return res
        .status(400)
        .json({ message: "This job is no longer accepting proposals" });
    }

    // Check if already submitted a proposal for this job
    const existing = await Proposal.findOne({
      job: jobId,
      freelancer: req.user._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already submitted a proposal for this job" });
    }

    const proposal = new Proposal({
      job: jobId,
      freelancer: req.user._id,
      coverLetter,
      bidAmount,
      deliveryTime,
      attachments
    });

    await proposal.save();
    const populated = await proposal.populate(
      "freelancer",
      "name email profileImage",
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("job")
      .populate("freelancer", "name email profileImage")
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const searchProposals = async (req, res) => {
    try{
        const query = req.query.q;
        const proposals = await Proposal.find({
            $or: [
                { coverLetter: { $regex: query, $options: "i" } },
                { bidAmount: { $regex: query, $options: "i" } },
            ],
        })
        .populate("job")
        .populate("freelancer", "name email profileImage");
        res.json(proposals);
    }catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate("job")
      .populate("freelancer", "name email profileImage");
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }
    if (proposal.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { coverLetter, bidAmount } = req.body;
    if (coverLetter) proposal.coverLetter = coverLetter;
    if (bidAmount) proposal.bidAmount = bidAmount;

    await proposal.save();
    const populated = await proposal.populate(
      "freelancer",
      "name email profileImage",
    );
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }
    if (proposal.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await proposal.remove();
    res.json({ message: "Proposal deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate("job")
      .populate("freelancer", "name email profileImage")
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getJobProposals = async (req, res) => {
  // get all the proposals for a specific job (for the client who owns the job)
  try {
    const job = await Jobs.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate("freelancer", "name email profileImage bio freelancer.skills")
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate("job");
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const job = proposal.job;
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update proposal status
    proposal.status = "accepted";
    await proposal.save();

    // Update job status and assign freelancer
    job.status = "In Progress";
    job.freelancer = proposal.freelancer;
    await job.save();

    // Reject all other proposals for this job
    await Proposal.updateMany(
      { job: job._id, _id: { $ne: proposal._id } },
      { status: "rejected" },
    );

    res.json({ proposal, job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate("job");
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const job = proposal.job;
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    proposal.status = "rejected";
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  postProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
  getMyProposals,
  getJobProposals,
  acceptProposal,
  rejectProposal,
  searchProposals,
};
