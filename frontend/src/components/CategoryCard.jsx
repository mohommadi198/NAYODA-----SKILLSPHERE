import React from "react";
import { Link } from "react-router-dom";

import "../styles/Home.css";


function CategoryCard({ category }) {
  return (
    <Link to={`browse/jobs?cat=${category.title}`} className="cat-card">
      <div
        className="cat-icon-wrap"
        style={{ background: "#f5f6ff" , color: "#2563eb" }}
      >
        {category.icon}
      </div>
      <div>
        <div className="cat-title">{category.title}</div>
        <div className="cat-desc">{category.description}</div>
      </div>
      <div className="cat-tags">
        {category.tags.map((tag , idx) => (
             <span className="cat-tag" key={idx}>{tag}</span>
        ))}
      </div>
      <div className="cat-footer">
        <span className="cat-count">{category.freelancersCount} freelancers</span>
        <svg
          className="cat-arrow"
          fill="none"
          viewBox="0 0 16 16"
          stroke="#2563eb"
          strokeWidth="1.8"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}

export default CategoryCard;
