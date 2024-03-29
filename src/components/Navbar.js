import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png';
import '../assets/Navbar.css';
import { auth } from '../firebase';

const Mainnav = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error.message);
    }
  };

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
        <li><NavLink to="/room"><i className="fa-solid fa-building"></i> รายชื่อห้อง</NavLink></li>
      </ul>
      <ul className="navbar-menu">
        {currentUser ? (
          <li>{currentUser.email} {" "}
            <button className='btn1' onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </li>
        ) : (
          <li></li>
        )}
      </ul>
    </nav>
  );
}

export default Mainnav;
