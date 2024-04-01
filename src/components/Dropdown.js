import React, { useState, useEffect } from 'react';
import fetchTeachers from './FetchTeachers';
import '../assets/Dropdown.css';
import FetchYear from './FetchYear';
import Select from 'react-select';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';



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

  const handleTeacherChange = (selectedOption) => {
    // อัปเดต state และ localStorage ด้วยค่า value ของตัวเลือกที่เลือก
    setSelectedTeacher(selectedOption ? selectedOption.value : '');
    localStorage.setItem('selectedTeacher', selectedOption ? selectedOption.value : '');
  };
  
  const handleYearChange = (selectedOption) => {
    // อัปเดต state และ localStorage ด้วยค่า value ของตัวเลือกที่เลือก หรือสตริงว่างถ้าไม่มีการเลือก
    setSelectedYear(selectedOption ? selectedOption.value : '');
    localStorage.setItem('selectedYear', selectedOption ? selectedOption.value : '');
  };
  
  const handleSemesterChange = (selectedOption) => {
    // อัปเดต state และ localStorage ด้วยค่า value ของตัวเลือกที่เลือก หรือสตริงว่างถ้าไม่มีการเลือก
    setSelectedSemester(selectedOption ? selectedOption.value : '');
    localStorage.setItem('selectedSemester', selectedOption ? selectedOption.value : '');
  };

  const onClickHandler = () => {
    queryCourses({ teacher: selectedTeacher, term: selectedSemester, year: selectedYear });
  };

  useEffect(() => {
    const checkAndUpdate = async () => {
      try {
        const docRef = doc(db, 'checkSerch', 'ibxgkBDV1OdKSnAC44Y7');
        const docSnap = await getDoc(docRef); // เปลี่ยนจาก doc.get เป็น getDoc
        const data = docSnap.data();
        if (data.check === 1) {
          // เรียกใช้ onClickHandler 1 ครั้งเมื่อค่าใน Firebase เป็น 1
          onClickHandler();

          // เปลี่ยนค่าใน Firebase เป็น 0
          await updateDoc(docRef, {
            check: 0
          });
          console.log('Data updated successfully. check 0');
        }
      } catch (error) {
        console.error('Error checking and updating data: ', error);
      }
    };

    checkAndUpdate();
  }, [onClickHandler]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: 250, // กำหนดความกว้างเป็น 200px หรือตามที่คุณต้องการ
    }),
    menu: (provided, state) => ({
      ...provided,
      width: 250, // ความกว้างของเมนูตรงกับ control
      minHeight: 'auto', // กำหนดความสูงขั้นต่ำสำหรับเมนู
      maxHeight: '400px', // กำหนดความสูงสูงสุด สำหรับการเลื่อนภายในเมนู
    }),
  };

  const customStyles2 = {
    control: (provided, state) => ({
      ...provided,
      width: 150, // กำหนดความกว้างเป็น 200px หรือตามที่คุณต้องการ
    }),
    menu: (provided, state) => ({
      ...provided,
      width: 150, // ความกว้างของเมนูตรงกับ control
      minHeight: 'auto', // กำหนดความสูงขั้นต่ำสำหรับเมนู
      maxHeight: '400px', // กำหนดความสูงสูงสุด สำหรับการเลื่อนภายในเมนู
    }),
  };

  const teacherOptions = [
    { value: "", label: "- กรุณาเลือก -", isDisabled: true }, // เพิ่มตัวเลือกนี้เป็นตัวแรก
    ...teachers.map((teacher) => ({
      value: teacher.firstname + ' ' + teacher.lastname,
      label: teacher.firstname + ' ' + teacher.lastname,
    }))
  ];

  const yearOptions = [
    { value: "", label: "- กรุณาเลือก -", isDisabled: true  }, // ตัวเลือกแรกสำหรับคำแนะนำให้เลือก
    ...[...new Set(year.map(year => year.years))].map(year => ({
      value: year, // ตัวเลือก 'value' เก็บค่าปี
      label: year // ตัวเลือก 'label' สำหรับแสดง
    }))
  ];

  const semesterOptions = [
    { value: "", label: "- กรุณาเลือก -", isDisabled: true },
    { value: "ฤดูร้อน", label: "ฤดูร้อน" },
    { value: "ต้น", label: "ต้น" },
    { value: "ปลาย", label: "ปลาย" }
  ];

  return (
    <div className="dropdown-container">

      <label className='labelsearch'>อาจารย์ผู้สอน</label>
      <Select
        className="basic-single"
        classNamePrefix="select"
        isSearchable={true}
        name="teacher"
        options={teacherOptions}
        value={teacherOptions.find(option => option.value === selectedTeacher)}
        onChange={(selectedOption) => handleTeacherChange(selectedOption)}
        styles={customStyles}
      />

      <label className='labelsearch'>ปีการศึกษา</label>
      <Select
        className="basic-single"
        classNamePrefix="select"
        isSearchable={true}
        name="year"
        options={yearOptions}
        value={yearOptions.find(option => option.value === selectedYear)} // กำหนดค่าที่เลือก
        onChange={(selectedOption) => handleYearChange(selectedOption)} // จัดการเมื่อมีการเปลี่ยนแปลง
        styles={customStyles2} // ถ้าต้องการกำหนดสไตล์เพิ่มเติม
      />

      <label className='labelsearch'>ภาคเรียน</label>
      <Select
        className="basic-single"
        classNamePrefix="select"
        isSearchable={true}
        name="semester"
        options={semesterOptions}
        value={semesterOptions.find(option => option.value === selectedSemester)} // กำหนดค่าที่เลือก
        onChange={(selectedOption) => handleSemesterChange(selectedOption)} // จัดการการเปลี่ยนแปลง
        styles={customStyles2} // ถ้าต้องการกำหนดสไตล์เพิ่มเติม
      />

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
