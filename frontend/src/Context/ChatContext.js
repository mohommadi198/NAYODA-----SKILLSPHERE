import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import chatServices from "../services/chatServices";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  const { dbUser, user } = useAuth();

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({}); // userId -> boolean
  const [conversations, setConversations] = useState([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);
  const tokenRef = useRef(localStorage.getItem("skillsphere_token"));
  const conversationsRef = useRef([]);

  // ── Load conversations + unread from REST ──────────────────────────────
  const loadConversations = useCallback(async () => {
    if (!dbUser) return;
    try {
      const data = await chatServices.getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  }, [dbUser]);

  const loadUnread = useCallback(async () => {
    if (!dbUser) return;
    try {
      const { totalUnread } = await chatServices.getUnreadCount();
      setTotalUnread(totalUnread || 0);
    } catch (err) {
      console.error("Failed to load unread", err);
    }
  }, [dbUser]);

  // ── Socket.io connection lifecycle ─────────────────────────────────────
  const connect = useCallback(() => {
    if (!dbUser) return;
    const token = localStorage.getItem("skillsphere_token");
    if (!token) return;

    // Avoid duplicate connections
    if (socketRef.current && socketRef.current.connected) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setConnected(true);
      // Tell server we're online and join any active rooms
      setReconnecting(false);
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.warn("Socket connect error:", err.message);
      setConnected(false);
    });

    // ── Real-time events ──────────────────────────────────────────────────
    newSocket.on("message:new", ({ message, conversationId }) => {
      // Update conversations list (last message, unread)
      setConversations((prev) => {
        const exists = prev.find(
          (c) => c._id.toString() === conversationId.toString()
        );
        if (!exists) {
          // New conversation we didn't know about — reload
          loadConversations();
          return prev;
        }
        return prev.map((c) =>
          c._id.toString() === conversationId.toString()
            ? {
                ...c,
                lastMessage: {
                  content: message.content,
                  sender: message.sender,
                  type: message.type,
                  createdAt: message.createdAt,
                },
                unreadCount:
                  message.sender?._id?.toString() === dbUser._id.toString()
                    ? c.unreadCount
                    : (c.unreadCount || 0) + 1,
                updatedAt: message.createdAt,
              }
            : c
        );
      });

      // Bump total unread if the message is from someone else
      if (message.sender?._id?.toString() !== dbUser._id.toString()) {
        setTotalUnread((u) => u + 1);
      }

      // Dispatch a window event so the active chat window can append it
      window.dispatchEvent(
        new CustomEvent("chat:message", { detail: { message, conversationId } })
      );
    });

    newSocket.on("message:typing", ({ conversationId, userId, isTyping }) => {
      window.dispatchEvent(
        new CustomEvent("chat:typing", {
          detail: { conversationId, userId, isTyping },
        })
      );
    });

    newSocket.on("message:read", ({ conversationId, userId }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c._id.toString() === conversationId.toString()
            ? { ...c, unreadCount: c.unreadCount }
            : c
        )
      );
      window.dispatchEvent(
        new CustomEvent("chat:read", { detail: { conversationId, userId } })
      );
    });

    newSocket.on("conversation:updated", ({ conversation }) => {
      setConversations((prev) => {
        const idx = prev.findIndex(
          (c) => c._id.toString() === conversation._id.toString()
        );
        if (idx === -1) {
          loadConversations();
          return prev;
        }
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...conversation };
        // Re-sort by last message time
        updated.sort(
          (a, b) =>
            new Date(b.lastMessage?.createdAt || b.updatedAt) -
            new Date(a.lastMessage?.createdAt || a.updatedAt)
        );
        return updated;
      });
    });

    newSocket.on("user:online", ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: true }));
    });

    newSocket.on("user:offline", ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: false }));
    });
  }, [dbUser, loadConversations]);

  // ── Init connection when user is available ─────────────────────────────
  useEffect(() => {
    if (dbUser) {
      loadConversations();
      loadUnread();
      connect();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [dbUser, connect, loadConversations, loadUnread]);

  // Keep a fresh ref of conversations for use in callbacks with empty deps
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // ── Helper actions ──────────────────────────────────────────────────────
  const startConversation = useCallback(
    async (recipientId, projectId = null) => {
      if (!recipientId) return null;
      try {
        const { conversation } = await chatServices.createOrGetConversation(
          recipientId,
          projectId
        );
        // Refresh list so it appears immediately
        loadConversations();
        return conversation;
      } catch (err) {
        console.error("startConversation failed", err);
        return null;
      }
    },
    [loadConversations]
  );

  const markRead = useCallback(async (conversationId) => {
    try {
      const conv = conversationsRef.current.find(
        (c) => c._id.toString() === conversationId.toString()
      );
      const decrement = conv?.unreadCount || 0;
      await chatServices.markConversationRead(conversationId);
      if (decrement > 0) {
        setTotalUnread((u) => Math.max(0, u - decrement));
      }
      setConversations((prev) =>
        prev.map((c) =>
          c._id.toString() === conversationId.toString()
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    } catch (err) {
      console.error("markRead failed", err);
    }
  }, []);

  // Join a conversation room for live updates
  const joinConversation = useCallback(
    (conversationId) => {
      if (socketRef.current && conversationId) {
        socketRef.current.emit("conversation:join", { conversationId });
      }
    },
    []
  );

  const leaveConversation = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit("conversation:leave", { conversationId });
    }
  }, []);

  const sendTyping = useCallback((conversationId, isTyping) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit("message:typing", { conversationId, isTyping });
    }
  }, []);

  const value = {
    socket,
    connected,
    reconnecting,
    onlineUsers,
    conversations,
    totalUnread,
    initialLoadDone,
    loadConversations,
    loadUnread,
    startConversation,
    markRead,
    joinConversation,
    leaveConversation,
    sendTyping,
    setConversations,
    setTotalUnread,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
