import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="100"
    height="100"
    viewBox="0 0 24 24"
  >
    <path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path>
  </svg>
);

export const Benefits = () => {
  const content = {
    // imgPos: "left",
    // headline: "Benefits of Our Service",
    // description: "Explore how our services can enhance your business.",
    points: [
      {
        headline: "Enhanced Credit Insights",
        description:
          "Gain access to personalized credit score predictions based on your uploaded documents, empowering you to understand and improve your financial health.",
        icon: <MyIcon />,
      },
      {
        headline: "Decentralized Security",
        description:
          "Experience a secure and private credit evaluation process that leverages decentralized technology, ensuring your sensitive information is protected.",
        icon: <MyIcon />,
      },
      {
        headline: "Incentives for Improvement",
        description:
          "Receive motivational rewards and benefits for uploading documents and enhancing your credit score, making financial growth more engaging and rewarding.",
        icon: <MyIcon />,
      },
    ],
  };

  return (
    <div className="pr-10 pt-10 flex flex-wrap mb-20 lg:gap-10 lg:flex-nowrap">
      <div
        className={`flex items-center justify-center w-full lg:w-1/2 ${
          content.imgPos === "right" ? "lg:order-1" : ""
        }`}
      >
        <motion.img
          src="https://nextly.web3templates.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbenefit-one.a3b4f792.png&w=640&q=75"
          width="350"
          height="350"
          alt="Features"
          className="object-cover"
          placeholder="blur"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div
        className={`flex flex-wrap items-center w-full lg:w-1/2 ${
          content.imgPos === "right" ? "lg:justify-end" : ""
        }`}
      >
        <div>
          <ScrollTitle
            title={content.headline}
            description={content.description}
          />
          <div className="w-full mt-5">
            {content.points.map((item, index) => (
              <ScrollFeatureItem
                key={index}
                headline={item.headline}
                icon={item.icon}
              >
                {item.description}
              </ScrollFeatureItem>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function ScrollTitle({ title, description }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="mb-8 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-semibold text-indigo-500 uppercase"></h2>
      <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
      <p className="mx-auto mt-4 text-lg w-[50%] text-white">{description}</p>
    </motion.div>
  );
}

function ScrollFeatureItem({ headline, icon, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="flex items-start mt-8 space-x-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 60 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center flex-shrink-0 mt-1 bg-indigo-500 rounded-md w-11 h-11">
        {React.cloneElement(icon, {
          className: "w-7 h-7 text-indigo-50",
        })}
      </div>
      <div>
        <h4 className="text-xl font-medium text-gray-800 dark:text-gray-200">
          {headline}
        </h4>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{children}</p>
      </div>
    </motion.div>
  );
}
