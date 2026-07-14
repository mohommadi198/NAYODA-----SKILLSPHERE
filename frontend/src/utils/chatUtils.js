/**
 * Shared helpers for the chat/messaging UI.
 */

/** Format a Date (or ISO string) as a short time like "2:45 PM" */
export function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Format a timestamp for the conversation list (Today, Yesterday, or date) */
export function formatConversationTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round((startOfToday - startOfMsg) / 86400000);

  if (dayDiff === 0) return formatTime(ts);
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

/** Format a date for the message divider (e.g., "Today", "March 5") */
export function formatDayDivider(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round((startOfToday - startOfMsg) / 86400000);
  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  return d.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Human-readable file size */
export function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Detect whether a string is a bare URL (for link-type messages) */
export function isBareUrl(text) {
  return /^https?:\/\/\S+$/i.test((text || "").trim());
}

/** Extract the first URL from a text string (for previews) */
export function extractUrl(text) {
  if (!text) return null;
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
}

/** Escape HTML to safely render in tooltips (not used for content) */
export function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
