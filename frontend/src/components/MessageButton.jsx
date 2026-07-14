import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../Context/ChatContext";
import { useAuth } from "../Context/AuthContext";
import { MessageCircle, Loader2 } from "lucide-react";

/**
 * Reusable button that starts (or resumes) a conversation with a user.
 * Works from Profile, Job details, Proposal, Dashboard, Project pages, etc.
 *
 * Props:
 *  - recipientId: string (required) – the user to message
 *  - projectId: string (optional) – associate conversation with a project/job
 *  - className: string (optional) – extra classes
 *  - label: string (optional) – button text
 *  - variant: "primary" | "ghost" | "icon" (default "primary")
 *  - ariaLabel: string (optional) – accessible label (useful for icon-only buttons)
 *  - onStarted: function (optional) – called with conversation after start
 */
export default function MessageButton({
  recipientId,
  projectId = null,
  className = "",
  label = "Message",
  variant = "primary",
  ariaLabel,
  onStarted,
}) {
  const { startConversation, connected } = useChat();
  const { dbUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const ariaProps = ariaLabel ? { "aria-label": ariaLabel } : {};

  if (!dbUser) {
    // Not logged in → send to login with return hint
    return (
      <button
        className={`message-btn message-btn-${variant} ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          navigate("/login");
        }}
        {...ariaProps}
      >
        <MessageCircle size={16} />
        {label}
      </button>
    );
  }

  // Can't message yourself
  if (dbUser._id.toString() === recipientId?.toString()) {
    return null;
  }

  const handleClick = async (e) => {
    e?.stopPropagation();
    setLoading(true);
    try {
      const conversation = await startConversation(recipientId, projectId);
      if (conversation) {
        onStarted?.(conversation);
        navigate("/chat", {
          state: { conversationId: conversation._id, recipientId },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const baseClass = `message-btn message-btn-${variant} ${className}`;

  return (
    <button
      className={baseClass}
      onClick={handleClick}
      disabled={loading}
      title={connected ? "Send a message" : "Reconnecting…"}
      {...ariaProps}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <MessageCircle size={16} />
      )}
      {label}
    </button>
  );
}
