import React, { useState, useEffect } from 'react';
import fetchTeachers from './FetchTeachers';
import '../assets/Dropdown.css';
import FetchYear from './FetchYear';

const Dropdown = ({ queryCourses }) => {
  const [year, setYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  const [selectedSemester, setSelectedSemester] = useState('');

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');

  useEffect(() => {
    const getTeachers = async () => {
      const teachersData = await fetchTeachers();
      setTeachers(teachersData);
    };
    getTeachers();

    const getYear = async () => {
      const yearData = await FetchYear();
      setYear(yearData);
    };
    getYear();
  }, []);

  useEffect(() => {
    const storedTeacher = localStorage.getItem('selectedTeacher');
    if (storedTeacher) {
      setSelectedTeacher(storedTeacher);
    }

    const storedYear = localStorage.getItem('selectedYear');
    if (storedYear) {
      setSelectedYear(storedYear);
    }

    const storedSemester = localStorage.getItem('selectedSemester');
    if (storedSemester) {
      setSelectedSemester(storedSemester);
    }

  }, []);

  const handleTeacherChange = (e) => {
    const value = e.target.value;
    setSelectedTeacher(value);
    localStorage.setItem('selectedTeacher', value);
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setSelectedYear(value);
    localStorage.setItem('selectedYear', value);
  };

  const handleSemesterChange = (event) => {
    const value = event.target.value;
    setSelectedSemester(value);
    localStorage.setItem('selectedSemester', value);
  };

  const onClickHandler = () => {
    queryCourses({ teacher: selectedTeacher, term: selectedSemester, year: selectedYear });
  };

  return (
    <div className="dropdown-container">

      <label className='labelsearch'>อาจารย์ผู้สอน</label>
      <select value={selectedTeacher} onChange={handleTeacherChange}>
        <option value="" disabled>- กรุณาเลือก -</option>
        {teachers.map((teacher, index) => (
          <option key={index} value={teacher.firstname + ' ' + teacher.lastname}>
            {teacher.firstname + ' ' + teacher.lastname}
          </option>
        ))}
      </select>

      <label className='labelsearch'>ปีการศึกษา</label>
      <select value={selectedYear} onChange={handleYearChange}>
        <option value="" disabled>- กรุณาเลือก -</option>
        {[...new Set(year.map((year) => year.years))].map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>

      <label className='labelsearch'>ภาคเรียน</label>
      <select value={selectedSemester} onChange={handleSemesterChange}>
        <option value="" disabled>กรุณาเลือก</option>
        <option value="ฤดูร้อน">ฤดูร้อน</option>
        <option value="ต้น">ต้น</option>
        <option value="ปลาย">ปลาย</option>
      </select>
      <button
        className="btn1"
        onClick={onClickHandler}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  );
}

export default Dropdown;
