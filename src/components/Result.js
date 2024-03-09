import React, { useState, useEffect } from 'react';
import '../assets/st.css';
import Navbar from "./Navbar";
import Dropdown from './Dropdown';
import { db } from '../firebase'; // Import the Firebase db instance
import { collection, getDocs } from 'firebase/firestore';


const Result = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'ChooseSubject'));
          const coursesData = querySnapshot.docs.map(doc => doc.data());
          setCourses(coursesData);
        } catch (error) {
          console.error('Error fetching courses: ', error);
        }
      };

    fetchCourses();
  }, []);

  return (
    <div> 
        <Navbar/>
    <div className='container'>
        <div className="schedule-table-container mt-5">
        <h2>ตารางสอน</h2>
        <Dropdown/>
            <table className="table table-hover mt-3">
                <thead class="thead-light">
                    <tr>
                    <th scope="col">ลำดับที่</th>
                    <th scope="col">รหัสวิชา</th>
                    <th scope="col">ชื่อวิชา</th>
                    <th scope="col">หน่วยกิต</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((courses, index) => (
                      <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{courses.code}</td>
                          <td>{courses.name}</td>
                          <td>{courses.credit}</td>
                      </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Result;
