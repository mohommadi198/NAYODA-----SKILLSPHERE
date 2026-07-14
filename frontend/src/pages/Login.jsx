import React, { useEffect, useRef, useState } from "react";
import "../styles/Login.css";
import { motion } from "framer-motion";

import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

import { HiOutlineCubeTransparent } from "react-icons/hi";
import { useAuth } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { syncUser } from "../services/userServices";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, googleSignIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectHandledRef = useRef(false);

  const normalizeRedirect = (value) => {
    if (!value || typeof value !== "string") return "/";
    if (value === "/login" || value === "/signup") return "/";
    return value;
  };

  const fromState = location.state?.from;
  const fromLocation =
    typeof fromState === "string" ? { pathname: fromState } : fromState;
  const fromPath = fromLocation?.pathname || "/";
  const fromSearch = fromLocation?.search || "";
  const fromHash = fromLocation?.hash || "";
  const from = normalizeRedirect(`${fromPath}${fromSearch}${fromHash}`);

  // Handle redirect AFTER auth is settled - only run once
  useEffect(() => {
    if (redirectHandledRef.current) return;
    if (authLoading) return; // Wait for auth to finish
    
    // If user is authenticated, let ProtectedRoute handle role selection
    // Don't auto-navigate here - let the route protection handle it
    if (user) {
      redirectHandledRef.current = true;
    }
  }, [authLoading, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(formData.email, formData.password);
      console.log("Logged in user UID:", result.user.uid);
      
      // Sync user with backend after email/password login
      await syncUser(result.user);
      
      // Navigate to home - ProtectedRoute will redirect to /choose-role if needed
      redirectHandledRef.current = true;
      // navigate("/",);
      window.location.href = "/";
    } catch (err) {
      console.error("Login Error:", err);
      if (err.message && err.message.includes("Email not confirmed")) {
        setError("Please verify your email address. Check your inbox.");
      } else if (err.status === 400 && err.message.includes("Grant Type")) {
        setError("Configuration Error: Invalid API Key or Auth Request.");
      } else {
        setError(err.message || "Failed to sign in. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const firebaseUser = await googleSignIn();

      if (firebaseUser) {
        // Sync user with backend
        await syncUser(firebaseUser);

        // Navigate to home - ProtectedRoute will handle role selection
        redirectHandledRef.current = true;
        // navigate("/", { replace: true });
      window.location.href = "/";

      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };
  return (
    <div className="login-page">
      <br/>
      <br/>
      <main className="login-container">
        <div className="ambient ambient-1"></div>
        <div className="ambient ambient-2"></div>

        <div className="glass-card">
          <div className="login-header">
            <div className="logo-icon">
              <HiOutlineCubeTransparent />
            </div>

            <h1>Welcome back</h1>

            <p>Log in to your freelancer portal</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <FaLock className="input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  name="password"
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <h1></h1>
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <button className="google-btn" onClick={handleGoogleSignIn}>
            {/* <FaGoogle /> */}
            <svg
              style={{ height: 20, width: 20 }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                fill="#EA4335"
              ></path>
            </svg>
            Continue with Google
          </button>

          <p className="signup-text">
            Don't have an account?
            <a href="/signup"> Sign Up</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
