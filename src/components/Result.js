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


const Result = () => {
  const [searchedCourse, setSearchedCourses] = useState([]);
  const ChooseSubjectRef = collection(db, 'ChooseSubject');

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
  };


  return (
    <div> 
        <Navbar/>
    <div className='container'>
        <div className="schedule-table-container mt-5">
        <h2>ตารางสอน</h2>
        <Dropdown queryCourses={queryCourses} />
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
                    {searchedCourse.map((searchedCourse, index) => (
                      <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{searchedCourse.code}</td>
                          <td>{searchedCourse.name}</td>
                          <td>{searchedCourse.credit}</td>
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
