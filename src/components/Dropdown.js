import React, { useState, useEffect } from 'react';
import fetchTeachers from './FetchTeachers';
import '../assets/Dropdown.css'; // Import CSS file

function Dropdown() {
  const [year, setYear] = useState(''); // ปีการศึกษาที่เลือก
  const [academicYear, setAcademicYear] = useState(''); // ปีการศึกษาที่เลือก
  const [semester, setSemester] = useState(''); // ภาคเรียนที่เลือก

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');

  useEffect(() => {
    const getTeachers = async () => {
      const teachersData = await fetchTeachers();
      setTeachers(teachersData);
    };
    getTeachers();
  }, []);

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleAcademicYearChange = (event) => {
    setAcademicYear(event.target.value);
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
      <select value={academicYear} onChange={handleAcademicYearChange} >
        <option value="" disabled selected>- กรุณาเลือก -</option>
        <option value="2565">2565</option>
        <option value="2566">2566</option>
        <option value="2567">2567</option>
        {/* เพิ่มตัวเลือกสำหรับปีการศึกษาต่อไปตามต้องการ */}
      </select>

      <label className='labelsearch'>ภาคเรียน</label>
      <select value={semester} onChange={handleSemesterChange}>
        <option value=""  disabled selected>กรุณาเลือก</option>
        <option value="1">ภาคเรียนที่ 1</option>
        <option value="2">ภาคเรียนที่ 2</option>
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