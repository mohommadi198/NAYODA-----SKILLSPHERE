import React, { useState, useMemo, useEffect } from "react";
import JobCard from "../components/JobCard";
import { getAllJobs } from "../services/jobsServices";
import JobModal from "../components/JobModal";

// Keeping the mock data outside the component prevents unnecessary redeclarations on every render
// const PROJECTS = [
//   {
//     id: 1,
//     title: "E-Commerce Platform with AI Recommendations",
//     type: "Development",
//     category: "Development",
//     desc: "Build a full-stack e-commerce platform with personalized product recommendations, cart, checkout, and admin dashboard.",
//     skills: ["React", "Node.js", "MongoDB", "AI/ML", "Stripe"],
//     budget: "$8,000 – $15,000",
//     budgetNum: 10000,
//     location: "Bangalore",
//     deadline: "45 days",
//     experience: "Expert",
//     proposals: 18,
//     milestones: ["Project setup & architecture", "Frontend UI", "Backend API", "AI recommendation engine", "Testing & launch"],
//   },
//   {
//     id: 2,
//     title: "Brand Identity & UI Design System",
//     type: "Design",
//     category: "Design",
//     desc: "Complete brand overhaul for a SaaS startup — logo, typography, color palette, and a 60-component Figma design system.",
//     skills: ["Figma", "UI/UX", "Branding", "Design Systems"],
//     budget: "$3,500 – $6,000",
//     budgetNum: 5000,
//     location: "Mumbai",
//     deadline: "21 days",
//     experience: "Intermediate",
//     proposals: 31,
//     milestones: ["Discovery & research", "Logo & brand", "Component library", "Handoff documentation"],
//   },
//   {
//     id: 3,
//     title: "Python Data Pipeline for BI Dashboard",
//     type: "Data Science",
//     category: "Data Science",
//     desc: "Architect and build an ETL pipeline ingesting 5M+ records/day from multiple sources into a PostgreSQL warehouse.",
//     skills: ["Python", "Airflow", "PostgreSQL", "dbt", "Tableau"],
//     budget: "$5,000 – $9,000",
//     budgetNum: 7000,
//     location: "Remote",
//     deadline: "30 days",
//     experience: "Expert",
//     proposals: 12,
//     milestones: ["Architecture design", "ETL development", "Data warehouse setup", "BI dashboard", "Documentation"],
//   },
//   {
//     id: 4,
//     title: "iOS & Android Fitness App",
//     type: "Development",
//     category: "Development",
//     desc: "Cross-platform fitness tracking app with workout plans, nutrition logging, wearable integration, and gamification.",
//     skills: ["Flutter", "Firebase", "Swift", "Kotlin", "UX Design"],
//     budget: "$12,000 – $22,000",
//     budgetNum: 17000,
//     location: "Delhi",
//     deadline: "90 days",
//     experience: "Expert",
//     proposals: 9,
//     milestones: ["UX wireframes", "Core app structure", "Health integrations", "Gamification", "App Store submission"],
//   },
//   {
//     id: 5,
//     title: "SEO Content Strategy — 50 Articles",
//     type: "Writing",
//     category: "Writing",
//     desc: "Research and write 50 SEO-optimised long-form articles (1,500+ words each) for a B2B SaaS brand in the HR tech niche.",
//     skills: ["SEO", "Content Writing", "Research", "HubSpot"],
//     budget: "$2,500 – $4,500",
//     budgetNum: 3500,
//     location: "Remote",
//     deadline: "60 days",
//     experience: "Intermediate",
//     proposals: 44,
//     milestones: ["Keyword research", "Content calendar", "Draft batch 1", "Draft batch 2", "Final edits & publish"],
//   },
//   {
//     id: 6,
//     title: "3D Product Animation — Launch Video",
//     type: "Video",
//     category: "Video",
//     desc: "Cinematic 60-second product reveal video for a hardware startup. Includes 3D modeling, animation, and sound design.",
//     skills: ["Cinema4D", "After Effects", "3D Modeling", "Sound Design"],
//     budget: "$4,000 – $7,500",
//     budgetNum: 5500,
//     location: "Hyderabad",
//     deadline: "28 days",
//     experience: "Expert",
//     proposals: 7,
//     milestones: ["Storyboard", "3D modeling", "Animation", "Color grading & sound", "Delivery"],
//   },
//   {
//     id: 7,
//     title: "Headless CMS Migration — Contentful",
//     type: "Development",
//     category: "Development",
//     desc: "Migrate a 2,000-page WordPress site to a headless Next.js + Contentful architecture with zero downtime.",
//     skills: ["Next.js", "Contentful", "WordPress", "TypeScript", "AWS"],
//     budget: "$6,000 – $11,000",
//     budgetNum: 8000,
//     location: "Remote",
//     deadline: "35 days",
//     experience: "Expert",
//     proposals: 15,
//     milestones: ["Audit & architecture", "Content modeling", "Frontend build", "Migration & QA", "Go-live"],
//   },
//   {
//     id: 8,
//     title: "UX Research & Usability Testing",
//     type: "Design",
//     category: "Design",
//     desc: "End-to-end UX research for a fintech app — user interviews, competitive analysis, heuristic evaluation, and report.",
//     skills: ["User Research", "Usability Testing", "Figma", "Miro", "Analytics"],
//     budget: "$1,800 – $3,200",
//     budgetNum: 2500,
//     location: "Pune",
//     deadline: "14 days",
//     experience: "Intermediate",
//     proposals: 22,
//     milestones: ["Research plan", "User interviews", "Competitive audit", "Usability testing", "Final report"],
//   },
//   {
//     id: 9,
//     title: "Machine Learning Model — Churn Prediction",
//     type: "Data Science",
//     category: "Data Science",
//     desc: "Build and deploy a churn prediction model for a subscription SaaS with 100k users. 92%+ accuracy target.",
//     skills: ["Python", "scikit-learn", "XGBoost", "FastAPI", "AWS SageMaker"],
//     budget: "$7,000 – $13,000",
//     budgetNum: 10000,
//     location: "Remote",
//     deadline: "42 days",
//     experience: "Expert",
//     proposals: 6,
//     milestones: ["Data exploration", "Feature engineering", "Model training", "API deployment", "Monitoring dashboard"],
//   },
//   {
//     id: 10,
//     title: "Social Media Growth Strategy — 6 months",
//     type: "Marketing",
//     category: "Marketing",
//     desc: "Develop and execute a LinkedIn + Instagram growth strategy for a B2B brand. Goal: 50k followers in 6 months.",
//     skills: ["Social Media", "Copywriting", "Analytics", "Canva", "Growth Hacking"],
//     budget: "$1,200 – $2,400",
//     budgetNum: 1800,
//     location: "Remote",
//     deadline: "180 days",
//     experience: "Intermediate",
//     proposals: 38,
//     milestones: ["Audit & strategy", "Content templates", "Month 1–3 execution", "Month 4–6 execution", "Final report"],
//   },
// ];

function BrowseJobs() {
  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");

  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Trigger State for the explicit "Search" button click
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    category: "",
    budget: "",
    location: "",
  });

  // Pagination Configuration
  const INITIAL_BATCH = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);

  useEffect(() => {
    getAllJobs()
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  // Click handler to snapshot and lock in the current filters
  const handleSearch = () => {
    setActiveFilters({ search, category, budget, location });
    setVisibleCount(INITIAL_BATCH); // Reset pagination on a brand new search
  };

  // Efficient combined compute: Filters item records first, memoized to protect layout shifts
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !activeFilters.search ||
        p.title.toLowerCase().includes(activeFilters.search.toLowerCase());
      const matchesCategory =
        !activeFilters.category || p.category === activeFilters.category;
      const matchesLocation =
        !activeFilters.location || p.location === activeFilters.location;

      let matchesBudget = true;
      if (activeFilters.budget) {
        if (activeFilters.budget === "Under $500")
          matchesBudget = p.budgetNum < 500;
        else if (activeFilters.budget === "$500 – $2,000")
          matchesBudget = p.budgetNum >= 500 && p.budgetNum <= 2000;
        else if (activeFilters.budget === "$2,000 – $10,000")
          matchesBudget = p.budgetNum >= 2000 && p.budgetNum <= 10000;
        else if (activeFilters.budget === "$10,000+")
          matchesBudget = p.budgetNum > 10000;
      }

      return (
        matchesSearch && matchesCategory && matchesLocation && matchesBudget
      );
    });
  }, [activeFilters, projects]);

  // Paginated Segment derived directly from the filtered results
  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const openProjectModal = (_id) => {
    const project = projects.find((p) => p._id === _id);

    if (!project) return;

    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };
  return (
    <div className="p-6">
      <div className="mb-6 text-left pl-5 px-4">
        <h1 className="text-3xl font-bold text-gray-800">
          <span className="text-blue-500 font-bold">Browse </span> Projects
        </h1>
        <p className="mt-2 text-gray-600">
          Find the perfect project for your skills and interests.
        </p>
      </div>

      {/* FILTER SECTION */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-end">
        {/* Search */}
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search Projects
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. React developer, logo design…"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Category */}
        <div className="w-full md:w-48">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option>Development</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>Writing</option>
            <option>Data Science</option>
            <option>Video</option>
          </select>
        </div>

        {/* Budget */}
        <div className="w-full md:w-48">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Budget
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            <option>Under $500</option>
            <option>$500 – $2,000</option>
            <option>$2,000 – $10,000</option>
            <option>$10,000+</option>
          </select>
        </div>

        {/* Location */}
        <div className="w-full md:w-48">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Anywhere</option>
            <option>Mumbai</option>
            <option>Delhi</option>
            <option>Bangalore</option>
            <option>Remote</option>
          </select>
        </div>

        {/* Search Trigger Button */}
        <button
          onClick={handleSearch}
          className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Search →
        </button>
      </div>

      {/* GRID */}
      {displayedProjects.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((p) => (
            <JobCard key={p._id} p={p} openProjectModal={openProjectModal} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-gray-500">
          <p className="text-lg font-medium">
            No projects found matching your criteria.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Try tweaking your search keywords or filters.
          </p>
        </div>
      )}

      {/* PAGINATION CONTROL */}
      {filteredProjects.length > visibleCount && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + INITIAL_BATCH)}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Load More Projects
          </button>
        </div>
      )}

      <JobModal
        isOpen={isModalOpen}
        onClose={closeProjectModal}
        project={selectedProject}
      />
    </div>
  );
}

export default BrowseJobs;
