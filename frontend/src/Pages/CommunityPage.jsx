import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../Components/Navbar";
import axiosInstance from "../AxiosInstance";
import { useWalletContract } from "../Context/WalletProvider";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
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

const CommunityPage = () => {

  const {
    walletAddress,
    microLoansContract,
    connectWallet,
    isConnected,
    disconnectWallet,
    communityFactoryContract,
    communityAbi,
  } = useWalletContract();


  const [communities, setCommunities] = useState([]);
  // const
  const [userCommunities, setUserCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [memberFilter, setMemberFilter] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  useEffect(() => {
    if (!isConnected) {
      connectWallet();
    } else {
      const fetchCommunities = async () => {
        const res = await communityFactoryContract.getCommunities(
          walletAddress
        );
        const result = await communityFactoryContract.getAllCommunities();
        setCommunities(result);
        console.log(res);
        console.log(result);
      };
      fetchCommunities();
    }
  }, [isConnected]);

  const addCommunity = async (owners, requiredSignatures, imageUrl, name) => {
    const initData = new ethers.Interface(communityAbi).encodeFunctionData(
      "initialize",
      [owners, requiredSignatures]
    );
    const res = await communityFactoryContract.deployContract(initData, owners, imageUrl, name);
  }

  const handleSearch = () => {
    let filtered = communities;

    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (community) => community.category === categoryFilter
      );
    }

    if (memberFilter) {
      filtered = filtered.filter(
        (community) => community.members <= parseInt(memberFilter)
      );
    }

    setFilteredCommunities(filtered);
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      const res = await axiosInstance.post(`/communities/join`, {
        communityId,
      });
      console.log("Joined community:", res.data);
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };
  const joinCommunity=async(community)=>{
    const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const communityContract = new ethers.Contract(walletAddress, communityAbi, signer);
        let owners=community.owners
        owners=owners.map(owner=>owner)
        owners.push(walletAddress)
        const tx = await communityContract.updateOwners(owners, 1);
        // console.log(community[0])
        if(tx){
          const txn=await communityFactoryContract.addOwnersToCommunity(community[0], owners)
        }

  }
  return (
    <div
      className=""
      style={{
        backgroundImage: "url('formBg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />

      <div className="min-h-screen p-8">
        <SectionTitle preTitle="Community Hub" title="Explore Communities">
          Join a community that fits your interests!
        </SectionTitle>

        {/* Community Cards Section */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Max Members"
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 text-gray-900"
            />
            <select
              onChange={(e) => setCategoryFilter(e.target.value)}
              value={categoryFilter}
              className="px-4 py-2 rounded-lg border-2 text-gray-900"
            >
              <option value="All">All Categories</option>
              <option value="Tech">Tech</option>
              <option value="Finance">Agriculture</option>
              <option value="Health">Health</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Search
            </button>
            <Link
              to="/community/create"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Create community
            </Link>
          </div>
        </div>

        <div className="!p-0">
          <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {communities.map((community, index) => (
                <motion.div
                  key={community.id}
                  className="bg-gray-700 text-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Community Card */}
                  <div>
                    <div className="mb-4">
                      <img
                        src={community.url || "/default-image.jpg"}
                        alt={community.name}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold">{community.name}</h3>
                    <p className="mt-2 text-lg">
                      Number of Members: {community.owners.length}
                    </p>

                    <button
                      onClick={() => joinCommunity(community)}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      View/Join Community
                    </button>
                  </div>

                  {/* Community Details (if selected) */}
                  <AnimatePresence>
                    {selectedCommunity &&
                      selectedCommunity.id === community.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="mt-4 p-4 bg-gray-800 rounded-lg"
                        >
                          <p className="text-lg">
                            {selectedCommunity.description}
                          </p>
                          <button
                            onClick={() =>
                              handleJoinCommunity(selectedCommunity.id)
                            }
                            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Join Community
                          </button>
                        </motion.div>
                      )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Cards Section */}
        <div className="mt-16">
          <SectionTitle preTitle="Featured" title="Featured Communities">
            Explore some of the highlighted communities!
          </SectionTitle>

          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <motion.div
              key="featured-1"
              className="bg-gray-700 text-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Featured Card 1 */}
              <div>
                <div className="mb-4">
                  <img
                    src="/comm1.webp" // Replace with actual image path
                    alt="Featured Community 1"
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
                <h3 className="text-2xl font-semibold">Computer Shiksha</h3>
                <p className="mt-2 text-lg">Category: Tech</p>
                <p className="mt-2 text-lg">Members: 120+</p>
                <p className="mt-4 text-sm text-gray-400">
                  A Tech focussed community with funds focussed upon Technical /
                  software education in rural areas
                </p>
                <button
                  onClick={() => setSelectedCommunity(community)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  View/Join Community
                </button>
              </div>
            </motion.div>

            <motion.div
              key="featured-2"
              className="bg-gray-700 text-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Featured Card 2 */}
              <div>
                <div className="mb-4">
                  <img
                    src="/comm2.jfif" // Replace with actual image path
                    alt="Featured Community 2"
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
                <h3 className="text-2xl font-semibold">Kisan Community</h3>
                <p className="mt-2 text-lg">Category: Agriculture</p>
                <p className="mt-2 text-lg">Members: 500+</p>
                <p className="mt-4 text-sm text-gray-400">
                  A community set up by the farmers for the farmers to fund
                  raise for various Agriculture activities
                </p>
                <button
                  // onClick={() => setSelectedCommunity(community)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  View/Join Community
                </button>
              </div>
            </motion.div>

            <motion.div
              key="featured-3"
              className="bg-gray-700 text-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Featured Card 3 */}
              <div>
                <div className="mb-4">
                  <img
                    src="/comm3.png" // Replace with actual image path
                    alt="Featured Community 3"
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
                <h3 className="text-2xl font-semibold">Health Camp</h3>
                <p className="mt-2 text-lg">Category: Health</p>
                <p className="mt-2 text-lg">Members: 300+</p>
                <p className="mt-4 text-sm text-gray-400">
                  A health and wellness community where funding or lending is
                  focussed towards health camp activities
                </p>
                <button
                  onClick={() => setSelectedCommunity(community)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  View/Join Community
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
