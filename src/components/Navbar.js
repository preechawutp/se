import React from 'react';
import { NavLink } from 'react-router-dom'; 
import Logo from '../assets/logo.png';
import '../assets/Navbar.css';

function Mainnav() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={Logo} alt="Logo" />
      </div>
      <ul className="navbar-menu">
        <li><NavLink to="/"><i className="fa-solid fa-book"></i> รายวิชา</NavLink></li>
        <li><NavLink to="/table"><i className="fa-solid fa-table"></i> ตารางสอน</NavLink></li>
        <li><NavLink to="/result"><i className="fa-solid fa-square-poll-vertical"></i> ผลการจัดตาราง</NavLink></li>
        <li><NavLink to="/course"><i className="fa-solid fa-bookmark"></i> หลักสูตร</NavLink></li>
        <li><NavLink to="/teacher"><i className="fa-solid fa-clipboard-list"></i> รายชื่ออาจารย์</NavLink></li>
      </ul>
      <ul className="navbar-menu">
        <li><NavLink to="/login">เข้าสู่ระบบ</NavLink></li>
      </ul>
    </nav>
  );
}

export default Mainnav;
