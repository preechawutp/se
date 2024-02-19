import React, { useState } from 'react';
import Main from './components/Main';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import BrowserRouter, Route, Switch
import LoginForm from './components/LoginForm';
import ScheduleTable from './components/ScheduleTable';
import ShowCourse  from './components/ShowCourse ';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Main />} />
        <Route path="/table" element={<ScheduleTable />} />
        <Route path="/course" element={<ShowCourse  />} />
      </Routes>
    </Router>
  );
};

export default App;