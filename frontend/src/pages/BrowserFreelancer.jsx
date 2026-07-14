import React, { useEffect, useState } from "react";
import FreelancerCard from "../components/FreelancerCard";
import { getAllFreelancers } from "../services/freelancerServices";

function BrowseFreelancers() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [freelancers, setFreelancers] = useState([]); // This will hold the fetched freelancers

  // Pagination State
  const INITIAL_BATCH = 8;
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);

 const fetchFreelancers = async () => {
  try {
    const data = await getAllFreelancers();

    setFreelancers(data);
    setFilteredFreelancers(data);
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    fetchFreelancers();
  }, []);


  const filterFreelancers = () => {
    let data = [...freelancers];
    if (search) {
      data = data.filter((f) => {
        const q = search.toLowerCase();

        return (
          f.name?.toLowerCase().includes(q) ||
          f.bio?.toLowerCase().includes(q) ||
          f.location?.toLowerCase().includes(q) ||
          f.skills?.some((skill) => skill.toLowerCase().includes(q))
        );
      });
    }

    // if (category) {
    //   data = data.filter((f) => f.category === category);
    // }

    if (location) {
      data = data.filter((f) =>
        f.location.toLowerCase().includes(location.toLowerCase()),
      );
    }

    if (budget) {
      switch (budget) {
        case "Under ₹500":
          data = data.filter((f) => f.rate < 500);
          break;

        case "₹500 - ₹1000":
          data = data.filter((f) => f.rate >= 500 && f.rate <= 1000);
          break;

        case "₹1000 - ₹3000":
          data = data.filter((f) => f.rate >= 1000 && f.rate <= 3000);
          break;

        case "₹3000+":
          data = data.filter((f) => f.rate > 3000);
          break;

        default:
          break;
      }
    }

    setFilteredFreelancers(data);
    setVisibleCount(INITIAL_BATCH); // Reset back to showing first 8 on new search
  };

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4); // Show 4 more on click
  };

  const openProjectModal = (id) => {
    console.log("Open project:", id);
  };

  // Slice the filtered results based on page view counts
const displayedFreelancers =
  filteredFreelancers.slice(0, visibleCount);

  return (
    <div className="p-6">

      <div className="mb-6 text-left pl-5 px-4">
        <h1 className="text-3xl font-bold text-gray-800">
          <span className="text-blue-500 font-bold">Browse </span> Freelancers
        </h1>
        <p className="mt-2 text-gray-600">
          Find the perfect freelancer for your skills and interests.
        </p>
      </div>

      {/* FILTER SECTION */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-end">
        {/* Search */}
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search Freelancers
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
<option>Under ₹500</option>
<option>₹500 - ₹1000</option>
<option>₹1000 - ₹3000</option>
<option>₹3000+</option>
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

        {/* Button */}
        <button
          onClick={filterFreelancers}
          className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
        >
          Search →
        </button>
      </div>

      {/* GRID SECTION */}
      <section className="mt-10 bg-gradient-to-b from-white to-slate-50 pb-12">
        {displayedFreelancers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {displayedFreelancers.map((f) => (
                <FreelancerCard key={f.id || f._id} f={f} openModal={openProjectModal} />
              ))}
            </div>

            {/* LOAD MORE BUTTON */}
            {visibleCount < filteredFreelancers.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMore}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
                >
                  Load More Freelancers
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm font-medium">
            No freelancers match your chosen filters.
          </div>
        )}
      </section>
    </div>
  );
}

export default BrowseFreelancers;
