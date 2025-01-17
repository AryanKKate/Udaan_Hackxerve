import { Link, useNavigate } from "react-router-dom";
import { useWalletContract } from "../Context/WalletProvider";
import { useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const context = useWalletContract();
  const { isConnected, connectWallet } = context;
  const [isOpen, setIsOpen] = useState(false);

  const handleCommunityClick = async () => {
    navigate("/community");
  };

  return (
    <div className="sm:px-[0px] bg-transparent shadow-lg shadow-white  mb-10">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6 lg:px-12">
        {/* Logo */}
        <Link
          to="/"
          className="ml-6 flex items-center justify-center space-x-2 text-2xl font-semibold text-indigo-200 hover:text-white transition duration-200"
        >
          <img
            src="/logo1.png"
            alt="Logo"
            className="logo-image w-24 h-auto transition-transform duration-300 hover:scale-110 hover:bg-indigo-790 rounded-lg"
          />
        </Link>

        {/* Mobile Hamburger Icon */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation Links - Collapsible on Mobile */}
        <div
          className={`lg:flex gap-3 ml-auto items-center transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          } lg:block`}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 lg:space-x-8">
            
            <li>
              <Link
                to="/bidding"
                className="block py-2 px-3 text-white text-xl rounded-md hover:bg-indigo-500 transition duration-300"
                onClick={() => connectWallet()}
              >
                Bidding
              </Link>
            </li>
            <li>
              <button
                onClick={handleCommunityClick}
                className="block py-2 px-3 text-white text-xl rounded-md hover:bg-indigo-500 transition duration-300"
              >
                Community Hub
              </button>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-3 text-white text-xl rounded-md hover:bg-indigo-500 transition duration-300"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/loan"
                className="block py-2 px-3 text-white text-xl bg-darkblue-800 rounded-md hover:bg-indigo-500 transition duration-300"
                onClick={() => connectWallet()}
              >
                Get Loan
              </Link>
            </li>

            <li>
              <Link
                to="/kyc"
                className="block py-2 px-3 text-white text-xl bg-gray-800 rounded-md hover:bg-gray-700 transition duration-300"
                onClick={() => connectWallet()}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};
