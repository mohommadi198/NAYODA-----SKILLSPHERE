import React from "react";
import { motion } from "framer-motion";

/**
 * Animated circular progress ring used in the sidebar to visualise profile
 * completion. The coloured stroke animates from 0 → `value` on mount.
 *
 * @param {object} props
 * @param {number} [props.value=0] - Completion percentage (0–100).
 * @param {number} [props.size=120] - SVG diameter in px.
 * @param {number} [props.stroke=10] - Stroke width in px.
 */
const ProfileCompletionRing = ({ value = 0, size = 120, stroke = 10 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 80 ? "#10b981" : clamped >= 50 ? "#6366f1" : "#f59e0b";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Profile ${clamped}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-slate-900">{clamped}%</span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
          Complete
        </span>
      </div>
    </div>
  );
};

export default ProfileCompletionRing;
