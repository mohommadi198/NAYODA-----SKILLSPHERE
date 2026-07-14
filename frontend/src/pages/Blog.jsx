import React from "react";

const featuredPost = {
  id: 1,
  title: "The Future of Freelancing in 2026",
  description:
    "Discover how AI, remote work, and global talent are transforming the freelancing industry.",
  image:
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200",
  category: "Freelancing",
  author: "SkillSphere Team",
  date: "July 10, 2026",
};

const posts = [
  {
    id: 2,
    title: "10 Tips to Hire the Perfect Freelancer",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600",
    category: "Hiring",
    date: "July 8, 2026",
  },
  {
    id: 3,
    title: "How to Build an Outstanding Freelancer Profile",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
    category: "Career",
    date: "July 6, 2026",
  },
  {
    id: 4,
    title: "AI Tools Every Freelancer Should Use",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
    category: "AI",
    date: "July 3, 2026",
  },
  {
    id: 5,
    title: "Remote Work Trends You Should Know",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
    category: "Remote Work",
    date: "June 30, 2026",
  },
  {
    id: 6,
    title: "How to Win More Freelance Projects",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600",
    category: "Business",
    date: "June 28, 2026",
  },
  {
    id: 7,
    title: "React vs Next.js: Which Should Freelancers Learn?",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
    category: "Development",
    date: "June 25, 2026",
  },
];

function Blog() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">

          <h1 className="text-5xl font-bold">
            SkillSphere Blog
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            Insights, freelancing tips, hiring guides, AI, and technology.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <input
              placeholder="Search articles..."
              className="w-full rounded-xl border-0 px-5 py-4 text-black shadow-lg outline-none"
            />
          </div>

        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-center gap-3 px-6">

        {[
          "All",
          "Freelancing",
          "Hiring",
          "AI",
          "Business",
          "Career",
          "Development",
          "Remote Work",
        ].map((cat) => (
          <button
            key={cat}
            className="rounded-full border bg-white px-5 py-2 text-sm font-medium transition hover:bg-blue-600 hover:text-white"
          >
            {cat}
          </button>
        ))}

      </section>

      {/* Featured */}
      <section className="mx-auto mt-12 max-w-7xl px-6">

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl lg:flex">

          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            className="h-80 w-full object-cover lg:w-1/2"
          />

          <div className="flex flex-col justify-center p-10">

            <span className="mb-3 w-fit rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              {featuredPost.category}
            </span>

            <h2 className="text-4xl font-bold">
              {featuredPost.title}
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              {featuredPost.description}
            </p>

            <div className="mt-6 text-sm text-gray-500">
              {featuredPost.author} • {featuredPost.date}
            </div>

            <button className="mt-8 w-fit rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Read Article
            </button>

          </div>

        </div>

      </section>

      {/* Blog Grid */}
      <section className="mx-auto mt-16 max-w-7xl px-6 pb-20">

        <h2 className="mb-8 text-3xl font-bold">
          Latest Articles
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {posts.map((post) => (

            <div
              key={post.id}
              className="overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-2 hover:shadow-xl"
            >

              <img
                src={post.image}
                alt={post.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {post.category}
                </span>

                <h3 className="mt-4 text-xl font-bold">
                  {post.title}
                </h3>

                <p className="mt-4 text-sm text-gray-500">
                  {post.date}
                </p>

                <button className="mt-6 text-blue-600 font-semibold hover:underline">
                  Read More →
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Blog;