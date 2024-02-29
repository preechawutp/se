import React from 'react';
import Main from './components/Main';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ScheduleTable from './components/ScheduleTable';
import ShowCourse  from './components/ShowCourse ';
import Result from './components/Result';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Main />} />
        <Route path="/table" element={<ScheduleTable />} />
        <Route path="/course" element={<ShowCourse  />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>

    
  );
};

export default App;