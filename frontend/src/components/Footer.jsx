import { Link } from "react-router-dom";

const footerLinks = [
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy", path: "/privacy" },
  { name: "Terms", path: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 md:flex-row">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-bold text-white"
        >
          Skill<span className="text-blue-500">Sphere</span>
        </Link>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} SkillSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}