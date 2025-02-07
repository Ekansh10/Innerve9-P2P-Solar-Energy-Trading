import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TransactionHistory from "./pages/TransactionHistory";
import BuyEnergy from "./pages/BuyEnergy";
import SellEnergy from "./pages/SellEnergy";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/buy-energy" element={<BuyEnergy />} />
        <Route path="/sell-energy" element={<SellEnergy />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;
