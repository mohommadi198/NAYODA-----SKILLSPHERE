const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Message type enables text, emoji, image, file, and link support
    type: {
      type: String,
      enum: ["text", "emoji", "image", "file", "link"],
      default: "text",
    },

    // Text content (used for text, emoji, link, and as caption for media)
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // For image/file messages: attachment metadata
    attachment: {
      url: { type: String, default: "" },
      name: { type: String, default: "" },
      size: { type: Number, default: 0 }, // bytes
      mimeType: { type: String, default: "" },
    },

    // Read receipt tracking
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isRead: { type: Boolean, default: false },

    // Optional project association (inherited from conversation)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
      default: null,
    },

    // Soft delete flag so deleted messages stay in DB but hide from UI
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index for fast pagination of a conversation's messages
messageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
