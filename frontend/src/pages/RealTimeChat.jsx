import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Chat.css";
import { useAuth } from "../Context/AuthContext";
import { useChat } from "../Context/ChatContext";
import chatServices from "../services/chatServices";
import MessageBubble from "../components/MessageBubble";

import {
  Send,
  Search,
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Smile,
  WifiOff,
  AlertCircle,
  LoaderCircle,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  formatTime,
  formatConversationTime,
  formatDayDivider,
  formatFileSize,
  isBareUrl,
} from "../utils/chatUtils";

const EMOJIS = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😊",
  "😍",
  "😘",
  "😎",
  "🤔",
  "😢",
  "😭",
  "😡",
  "👍",
  "👎",
  "👏",
  "🙏",
  "💪",
  "🔥",
  "❤️",
  "💯",
  "🎉",
  "✅",
  "⭐",
  "🚀",
];

const FALLBACK_AVATAR =
  "https://img.freepik.com/free-psd/3d-rendered-user-icon-blue-circle_84443-55891.jpg";

export default function RealTimeChat() {
  const { dbUser } = useAuth();
  const {
    socket,
    connected,
    conversations,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendTyping,
    markRead,
  } = useChat();

  const location = useLocation();
  const navigate = useNavigate();

  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  // Holds the pagination cursor without making loadHistory re-create on every change.
  const nextCursorRef = useRef(null);

  // Pick the conversation to open (from nav state or first in list)
  useEffect(() => {
    const fromNav = location.state?.conversationId;
    if (fromNav) {
      setSelectedConvId(fromNav);
      setMobileShowChat(true);
    } else if (!selectedConvId && conversations.length > 0) {
      setSelectedConvId(conversations[0]._id);
    }
  }, [location.state, conversations, selectedConvId]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c._id === selectedConvId) || null,
    [conversations, selectedConvId],
  );

  const otherUser = selectedConversation?.otherUser || null;

  // ── Load message history (with pagination) ─────────────────────────────
  const loadHistory = useCallback(
    async (conversationId, { older = false } = {}) => {
      if (!conversationId) return;
      try {
        if (older) setLoadingOlder(true);
        else setLoadingHistory(true);

        const cursor = older ? nextCursorRef.current : null;
        const data = await chatServices.getChatHistory(
          conversationId,
          cursor,
          30,
        );

        const incoming = data.messages || [];
        setMessages((prev) => (older ? [...incoming, ...prev] : incoming));
        nextCursorRef.current = data.nextCursor;
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
        setError(null);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load messages. Please try again.");
      } finally {
        if (older) setLoadingOlder(false);
        else setLoadingHistory(false);
      }
    },
    [],
  );

  // Reset + load when conversation changes
  useEffect(() => {
    if (!selectedConvId) return;
    setMessages([]);
    setNextCursor(null);
    nextCursorRef.current = null;
    setHasMore(true);
    setError(null);
    loadHistory(selectedConvId, { older: false });
    markRead(selectedConvId);
    if (socket) joinConversation(selectedConvId);
    return () => {
      if (socket) leaveConversation(selectedConvId);
    };
  }, [
    selectedConvId,
    socket,
    joinConversation,
    leaveConversation,
    markRead,
    loadHistory,
  ]);

  // ── Preserve scroll when loading older messages ────────────────────────
  const onScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    if (el.scrollTop < 60 && hasMore && !loadingOlder && nextCursor) {
      const prevHeight = el.scrollHeight;
      const prevTop = el.scrollTop;
      loadHistory(selectedConvId, { older: true }).then(() => {
        requestAnimationFrame(() => {
          const newHeight = el.scrollHeight;
          el.scrollTop = newHeight - prevHeight + prevTop;
        });
      });
    }
  }, [hasMore, loadingOlder, nextCursor, loadHistory, selectedConvId]);

  // ── Auto-scroll to bottom on new messages (only if near bottom) ────────
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ── Real-time updates via window events dispatched by ChatContext ──────
  useEffect(() => {
    const onNewMessage = (e) => {
      const { message, conversationId } = e.detail;
      if (conversationId !== selectedConvId) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (message.sender?._id?.toString() !== dbUser?._id?.toString()) {
        markRead(conversationId);
      }
    };
    const onTyping = (e) => {
      const { conversationId, userId, isTyping } = e.detail;
      if (conversationId !== selectedConvId) return;
      setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
    };
    const onRead = () => {
      setMessages((prev) => [...prev]);
    };

    window.addEventListener("chat:message", onNewMessage);
    window.addEventListener("chat:typing", onTyping);
    window.addEventListener("chat:read", onRead);
    return () => {
      window.removeEventListener("chat:message", onNewMessage);
      window.removeEventListener("chat:typing", onTyping);
      window.removeEventListener("chat:read", onRead);
    };
  }, [selectedConvId, dbUser, markRead]);

  // ── Typing indicator emit ──────────────────────────────────────────────
  const handleTyping = useCallback(() => {
    if (!selectedConvId || !connected) return;
    sendTyping(selectedConvId, true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      sendTyping(selectedConvId, false);
    }, 1500);
  }, [selectedConvId, connected, sendTyping]);

  // ── Send message (optimistic + REST + socket broadcast) ────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !selectedConvId || !otherUser) return;

    setNewMessage("");
    setShowEmoji(false);

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      conversation: selectedConvId,
      sender: { _id: dbUser._id },
      recipient: { _id: otherUser._id },
      type: isBareUrl(text) ? "link" : "text",
      content: text,
      createdAt: new Date().toISOString(),
      isRead: false,
      pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    setSending(true);
    try {
      const res = await chatServices.sendMessage({
        conversationId: selectedConvId,
        recipientId: otherUser._id,
        content: text,
        type: isBareUrl(text) ? "link" : "text",
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? res.message : m)),
      );
    } catch (err) {
      console.error("Send failed", err);
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? { ...m, failed: true } : m)),
      );
      setError("Message failed to send.");
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConvId || !otherUser) return;
    const url = URL.createObjectURL(file);
    const isImage = file.type.startsWith("image/");
    const type = isImage ? "image" : "file";

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      conversation: selectedConvId,
      sender: { _id: dbUser._id },
      recipient: { _id: otherUser._id },
      type,
      content: isImage ? "Photo" : file.name,
      attachment: {
        url,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      },
      createdAt: new Date().toISOString(),
      isRead: false,
      pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await chatServices.sendMessage({
        conversationId: selectedConvId,
        recipientId: otherUser._id,
        content: isImage ? "Photo" : file.name,
        type,
        attachment: {
          url,
          name: file.name,
          size: file.size,
          mimeType: file.type,
        },
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? res.message : m)),
      );
    } catch (err) {
      console.error("File send failed", err);
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? { ...m, failed: true } : m)),
      );
    }
    e.target.value = "";
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmoji(false);
  };

  // ── Group messages by day for dividers ──────────────────────────────────
  const messagesByDay = useMemo(() => {
    const groups = [];
    let lastDay = null;
    messages.forEach((m) => {
      const day = formatDayDivider(m.createdAt);
      if (day !== lastDay) {
        groups.push({ divider: day, items: [] });
        lastDay = day;
      }
      groups[groups.length - 1].items.push(m);
    });
    return groups;
  }, [messages]);

  const filteredConversations = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isOtherTyping = otherUser && typingUsers[otherUser._id];
  const otherOnline = otherUser && onlineUsers[otherUser._id];

  return (
    <div className="chat-shell">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`chat-sidebar ${mobileShowChat ? "hidden-mobile" : ""}`}
      >
        <div className="chat-sidebar-header">
          <h1>Messenger</h1>
          <span
            className={`chat-conn-status ${connected ? "online" : "offline"}`}
            title={connected ? "Connected" : "Offline – reconnecting…"}
          >
            <span className="dot" />
            {connected ? "Live" : "Offline"}
          </span>
        </div>

        <div className="chat-search">
          <Search size={16} className="chat-search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="chat-conv-list">
          {!connected && (
            <div className="chat-offline-banner">
              <WifiOff size={14} /> Reconnecting to live updates…
            </div>
          )}

          {conversations.length === 0 ? (
            <div className="chat-empty-list">
              <MessageSquare size={32} />
              <p>No conversations yet</p>
              <span>Message a freelancer or client to get started.</span>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isActive = c._id === selectedConvId;
              const other = c.otherUser || {};
              const lastMsg = c.lastMessage || {};
              return (
                <button
                  key={c._id}
                  className={`chat-conv-item ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setSelectedConvId(c._id);
                    setMobileShowChat(true);
                  }}
                >
                  <div className="chat-conv-avatar-wrap">
                    <img
                      src={other.profileImage || FALLBACK_AVATAR}
                      alt={other.name}
                    />
                    <span
                      className={`chat-presence ${
                        onlineUsers[other._id] ? "on" : "off"
                      }`}
                    />
                  </div>

                  <div className="chat-conv-body">
                    <div className="chat-conv-top">
                      <span className="chat-conv-name">{other.name}</span>
                      <span className="chat-conv-time">
                        {formatConversationTime(lastMsg.createdAt)}
                      </span>
                    </div>
                    <div className="chat-conv-bottom">
                      <span className="chat-conv-preview">
                        {lastMsg.sender?._id?.toString() ===
                        dbUser?._id?.toString()
                          ? "You: "
                          : ""}
                        {lastMsg.content || "No messages yet"}
                      </span>
                      {c.unreadCount > 0 && (
                        <span className="chat-unread-badge">
                          {c.unreadCount > 99 ? "99+" : c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Chat window ─────────────────────────────────────────────────── */}
      <section
        className={`chat-window ${mobileShowChat ? "" : "hidden-mobile"}`}
      >
        {selectedConversation && otherUser ? (
          <>
            <header className="chat-header">
              <button
                className="chat-back-btn"
                onClick={() => setMobileShowChat(false)}
                aria-label="Back to conversations"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="chat-conv-avatar-wrap">
                <img
                  src={otherUser.profileImage || FALLBACK_AVATAR}
                  alt={otherUser.name}
                />
                <span
                  className={`chat-presence ${otherOnline ? "on" : "off"}`}
                />
              </div>
              <div className="chat-header-info">
                <h3>{otherUser.name}</h3>
                <span className="chat-header-status">
                  {isOtherTyping ? (
                    <em className="typing-text">typing…</em>
                  ) : otherOnline ? (
                    "Online"
                  ) : (
                    "Offline"
                  )}
                </span>
              </div>
            </header>

            <div
              className="chat-messages"
              ref={messagesContainerRef}
              onScroll={onScroll}
            >
              {loadingHistory ? (
                <div className="chat-loading">
                  <LoaderCircle className="animate-spin" size={28} />
                </div>
              ) : error && messages.length === 0 ? (
                <div className="chat-error-state">
                  <AlertCircle size={32} />
                  <p>{error}</p>
                  <button onClick={() => loadHistory(selectedConvId)}>
                    Retry
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-empty-state">
                  <MessageSquare size={36} />
                  <p>No messages yet</p>
                  <span>Say hello to {otherUser.name} 👋</span>
                </div>
              ) : (
                <>
                  {loadingOlder && (
                    <div className="chat-loading-older">
                      <LoaderCircle className="animate-spin" size={18} />
                    </div>
                  )}
                  {!hasMore && (
                    <div className="chat-start-note">
                      Beginning of conversation
                    </div>
                  )}
                  {messagesByDay.map((group, gi) => (
                    <div key={gi} className="chat-day-group">
                      <div className="chat-day-divider">
                        <span>{group.divider}</span>
                      </div>
                      {group.items.map((msg) => (
                        <MessageBubble
                          key={msg._id}
                          msg={msg}
                          dbUser={dbUser}
                        />
                      ))}
                    </div>
                  ))}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-composer" onSubmit={handleSend}>
              {!connected && (
                <div className="chat-offline-composer-note">
                  <WifiOff size={12} /> Offline – messages will send when
                  reconnected
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
              />
              {/* <button
                type="button"
                className="chat-icon-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
              >
                <Paperclip size={18} />
              </button> */}

              <div className="chat-emoji-wrap">
                <button
                  type="button"
                  className="chat-icon-btn"
                  onClick={() => setShowEmoji((s) => !s)}
                  title="Emoji"
                >
                  <Smile size={18} />
                </button>
                {showEmoji && (
                  <div className="chat-emoji-picker">
                    {EMOJIS.map((e) => (
                      <button key={e} type="button" onClick={() => addEmoji(e)}>
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Type a message…"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                className="chat-input"
              />

              <button
                type="submit"
                className="chat-send-btn"
                disabled={!newMessage.trim() || sending}
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-no-selection">
            <MessageSquare size={48} />
            <h3>Select a conversation</h3>
            <p>Choose someone from the list to start chatting.</p>
            <button
              className="chat-back-to-list"
              onClick={() => setMobileShowChat(false)}
            >
              View conversations
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
