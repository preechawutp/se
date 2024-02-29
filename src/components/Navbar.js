import Logo from '../assets/logo.png';
import "../assets/Navbar.css"
import React from "react";

function Mainnav() {
  return (
    <>
    
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={Logo} alt="Logo" />
      </div>
        <ul className="navbar-menu">
          <li><a href="/"><i class="fa-solid fa-book"></i> รายวิชา</a></li>
          <li><a href="/table"><i class="fa-solid fa-table"></i> ตารางสอน</a></li>
          <li><a href="/course"><i class="fa-solid fa-bookmark"></i> หลักสูตร</a></li>
          <li><a href="/result"><i class="fa-solid fa-square-poll-vertical"></i> ผลการจัดตาราง</a></li>
          <li><a href="/teacher"><i class="fa-solid fa-clipboard-list"></i> รายชื่ออาจารย์</a></li>
        </ul>
    </nav>
    </>
  );
}

export default Mainnav;