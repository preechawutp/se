import React from 'react';
import { NavLink } from 'react-router-dom'; 
import Logo from '../assets/logo.png';
import '../assets/Navbar.css';

function NavbarGuest() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <ul className="navbar-menu">
          <li><NavLink to="/"><i className="fa-solid fa-table"></i> ตารางสอน</NavLink></li>
          <li><NavLink to="/"><i className="fa-solid fa-bookmark"></i> หลักสูตร</NavLink></li>
        </ul>
        <ul className="navbar-menu">
          <li><NavLink to="/login">เข้าสู่ระบบ</NavLink></li>
        </ul>
      </nav>
    </>
  );
}

export default NavbarGuest;