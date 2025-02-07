import React from "react";
import Charts from "../components/Charts";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gradient-to-r from-black via-dark-blue to-white text-white">
        <div className="grid grid-cols-2 gap-4 mt-4 animate-fadeIn">
          <Charts />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 animate-slideUp">
        </div>
      </div>
  );
};
export default Dashboard;
