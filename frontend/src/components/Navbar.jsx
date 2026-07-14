import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useChat } from "../Context/ChatContext";
import "../styles/Navbar.css";


const navItems = [
  { name: "Explore", path: "/" },
  { name: "Jobs", path: "/browse/jobs" },
  { name: "Freelancers", path: "/browse/freelancers" },
  { name: "Pricing", path: "/pricing" },
  { name: "Blog", path: "/blog" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { dbUser, logout } = useAuth();
  const { totalUnread } = useChat();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    if (logout) logout();
    closeMenu();
  };

  return (
    <nav id="mainNav">
      <div className="nav-inner">
        {/* Logo */}
        <NavLink to="/" className="nav-logo" onClick={closeMenu}>
          <div className="nav-logo-icon">
            <svg viewBox="0 0 16 16">
              <path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" />
            </svg>
          </div>

          Skill<span>Sphere</span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="nav-auth">
          {!dbUser ? (
            <>
              <NavLink to="/login">
                <button className="btn-ghost">Sign In</button>
              </NavLink>

              <NavLink to="/signup">
                <button className="btn-primary">Get Started</button>
              </NavLink>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {dbUser.role === "client" && (
                <NavLink to="/client/dashboard">
                  <button className="btn-ghost">Dashboard</button>
                </NavLink>
              )}

              {dbUser.role === "freelancer" && (
                <NavLink to="/freelancer/dashboard">
                  <button className="btn-ghost">Dashboard</button>
                </NavLink>
              )}

              {dbUser.role && (
                <>
                  <NavLink to="/chat" className="nav-messages-link">
                    <button className="btn-ghost">Messages</button>
                    {totalUnread > 0 && (
                      <span className="nav-unread-badge">
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}
                  </NavLink>
                  <NavLink to="/payments">
                    <button className="btn-ghost">Finances</button>
                  </NavLink>
                </>
              )}

              <NavLink to="/profile">
                <img
                  src={
                    dbUser.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      dbUser.name
                    )}`
                  }
                  alt={dbUser.name}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                    cursor: "pointer",
                  }}
                />
              </NavLink>

              <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{ color: "#e53e3e" }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          aria-label="Open Menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="7" x2="19" y2="7" />
            <line x1="3" y1="11" x2="19" y2="11" />
            <line x1="3" y1="15" x2="19" y2="15" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
<div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.name}
          </NavLink>
        ))}

        {!dbUser ? (
          <>
            <NavLink to="/login" onClick={closeMenu}>
              <button
                className="btn-ghost"
                style={{
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                Sign In
              </button>
            </NavLink>

            <NavLink to="/signup" onClick={closeMenu}>
              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                Get Started
              </button>
            </NavLink>
          </>
        ) : (
          <>
            {dbUser.role === "client" && (
              <NavLink
                to="/client/dashboard"
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
            )}

            {dbUser.role === "freelancer" && (
              <NavLink
                to="/freelancer/dashboard"
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
            )}

            {dbUser.role && (
              <>
                <NavLink to="/chat" onClick={closeMenu} className="nav-messages-link">
                  Messages
                  {totalUnread > 0 && (
                    <span className="nav-unread-badge">
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/payments" onClick={closeMenu}>Finances</NavLink>
              </>
            )}

            <NavLink
              to="/profile"
              onClick={closeMenu}
            >
              Profile
            </NavLink>

            <button
              onClick={handleLogout}
              className="btn-ghost"
              style={{ width: "100%", marginTop: "10px", color: "#e53e3e" }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;