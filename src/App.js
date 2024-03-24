import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Main from './components/Main';
import LoginForm from './components/LoginForm';
import ScheduleTable from './components/ScheduleTable';
import ShowCourse from './components/ShowCourse';
import Result from './components/Result';
import TeacherTable from './components/Teachertable';
import ShowSchedule from './components/ShowSchedule'; // นำเข้า ShowSchedule component

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="loader"></div>
    </div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/show-schedule" element={<ShowSchedule />} /> 
        <Route path="/login" element={<LoginForm />} />
        {user ? (
          <>
            <Route path="/" element={<Main />} />
            <Route path="/table" element={<ScheduleTable />} />
            <Route path="/course" element={<ShowCourse />} />
            <Route path="/result" element={<Result />} />
            <Route path="/teacher" element={<TeacherTable />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/show-schedule" />} /> 
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
