import React from "react";
import { Link } from "react-router-dom";
import { FaHistory, FaShoppingCart, FaDollarSign, FaUserCircle, FaChartBar, FaChartLine  } from "react-icons/fa";
import "../styles/Navbar.css"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li>
          <Link to="/dashboard" className="nav-link">
            <FaChartLine className="icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/transaction-history" className="nav-link">
            <FaHistory className="icon" /> Transaction History
          </Link>
        </li>
        <li>
          <Link to="/buy-energy" className="nav-link">
            <FaShoppingCart className="icon" /> Buy Energy
          </Link>
        </li>
        <li>
          <Link to="/sell-energy" className="nav-link">
            <FaDollarSign className="icon" /> Sell Energy
          </Link>
        </li>
        <li>
          <Link to="/profile" className="nav-link">
            <FaUserCircle className="icon" /> Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
