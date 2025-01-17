import React, { useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar";
import { Footer } from "../Components/Footer";
import { useWalletContract } from "../Context/WalletProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function KYC() {
  // State for form data
  const context = useWalletContract();
  const { isConnected, connectWallet, walletAddress, microLoansContract } =
    context;
  const navigate = useNavigate();

  // State for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isConnected) {
      connectWallet();
    }
  }, [isConnected]);

  const [formData, setFormData] = useState({
    walletAddress: "",
    name: "",
    age: "",
    city: "",
    addr: "",
    adhar_num: "",
    bankAccNumber: "",
    annualIncome: "",
    savings: "", // Added annualIncome
    image: "https://via.placeholder.com/150", // Dummy image URL
    profession: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input for image upload
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Handle image upload to cloud
  const handleImageUpload = async (imageFile) => {
    // Check if the file is an image
    if (!imageFile || !imageFile.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPEG, etc.).");
      return null; // Exit the function if the file is not an image
    }

    const cloudinaryUrl =
      "https://api.cloudinary.com/v1_1/dke7f8nkt/image/upload";
    const formData = new FormData();

    // Appending the image file and required parameters
    formData.append("file", imageFile);
    formData.append("upload_preset", "TraderHub");

    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Uploaded image URL:", data.secure_url); // Image URL on Cloudinary
      return data.secure_url; // Return the URL if needed
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; // Return null in case of an error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    setError(""); // Reset error state

    // Handle the form submission, e.g., send the data to an API
    const image = await handleImageUpload(formData.image);
    if (image) {
      try {
        console.log(walletAddress);
        const res = await microLoansContract.addKYC(
          walletAddress,
          formData.name,
          +formData.age,
          formData.city,
          formData.addr,
          formData.adhar_num,
          image,
          +formData.annualIncome,
          +formData.savings,
          formData.profession
        );
        console.log(res);
        console.log("Form submitted:", formData);
        navigate("/");
        toast.success("Form Submitted");
      } catch (err) {
        toast.error("Error submitting your KYC");
        console.log(err);
      }
    } else {
      toast.error("Failed to upload image");
    }
    setLoading(false);
  };

  return (
    <div
      className="bg-gray-800"
      style={{
        backgroundImage: "url('formBg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div>
        <Navbar />
      </div>
      <div className="min-h-full w-full bg-transparent flex justify-center items-center  ">
        <div className="flex max-w-4xl w-full bg-transparent shadow-lg rounded-lg overflow-hidden py-14 gap-10 ">
          {/* Left Side - Image */}
          <div className="w-1/2 flex items-center justify-center ">
            <img
              src="/kyc.jpeg"
              alt="KYC Illustration"
              className="w-full h-auto rounded-2xl border-none shadow-xl "
              style={{ maxHeight: "600px", maxWidth: "600px" }}
            />
          </div>

          {/* Right Side - Form */} 
          <div className="w-1/2 p-6 flex flex-col justify-center shadow-inner">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-extrabold text-white mb-6">
                KYC Form
              </h1>
              {error && <div className="text-red-500 mb-4">{error}</div>}



              <form onSubmit={handleSubmit}>

                <input
                  className="w-full px-4 py-3  rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                  type="text"
                  name="walletAddress"
                  placeholder="Wallet Address"
                  value={walletAddress}
                  required
                />


                <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <input
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                    type="text"
                    name="addr"
                    placeholder="Home Address"
                    value={formData.addr}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                    type="text"
                    name="bankAccNumber"
                    placeholder="Bank Account Number"
                    value={formData.bankAccNumber}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                    type="text"
                    name="adharCardNumber"
                    placeholder="Aadhar Card Number"
                    value={formData.adharCardNumber}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                    type="number"
                    name="annualIncome"
                    placeholder="Annual Income"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                    type="number"
                    name="savings"
                    placeholder="Savings"
                    value={formData.savings}
                    onChange={handleChange}
                    required
                  />
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                  type="text"
                  name="profession"
                  placeholder="Profession"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full px-4 py-3 rounded-lg text-white border border-gray-600 mb-4"
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
                <button
                  type="submit"
                  className={`w-full mt-4 tracking-wide font-semibold bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500 transition-all duration-300 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default KYC;
