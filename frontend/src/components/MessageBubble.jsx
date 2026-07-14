import {
  Send,
  Search,
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Smile,
  WifiOff,
  AlertCircle,
  Loader2,
  Check,
  CheckCheck,
} from "lucide-react";
import { formatFileSize, formatTime } from "../utils/chatUtils";

/** Individual message bubble with text/emoji/image/file/link rendering */
export default function MessageBubble({ msg, dbUser }) {
  const isMe = msg.sender?._id?.toString() === dbUser?._id?.toString();
  const showRead = isMe && msg.isRead;
  const failed = msg.failed;
  const pending = msg.pending;

  return (
    <div className={`chat-msg ${isMe ? "me" : "them"}`}>
      <div className={`chat-bubble ${isMe ? "bubble-me" : "bubble-them"}`}>
        {msg.type === "image" && msg.attachment?.url && (
          <a href={msg.attachment.url} target="_blank" rel="noreferrer">
            <img
              src={msg.attachment.url}
              alt={msg.attachment.name || "image"}
              className="chat-msg-image"
            />
          </a>
        )}

        {msg.type === "file" && msg.attachment?.url && (
          <a
            href={msg.attachment.url}
            target="_blank"
            rel="noreferrer"
            className="chat-file-card"
          >
            <Paperclip size={22} />
            <div>
              <div className="chat-file-name">{msg.attachment.name || "File"}</div>
              <div className="chat-file-size">{formatFileSize(msg.attachment.size)}</div>
            </div>
          </a>
        )}

        {msg.type === "text" && <p className="chat-msg-text">{msg.content}</p>}
        {msg.type === "emoji" && <p className="chat-msg-emoji">{msg.content}</p>}
        {msg.type === "link" && (
          <a href={msg.content} target="_blank" rel="noreferrer" className="chat-msg-link">
            {msg.content}
          </a>
        )}

        <div className="chat-msg-meta">
          <span>{formatTime(msg.createdAt)}</span>
          {isMe &&
            (failed ? (
              <span className="chat-msg-failed">Failed</span>
            ) : showRead ? (
              <CheckCheck size={13} className="read-receipt" />
            ) : pending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Check size={13} />
            ))}
        </div>
      </div>
    </div>
  );
}
