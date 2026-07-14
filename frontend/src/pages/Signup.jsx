import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link , useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

import { syncUser } from "../services/userServices";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { signup, googleSignIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectHandledRef = useRef(false);
  const redirectKey = "authRedirectTo";

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

  const readRedirect = () => {
    try {
      return sessionStorage.getItem(redirectKey);
    } catch (err) {
      return null;
    }
  };

  const writeRedirect = (value) => {
    try {
      sessionStorage.setItem(redirectKey, value);
    } catch (err) {
      // Ignore storage errors (e.g., private mode)
    }
  };

  const clearRedirect = () => {
    try {
      sessionStorage.removeItem(redirectKey);
    } catch (err) {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    if (redirectHandledRef.current) return;
    if (authLoading || !user) return;

    const storedRedirect = readRedirect();
    const target = storedRedirect || "/";
    if (storedRedirect) {
      clearRedirect();
    }

    redirectHandledRef.current = true;
    navigate(target, { replace: true });
  }, [authLoading, user, navigate]);

  
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    return setError("Please fill in all fields");
  }

  if (password !== confirmPassword) {
    return setError("Passwords do not match");
  }

  if (password.length < 6) {
    return setError("Password must be at least 6 characters");
  }

  setError("");
  setLoading(true);

  try {
    const firebaseUser = await signup(name, email, password);

    console.log(firebaseUser);

    await syncUser(firebaseUser);

    redirectHandledRef.current = true;

    navigate("/choose-role", { replace: true });

  } catch (err) {
    console.error(err);

    setError(err.message || "Failed to create account");
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      writeRedirect(normalizeRedirect(from || "/"));

      const firebaseUser = await googleSignIn();

      if (firebaseUser) {
        // Always sync
        await syncUser(firebaseUser);

        clearRedirect();
        redirectHandledRef.current = true;
        navigate("/choose-role", { replace: true });
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      clearRedirect();
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
    <br />
        <br />
        <br />
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-gray-50">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join us to start shopping for premium fabrics
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 mt-6"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Or join with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Sign up with Google
          </button>

          <p className="mt-10 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default Signup;
