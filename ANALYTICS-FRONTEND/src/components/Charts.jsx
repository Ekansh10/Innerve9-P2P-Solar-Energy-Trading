// import React, { useState } from "react";
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import "../styles/Charts.css"; // Import the updated CSS

// // Generate 15-minute interval data for the last 31 days
// const generateData = () => {
//   const data = [];
//   const now = new Date();
//   for (let i = 0; i < 31 * 24 * 4; i++) {
//     const date = new Date(now);
//     date.setDate(now.getDate() - 30 + Math.floor(i / (24 * 4))); // Start from 30 days ago
//     const hour = Math.floor((i % (24 * 4)) / 4); // Hours 0-23
//     const purchaseBid = Math.floor(500 + Math.random() * 200); // Randomize between 500-700
//     const sellBid = Math.floor(400 + Math.random() * 200); // Randomize between 400-600
//     const mcv = Math.floor((purchaseBid + sellBid) / 2 + Math.random() * 50 - 25); // Randomize around average
//     const finalVolume = Math.floor(mcv * (0.9 + Math.random() * 0.2)); // Randomize around 90-110% of mcv
//     const mcp = Math.floor(3000 + Math.random() * 500); // Randomize between 3000-3500

//     data.push({
//       date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), // Format: "01 Oct"
//       hour,
//       purchaseBid,
//       sellBid,
//       mcv,
//       finalVolume,
//       mcp,
//     });
//   }
//   return data;
// };

// const data = generateData();

// const pieData = [
//   { name: "Solar", value: 400 },
//   { name: "Wind", value: 300 },
//   { name: "Hydro", value: 300 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

// const Charts = () => {
//   const [interval, setInterval] = useState("daily");

//   // Filter data based on the selected interval
//   const filterData = (interval) => {
//     switch (interval) {
//       case "hourly":
//         return data.filter((_, index) => index % 4 === 0); // One entry per hour
//       case "daily":
//         return data.filter((_, index) => index % (24 * 4) === 0); // One entry per day
//       case "weekly":
//         return data.filter((_, index) => index % (7 * 24 * 4) === 0); // One entry per week
//       case "monthly":
//         return data.filter((_, index) => index % (30 * 24 * 4) === 0); // One entry per month
//       case "yearly":
//         return data.filter((_, index) => index % (365 * 24 * 4) === 0); // One entry per year
//       default:
//         return data;
//     }
//   };

//   const filteredData = filterData(interval);

//   return (
//     <div className="charts-container">
//       <h2 className="charts-title">Energy Usage Trends</h2>
//       <div className="charts-select-container">
//         <select
//           value={interval}
//           onChange={(e) => setInterval(e.target.value)}
//           className="charts-select"
//         >
//           <option value="hourly">Hourly</option>
//           <option value="daily">Daily</option>
//           <option value="weekly">Weekly</option>
//           <option value="monthly">Monthly</option>
//           <option value="yearly">Yearly</option>
//         </select>
//       </div>

//       <div className="charts-grid">
//         {/* Line Chart */}
//         <div className="chart-box">
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={filteredData}>
//               <XAxis dataKey="date" stroke="#00c49f" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
//               <YAxis stroke="#00c49f" label={{ value: "Energy & Demand", angle: -90, position: "insideLeft" }} />
//               <Tooltip />
//               <Line type="monotone" dataKey="purchaseBid" stroke="#82ca9d" strokeWidth={2} />
//               <Line type="monotone" dataKey="sellBid" stroke="#ff7300" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Area Chart */}
//         <div className="chart-box">
//           <ResponsiveContainer width="100%" height={250}>
//             <AreaChart data={filteredData}>
//               <XAxis dataKey="date" stroke="#00c49f" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
//               <YAxis stroke="#00c49f" label={{ value: "Energy & Demand", angle: -90, position: "insideLeft" }} />
//               <Tooltip />
//               <Area type="monotone" dataKey="mcv" stroke="#82ca9d" fill="#82ca9d66" />
//               <Area type="monotone" dataKey="finalVolume" stroke="#ff7300" fill="#ff730066" />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Bar Chart */}
//         <div className="chart-box">
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={filteredData}>
//               <XAxis dataKey="date" stroke="#00c49f" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
//               <YAxis stroke="#00c49f" label={{ value: "Energy & Demand", angle: -90, position: "insideLeft" }} />
//               <Tooltip />
//               <Bar dataKey="purchaseBid" fill="#82ca9d" />
//               <Bar dataKey="sellBid" fill="#ff7300" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Pie Chart */}
//         <div className="chart-box">
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Tooltip />
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Charts;





// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
// } from "recharts";
// import "../styles/Charts.css";

// const data = [
//   { date: "01 Jan", hour: 1, timeBlock: "00:00-00:15", purchaseBid: 500, sellBid: 400, mcv: 450, finalVolume: 430, mcp: 3200 },
//   { date: "02 Jan", hour: 2, timeBlock: "00:15-00:30", purchaseBid: 600, sellBid: 500, mcv: 520, finalVolume: 510, mcp: 3100 },
//   { date: "03 Jan", hour: 3, timeBlock: "00:30-00:45", purchaseBid: 550, sellBid: 480, mcv: 500, finalVolume: 490, mcp: 3300 },
//   { date: "04 Jan", hour: 4, timeBlock: "00:45-01:00", purchaseBid: 580, sellBid: 520, mcv: 530, finalVolume: 520, mcp: 3400 },
//   { date: "05 Jan", hour: 5, timeBlock: "01:00-01:15", purchaseBid: 620, sellBid: 570, mcv: 590, finalVolume: 580, mcp: 3500 },
// ];

// const colors = {
//   purchaseBid: "#0088FE",
//   sellBid: "#00C49F",
//   mcv: "#FFBB28",
//   finalVolume: "#FF8042",
//   mcp: "#A52A2A",
// };

// const Charts = () => {
//   const [interval, setInterval] = useState("hourly");

//   const filterDataByInterval = (data, interval) => {
//     // Implement your actual filtering logic for different intervals
//     if (interval === "15-min-block") {
//       // Filter data based on 15-min block logic (example logic, adjust as needed)
//       return data.filter((item) => item.timeBlock.includes("00:00"));
//     } else if (interval === "hourly") {
//       // Filter data for hourly intervals
//       return data;
//     } else if (interval === "daily") {
//       // Filter data for daily intervals
//       return data;
//     }
//     // Add more conditions for other intervals like weekly, monthly if needed
//     return data;
//   };

//   const filteredData = filterDataByInterval(data, interval);

//   return (
//     <div className="charts-container">
//       <Navbar />

//       <h2 className="charts-title">Energy Market Analysis</h2>

//       <div className="filters">
//         <select value={interval} onChange={(e) => setInterval(e.target.value)}>
//           <option value="15-min-block">15-Min Block</option>
//           <option value="hourly">Hourly</option>
//           <option value="daily">Daily</option>
//           <option value="weekly">Weekly</option>
//           <option value="monthly">Monthly</option>
//           <option value="yearly">Yearly</option>
//         </select>
//       </div>

//       <div className="charts-grid">
//         <div className="chart-box">
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={filteredData}>
//               <XAxis dataKey="date" stroke="#00c49f" />
//               <YAxis stroke="#00c49f" />
//               <Tooltip />
//               <Legend />
//               {Object.keys(colors).map((key) => (
//                 <Line key={key} type="monotone" dataKey={key} stroke={colors[key]} strokeWidth={2} />
//               ))}
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="chart-box">
//           <ResponsiveContainer width="100%" height={250}>
//             <AreaChart data={filteredData}>
//               <XAxis dataKey="date" stroke="#00c49f" />
//               <YAxis stroke="#00c49f" />
//               <Tooltip />
//               <Legend />
//               {Object.keys(colors).map((key) => (
//                 <Area key={key} type="monotone" dataKey={key} stroke={colors[key]} fill={`${colors[key]}66`} />
//               ))}
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="chart-box">
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={filteredData}>
//               <XAxis dataKey="date" stroke="#00c49f" />
//               <YAxis stroke="#00c49f" />
//               <Tooltip />
//               <Legend />
//               {Object.keys(colors).map((key) => (
//                 <Bar key={key} dataKey={key} fill={colors[key]} />
//               ))}
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="chart-box">
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Tooltip />
//               <Pie data={filteredData} dataKey="purchaseBid" nameKey="date" cx="50%" cy="50%" outerRadius={80} label>
//                 {filteredData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={colors.purchaseBid} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="chart-box">
//           <ResponsiveContainer width="100%" height={250}>
//             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredData}>
//               <PolarGrid />
//               <PolarAngleAxis dataKey="date" />
//               <PolarRadiusAxis />
//               <Tooltip />
//               {Object.keys(colors).map((key) => (
//                 <Radar key={key} name={key} dataKey={key} stroke={colors[key]} fill={`${colors[key]}66`} fillOpacity={0.6} />
//               ))}
//               <Legend />
//             </RadarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Charts;

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/Charts.css"; // Import the updated CSS

// Generate 15-minute interval data for the last 31 days
const generateData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 31 * 24 * 4; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - 30 + Math.floor(i / (24 * 4))); // Start from 30 days ago
    const hour = Math.floor((i % (24 * 4)) / 4); // Hours 0-23
    const timeBlock = `${hour}:00 - ${hour + 1}:00`; // Time Block
    const purchaseBid = Math.floor(500 + Math.random() * 200); // Randomize between 500-700
    const sellBid = Math.floor(400 + Math.random() * 200); // Randomize between 400-600
    const mcv = Math.floor((purchaseBid + sellBid) / 2 + Math.random() * 50 - 25); // Randomize around average
    const finalVolume = Math.floor(mcv * (0.9 + Math.random() * 0.2)); // Randomize around 90-110% of mcv
    const mcp = Math.floor(400 + Math.random() * 500); // Randomize between 3000-3500
    const supply = Math.floor(1000 + Math.random() * 500); // Randomize between 1000-1500
    const demand = Math.floor(500 + Math.random() * 500); // Randomize between 500-1000
    const residential = Math.floor(100 + Math.random() * 300); // Randomize between 100-400
    const industrial = Math.floor(100 + Math.random() * 300); // Randomize between 100-400
    const commercial = Math.floor(100 + Math.random() * 300); // Randomize between 100-400
    const transportation = Math.floor(100 + Math.random() * 300); // Randomize between 100-400
    const agriculture = Math.floor(100 + Math.random() * 300); // Randomize between 100-400


    data.push({
      date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), // Format: "01 Oct"
      hour,
      timeBlock,
      purchaseBid,
      sellBid,
      mcv,
      finalVolume,
      mcp,
      supply,
      demand,
      residential,
      industrial,  
      commercial,   
      transportation,
      agriculture,
    });
  }
  return data;
};

const data = generateData();

const energyDistribution = [
  { name: "Solar Energy", value: 40 },
  { name: "Wind Energy", value: 30 },
  { name: "Hydro Energy", value: 15 },
  { name: "Battery Storage", value: 10 },
  { name: "Others", value: 5 },
];

const transactionTypes = [
  { name: "Buy Transactions", value: 55 },
  { name: "Sell Transactions", value: 45 },
];

const userParticipation = [
  { name: "Prosumers", value: 60 },
  { name: "Consumers", value: 40 },
];

const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE", "#A28BE9"];
const TRANSACTION_COLORS = ["#4CAF50", "#F44336"];
const USER_COLORS = ["#2196F3", "#FFC107"];

const Charts = () => {
  const [interval, setInterval] = useState("daily");

  // Filter data based on the selected interval
  const filterData = (interval) => {
    switch (interval) {
      case "hourly":
        return data.filter((_, index) => index % 4 === 0); // One entry per hour
      case "daily":
        return data.filter((_, index) => index % (24 * 4) === 0); // One entry per day
      case "weekly":
        return data.filter((_, index) => index % (7 * 24 * 4) === 0); // One entry per week
      case "monthly":
        return data.filter((_, index) => index % (30 * 24 * 4) === 0); // One entry per month
      case "yearly":
        return data.filter((_, index) => index % (365 * 24 * 4) === 0); // One entry per year
      default:
        return data;
    }
  };

  const filteredData = filterData(interval);

  return (
    <div className="charts-container">
      <div className="charts-select-container">
      {/* <Navbar /> */}
      <h2 className="charts-title">Energy Usage Trends</h2>
  <label className="filter-title">Select Interval</label>
  <select
    value={interval}
    onChange={(e) => setInterval(e.target.value)}
    className="charts-select"
  >
    <option value="hourly">Hourly</option>
    <option value="daily">Daily</option>
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
    <option value="yearly">Yearly</option>
  </select>
</div>
<br />
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredData}>
              <XAxis dataKey="date" stroke="#00c49f" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
              <YAxis stroke="#00c49f" label={{ value: "Energy & Demand", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line type={"monotone"} dataKey={"purchaseBid"} stroke="#FF6347" strokeWidth={2} /> {/* Tomato Red */}
              <Line type={"monotone"} dataKey={"sellBid"} stroke="#4682B4" strokeWidth={2} /> {/* Steel Blue */}
              <Line type={"monotone"} dataKey={"mcv"} stroke="#32CD32" strokeWidth={2} /> {/* Lime Green */}
              <Line type={"monotone"} dataKey={"finalVolume"} stroke="#FFD700" strokeWidth={2} /> {/* Gold */}
              <Line type={"monotone"} dataKey={"mcp"} stroke="#8A2BE2" strokeWidth={2} /> {/* Blue Violet */}

            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
         <div className="chart-box">
           <ResponsiveContainer width="100%" height={250}>
             <AreaChart data={filteredData}>
               <XAxis dataKey="date" stroke="#00c49f" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
               <YAxis stroke="#00c49f" label={{ value: "Energy & Demand", angle: -90, position: "insideLeft" }} />
               <Tooltip />
               <Area type="monotone" dataKey="supply" stroke="#82ca9d" fill="#82ca9d66" />
               <Area type="monotone" dataKey="demand" stroke="#ff7300" fill="#ff730066" />
             </AreaChart>
           </ResponsiveContainer>
         </div>

     {/* Bar Chart */}
<div className="chart-box" width="200%">
  <ResponsiveContainer width="200%" height={320}>
    <BarChart data={filteredData}>
      <XAxis 
        dataKey="sector" 
        stroke="#00c49f" 
        label={{ value: "Sector Name", position: "insideBottom", offset: -5 }} 
        tickFormatter={(sector) => {
          const sectorNames = {
            residential: "Residential",
            industrial: "Industrial",
            commercial: "Commercial",
            transportation: "Transportation",
            agriculture: "Agriculture"
          };
          return sectorNames[sector] || sector; 
        }}
      />
      <YAxis 
        stroke="#00c49f" 
        label={{ value: "Energy Consumption (kWh)", angle: -90, position: "insideLeft" }} 
      />
      <Tooltip />
      <Bar dataKey="residential" fill="#FF6347" />
      <Bar dataKey="industrial" fill="#4682B4" />
      <Bar dataKey="commercial" fill="#32CD32" />
      <Bar dataKey="transportation" fill="#FFD700" />
      <Bar dataKey="agriculture" fill="#8A2BE2" />
    </BarChart>
  </ResponsiveContainer>
</div>


        <br />

        {/* Pie Chart */}
        <div className="flex flex-row justify-center gap-6 p-6 bg-gray-100 rounded-lg shadow-lg overflow-x-auto">
      {/* Energy Distribution */}
      <div className="chart-box bg-white p-4 rounded-lg shadow-md w-1/3 min-w-[300px]">
        <h3 className="text-lg font-semibold text-center mb-4">Energy Distribution</h3>
        <ResponsiveContainer width="100%" height={270}>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={energyDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              animationDuration={800}
            >
              {energyDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
       <br />
      {/* Transaction Types */}
      <div className="chart-box bg-white p-4 rounded-lg shadow-md w-1/3 min-w-[320px]">
        <h3 className="text-lg font-semibold text-center mb-4">Transaction Types</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={transactionTypes}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              animationDuration={800}
            >
              {transactionTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={TRANSACTION_COLORS[index % TRANSACTION_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <br />
      {/* User Participation */}
      <div className="chart-box bg-white p-4 rounded-lg shadow-md w-1/3 min-w-[320px]">
        <h3 className="text-lg font-semibold text-center mb-4">User Participation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={userParticipation}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              animationDuration={800}
            >
              {userParticipation.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    
        
    <motion.div
      className="p-4 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Key Terms</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Term</th>
              <th className="border p-2">Definition</th>
            </tr>
          </thead>
          <tbody>
            {[
              { term: "MCV", definition: "Market Cleared Volume (Unconstrained)" },
              { term: "MCP", definition: "Market Clearing Price (Unconstrained)" },
              { term: "Average (RTC)", definition: "Average of traded hours price in (24 Hrs)" },
              { term: "Peak", definition: "Average of traded hours price in (18-23 Hrs)" },
              { term: "Non-Peak", definition: "Average of traded hours price in (1-17 & 24 Hrs)" },
              { term: "Cleared Volume", definition: "Volume Cleared Post Congestion" },
              { term: "Final Scheduled Volume", definition: "Volume adjusted for real-time curtailment" },
              { term: "Morning", definition: "Average of traded hours price in (07-10 Hrs)" },
              { term: "Day", definition: "Average of traded hours price in (11-17 Hrs)" },
              { term: "Night", definition: "Average of traded hours price in (01-06, 24 Hrs)" },
              { term: "Purchase Bid", definition: "Buyers are willing to pay this price." },
              { term: "Sell Bid", definition: "Sellers are willing to sell at this price." },
              { term: "(MCV) Market Clearing Volume ", definition: " Energy successfully traded." },
              { term: "(MCP) Market Clearing Price", definition: "final price at which energy is sold." },
            ].map((item, index) => (
              <motion.tr
                key={index}
                className="odd:bg-gray-100 even:bg-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <td className="border p-2 font-medium">{item.term}</td>
                <td className="border p-2">{item.definition}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </motion.div>
      </div>
    </div>
  );
};
export default Charts;