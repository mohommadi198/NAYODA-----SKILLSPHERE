// frontend/src/components/AuthErrorBoundary.jsx
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { AUTH_ROUTES } from "../utils/constants";
import { useNavigate } from "react-router-dom";

class AuthErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Auth Error Boundary caught:", error, errorInfo);

    // If it's an auth error, clear auth state
    if (error.message?.includes("auth") || error.message?.includes("token")) {
      // The AuthProvider will handle cleanup via its error state
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an authentication error. Please try signing in
              again.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = AUTH_ROUTES.LOGIN;
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign In Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component that uses hooks
export const AuthErrorBoundaryWrapper = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // This component doesn't catch errors itself, but provides a fallback UI
  // The actual boundary is the class component above
  return <AuthErrorBoundary>{children}</AuthErrorBoundary>;
};

export default AuthErrorBoundary;
