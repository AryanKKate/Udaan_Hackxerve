import React, { useState, useEffect } from "react";
import { Navbar } from "../Components/Navbar";
import { useWalletContract } from "../Context/WalletProvider";
import axiosInstance from "../AxiosInstance";
import { ethers } from "ethers";
import RealtimeGraph from "../Components/RealtimeGraph"
// Sample loan data for the dashboard
// const userLoans = [
//   {
//     id: 1,
//     loanType: "Personal Loan",
//     amount: 20000,
//     timer: 24, // Timer in hours
//     bids: [
//       { name: "User1", roi: 5 },
//       { name: "User2", roi: 6 },
//     ],
//   },
//   {
//     id: 2,
//     loanType: "Business Loan",
//     amount: 50000,
//     timer: 12, // Timer in hours
//     bids: [{ name: "User3", roi: 4 }],
//   },
// ];

function Dashboard() {
  // const [loanTimers, setLoanTimers] = useState(
  //   userLoans.map((loan) => loan.timer)
  // );
  const [userLoans, setUserLoans] = useState([]);
  const [userApprovedBids, setUserApprovedBids] = useState([]);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setLoanTimers((prevTimers) =>
  //       prevTimers.map((timer) => (timer > 0 ? timer - 1 : 0))
  //     );
  //   }, 3600000); // 1 hour interval
  //   return () => clearInterval(interval);
  // }, []);
  const { isConnected, walletAddress, microLoansContract, connectWallet } =
    useWalletContract();

  useEffect(() => {
    if (!isConnected) {
      connectWallet();
    } else {
      const fetchUserLoans = async () => {
        const res = await axiosInstance.get(`/loan/${walletAddress}`);
        console.log(res.data);
        // setUserLoans(res.data)
        try {
          const result = await microLoansContract.getUserRequestedLoans(
            walletAddress
          );
          let userLoan = [];
          res.data.map((loan) => {
            userLoan.push({
              ...loan,
              type: result[loan.loanIndex].typeOfLoan,
              description: result[loan.loanIndex].description,
            });
          });
          console.log(userLoan);
          setUserLoans(userLoan);
        } catch (err) {
          console.log(err);
        }
      };
      const fetchUserBids = async () => {
        const res = await axiosInstance.get(`/loan/approved/${walletAddress}`);
        console.log(res.data);
        setUserApprovedBids(res.data);
      };
      fetchUserLoans();
      fetchUserBids();
    }
  }, [isConnected]);

  const handleContinue = (loanId) => {
    console.log("Loan continued with ID:", loanId);
    // Reset timer to user's selected value here
  };

  const acceptBid = async (loanId) => {
    const res = await axiosInstance.post("/loan/approve", { loanId });
    console.log(res.data);
  };

  //   borrower
  // loanIndex
  // duration
  // interestRate
  const sendMoney = async (loan) => {
    try {
      console.log(BigInt(loan.loan));
      const tx = await microLoansContract.approveLoan(
        loan.address,
        loan.loanIndex,
        18,
        Math.floor(loan.percentage),
        {
          value: BigInt(loan.loan),
        }
      );
      console.log(tx);

      const res = await axiosInstance.post("/loan/done", { loanId: loan._id });
      console.log("Loan marked as done:", res.data);
    } catch (error) {
      console.error("Error in sending money or marking loan as done:", error);
    }
  };


  const handleWithdraw = (loanId) => {
    console.log("Loan withdrawn with ID:", loanId);
    // Logic for withdrawing the loan
  };
  const type = ["Personal", "Business", "Student"];
  return (
    <div className="bg-gray-900 min-h-screen"
      style={{
        backgroundImage: "url('formBg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />
      <div className="px-6 py-12">
        <h1 className="text-4xl font-semibold text-center text-white mb-8">
          Your Loans
        </h1>
        <RealtimeGraph />
        <div className="space-y-6 mx-10">
          {userLoans && userLoans.length != 0 ? (
            <>
              {userLoans.map((loan) => (
                <div
                  key={loan._id}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {type[ethers.formatUnits(loan.type, 0)]} Loan
                      </h2>
                      <h2 className="text-md font-semibold text-white">
                        Reason: {loan.description}
                      </h2>
                      <p className="text-sm text-gray-400">
                        Amount: {loan.loan / Math.pow(10, 18)} ETH
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => acceptBid(loan._id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white">
                      Number of Bids: {loan.bids.length}
                    </h3>
                    <h3 className="text-lg font-semibold text-white">
                      Current Interest Rate: {loan.percentage}%
                    </h3>
                    {loan.bids.length > 0 && (
                      <h3 className="text-lg font-semibold text-white">
                        Last Bid By: {loan.bids[loan.bids.length - 1].bidBy}
                      </h3>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <h1 className="text-white">No Pending Loans</h1>
          )}
        </div>
        <h1 className="text-4xl font-semibold text-center text-white mb-8">
          Your Approved Bids
        </h1>
        <div className="space-y-6 mx-10">
          {userApprovedBids && userApprovedBids.length != 0 ? (
            <>
              {userApprovedBids.map((loan, index) => (
                <div
                  key={loan._id}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xl text-white">
                        Amount: {loan.loan / Math.pow(10, 18)} ETH
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => sendMoney(loan)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Send Money
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white">
                      Interest Rate: {loan.percentage}%
                    </h3>
                    <h3 className="text-lg font-semibold text-white">
                      Borrower: {loan.address}
                    </h3>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <h1 className="text-white">No Pending Loans</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
