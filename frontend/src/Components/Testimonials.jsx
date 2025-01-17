import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

// SectionTitle Component
const SectionTitle = ({ preTitle, title, children }) => {
  return (
    <div className="mb-12 text-center">
      <h4 className="text-lg font-semibold text-indigo-600 uppercase">
        {preTitle}
      </h4>
      <h2 className="mt-2 text-3xl font-bold text-white">{title}</h2>
      <p className="mt-4 text-lg text-white">{children}</p>
    </div>
  );
};

// Testimonials Component
export const Testimonials = () => {
  return (
    <div className="px-14">
      <SectionTitle
        preTitle="Testimonials"
        title="Here's what our users said"
      >
      </SectionTitle>
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
        <TestimonialCard
          quote="I never thought I’d have access to financial help without a bank nearby. This platform is truly changing lives in our community."
          name="Vaishali Lodha"
          title="Artisan"
          image="https://nextly.web3templates.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser1.71c84e11.jpg&w=48&q=75"
        />
        <TestimonialCard
          quote="Udaan just made getting a small loan so easy. I was able to expand my shop, and the process was quick and secure!"
          name="Raju Makattil"
          title="Local Shop Owner"
          image="https://nextly.web3templates.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser2.33ea1ca7.jpg&w=48&q=75"
        />
        <TestimonialCard
          quote="Being part of a self-help group and using this app has given me more control over my finances and helped me build my credit."
          name="Sajin KT"
          title="District Tehsildar"
          image="https://nextly.web3templates.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser3.b804ab99.jpg&w=48&q=75"
        />
      </div>
    </div>
  );
};

// TestimonialCard Component with Animation, Overflow Handling, and Hover Effect
const TestimonialCard = ({ quote, name, title, image }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col justify-between w-full h-full bg-gray-600 px-14 rounded-2xl py-14 dark:bg-trueGray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 60 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.15 }}  // Add the scale transformation on hover
    >
      {/* Quote Text */}
      <p className="text-2xl leading-normal text-white">{quote}</p>
      <Avatar image={image} name={name} title={title} />
    </motion.div>
  );
};

// Avatar Component
function Avatar({ image, name, title }) {
  return (
    <div className="flex items-center mt-8 space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full w-14 h-14">
        <img
          src={image}
          width="40"
          height="40"
          alt="Avatar"
          className="object-cover"
        />
      </div>
      <div>
        <div className="text-xl text-indigo-300 font-medium">{name}</div>
        <div className="text-gray-600 dark:text-white">{title}</div>
      </div>
    </div>
  );
}

// Mark Component (optional)
function Mark({ children }) {
  return (
    <mark className="text-white bg-white rounded-md ring-white ring-4 dark:ring-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
      {children}
    </mark>
  );
}

export default Testimonials;
