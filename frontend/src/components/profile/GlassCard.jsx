import React from "react";

/**
 * Reusable glassmorphism card used across the profile page.
 * `as` lets callers render a <section>, <div>, <article>, etc.
 */
const GlassCard = ({ as: Tag = "section", className = "", children, ...rest }) => (
  <Tag
    className={
      "rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-xl transition duration-300 hover:shadow-2xl hover:shadow-indigo-200/60 " +
      className
    }
    {...rest}
  >
    {children}
  </Tag>
);

export default GlassCard;
