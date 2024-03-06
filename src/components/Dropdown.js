import React, { useState, useEffect } from 'react';
import fetchTeachers from './FetchTeachers';
import '../assets/Dropdown.css'; // Import CSS file
import FetchYear from './FetchYear';

function Dropdown() {
  const [year, setYear] = useState([]);
  const [selectYear, setSelectYear] = useState('');

  const [semester, setSemester] = useState(''); // ภาคเรียนที่เลือก

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

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectYear(e.target.value);
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  return (
    <div className="dropdown-container">

      <label className='labelsearch'>อาจารย์ผู้สอน</label>
      <select value={selectedTeacher} onChange={handleTeacherChange}>
        <option value="" disabled selected >- กรุณาเลือก -</option>
        {teachers.map((teacher, index) => (
          <option key={index} value={teacher.firstname + ' ' + teacher.lastname}>
            {teacher.firstname + ' ' + teacher.lastname}
          </option>
        ))}
      </select>

      <label className='labelsearch'>ปีการศึกษา</label>
      <select value={selectYear} onChange={handleYearChange}>
        <option value="" disabled>- กรุณาเลือก -</option>
        {[...new Set(year.map((year) => year.years))].map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>

      <label className='labelsearch'>ภาคเรียน</label>
      <select value={semester} onChange={handleSemesterChange}>
        <option value="" disabled selected>กรุณาเลือก</option>
        <option value="ฤดูร้อน">ฤดูร้อน</option>
        <option value="ฤดูร้อน">ต้น</option>
        <option value="ฤดูร้อน">ปลาย</option>
        {/* เพิ่มตัวเลือกสำหรับภาคเรียนต่อไปตามต้องการ */}
      </select>
      <button
        className="btn1"
      >
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  );
}

export default Dropdown;