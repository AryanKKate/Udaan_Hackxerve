import React, { useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar";
import { Footer } from "../Components/Footer";
import { useWalletContract } from "../Context/WalletProvider";
import { toast } from "react-toastify";
import axios from "axios";
import {ethers} from "ethers"
import { useNavigate } from "react-router-dom";

function KYC() {
    const context = useWalletContract();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        walletAddress: "",
        name: "",
        requiredSignatured:0
    });
    const {walletAddress, microLoansContract, connectWallet, isConnected, disconnectWallet, communityFactoryContract, communityAbi} = useWalletContract();
    useEffect(() => {
        if (!isConnected) {
            connectWallet();
        }
    }, [isConnected]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Automatically upload image when the file is selected
    const handleFileChange = async (e) => {
        const imageFile = e.target.files[0];
        
        if (imageFile && imageFile.type.startsWith("image/")) {
            setLoading(true); // Set loading to true when the file is selected
            const imageUrl = await handleImageUpload(imageFile);
            if (imageUrl) {
                setFormData({
                    ...formData,
                    image: imageUrl,
                });
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Failed to upload image.");
            }
            setLoading(false); // Set loading to false once the upload completes
        } else {
            toast.error("Please upload a valid image file.");
        }
    };

    const handleImageUpload = async (imageFile) => {
        const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dke7f8nkt/image/upload";
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "TraderHub");

        try {
            const response = await fetch(cloudinaryUrl, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            return data.secure_url; // Return the URL of the uploaded image
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };
    const addCommunity=async(owners, requiredSignatures, imageUrl, name)=>{
        console.log(owners)
        const initData = new ethers.Interface(communityAbi).encodeFunctionData(
          "initialize",
          [[walletAddress], requiredSignatures, imageUrl]
        );
        const res=await communityFactoryContract.deployContract(initData, [walletAddress], imageUrl, name);
        console.log(res)
      }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if(formData.image!=""){
           const res=await addCommunity([formData.walletAddress], formData.requiredSignatured, formData.image, formData.name)
           console.log(res)
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
            <Navbar />
            <div className="min-h-full w-full bg-transparent flex justify-center items-center">
                <div className="flex max-w-4xl w-full bg-transparent shadow-lg rounded-lg overflow-hidden py-14 gap-10">
                    {/* Left Side - Image */}
                    <div className="w-1/2 flex items-center justify-center">
                        <img
                            src={formData.image || "placeholder-image.jpg"}
                            alt="KYC Illustration"
                            className="w-full h-auto rounded-2xl border-none shadow-xl"
                            style={{ maxHeight: "600px", maxWidth: "600px" }}
                        />
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-1/2 p-6 flex flex-col justify-center">
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-extrabold text-white mb-6">
                                Create Community
                            </h1>
                            {error && <div className="text-red-500 mb-4">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <input
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                                    type="text"
                                    name="walletAddress"
                                    placeholder="Wallet Address"
                                    value={walletAddress}
                                    required
                                />
                                <input
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                                    type="text"
                                    name="name"
                                    placeholder="Name of the Community"
                                    onChange={handleChange}
                                    value={formData.name}
                                    required
                                />

                                <input
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-white mb-4"
                                    type="number"
                                    name="requiredSignatured"
                                    placeholder="Number of Required Signatured"
                                    value={formData.requiredSignatured}
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
                                    className={`w-full mt-4 tracking-wide font-semibold bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500 transition-all duration-300 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
