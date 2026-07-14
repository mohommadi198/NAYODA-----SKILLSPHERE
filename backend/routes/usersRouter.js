const express = require("express");
const router = express.Router();

const {
  syncUser,
  getMyProfile,
  changeRole,
  updateProfile,
  publicFreelancerProfile,
  publicFreelancerProfileById,
  getUserById
} = require("../controllers/userController");

const authMiddleware = require("../middleware/auth");

// @route   POST /api/users/sync
// @desc    Create or update user from Firebase auth (no auth needed)
router.post("/sync", syncUser);

// @route   GET /api/users/me
// @desc    Get current user profile (protected)
router.get("/me", authMiddleware, getMyProfile);

// @route   GET /api/users/freelancers
// @desc    Get all freelancers (public)
router.get("/freelancers", publicFreelancerProfile);
router.get("/freelancers/:freelancerId", publicFreelancerProfileById);

// @route   GET /api/users/:id
// @desc    Get a user's public profile by id (protected)
router.get("/:id", authMiddleware, getUserById);

// @route   PUT /api/users/role
// @desc    Update user role (client/freelancer/admin) (protected)
router.put("/role", authMiddleware, changeRole);

// @route   PUT /api/users/profile
// @desc    Update user profile (role-aware validation) (protected)
router.put("/profile", authMiddleware, updateProfile);

// Backwards-compatible alias (kept so older clients keep working)
router.put("/complete-profile", authMiddleware, updateProfile);

module.exports = router;
