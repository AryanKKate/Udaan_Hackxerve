import React, { createContext, useContext, useState, useEffect } from "react";
import { microLoansAbi, microLoansAddress, communityFactoryAddress, communityFactoryAbi, communityAbi } from "../Constants.js";
import { ethers } from "ethers";

const WalletContractContext = createContext();

export const WalletContractProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [microLoansContract, setMicroLoansContract] = useState(null);
  const [communityFactoryContract, setCommunityFactoryContract] = useState(null);
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.getAddress(accounts[0]);
        setWalletAddress(account);
        setIsConnected(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        initializeContract(signer);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setMicroLoansContract(null);
  };

  const initializeContract = (signer) => {
    console.log(signer)
    const contractInstance = new ethers.Contract(microLoansAddress, microLoansAbi, signer);
    setMicroLoansContract(contractInstance);
    const community=new ethers.Contract(communityFactoryAddress,communityFactoryAbi, signer);
    setCommunityFactoryContract(community)
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
          setIsConnected(true);

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = provider.getSigner();
          initializeContract(signer);
        }
      });
    }
  }, []);

  return (
    <WalletContractContext.Provider
      value={{
        walletAddress,
        microLoansContract,
        connectWallet,
        isConnected,
        disconnectWallet,
        communityFactoryContract,
        communityAbi
      }}
    >
      {children}
    </WalletContractContext.Provider>
  );
};

export const useWalletContract = () => useContext(WalletContractContext);
