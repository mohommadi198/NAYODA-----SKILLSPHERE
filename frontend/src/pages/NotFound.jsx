import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-6">

      {/* Background Blur */}
      <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl text-center"
      >
        {/* 404 */}
        <motion.h1
          animate={{ y: [-8, 8, -8] }}
          transition={{
            repeat: Infinity,
            duration: 4,
          }}
          className="text-8xl font-extrabold md:text-[180px]"
        >
          <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
            404
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-4xl font-bold text-slate-900"
        >
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-5 max-w-xl text-lg text-slate-600"
        >
          The page you're looking for doesn't exist, has been moved,
          or the URL might be incorrect.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/"
            className="rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-cyan-600"
          >
            🏠 Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 shadow-md transition-all hover:scale-105 hover:border-cyan-500 hover:text-cyan-600"
          >
            ← Go Back
          </button>
        </motion.div>

        {/* Floating Illustration */}
        <motion.div
          animate={{
            rotate: [-5, 5, -5],
            y: [-10, 10, -10],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="mt-16 text-[120px]"
        >
          🚀
        </motion.div>
      </motion.div>
    </div>
  );
}