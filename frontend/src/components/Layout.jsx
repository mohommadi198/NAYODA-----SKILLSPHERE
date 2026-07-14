import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Application shell — renders a fixed Navbar at the top, a scrollable
 * content area powered by React Router's <Outlet />, and a Footer.
 *
 * The component also scrolls to the top on every route change so
 * users always start at the top of a new page.
 */
const Layout = () => {
  const { pathname } = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page content — pt-20 accounts for the fixed navbar height */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;