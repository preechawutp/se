import React, { useState, useEffect } from 'react';
import fetchTeachers from './FetchTeachers';
import '../assets/Dropdown.css'; // Import CSS file
import FetchYear from './FetchYear';

const Dropdown = ({queryCourses}) => {
  const [year, setYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  const [selectedSemester, setSelectedSemester] = useState(''); // ภาคเรียนที่เลือก

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
    setSelectedYear(e.target.value);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const onClickHandler = (selectedTeacher, selectedSemester, selectedYear) => {
    queryCourses({ teacher: selectedTeacher, term: selectedSemester, year: selectedYear });
}

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
        <option value="" disabled selected>กรุณาเลือก</option>
        <option value="ฤดูร้อน">ฤดูร้อน</option>
        <option value="ต้น">ต้น</option>
        <option value="ปลาย">ปลาย</option>
        {/* เพิ่มตัวเลือกสำหรับภาคเรียนต่อไปตามต้องการ */}
      </select>
      <button
        className="btn1"
        onClick={() => onClickHandler(selectedTeacher, selectedSemester, selectedYear)}
      >
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  );
}

export default Dropdown;