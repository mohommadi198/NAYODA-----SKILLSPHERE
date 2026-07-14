import React from "react";
import "../styles/Home.css";
import { AdIcon, Pen, Settings } from "lucide-react";
import { FaThinkPeaks } from "react-icons/fa";
import CategoryCard from "../components/CategoryCard";
import { Link } from "react-router-dom";

function Home() {
  const categories = [
    {
      id: "development",
      title: "Development",
      description: "Web, mobile, and software engineers",
      freelancersCount: "48,200+",
      tags: ["React", "Node.js", "Python", "iOS"],
      icon: <Settings />,
    },
    {
      id: "design-creative",
      title: "Design & Creative",
      description: "UI/UX, branding, and illustration",
      freelancersCount: "32,500+",
      tags: ["Figma", "Branding", "UI/UX", "Logo"],
      icon: <FaThinkPeaks />,
    },
    {
      id: "writing-content",
      title: "Writing & Content",
      description: "Copywriters, bloggers, and editors",
      freelancersCount: "27,100+",
      tags: ["Blog", "Copywriting", "SEO", "Technical"],
      icon: <Pen />,
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing",
      description: "SEO, ads, and social media experts",
      freelancersCount: "19,800+",
      tags: ["SEO", "PPC", "Social", "Email"],
      icon: <AdIcon />,
    },
  ];

  return (
    <main className="pt-16">
      <h2 className="sr-only">
        FreelanceHub – Find the perfect freelancer for any project
      </h2>

      <section className="hero">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="hero-blob1" aria-hidden="true"></div>
        <div className="hero-blob2" aria-hidden="true"></div>
        <div className="hero-content">
          <div className="badge">
            <svg viewBox="0 0 16 16">
              <path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" />
            </svg>
            Trusted by 50,000+ businesses worldwide
          </div>
          <h1>
            Find the
            <span className="hl">
              Perfect Freelancer
              <svg
                className="underline-svg"
                viewBox="0 0 340 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
               //aria-hidden="true"
              >
                <path
                  d="M2 10 Q85 2 170 10 Q255 18 338 10"
                  stroke="#60a5fa"
                  stroke-width="3.5"
                  stroke-linecap="round"
                />
              </svg>{" "}
            </span>
            <br />
            for Any Project
          </h1>
          <p className="hero-desc">
            Connect with talented professionals across 500+ skill categories.
            Post a project in minutes and receive proposals from verified
            experts today.
          </p>
          <div className="hero-btns">
            <Link to="/browse/freelancers" className="btn-hero-primary">
              Find Talent Now
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11"
                  stroke="white"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Link>
            
            <button
              className="btn-hero-secondary"
              onClick={() => {
                const el = document.getElementById("ai-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="play-circle">
                <svg viewBox="0 0 12 12">
                  <polygon points="3,1 11,6 3,11" />
                </svg>
              </div>
              Watch Demo
            </button>
          </div>

          <div className="trending">
            <span className="trending-label">Trending:</span>
            <Link to="/browse/jobs" className="tag">
              UI Design
            </Link>
            <Link to="/browse/jobs" className="tag">
              React Dev
            </Link>
            <Link to="/browse/jobs" className="tag">
              SEO Writing
            </Link>
            <Link to="/browse/jobs" className="tag">
              Video Edit
            </Link>
            <Link to="/browse/jobs" className="tag">
              Data Analysis
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div
              className="stat-icon"
              //  style="background: #eff6ff"
              style={{ background: "#eff6ff" }}
            >
              <svg viewBox="0 0 20 20" fill="#2563eb">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.97 5.97 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.97 5.97 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div>
              <div className="stat-val">250K+</div>
              <div className="stat-name">Active Freelancers</div>
              <div className="stat-desc">
                Skilled professionals ready to work
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div
              className="stat-icon"
              //  style="background: #faf5ff"
              style={{ background: "#faf5ff" }}
            >
              <svg viewBox="0 0 20 20" fill="#7c3aed">
                <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <div>
              <div className="stat-val">1.2M</div>
              <div className="stat-name">Projects Completed</div>
              <div className="stat-desc">Successfully delivered worldwide</div>
            </div>
          </div>
          <div className="stat-card">
            <div
              className="stat-icon"
              //  style="background: #fefce8"
              style={{ background: "#faf5ff" }}
            >
              <svg viewBox="0 0 20 20" fill="#f59e0b">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <div className="stat-val">4.9/5</div>
              <div className="stat-name">Average Rating</div>
              <div className="stat-desc">Based on verified client reviews</div>
            </div>
          </div>
          <div className="stat-card">
            <div
              className="stat-icon"
              // style="background: #f0fdf4"
              style={{ background: "#faf5ff" }}
            >
              <svg viewBox="0 0 20 20" fill="#10b981">
                <path
                  fill-rule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="stat-val">98%</div>
              <div className="stat-name">Satisfaction Rate</div>
              <div className="stat-desc">Clients who recommend us</div>
            </div>
          </div>
        </div>
      </section>

      <section className="categories">
        <div
          style="max-width: 1280px; margin: 0 auto"
          style={{ maxWidth: "1280px", margin: "0 auto" }}
        >
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Browse by category</div>
              <h2 className="section-title">Explore Top Categories</h2>
            </div>
            <Link to="/browse/jobs" className="see-all">
              View all categories
              <svg viewBox="0 0 14 14">
                <path
                  d="M3 7h8M7 3l4 4-4 4"
                  stroke="currentColor"
                  stroke-width="1.6"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="cat-grid">
            {categories.map((cat, idx) => (
              <div key={cat.id || idx}>
                <CategoryCard category={cat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-section" id="ai-section">
        <div className="ai-inner">
          <div className="ai-cards">
            <div className="ai-blob" aria-hidden="true"></div>
            <div className="ai-card">
              <div
                className="ai-card-icon"
                //style="background: linear-gradient(135deg, #2563eb, #4f46e5)"
                style={{
                  background: "linear-gradient(135deg , #2563eb , #4f46e5)",
                }}
              >
                97%
              </div>
              <div>
                <div className="ai-card-label">AI Match Score</div>
                <div className="ai-card-sub">Best fit for your project</div>
              </div>
              <div className="ai-pulse"></div>
            </div>
            <div className="ai-card">
              <div
                className="ai-card-icon"
                // style="background: linear-gradient(135deg, #10b981, #0891b2)"
                style={{
                  background: "linear-gradient(135deg , #10b981 , #0891b2)",
                }}
              >
                &lt;2hrs
              </div>
              <div>
                <div className="ai-card-label">Average Response</div>
                <div className="ai-card-sub">Top freelancers reply fast</div>
              </div>
              <div
                className="ai-pulse"
                //style="background: #60a5fa"
                style={{ background: "#60a5fa" }}
              ></div>
            </div>
            <div className="ai-card">
              <div
                className="ai-card-icon"
                //style="background: linear-gradient(135deg, #7c3aed, #a855f7)"
                style={{
                  background: "linear-gradient(135deg , #7c3aed , #a855f7)",
                }}
              >
                15hrs
              </div>
              <div>
                <div className="ai-card-label">Time Saved</div>
                <div className="ai-card-sub">
                  Compared to traditional hiring
                </div>
              </div>
              <div
                className="ai-pulse"
                //style="background: #a78bfa"
                style={{ background: "#a78bfa" }}
              ></div>
            </div>
          </div>
          <div className="ai-right">
            <div>
              <div className="ai-eyebrow">
                <svg viewBox="0 0 14 14">
                  <path
                    d="M7 1l1.5 4h4L9 7l1.2 4L7 9 3.8 11 5 7 1.5 5h4z"
                    fill="currentColor"
                  />
                </svg>
                Powered by AI
              </div>
              <h2
                className="ai-title"
                //  style="margin-top: 10px"
                style={{ marginTop: "10px" }}
              >
                Smarter Hiring with <span>Artificial Intelligence</span>
              </h2>
              <p
                className="ai-desc"
                //style="margin-top: 14px"
                style={{ marginTop: "14px" }}
              >
                Our AI understands your project needs better than any form ever
                could. Describe what you're building and get matched with expert
                freelancers who have the exact skills you need.
              </p>
            </div>
            <div className="ai-features">
              <div className="ai-feature">
                <div
                  className="ai-feature-icon"
                  //style="background: #eff6ff"
                  style={{ background: "#eff6ff" }}
                >
                  <svg
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="#2563eb"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  >
                    <path d="M9 2v4M9 12v4M2 9h4M12 9h4M4.3 4.3l2.8 2.8M10.9 10.9l2.8 2.8M13.7 4.3l-2.8 2.8M7.1 10.9l-2.8 2.8" />
                  </svg>
                </div>
                <div>
                  <div className="ai-feature-title">Smart Matching</div>
                  <div className="ai-feature-desc">
                    AI analyzes your project requirements and matches you with
                    the most qualified freelancers in seconds.
                  </div>
                </div>
              </div>
              <div className="ai-feature">
                <div
                  className="ai-feature-icon"
                  // style="background: #f0fdf4"
                  style={{ background: "#f0fdf4" }}
                >
                  <svg
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="#10b981"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  >
                    <path d="M9 1L14 3.5v5L9 17 4 8.5V3.5z" />
                    <path d="M6 8l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <div className="ai-feature-title">Verified talent</div>
                  <div className="ai-feature-desc">
                    Every freelancer goes through skill assessments and identity
                    verification before joining the platform.
                  </div>
                </div>
              </div>
              <div className="ai-feature">
                <div
                  className="ai-feature-icon"
                  // style="background: #faf5ff"
                  style={{ background: "#faf5ff" }}
                >
                  <svg
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="#7c3aed"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  >
                    <circle cx="9" cy="9" r="7" />
                    <path d="M9 5v4l3 2" />
                  </svg>
                </div>
                <div>
                  <div className="ai-feature-title">Real-time insights</div>
                  <div className="ai-feature-desc">
                    Live project tracking, progress reports, and performance
                    analytics all in one dashboard.
                  </div>
                </div>
              </div>
            </div>
            <div className="ai-actions">
              <Link to="/browse/freelancers" className="btn-ai">
                <svg viewBox="0 0 14 14">
                  <path
                    d="M7 1l1.5 4h4L9 7l1.2 4L7 9 3.8 11 5 7 1.5 5h4z"
                    fill="white"
                  />
                </svg>
                Try AI Matching
              </Link>
              <Link to="/faq" className="btn-link">
                Learn how it works →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div
          //  style="max-width: 1280px; margin: 0 auto"
          style={{ maxWidth: "1280px", margin: "0 auto" }}
        >
          <div
            // style="text-align: center; margin-bottom: 44px"
            style={{ textAlign: "center", marginBottom: "44px" }}
          >
            <div className="section-eyebrow">Client success stories</div>
            <h2
              className="section-title"
              //   style="margin-top: 6px"
              style={{ marginTop: "6px" }}
            >
              What Our Clients Say
            </h2>
            <p
              // style="font-size: 15px; color: #475569; margin-top: 10px"
              style={{ color: "#475569", fontSize: "15px", marginTop: "10px" }}
            >
              Join thousands of businesses that found their perfect freelancer.
            </p>
          </div>
          <div className="test-grid">
            <div className="test-card">
              <div className="test-stars">
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
              </div>
              <p className="test-text">
                "FreelanceHub transformed how we source design talent. We went
                from weeks of interviews to having a world-class designer
                working on our app within 48 hours. The quality is consistently
                outstanding."
              </p>
              <span className="test-tag">Product Design</span>
              <div className="test-author">
                <img
                  className="test-avatar"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format"
                  alt="Jennifer Walsh"
                  loading="lazy"
                />
                <div>
                  <div className="test-name">Jennifer Walsh</div>
                  <div className="test-role">Product Manager · TechNova</div>
                </div>
              </div>
            </div>
            <div className="test-card">
              <div className="test-stars">
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
              </div>
              <p className="test-text">
                "As a startup founder, I needed reliable development help
                without the overhead of full-time hires. FreelanceHub gave me
                access to senior engineers who hit the ground running
                immediately."
              </p>
              <span className="test-tag">Web Development</span>
              <div className="test-author">
                <img
                  className="test-avatar"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format"
                  alt="David Kim"
                  loading="lazy"
                />
                <div>
                  <div className="test-name">David Kim</div>
                  <div className="test-role">Founder & CEO · LaunchPad</div>
                </div>
              </div>
            </div>
            <div className="test-card">
              <div className="test-stars">
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
                <svg viewBox="0 0 15 15">
                  <polygon
                    points="7.5,0 9.5,5.5 15,6 11,9.5 12.5,15 7.5,12 2.5,15 4,9.5 0,6 5.5,5.5"
                    fill="#f59e0b"
                  />
                </svg>
              </div>
              <p className="test-text">
                "The AI matching is genuinely impressive. I described our
                content needs and was connected with writers who understood our
                brand voice immediately. Saved us months of trial and error."
              </p>
              <span className="test-tag">Content Strategy</span>
              <div className="test-author">
                <img
                  className="test-avatar"
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&auto=format"
                  alt="Maria Santos"
                  loading="lazy"
                />
                <div>
                  <div className="test-name">Maria Santos</div>
                  <div className="test-role">Marketing Director · GrowthCo</div>
                </div>
              </div>
            </div>
          </div>
          <div className="test-trust">
            <div className="trust-item">
              <div className="trust-val">4.9/5</div>
              <div className="trust-label">Average rating</div>
            </div>
            <div className="trust-item">
              <div className="trust-val">98%</div>
              <div className="trust-label">Would recommend</div>
            </div>
            <div className="trust-item">
              <div className="trust-val">50K+</div>
              <div className="trust-label">Happy clients</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-box">
          <div className="cta-circle1" aria-hidden="true"></div>
          <div className="cta-circle2" aria-hidden="true"></div>
          <div className="cta-badge">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path
                d="M7 1l1.5 4h4L9 7l1.2 4L7 9 3.8 11 5 7 1.5 5h4z"
                fill="white"
              />
            </svg>
            No subscription required
          </div>
          <h2 className="cta-title">Ready to Find Your Perfect Freelancer?</h2>
          <p className="cta-desc">
            Post your project for free and receive proposals from qualified
            freelancers within hours. No commitment, no hidden fees.
          </p>
          <div className="cta-btns">
            <Link to="/create-gig" className="btn-cta-white">
              Post a Project – It's Free
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11"
                  stroke="#2563eb"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Link>
            <Link to="/browse/freelancers" className="btn-cta-outline">
              Browse Freelancers
            </Link>
          </div>
          <p className="cta-note">
            Trusted by 50,000+ businesses · Secure payments · 24/7 support
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
