import api from "./api";

/**
 * Chat API services. All requests automatically include the bearer token
 * via the axios interceptor configured in api.js.
 */

const getConversations = async () => {
  try {
    const response = await api.get("/chat/conversations");
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

const getChatHistory = async (conversationId, before = null, limit = 30) => {
  try {
    const params = { limit };
    if (before) params.before = before;
    const response = await api.get(`/chat/history/${conversationId}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

const sendMessage = async (payload) => {
  try {
    const response = await api.post("/chat/send", payload);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

const createOrGetConversation = async (recipientId, projectId = null) => {
  try {
    const response = await api.post("/chat/conversation", {
      recipientId,
      projectId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

const markConversationRead = async (conversationId) => {
  try {
    const response = await api.post(`/chat/read/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Error marking read:", error);
    throw error;
  }
};

const getUnreadCount = async () => {
  try {
    const response = await api.get("/chat/unread");
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};

const getOnlineStatus = async (ids) => {
  try {
    const response = await api.get("/chat/online", {
      params: { ids: ids.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching online status:", error);
    throw error;
  }
};

const chatServices = {
  getConversations,
  getChatHistory,
  sendMessage,
  createOrGetConversation,
  markConversationRead,
  getUnreadCount,
  getOnlineStatus,
};

export default chatServices;