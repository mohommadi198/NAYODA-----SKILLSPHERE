const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // The two participants in this 1-on-1 conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Optional project/job association to prevent duplicate conversations
    // for the same project between the same two users
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
      default: null,
    },

    // Last message snapshot for fast sidebar rendering (no extra query)
    lastMessage: {
      content: { type: String, default: "" },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      type: {
        type: String,
        enum: ["text", "image", "file", "emoji", "link"],
        default: "text",
      },
      createdAt: { type: Date, default: Date.now },
    },

    // Per-participant unread counters
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },

    // Whether the conversation is active/visible
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Compound index to efficiently find a 1-on-1 conversation between two users
// for a given project (or null project). Prevents duplicate conversations.
conversationSchema.index(
  { participants: 1, project: 1 },
  {
    unique: true,
    partialFilterExpression: { project: { $exists: true } },
  }
);

// Ensure participants array always has exactly 2 entries
conversationSchema.pre("save", function () {
  if (this.participants.length !== 2) {
    throw new Error("A conversation must have exactly 2 participants.");
  }
});

module.exports = mongoose.model("Conversation", conversationSchema);
