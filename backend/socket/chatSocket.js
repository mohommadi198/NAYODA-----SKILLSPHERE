/**
 * Socket.io chat handlers for real-time messaging.
 *
 * Events handled (from client):
 *   - conversation:join      { conversationId }       -> join a room for a conversation
 *   - conversation:leave     { conversationId }       -> leave the room
 *   - message:send           { ...message payload }    -> persist + broadcast (handled via REST for persistence, but socket used for live delivery)
 *   - message:typing         { conversationId, isTyping }
 *   - message:read           { conversationId }
 *
 * Events emitted (to client):
 *   - message:new            { message, conversationId }
 *   - message:typing         { conversationId, userId, isTyping }
 *   - message:read           { conversationId, userId, readBy }
 *   - conversation:updated   { conversation }
 *   - user:online / user:offline (handled in server.js)
 */

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

// Helper: is a given user currently online?
function isUserOnline(onlineUsers, userId) {
  return onlineUsers.has(userId?.toString());
}

// Helper: emit online status list to a newly connected socket
function getOnlineStatuses(onlineUsers, userIds) {
  const result = {};
  userIds.forEach((id) => {
    result[id.toString()] = onlineUsers.has(id.toString());
  });
  return result;
}

module.exports = function registerChatSocket(io, socket, { onlineUsers }) {
  const userId = socket.user._id.toString();

  // Join a conversation room so the socket receives live updates for it
  socket.on("conversation:join", async ({ conversationId }) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;
      // Security: only participants may join the room
      if (!conversation.participants.some((p) => p.toString() === userId)) {
        return;
      }
      socket.join(`conversation:${conversationId}`);
    } catch (err) {
      console.error("conversation:join error", err);
    }
  });

  socket.on("conversation:leave", ({ conversationId }) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // Typing indicator
  socket.on("message:typing", ({ conversationId, isTyping }) => {
    if (!conversationId) return;
    socket.to(`conversation:${conversationId}`).emit("message:typing", {
      conversationId,
      userId,
      isTyping: !!isTyping,
    });
  });

  // Mark conversation as read
  socket.on("message:read", async ({ conversationId }) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;
      if (!conversation.participants.some((p) => p.toString() === userId)) {
        return;
      }

      // Reset unread count for this user
      const unread = conversation.unreadCount || {};
      unread[userId] = 0;
      conversation.unreadCount = unread;
      await conversation.save();

      // Mark all messages in this conversation as read by this user
      await Message.updateMany(
        {
          conversation: conversationId,
          recipient: userId,
          isRead: false,
        },
        {
          $set: { isRead: true },
          $addToSet: { readBy: userId },
        },
      );

      // Notify the other participant(s)
      socket.to(`conversation:${conversationId}`).emit("message:read", {
        conversationId,
        userId,
        readBy: [userId],
      });

      // Also tell the reader's other devices
      socket.emit("conversation:updated", { conversation });
    } catch (err) {
      console.error("message:read error", err);
    }
  });

  // When a message is persisted via REST, the controller calls this to broadcast.
  // We expose a function on the socket's io instance for reuse.
  socket.on("disconnecting", () => {
    // Cleanup handled in server.js
  });
};

// Export helpers so the REST controller can broadcast through the socket.
module.exports.broadcastNewMessage = function broadcastNewMessage(
  io,
  { message, conversation, sender },
) {
  const conversationId = conversation._id.toString();
  const recipientId = conversation.participants
    .find((p) => p.toString() !== sender._id.toString())
    ?.toString();

  // Emit to the conversation room (sender + recipient if both connected)
  io.to(`conversation:${conversationId}`).emit("message:new", {
    message,
    conversationId,
  });

  // Also target the recipient directly in case they're not in the room yet
  if (recipientId) {
    io.to(`user:${recipientId}`).emit("message:new", {
      message,
      conversationId,
    });
  }
};

module.exports.broadcastConversationUpdate =
  function broadcastConversationUpdate(io, conversation) {
    const conversationId = conversation._id.toString();
    conversation.participants.forEach((p) => {
      io.to(`user:${p.toString()}`).emit("conversation:updated", {
        conversation,
      });
    });
  };

module.exports.isUserOnline = isUserOnline;
module.exports.getOnlineStatuses = getOnlineStatuses;
