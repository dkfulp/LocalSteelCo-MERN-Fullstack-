import React from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";

const NavLinks = (props) => {
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          CONTACT US
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" exact>
          ABOUT US
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
