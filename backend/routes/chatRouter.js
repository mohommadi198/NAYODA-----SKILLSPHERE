const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getConversations,
  createOrGetConversation,
  markConversationRead,
  getUnreadCount,
  getOnlineStatus,
} = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");

// Create or fetch a conversation (used by "Message" buttons)
router.post("/conversation", authMiddleware, createOrGetConversation);

// Send a message (also creates conversation automatically if needed)
router.post("/send", authMiddleware, sendMessage);

// List all conversations for the current user
router.get("/conversations", authMiddleware, getConversations);

// Paginated message history for a specific conversation
router.get("/history/:conversationId", authMiddleware, getMessages);

// Mark a conversation as read
router.post("/read/:conversationId", authMiddleware, markConversationRead);

// Total unread count (for Navbar badge)
router.get("/unread", authMiddleware, getUnreadCount);

// Online status lookup for a set of user ids
router.get("/online", authMiddleware, getOnlineStatus);

module.exports = router;
