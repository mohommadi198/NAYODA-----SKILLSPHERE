import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FaQuestionCircle } from "react-icons/fa";

const faqs = [
  {
    question: "What is SkillSphere?",
    answer:
      "SkillSphere is an AI-powered freelance marketplace that connects clients with skilled professionals based on skills, ratings, location, and project requirements.",
  },
  {
    question: "How do I hire a freelancer?",
    answer:
      "Simply post your project, receive proposals from freelancers, compare profiles, and hire the best match.",
  },
  {
    question: "How do freelancers get paid?",
    answer:
      "Payments are securely held in escrow and released once the project milestones are completed and approved.",
  },
  {
    question: "Does SkillSphere charge any commission?",
    answer:
      "Yes. A small platform fee is deducted only after successful project completion.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Absolutely. All payments are encrypted and protected using secure payment gateways with escrow protection.",
  },
  {
    question: "Can I work remotely?",
    answer:
      "Yes. SkillSphere supports both remote and local freelance opportunities.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}

        <div className="mb-14 text-center">
          <span
            className="inline-block rounded-full bg-blue-100 px-4 py-2 font-semibold flex text-blue-600 text-center items-center justify-center"
          >
            <FaQuestionCircle size={20} /> <b className="text-lg ml-2">FAQ</b>
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Common
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Everything you need to know before getting started with SkillSphere.
          </p>
        </div>

        {/* FAQ */}

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-blue-200 shadow-lg"
                    : "border-gray-200 hover:border-blue-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </h3>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 bg-blue-600 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-gray-600 leading-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
