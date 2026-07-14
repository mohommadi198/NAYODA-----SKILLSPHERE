const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Jobs = require("../models/Jobs");

// Constants
const MESSAGE_TYPES = ["text", "emoji", "image", "file", "link"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
];

const PAGE_SIZE = 30;

/**
 * Detect a message type from content + optional attachment.
 */
function inferMessageType({ type, attachment, content }) {
  if (type && MESSAGE_TYPES.includes(type)) return type;
  if (attachment && attachment.url) {
    return attachment.mimeType?.startsWith("image/") ? "image" : "file";
  }
  if (content && /^https?:\/\/\S+$/i.test(content.trim())) return "link";
  return "text";
}

/**
 * Validate and normalize an attachment object.
 */
function sanitizeAttachment(attachment) {
  if (!attachment || !attachment.url) return null;
  if (attachment.size && attachment.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds maximum allowed size (10MB).");
  }
  if (
    attachment.mimeType &&
    !ALLOWED_FILE_TYPES.includes(attachment.mimeType)
  ) {
    throw new Error("Unsupported file type.");
  }
  return {
    url: attachment.url,
    name: attachment.name || "file",
    size: attachment.size || 0,
    mimeType: attachment.mimeType || "",
  };
}

/**
 * GET /api/chat/conversations
 * Returns all conversations for the current user, including: participant
 * details, last message preview, unread counts, and online status.
 */
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })
      .populate("participants", "name email profileImage role location isVerified")
      .populate("lastMessage.sender", "name profileImage")
      .populate("project", "title")
      .sort({ "lastMessage.createdAt": -1, updatedAt: -1 });

    const onlineUsers = req.app.get("onlineUsers");
    const result = conversations.map((conv) => {
      const convObj = conv.toObject();
      const other = convObj.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );
      const me = convObj.participants.find(
        (p) => p._id.toString() === userId.toString()
      );
      return {
        ...convObj,
        otherUser: other || null,
        me,
        unreadCount: convObj.unreadCount?.[userId.toString()] || 0,
        isOtherOnline: onlineUsers ? onlineUsers.has(other?._id.toString()) : false,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Server error fetching conversations." });
  }
};

/**
 * GET /api/chat/history/:conversationId?before=<iso>&limit=<n>
 * Paginated message history for a conversation. Only participants may access.
 */
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const limit = Math.min(parseInt(req.query.limit) || PAGE_SIZE, 100);
    const before = req.query.before ? new Date(req.query.before) : null;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }
    // Security: only participants can read messages
    if (!conversation.participants.some((p) => p.toString() === userId.toString())) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this conversation." });
    }

    const query = { conversation: conversationId, deleted: false };
    if (before) {
      query.createdAt = { $lt: before };
    }

    const messages = await Message.find(query)
      .populate("sender", "name profileImage role")
      .populate("recipient", "name profileImage role")
      .sort({ createdAt: -1 })
      .limit(limit);

    const ordered = messages.reverse();
    const oldest = ordered[0];
    res.json({
      messages: ordered,
      nextCursor: oldest ? oldest.createdAt.toISOString() : null,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error fetching messages." });
  }
};

/**
 * POST /api/chat/send
 * Sends a message. If conversationId is provided, use it; otherwise
 * create/find a conversation with recipientId (and optional projectId).
 */
const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      recipientId,
      conversationId,
      content,
      type,
      attachment,
      projectId,
    } = req.body;

    if (!content || !content.toString().trim()) {
      return res.status(400).json({ message: "Message content is required." });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found." });
      }
      if (
        !conversation.participants.some((p) => p.toString() === userId.toString())
      ) {
        return res
          .status(403)
          .json({ message: "You are not a participant in this conversation." });
      }
    } else {
      if (!recipientId) {
        return res
          .status(400)
          .json({ message: "recipientId or conversationId is required." });
      }
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ message: "Recipient user not found." });
      }
      if (recipientId.toString() === userId.toString()) {
        return res
          .status(400)
          .json({ message: "You cannot message yourself." });
      }

      let project = null;
      if (projectId) {
        project = await Jobs.findById(projectId);
        if (!project) {
          return res.status(404).json({ message: "Project not found." });
        }
        const allowed =
          project.client?.toString() === userId.toString() ||
          project.freelancer?.toString() === userId.toString() ||
          project.client?.toString() === recipientId.toString() ||
          project.freelancer?.toString() === recipientId.toString();
        if (!allowed) {
          return res
            .status(403)
            .json({
              message: "You are not authorized to message about this project.",
            });
        }
      }

      const participantPair = [userId, recipientId].sort();
      conversation = await Conversation.findOne({
        participants: { $all: participantPair, $size: 2 },
        project: projectId || null,
      });

      if (!conversation) {
        const unread = {};
        unread[recipientId.toString()] = 0;
        unread[userId.toString()] = 0;
        conversation = await Conversation.create({
          participants: [userId, recipientId],
          project: projectId || null,
          unreadCount: unread,
        });
      }
    }

    const recipientIdFromConv = conversation.participants.find(
      (p) => p.toString() !== userId.toString()
    );

    let cleanAttachment = null;
    try {
      cleanAttachment = sanitizeAttachment(attachment);
    } catch (attErr) {
      return res.status(400).json({ message: attErr.message });
    }

    const messageType = inferMessageType({
      type,
      attachment: cleanAttachment,
      content,
    });

    const message = new Message({
      conversation: conversation._id,
      sender: userId,
      recipient: recipientIdFromConv,
      type: messageType,
      content: content.toString().trim(),
      attachment: cleanAttachment,
      project: conversation.project,
      readBy: [userId],
      isRead: false,
    });

    await message.save();

    const unread = conversation.unreadCount || {};
    const recipientKey = recipientIdFromConv.toString();
    unread[recipientKey] = (unread[recipientKey] || 0) + 1;

    conversation.lastMessage = {
      content:
        messageType === "text" || messageType === "emoji" || messageType === "link"
          ? message.content
          : messageType === "image"
          ? "📷 Image"
          : "📎 File",
      sender: userId,
      type: messageType,
      createdAt: message.createdAt,
    };
    conversation.unreadCount = unread;
    conversation.updatedAt = new Date();
    await conversation.save();

    const populated = await Message.findById(message._id)
      .populate("sender", "name profileImage role")
      .populate("recipient", "name profileImage role");

    const io = req.app.get("io");
    if (io) {
      const chatSocket = require("../socket/chatSocket");
      chatSocket.broadcastNewMessage(io, {
        message: populated,
        conversation,
        sender: req.user,
      });
      chatSocket.broadcastConversationUpdate(io, conversation);
    }

    res.status(201).json({ message: populated, conversation });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error sending message." });
  }
};

/**
 * POST /api/chat/conversation
 * Explicitly create or fetch a conversation (used by "Message" buttons).
 */
const createOrGetConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { recipientId, projectId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: "recipientId is required." });
    }
    if (recipientId.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot start a conversation with yourself." });
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient user not found." });
    }

    let project = null;
    if (projectId) {
      project = await Jobs.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }
    }

    const participantPair = [userId, recipientId].sort();
    let conversation = await Conversation.findOne({
      participants: { $all: participantPair, $size: 2 },
      project: projectId || null,
    })
      .populate("participants", "name email profileImage role location isVerified")
      .populate("lastMessage.sender", "name profileImage")
      .populate("project", "title");

    if (!conversation) {
      const unread = {};
      unread[recipientId.toString()] = 0;
      unread[userId.toString()] = 0;
      conversation = await Conversation.create({
        participants: [userId, recipientId],
        project: projectId || null,
        unreadCount: unread,
      });
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name email profileImage role location isVerified")
        .populate("lastMessage.sender", "name profileImage")
        .populate("project", "title");
    }

    const onlineUsers = req.app.get("onlineUsers");
    const convObj = conversation.toObject();
    const other = convObj.participants.find(
      (p) => p._id.toString() !== userId.toString()
    );
    const result = {
      ...convObj,
      otherUser: other || null,
      unreadCount: convObj.unreadCount?.[userId.toString()] || 0,
      isOtherOnline: onlineUsers ? onlineUsers.has(other?._id.toString()) : false,
    };

    res.status(200).json({ conversation: result });
  } catch (error) {
    console.error("Create/get conversation error:", error);
    res.status(500).json({ message: "Server error managing conversation." });
  }
};

/**
 * POST /api/chat/read/:conversationId
 */
const markConversationRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }
    if (
      !conversation.participants.some((p) => p.toString() === userId.toString())
    ) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this conversation." });
    }

    const unread = conversation.unreadCount || {};
    unread[userId.toString()] = 0;
    conversation.unreadCount = unread;
    await conversation.save();

    await Message.updateMany(
      { conversation: conversationId, recipient: userId, isRead: false },
      { $set: { isRead: true }, $addToSet: { readBy: userId } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Server error marking as read." });
  }
};

/**
 * GET /api/chat/unread
 */
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    });
    let total = 0;
    conversations.forEach((c) => {
      total += c.unreadCount?.[userId.toString()] || 0;
    });
    res.json({ totalUnread: total });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Server error fetching unread count." });
  }
};

/**
 * GET /api/chat/online
 */
const getOnlineStatus = async (req, res) => {
  try {
    const ids = (req.query.ids || "").split(",").filter(Boolean);
    const onlineUsers = req.app.get("onlineUsers");
    const status = {};
    ids.forEach((id) => {
      status[id] = onlineUsers ? onlineUsers.has(id) : false;
    });
    res.json({ status });
  } catch (error) {
    console.error("Get online status error:", error);
    res.status(500).json({ message: "Server error fetching status." });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  createOrGetConversation,
  markConversationRead,
  getUnreadCount,
  getOnlineStatus,
};
