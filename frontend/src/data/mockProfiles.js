/**
 * Mock profile documents used for UI preview / demos.
 *
 *   /profile?demo=freelancer   → renders the freelancer profile
 *   /profile?demo=client       → renders the client profile
 *
 * The shapes below match the backend `User` schema exactly so the same
 * rendering code path is exercised as with real API data.
 */

const mockFreelancer = {
  _id: "64f0c0ffee0000freelancer01",
  authId: "firebase_uid_freelancer",
  email: "ava.mitchell@example.com",
  name: "Ava Mitchell",
  profileImage: "https://i.pravatar.cc/400?img=47",
  role: "freelancer",
  bio: "Senior product designer & front-end engineer crafting calm, accessible interfaces for fast-moving teams. Previously at two YC startups. I love turning fuzzy ideas into shippable products.",
  location: "Bengaluru, India",
  isVerified: true,
  isBanned: false,
  createdAt: "2023-02-11T09:24:00.000Z",
  socialLinks: {
    linkedin: "https://linkedin.com/in/avamitchell",
    github: "https://github.com/avamitchell",
    twitter: "https://twitter.com/avamitchell",
    website: "https://ava.design",
  },
  freelancer: {
    headline: "Product Designer & React Engineer",
    skills: [
      "React",
      "TypeScript",
      "Figma",
      "Tailwind CSS",
      "Framer Motion",
      "Design Systems",
      "Node.js",
      "Accessibility",
      "Prototyping",
      "User Research",
    ],
    hourlyRate: 48,
    availability: "Available",
    languages: ["English", "Hindi", "Spanish"],
    portfolio: [
      {
        _id: "pf1",
        title: "Lumen — Fintech Dashboard",
        url: "https://ava.design/lumen",
        imageUrl:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        description:
          "End-to-end redesign of a retail banking dashboard. Cut task time by 38% and lifted CSAT to 4.7.",
      },
      {
        _id: "pf2",
        title: "Orbit — Design System",
        url: "https://ava.design/orbit",
        imageUrl:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
        description:
          "A 120-component multi-brand design system powering 6 products with 99% token coverage.",
      },
      {
        _id: "pf3",
        title: "Cadence — Mobile Banking",
        url: "https://ava.design/cadence",
        imageUrl:
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        description:
          "iOS banking app concept with a focus on micro-interactions and motion detailing.",
      },
    ],
    experience: [
      {
        _id: "ex1",
        title: "Lead Product Designer",
        company: "Northwind Labs",
        startDate: "2021-06-01",
        endDate: "",
        current: true,
        description:
          "Lead design for the core product surface. Mentor a team of 4 and own the design system.",
      },
      {
        _id: "ex2",
        title: "Senior UI Engineer",
        company: "Polestar Studio",
        startDate: "2018-03-01",
        endDate: "2021-05-01",
        current: false,
        description:
          "Built the component library and shipped the marketing site with a 98 Lighthouse score.",
      },
      {
        _id: "ex3",
        title: "Freelance Designer",
        company: "Self-employed",
        startDate: "2016-01-01",
        endDate: "2018-02-01",
        current: false,
        description: "Worked with 20+ early-stage startups on brand and product UI.",
      },
    ],
    education: [
      {
        _id: "ed1",
        school: "National Institute of Design",
        degree: "B.Des",
        fieldOfStudy: "Interaction Design",
        startDate: "2012-07-01",
        endDate: "2016-05-01",
      },
      {
        _id: "ed2",
        school: "Coursera",
        degree: "Specialization",
        fieldOfStudy: "Human-Computer Interaction",
        startDate: "2020-01-01",
        endDate: "2020-08-01",
      },
    ],
    certifications: [
      {
        _id: "c1",
        name: "Professional UX Design",
        issuer: "Google",
        year: "2022",
        url: "https://example.com/cert/google-ux",
      },
      {
        _id: "c2",
        name: "Accessibility (WCAG) Practitioner",
        issuer: "W3C",
        year: "2023",
        url: "https://example.com/cert/wcag",
      },
    ],
  },
  client: {
    company: "",
    organization: "",
    businessDescription: "",
    industry: "",
    website: "",
    hiringPreferences: { preferredSkills: [], budgetRange: "", engagementType: "", remoteOnly: false },
  },
};

const mockClient = {
  _id: "64f0c0ffee0000client0001",
  authId: "firebase_uid_client",
  email: "ops@brightwave.io",
  name: "Brightwave Studios",
  profileImage: "https://i.pravatar.cc/400?img=12",
  role: "client",
  bio: "We are a product studio helping ambitious teams ship delightful software. Currently hiring senior freelancers for web and mobile engagements.",
  location: "Remote — San Francisco, CA",
  isVerified: true,
  isBanned: false,
  createdAt: "2022-09-01T12:00:00.000Z",
  socialLinks: {
    linkedin: "https://linkedin.com/company/brightwave",
    github: "",
    twitter: "https://twitter.com/brightwave",
    website: "https://brightwave.io",
  },
  freelancer: {
    headline: "",
    skills: [],
    hourlyRate: 0,
    availability: "",
    languages: [],
    portfolio: [],
    experience: [],
    education: [],
    certifications: [],
  },
  client: {
    company: "Brightwave Studios",
    organization: "Brightwave Inc.",
    businessDescription:
      "Brightwave is a product studio that partners with founders to design, build, and scale software. We value craft, speed, and clear communication.",
    industry: "Software & Product Design",
    website: "https://brightwave.io",
    hiringPreferences: {
      preferredSkills: ["React", "TypeScript", "Figma", "Node.js", "Framer Motion"],
      budgetRange: "$5k - $25k",
      engagementType: "Either",
      remoteOnly: true,
    },
  },
};

/** Recent job postings shown on the client profile (purely illustrative). */
export const mockClientJobs = [
  {
    _id: "job1",
    title: "Senior React Engineer for Design System",
    budget: "$8k - $12k",
    applicants: 24,
    status: "Open",
    postedDate: "2026-06-28T10:00:00.000Z",
  },
  {
    _id: "job2",
    title: "Motion Designer — Marketing Site",
    budget: "$4k - $6k",
    applicants: 11,
    status: "In Review",
    postedDate: "2026-06-15T10:00:00.000Z",
  },
  {
    _id: "job3",
    title: "Full-stack Node + React Contract",
    budget: "$15k - $20k",
    applicants: 37,
    status: "Open",
    postedDate: "2026-05-30T10:00:00.000Z",
  },
];

export const mockProfiles = {
  freelancer: mockFreelancer,
  client: mockClient,
};
