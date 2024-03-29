import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png';

const GuestNavbar = () => {

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={Logo} alt="Logo" />
      </div>
      <ul className="navbar-menu">
        <li><NavLink to="/show-schedule"><i className="fa-solid fa-table"></i> ตารางสอน</NavLink></li>
      </ul>
      <ul className="navbar-menu">
        <li><NavLink to="/login">เข้าสู่ระบบ</NavLink></li>
      </ul>
    </nav>
  );
}

export default GuestNavbar;
