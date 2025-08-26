// src/components/Navbar.jsx

import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navStyle = {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    borderBottom: "2px solid #eee",
    marginBottom: "20px",
  };

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: isActive ? "bold" : "normal",
    color: isActive ? "#007BFF" : "#333",
    borderBottom: isActive ? "2px solid #007BFF" : "none",
    paddingBottom: "5px",
  });

  return (
    <nav style={navStyle}>
      <NavLink to="/setup" style={linkStyle}>
        Setup
      </NavLink>
      <NavLink to="/transactions" style={linkStyle}>
        Transactions
      </NavLink>
    </nav>
  );
};

export default Navbar;
