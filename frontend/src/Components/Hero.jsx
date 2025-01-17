import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      <motion.div
        className="flex flex-wrap bg-gray-900"
        initial={{ opacity: 0, y: -50 }} // Initial state
        animate={{ opacity: 1, y: 0 }} // Animation when mounted
        exit={{ opacity: 0, y: 50 }} // Animation when unmounted
        transition={{ duration: 0.5 }} // Transition duration
      >
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8 ml-24">
            <motion.h1
              className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-indigo-700"
              initial={{ opacity: 0, y: 20 }} // Initial state for heading
              animate={{ opacity: 1, y: 0 }} // Animation when heading appears
              transition={{ duration: 0.5 }}
            >
              Udaan
            </motion.h1>
            <motion.div
              className="py-5 leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }} // Initial state for description
              animate={{ opacity: 1, y: 0 }} // Animation when description appears
              transition={{ duration: 0.5, delay: 0.2 }} // Slight delay for the description
            >
              Udaan provides rural communities with easy access to micro-loans through a secure blockchain-powered platform. By leveraging digital identity verification and community-based lending, we empower small businesses and individuals to grow financially.
            </motion.div>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <motion.button
                onClick={() => navigate("/loan")}
                className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md"
                whileHover={{ scale: 1.05 }} // Scale on hover
                whileTap={{ scale: 0.95 }} // Scale down on click
                transition={{ duration: 0.2 }}
              >
                Get Loan
              </motion.button>
            </div>
          </div>
        </div>
        <motion.div
          className="flex items-center justify-center w-full lg:w-1/2"
          initial={{ opacity: 0, x: 50 }} // Initial state for image
          animate={{ opacity: 1, x: 0 }} // Animation when image appears
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://nextly.web3templates.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhero.4e76c802.png&w=640&q=75"
            width="350"
            height="350"
            className="object-cover"
            alt="Hero Illustration"
            loading="eager"
          />
        </motion.div>
      </motion.div>
      <div>{/* Optional additional content can be added here */}</div>
    </>
  );
};
