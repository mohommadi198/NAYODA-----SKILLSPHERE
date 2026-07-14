import React from "react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    duration: "/month",
    color: "border-gray-200",
    button: "bg-gray-800 hover:bg-gray-900",
    features: [
      "Post up to 3 jobs",
      "Browse freelancers",
      "Basic messaging",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "₹499",
    duration: "/month",
    popular: true,
    color: "border-blue-500",
    button: "bg-blue-600 hover:bg-blue-700",
    features: [
      "Unlimited job posts",
      "AI freelancer matching",
      "Featured job listings",
      "Advanced search",
      "Invite freelancers",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    duration: "",
    color: "border-purple-500",
    button: "bg-purple-600 hover:bg-purple-700",
    features: [
      "Unlimited everything",
      "Dedicated account manager",
      "Team collaboration",
      "Analytics dashboard",
      "API Access",
      "24×7 Support",
    ],
  },
];

function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <h1 className="text-5xl font-bold text-slate-900">
            Simple Pricing
          </h1>

          <p className="mt-5 text-lg text-slate-600">
            Hire faster with powerful tools designed for modern businesses.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border ${plan.color} bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl`}
            >

              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </span>
              )}

              <h2 className="text-3xl font-bold">
                {plan.name}
              </h2>

              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-bold">
                  {plan.price}
                </span>

                <span className="pb-2 text-gray-500">
                  {plan.duration}
                </span>
              </div>

              <ul className="mt-8 space-y-4">

                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <span className="text-green-500">✔</span>

                    <span>{feature}</span>
                  </li>
                ))}

              </ul>

              <button
                className={`mt-10 w-full rounded-xl py-3 font-semibold text-white transition ${plan.button}`}
              >
                Get Started
              </button>

            </div>
          ))}

        </div>

        <div className="mt-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-center text-white">

          <h2 className="text-4xl font-bold">
            Need a custom solution?
          </h2>

          <p className="mt-4 text-blue-100">
            Contact our sales team for enterprise hiring solutions.
          </p>

          <button className="mt-8 rounded-xl bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-slate-100">
            Contact Sales
          </button>

        </div>
      </div>
    </div>
  );
}

export default Pricing;