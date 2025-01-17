import Landing from "./Pages/Landing";
import { WalletContractProvider } from "./Context/WalletProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loan from "./Pages/Loan";
import BiddingPage from "./Pages/BiddingPage";
import Dashboard from "./Pages/Dashboard";
import KYC from "./Pages/KYC";
import CommunityPage from "./Pages/CommunityPage";
import CommunityInput from "./Pages/CommunityInputs"


function App() {
  return (
    <WalletContractProvider>
      <div className="min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/loan" element={<Loan />} />
            <Route path="/bidding" element={<BiddingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/community" element={<CommunityPage/>} />
            <Route path="/community/create" element={<CommunityInput/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </WalletContractProvider>
  );
}
export default App;
