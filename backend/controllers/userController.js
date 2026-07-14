const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");


const ALLOWED_ROLES = ["client", "freelancer", "admin"];


const buildFreelancerData = (body) => {
  const data = {};

  if (body.headline !== undefined) data.headline = String(body.headline).trim();
  if (body.skills !== undefined) {
    data.skills = Array.isArray(body.skills)
      ? body.skills.map((s) => String(s).trim()).filter(Boolean)
      : String(body.skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  }
  if (body.hourlyRate !== undefined) {
    const n = Number(body.hourlyRate);
    if (Number.isNaN(n) || n < 0) {
      throw new Error("Hourly rate must be a positive number.");
    }
    data.hourlyRate = n;
  }
  if (body.availability !== undefined) {
    data.availability = ["", "Available", "Partially Available", "Unavailable"].includes(
      body.availability
    )
      ? body.availability
      : "";
  }
  if (body.languages !== undefined) {
    data.languages = Array.isArray(body.languages)
      ? body.languages.map((s) => String(s).trim()).filter(Boolean)
      : String(body.languages)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  }
  if (body.portfolio !== undefined) data.portfolio = body.portfolio;
  if (body.experience !== undefined) data.experience = body.experience;
  if (body.education !== undefined) data.education = body.education;
  if (body.certifications !== undefined) data.certifications = body.certifications;

  return data;
};

const buildClientData = (body) => {
  const data = {};

  if (body.company !== undefined) data.company = String(body.company).trim();
  if (body.organization !== undefined)
    data.organization = String(body.organization).trim();
  if (body.businessDescription !== undefined)
    data.businessDescription = String(body.businessDescription).trim();
  if (body.industry !== undefined) data.industry = String(body.industry).trim();
  if (body.website !== undefined) data.website = String(body.website).trim();

  if (body.hiringPreferences !== undefined) {
    const hp = body.hiringPreferences;
    data.hiringPreferences = {
      preferredSkills: Array.isArray(hp.preferredSkills)
        ? hp.preferredSkills.map((s) => String(s).trim()).filter(Boolean)
        : typeof hp.preferredSkills === "string"
        ? hp.preferredSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      budgetRange: hp.budgetRange ? String(hp.budgetRange).trim() : "",
      engagementType: ["", "Hourly", "Fixed", "Either"].includes(
        hp.engagementType
      )
        ? hp.engagementType
        : "Either",
      remoteOnly: Boolean(hp.remoteOnly),
    };
  }

  return data;
};

const syncUser = async (req, res) => {
  try {
    const { authId, email, name, profileImage } = req.body;

    if (!authId || !email) {
      return res.status(400).json({ message: "authId and email are required" });
    }

    // Find user by authId (Firebase UID) or create new
    let user = await User.findOne({ authId });

    if (user) {
      // Update existing user
      user.email = email;
      user.name = name || user.name;
      user.profileImage = profileImage || user.profileImage;
      await user.save();
    } else {
      // Create new user
      user = new User({
        authId,
        email,
        name: name || "User",
        profileImage: profileImage || "",
      });
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, authId: user.authId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ user, token });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    req.user.role = role;

    // Ensure the chosen role's sub-document exists so the UI can render it
    // immediately without a second round-trip. Other roles' data is kept
    // (hidden) so switching back doesn't lose information.
    if (role === "freelancer" && !req.user.freelancer) req.user.freelancer = {};
    if (role === "client" && !req.user.client) req.user.client = {};
    if (role === "admin" && !req.user.admin) req.user.admin = {};

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Unified profile update endpoint.
 *  - Common fields (name, bio, location, profileImage, socialLinks) always apply.
 *  - Role-specific fields are validated and merged into the correct
 *    sub-document based on the user's current `role`.
 *  - A user can ONLY write to the sub-document that matches their role,
 *    so a client can never inject freelancer-only data and vice-versa.
 */
const updateProfile = async (req, res) => {
  try {
    const body = req.body;

    // ── Common (shared) fields ──────────────────────────────────────────
    if (body.name !== undefined) {
      if (!String(body.name).trim()) {
        return res.status(400).json({ message: "Name cannot be empty." });
      }
      req.user.name = String(body.name).trim();
    }
    if (body.bio !== undefined) req.user.bio = String(body.bio);
    if (body.location !== undefined) req.user.location = String(body.location);
    if (body.profileImage !== undefined)
      req.user.profileImage = String(body.profileImage);

    if (body.socialLinks !== undefined) {
      const sl = body.socialLinks || {};
      req.user.socialLinks = {
        linkedin: sl.linkedin ? String(sl.linkedin) : "",
        github: sl.github ? String(sl.github) : "",
        twitter: sl.twitter ? String(sl.twitter) : "",
        website: sl.website ? String(sl.website) : "",
      };
    }

    // ── Role-specific fields ────────────────────────────────────────────
    if (!req.user.role) {
      // Role not chosen yet — only common fields are accepted.
      await req.user.save();
      return res.json(req.user);
    }

    if (req.user.role === "freelancer") {
      const data = buildFreelancerData(body);
      req.user.freelancer = { ...req.user.freelancer?.toObject?.() , ...data };
    } else if (req.user.role === "client") {
      const data = buildClientData(body);
      req.user.client = { ...req.user.client?.toObject?.(), ...data };
    } else if (req.user.role === "admin") {
      // Admin profile updates reserved for future use.
      const data = {};
      if (body.admin?.level !== undefined) data.level = body.admin.level;
      if (body.admin?.permissions !== undefined)
        data.permissions = body.admin.permissions;
      req.user.admin = { ...req.user.admin?.toObject?.(), ...data };
    }

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(400).json({ message: error.message || "Server error" });
  }
};

const publicFreelancerProfile = async (req, res) => {
  try {
    const freelancers = await User.find({ role: "freelancer" }).select(
      "-authId",
    );
    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const publicFreelancerProfileById = async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.freelancerId).select("-authId");
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET /api/users/:id
 * Get any user's public profile by id (used to view a profile and message them).
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-authId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  syncUser,
  getMyProfile,
  changeRole,
  updateProfile,
  publicFreelancerProfile,
  publicFreelancerProfileById,
  getUserById,
};
