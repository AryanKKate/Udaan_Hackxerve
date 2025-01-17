import React, { useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar";
import { useWalletContract } from "../Context/WalletProvider";
import { ethers } from "ethers";
import axiosInstance from "../AxiosInstance";
import { useNavigate } from "react-router-dom";

function Loan() {
  const {
    walletAddress,
    microLoansContract,
    connectWallet,
    isConnected,
    disconnectWallet,
  } = useWalletContract();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      connectWallet();
    }
  }, [isConnected]);

  const types = {
    personal: 0,
    business: 1,
    student: 2,
  };

  const [formData, setFormData] = useState({
    type: "business",
    amount: "",
    description: "",
    roi: "", // New field for ROI
  });

  const INR_TO_ETHER_RATE = 224650;
  const convertINRToWei = (inrAmount) => {
    const etherAmount = inrAmount / INR_TO_ETHER_RATE;
    return ethers.parseEther(etherAmount.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addLoan();
      navigate("/");
    } catch (error) {
      console.error("Error submitting loan form:", error);
    }
  };

  const addLoan = async () => {
    try {
      const loanAmount = convertINRToWei(formData.amount);
      const userLoans = await microLoansContract.getUserRequestedLoans(walletAddress);
      const res = await microLoansContract.requestLoan(
        loanAmount,
        types[formData.type],
        formData.description
      );
      const result = await axiosInstance.post("/loan", {
        address: walletAddress,
        userLoan: loanAmount.toString(),
        userPercentage: formData.roi,
        loanIndex: userLoans.length,
      });
      console.log(result);
    } catch (error) {
      console.error("Error in addLoan:", error);
    }
  };

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/bg1.jpeg",
    "/bg2.jpeg",
    "/bg3.jpeg"
  ];

  // Automatically change the image every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2300); // Change every 2 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Dots update based on current image index
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="flex flex-col bg-gray-900 min-h-screen w-full"
      style={{
        backgroundImage: "url('formBg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />
      {isConnected ? (
        <div className="flex mt-3 justify-center ">
          {/* Left - Carousel */}
          <div className="relative flex items-center justify-center ">
            <div
              className="carousel-container"
              style={{
                position: "relative",
                width: "450px",
                overflow: "hidden",
                borderRadius: "10px",
              }}
            >
              {/* Image Display */}
              <img
                src={images[currentImageIndex]}
                alt="Hero Illustration"
                loading="eager"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  transition: "transform 0.5s ease-in-out", // Smooth transition
                }}
              />
              {/* Left and Right Buttons */}

            </div>

            {/* Dots Below the Carousel */}
            <div className="absolute bottom-0 text-center  left-1/2 transform -translate-x-1/2 mb-4 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={` w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-gray-500'}`}
                  style={{ transition: 'background-color 0.4s' }}
                />
              ))}
            </div>
          </div>

          {/* Right - Loan Form */}
          <div className="flex justify-center items-center  w-1/2">
            <div className="w-5/6 max-w-xl mx-auto my-auto p-8 border-2 border-gray-300 rounded-lg min-h-[600px]">
              <h1 className="text-3xl font-semibold text-center text-white mb-6">
                Get Loan
              </h1>
              <form onSubmit={handleSubmit}>
                <label
                  htmlFor="countries"
                  className="block mb-5 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select type of Loan
                </label>
                <select
                  required
                  id="countries"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                  <option value="student">Student</option>
                </select>

                <label
                  htmlFor="number-input"
                  className="block mb-5 mt-5 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter Amount:
                </label>
                <input
                  type="number"
                  id="number-input"
                  min={10000}
                  max={100000}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="₹"
                  required
                />

                <label
                  htmlFor="roi-input"
                  className="block mb-5 mt-5 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter ROI (in %):
                </label>
                <input
                  type="number"
                  id="roi-input"
                  min={1}
                  max={20}
                  value={formData.roi}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, roi: e.target.value }))
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="%"
                  required
                />

                <label
                  htmlFor="message"
                  className="block mb-5 mt-5 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="message"
                  rows="8"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Briefly describe why you need the loan"
                  required
                ></textarea>

                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center text-white mt-20">
          Please connect your wallet first
        </h1>
      )}
    </div>
  );
}

export default Loan;
