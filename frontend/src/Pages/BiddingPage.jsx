import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useWalletContract } from "../Context/WalletProvider";
import { ethers } from "ethers"
import axiosInstance from "../AxiosInstance";


const BiddingPage = () => {
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loanTypeFilter, setLoanTypeFilter] = useState("All");
  const [loanRequests, setLoanRequests] = useState([])
  const [amountFilter, setAmountFilter] = useState("");
  const [roiBid, setRoiBid] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [userBids, setUserBids] = useState({});
  const [loanTimers, setLoanTimers] = useState(
    loanRequests.map((loan) => loan.timer)
  );
  const types = {
    0: "Pending",
    1: "Business",
    2: "Student"
  }
  const navigate = useNavigate()
  const { isConnected, walletAddress, microLoansContract, connectWallet } = useWalletContract();
  const [loanDetails, setLoanDetails] = useState(null)
  useEffect(() => {
    if (!selectedLoan) {
      return setLoanDetails(null)
    }
    else {
      const fetchDetails = async () => {
        const loanDetail = await microLoansContract.getUserRequestedLoans(selectedLoan.address)
        // console.log(loanDetail[selectedLoan.loanIndex])
        const details = {
          description: loanDetail[selectedLoan.loanIndex].description,
          loanType: types[ethers.formatUnits(loanDetail[selectedLoan.loanIndex].typeOfLoan, 0)],
        }
        console.log(details)
        setLoanDetails(details)
      }
      fetchDetails()
    }
  }, [selectedLoan])
  useEffect(() => {
    const fetchRequests = async () => {
      if (!isConnected) {
        await connectWallet();
      }
      const fetchLoans = async () => {
        try {
          const res = await axiosInstance.get('/loan');
          console.log(res);

          const loansWithUserDetails = await Promise.all(
            res.data.map(async (loan) => {
              const userDetails = await microLoansContract.getKYC(loan.address);
              if (userDetails) {
                loan.userDetails = userDetails;
              }
              return loan;
            })
          );

          console.log(loansWithUserDetails);
          setLoanRequests(res.data);
          setFilteredLoans(loansWithUserDetails);
        } catch (error) {
          console.error("Error fetching loans:", error);
        }
      };

      fetchLoans();
    };

    fetchRequests();
  }, [isConnected]);


  useEffect(() => {
    const interval = setInterval(() => {
      setLoanTimers((prevTimers) =>
        prevTimers.map((timer) => (timer > 0 ? timer - 1 : 0))
      );
    }, 3600000); // 1 hour interval
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    let filtered = loanRequests;

    if (loanTypeFilter !== "All") {
      filtered = filtered.filter((loan) => loan.loanType === loanTypeFilter);
    }

    if (amountFilter) {
      filtered = filtered.filter(
        (loan) => loan.amount <= parseInt(amountFilter)
      );
    }

    setFilteredLoans(filtered);
  };

  const handleSubmitBid = async (loanId) => {
    const res = await axiosInstance.post('/loan/bid', { loanId, bidBy: walletAddress })
    console.log(res)
  };

  return (
    <div className="bg-gray-900"
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
        <h1 className="text-4xl font-semibold text-center text-white mb-8">
          Loan Bidding
        </h1>
        <div className="mb-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Max Amount"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 text-gray-900"
            />
            <select
              onChange={(e) => setLoanTypeFilter(e.target.value)}
              value={loanTypeFilter}
              className="px-4 py-2 rounded-lg border-2 text-gray-900"
            >
              <option value="All">All Loans</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Student Loan">Student Loan</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {filteredLoans.map((loan) => (
            <motion.div
              key={loan.id}
              className="bg-gray-700 text-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold">{loan.loan / Math.pow(10, 18)}</h3>
              <p className="text-lg">Name: {loan.userDetails.name}</p>
              <p className="text-lg">Strikes: {Math.round(ethers.formatEther(loan.userDetails.strikes))}</p>
              <p className="mt-2 text-lg">Interest: {loan.percentage} %</p>

              <button
                onClick={() => setSelectedLoan(loan)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                View/Place Bid
              </button>
            </motion.div>
          ))}
        </div>

        {selectedLoan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-8 rounded-lg shadow-lg w-1/2">
              {loanDetails ? <><h3 className="text-2xl font-semibold">
                {loanDetails.loanType} Loan
              </h3>
                <p className="mt-2">
                  Description: {loanDetails.description}
                </p></> : <></>}
              <p>User: {selectedLoan.userDetails.name}</p>
              <p>Strikes: {Math.round(ethers.formatEther(selectedLoan.userDetails.strikes))}</p>
              <p>Credit: {Math.round(ethers.formatEther(selectedLoan.userDetails.credit))}</p>
              <p className="mt-2">Amount: {(selectedLoan.loan / Math.pow(10, 18))} ETH</p>
              <p className="mt-2">Current Interest: {selectedLoan.percentage}%</p>
              <div className="mt-4">
                {selectedLoan.bids && selectedLoan.bids.length > 0 ? (
                  <p>
                    <span className="font-semibold">{selectedLoan.bids.length} bids</span>
                  </p>
                ) : (
                  <p>No bids yet.</p>
                )}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleSubmitBid(selectedLoan._id)}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit/Update Bid
                </button>
              </div>
              <button
                onClick={() => setSelectedLoan(null)}
                className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiddingPage;
