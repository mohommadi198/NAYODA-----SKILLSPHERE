
require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set. Add it to your .env file.");
  process.exit(1);
}

// Load the model so defaults are applied on save.
const User = require("../models/User");

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    console.log(`🔍 Found ${users.length} user(s) to inspect.`);

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
      let changed = false;

      // Ensure the role sub-documents exist (triggers schema defaults).
      if (!user.freelancer) {
        user.freelancer = {};
        changed = true;
      }
      if (!user.client) {
        user.client = {};
        changed = true;
      }
      if (!user.admin) {
        user.admin = {};
        changed = true;
      }

      // Migrate legacy flat fields → freelancer sub-document.
      if (Array.isArray(user.skills) && user.skills.length && !user.freelancer.skills?.length) {
        user.freelancer.skills = user.skills;
        changed = true;
      }
      if (typeof user.rate === "number" && user.rate && !user.freelancer.hourlyRate) {
        user.freelancer.hourlyRate = user.rate;
        changed = true;
      }

      if (changed) {
        await user.save();
        migrated++;
      } else {
        skipped++;
      }
    }

    // Remove obsolete flat fields in a single bulk pass (safe — values were
    // already copied into the freelancer sub-document above).
    const unsetResult = await User.updateMany(
      { $or: [{ skills: { $exists: true } }, { rate: { $exists: true } }] },
      { $unset: { skills: "", rate: "" } }
    );

    console.log(`✅ Migration complete.`);
    console.log(`   • Users updated : ${migrated}`);
    console.log(`   • Users skipped : ${skipped} (already up to date)`);
    console.log(
      `   • Flat fields removed from ${unsetResult.modifiedCount} document(s).`
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
})();
