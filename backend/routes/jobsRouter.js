const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  searchJobs,
  getMyJobs,
  updateJob,
  deleteJob,
  updateJobStatus,
  getFreelancerJobs,
} = require("../controllers/JobsController");

const { 
  activateMilestone, 
  submitMilestone,
  approveMilestone,
  requestChanges,
  resubmitMilestone,
  payMilestone
  } = require("../controllers/milestonesController");

const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createJob);
router.get("/", getAllJobs);
router.get("/getById/:jobId", getJobById);

router.get("/me", authMiddleware, getMyJobs);
router.get("/freelancer/active", authMiddleware, getFreelancerJobs);

router.get("/search", searchJobs);

router.put("/updateJob/:id", authMiddleware, updateJob);

router.put("/updateStatus/:id", authMiddleware, updateJobStatus);

router.post(
  "/:jobId/milestones/:milestoneId/activate",
  authMiddleware,
  activateMilestone,
);

router.post(
  "/:jobId/milestones/:milestoneId/submit",
  authMiddleware,
  submitMilestone,
);

router.post(
  "/:jobId/milestones/:milestoneId/approve",
  authMiddleware,
  approveMilestone,
);

router.post(
  "/:jobId/milestones/:milestoneId/requestChanges",
  authMiddleware,
  requestChanges,
);

router.post(
  "/:jobId/milestones/:milestoneId/resubmit",
  authMiddleware,
  resubmitMilestone,
);

router.post(
  "/:jobId/milestones/:milestoneId/pay",
  authMiddleware,
  payMilestone,
);



router.delete("/deleteJob/:id", authMiddleware, deleteJob);

{
  /*
 Search Examples:

GET /api/jobs/search?search=React

GET /api/jobs/search?search=React&page=2&limit=12

GET /api/jobs/search?experience=Expert

GET /api/jobs/search?workType=Remote

GET /api/jobs/search?sort=budget_high

GET /api/jobs/search?status=Open
 */
}

module.exports = router;
