import React, { useState } from 'react';
import '../assets/Dropdown.css'; // Import CSS file

function Dropdown() {
  const [year, setYear] = useState(''); // ปีการศึกษาที่เลือก
  const [teacher, setTeacher] = useState(''); // อาจารย์ที่เลือก
  const [academicYear, setAcademicYear] = useState(''); // ปีการศึกษาที่เลือก
  const [semester, setSemester] = useState(''); // ภาคเรียนที่เลือก

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleTeacherChange = (event) => {
    setTeacher(event.target.value);
  };

  const handleAcademicYearChange = (event) => {
    setAcademicYear(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  return (
    <div className="dropdown-container">
      <label className='labelsearch '> อาจารย์ผู้สอน </label>
        <select value={teacher} onChange={handleTeacherChange}>
          <option value="">โปรดเลือก</option>
          <option value="John Doe">John Doe</option>
          <option value="Jane Smith">Jane Smith</option>
          <option value="Michael Johnson">Michael Johnson</option>
          {/* เพิ่มตัวเลือกสำหรับอาจารย์ต่อไปตามต้องการ */}
        </select>
      
      <label className='labelsearch'>ปีการศึกษา</label>
        <select value={academicYear} onChange={handleAcademicYearChange}>
          <option value="">โปรดเลือก</option>
          <option value="2565">2565</option>
          <option value="2566">2566</option>
          <option value="2567">2567</option>
          {/* เพิ่มตัวเลือกสำหรับปีการศึกษาต่อไปตามต้องการ */}
        </select>
      
      <label className='labelsearch'>ภาคเรียน</label>
        <select value={semester} onChange={handleSemesterChange}>
          <option value="">โปรดเลือก</option>
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