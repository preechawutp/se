  import React, { useState, useEffect } from 'react';
  import '../assets/st.css';
  import Navbar from "./Navbar";
  import Dropdown from './Dropdown';
  import { db } from '../firebase'; // Import the Firebase db instance
  import {
    collection,
    query,
    where,
    getDocs,
  } from 'firebase/firestore';
  import * as XLSX from 'xlsx'; // Import the xlsx library

  const Result = () => {
    const [searchedCourse, setSearchedCourses] = useState([]);
    const ChooseSubjectRef = collection(db, 'ChooseSubject');
    const [totalCredits, setTotalCredits] = useState(0);

    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'ChooseSubject'));
          const coursesData = querySnapshot.docs.map(doc => doc.data());
          setSearchedCourses(coursesData);
        } catch (error) {
          console.error('Error fetching courses: ', error);
        }
      };

      fetchCourses();
    }, []);

    const [searched, setSearched] = useState(false);
    const queryCourses = async ({
      teacher,
      term,
      year,
    }) => {
      const q = query(ChooseSubjectRef,
        where('teacher', '==', teacher),
        where('term', '==', term),
        where('years', '==', year),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      // const coursesArray = querySnapshot.docs.map(doc => doc.data());
      const coursesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchedCourses(coursesArray);
      setSearched(true);
    };

    const saveAs = () => {
      const teacherName = searchedCourse.length > 0 ? searchedCourse[0].teacher : 'unknown_teacher';
      const year = searchedCourse.length > 0 ? searchedCourse[0].years : 'unknown_year';
      const term = searchedCourse.length > 0 ? searchedCourse[0].term : 'unknown_term';
      const filename = `${teacherName}-${year}-${term}.xlsx`;

      if (searchedCourse.length === 0) {
        console.error('No courses found.');
        return;
      }

      const ws = XLSX.utils.aoa_to_sheet([
        [`อาจารย์ : ${teacherName}, ปีการศึกษา : ${year}, ภาคเรียน : ${term}`],
        ['รหัสวิชา', 'หลักสูตร', 'ชื่อวิชา', 'ประเภท', 'หมู่เรียน', 'วัน', 'เริ่ม', 'สิ้นสุด', 'ห้องเรียน', 'จำนวนที่เปิดรับ', 'อาจารย์ผู้สอน'],
        ...searchedCourse.map(course => [
          course.code,
          course.grade,
          course.name,
          course.type,
          course.sec,
          course.day,
          course.TimeStart,
          course.TimeStop,
          course.room,
          course.student,
          course.teacher
        ])
      ]);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'All Data');

      XLSX.writeFile(wb, filename);
    };

    const saveAsAll = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ChooseSubject'));
        const allCoursesData = querySnapshot.docs.map(doc => doc.data());

        const allData = allCoursesData.reduce((accumulator, course) => {
          const { years, term } = course;
          const key = `${years}_${term}`;
          if (!accumulator[key]) {
            accumulator[key] = [];
          }
          accumulator[key].push(course);
          return accumulator;
        }, {});

        const filename = 'ผลการจัดตาราง.xlsx';
        const wb = XLSX.utils.book_new();

        Object.entries(allData).forEach(([key, courses]) => {
          const [year, term] = key.split('_');

          const wsData = [
            [`ปีการศึกษา : ${year} ภาคเรียน : ${term}`],
            ['รหัสวิชา', 'หลักสูตร', 'ชื่อวิชา', 'ประเภท', 'หมู่เรียน', 'วัน', 'เริ่ม', 'สิ้นสุด', 'ห้องเรียน', 'จำนวนที่เปิดรับ', 'อาจารย์ผู้สอน'],
            ...courses.map(course => [
              course.code,
              course.grade,
              course.name,
              course.type,
              course.sec,
              course.day,
              course.TimeStart,
              course.TimeStop,
              course.room,
              course.student,
              course.teacher
            ])
          ];

          const ws = XLSX.utils.aoa_to_sheet(wsData);
          XLSX.utils.book_append_sheet(wb, ws, ` ปีการศึกษา ${year} ภาค${term}`);
        });

        XLSX.writeFile(wb, filename);
      } catch (error) {
        console.error('Error fetching all courses: ', error);
      }
    };

    useEffect(() => {
      // Calculate total credits whenever searchedCourse changes
      const credits = searchedCourse.reduce((total, course) => total + parseInt(course.credit), 0);
      setTotalCredits(credits);
    }, [searchedCourse]);

    return (
      <div>
        <Navbar />
        <div className='container'>
          <div className="schedule-table-container mt-5">
            <h2>ผลการจัดตาราง</h2>
            <div className='d-flex justify-content-between'>
              <Dropdown queryCourses={queryCourses} />
              <div className='d-flex justify-content-end'>
                <button className="btn1 m-3" onClick={saveAs}>ผลการจัดตาราง</button>
              </div>
            </div>
            {!searched && <h5 className='text-center mb-4 mt-5'>กรุณาค้นหาข้อมูล</h5>}
            {searched &&
            <table className="table table-hover mt-3">
              <thead className="thead-light">
                <tr>
                  <th scope="col">ลำดับที่</th>
                  <th scope="col">รหัสวิชา</th>
                  <th scope="col">ชื่อวิชา</th>
                  <th scope="col" style={{width: "10%"}}>หน่วยกิต</th>
                </tr>
              </thead>
              <tbody>
                {searchedCourse.map((searchedCourse, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{searchedCourse.code}</td>
                    <td>{searchedCourse.name}</td>
                    <td>{searchedCourse.credit}</td>
                  </tr>

                ))}
                <td></td><td></td><td></td><td>รวม {totalCredits} หน่วยกิต</td>
              </tbody>
            
            </table>
            }
            <div className='d-flex justify-content-end'>
              <button className="btn1 m-3" onClick={saveAsAll}>ผลการจัดตารางทั้งหมด</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Result;