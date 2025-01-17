import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// SectionTitle Component
const SectionTitle = ({ preTitle, title, children }) => {
  return (
    <div className="mb-12 text-center">
      <h4 className="text-lg font-semibold text-indigo-600 uppercase">
        {preTitle}
      </h4>
      <h2 className="mt-2 text-3xl font-bold text-white">{title}</h2>
      <p className="mt-5 text-lg text-white">{children}</p>
    </div>
  );
};

// FAQ data
const faqdata = [
  {
    question: "How can local communities avail benefits from Udaan?",
    answer: "The platform encourages community involvement through Self-Help Groups (SHGs) and peer-to-peer lending models, creating a community-based trust system.",
  },
  {
    question: "How does the credit scoring system work for individuals with limited financial history?",
    answer: "Our platform develops credit scores based on alternative data sources, such as transaction history, savings habits, and repayment patterns within the community. By evaluating these factors, we can create a more comprehensive and inclusive credit profile for individuals who may not have access to traditional banking services.",
  },
  {
    question: "How does the platform ensure loan repayment?",
    answer:
      "The platform incorporates community-based support and peer monitoring, especially within SHGs or peer-to-peer networks. Repayment reminders are sent via SMS, and local partnerships help maintain close communication with borrowers.",
  },
  {
    question: "What role do local partnerships play in this lending model?",
    answer:
      "Local partnerships with community organizations, NGOs, and local financial institutions help us reach and support rural borrowers effectively. These partnerships assist in digital literacy training, onboarding, and guiding borrowers through the process.",
  },
];

// Faq Component
const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null); // State to track which FAQ is open

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle open/close state
  };

  return (
    <div className="mt-8">
      <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
       
      </SectionTitle>
      <div className="!p-0">
        <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
          {faqdata.map((item, index) => (
            <div key={item.question} className="mb-5">
              <div>
                <button
                  onClick={() => toggleFAQ(index)} // Toggle FAQ on button click
                  className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-700 hover:bg-indigo-400 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200"
                >
                  <span className="text-white">{item.question}</span>
                  <i
                    className={`${
                      openIndex === index ? "transform rotate-180" : ""
                    } w-5 h-5 text-indigo-400`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && ( // Show answer if the current index is open
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: 0.5, // Increase duration for smooth animation
                        ease: [0.4, 0, 0.2, 1], // Custom easing function for smoother transition
                      }}
                      className="rounded-lg px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
