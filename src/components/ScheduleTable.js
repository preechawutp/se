import React, { useState, useEffect } from 'react';
import '../assets/st.css';
import Navbar from "./Navbar";
import Dropdown from './Dropdown';
import { db } from '../firebase';
import {
  collection,
  query, 
  where,
  getDocs,
  onSnapshot,
  and,
} from 'firebase/firestore';

const ScheduleTable = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const selectedCourseRef = collection(db, 'selected_course');
    const q = query(selectedCourseRef, where('status', '==', 'active'));
    //const courseRef = getDocs(q);
    useEffect(() => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newSelectedCourses = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSelectedCourses(newSelectedCourses);
        });
    
        return () => {
          unsubscribe();
        };
      }, []);

    const timeSlots = Array.from({ length: 26 }, (_, index) => {
        const startHour = Math.floor(index / 2) + 7 < 10 ? '0' + `${Math.floor(index / 2) + 7}` : `${Math.floor(index / 2) + 7}`;
        const startMinute = index % 2 === 0 ? '00' : '30';
        const endHour = Math.floor((index+1)/ 2) + 7 < 10 ? '0' + `${Math.floor((index+1) / 2) + 7}` : `${Math.floor((index+1) / 2) + 7}`;
        const endMinute = (index + 1) % 2 === 0 ? '00' : '30';

        return `${startHour}:${startMinute}-${endHour}:${endMinute}`;
    });

    const daysOfWeek = ['จันทร์/MON', 'อังคาร/TUE', 'พุธ/WED', 'พฤหัสบดี/THU', 'ศุกร์/FRI', 'เสาร์/SAT', 'อาทิตย์/SUN'];

    // Function to simulate adding a course to the schedule
    // This should be replaced with your actual logic to add courses
    const addDummyCourse = () => {
        for (let i =0; i<selectedCourses.length; i++){
            console.log(i)
            setCourses(prevCourses => [...prevCourses, {
                id: prevCourses.length + 1,
                code: selectedCourses[i].code,
                curriculum: selectedCourses[i].grade,
                name: selectedCourses[i].name,
                credit: selectedCourses[i].credit,
                type: selectedCourses[i].type,
                day: selectedCourses[i].day,
                startTime: selectedCourses[i].TimeStart,
                endTime: selectedCourses[i].TimeStop,
            }]);
        }    
    };
    console.log(selectedCourses)
    return (
        <div> 
            <Navbar/>
            <div className='container'>
                <button onClick={addDummyCourse}>Add Dummy Course</button>
                <div className="schedule-table-container mt-5">
                    <h2>ตารางสอน</h2>
                    <Dropdown/>
                    <table className="schedule-table">
                        <thead>
                            <tr>
                                <th>Day/Time</th>
                                {timeSlots.map((time, index) => (
                                    <th key={index}>{time}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {daysOfWeek.map((day, dayIndex) => (
                                <tr key={dayIndex}>
                                    <td>{day.split('/')[0]}</td>
                                    {timeSlots.map((time, timeIndex) => {
                                        const courseForThisSlot = courses.find(course => 
                                            course.day === day.split('/')[1] && 
                                            course.startTime <= time.split('-')[0] && 
                                            course.endTime >= time.split('-')[1]
                                        );
                                        return (
                                            <td key={timeIndex}>
                                                {courseForThisSlot ? `${courseForThisSlot.name}` : ""}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="course-detail-table mt-5">
                    <h2>รายละเอียดรายวิชา</h2>
                    <table className="table table-hover">
                        <thead >
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">รหัสวิชา</th>
                                <th scope="col">หลักสูตร</th>
                                <th scope="col">ชื่อวิชา</th>
                                <th scope="col">หน่วยกิต</th>
                                <th scope="col">ประเภท</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{course.code}</td>
                                    <td>{course.curriculum}</td>
                                    <td>{course.name}</td>
                                    <td>{course.credit}</td>
                                    <td>{course.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ScheduleTable;
