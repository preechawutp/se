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
                                const courseForThisSlot = courses.find(
                                (course) =>
                                    course.day === day.split('/')[1] &&
                                    course.startTime <= time.split('-')[0] &&
                                    course.endTime >= time.split('-')[1]
                                );

                                if (courseForThisSlot) {
                                // Check if this is the first cell in the consecutive time slots
                                const isFirstCell =
                                    timeIndex === 0 ||
                                    !courses.find(
                                    (course) =>
                                        course.day === day.split('/')[1] &&
                                        course.startTime <= timeSlots[timeIndex - 1].split('-')[0] &&
                                        course.endTime >= timeSlots[timeIndex - 1].split('-')[1]
                                    );

                                if (isFirstCell) {
                                    // Calculate the colspan based on the number of consecutive time slots
                                    const startSlotIndex = timeIndex;
                                    let colspan = 1;
                                    while (
                                    timeSlots[startSlotIndex + colspan] &&
                                    courses.find(
                                        (course) =>
                                        course.day === day.split('/')[1] &&
                                        course.startTime <= timeSlots[startSlotIndex + colspan].split('-')[0] &&
                                        course.endTime >= timeSlots[startSlotIndex + colspan].split('-')[1]
                                    )
                                    ) {
                                    colspan++;
                                    }

                                    return (
                                        <td key={timeIndex} colSpan={colspan} className="cellselected">
                                            {`${courseForThisSlot.code} ${courseForThisSlot.name}`}
                                        </td>
                                    );
                                } else {
                                    // If not the first cell, return a hidden cell
                                    return <td key={timeIndex} className="hidden-cell"></td>;
                                }
                                } else {
                                return <td key={timeIndex}></td>;
                                }
                            })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="course-detail-cards ">
                    <h2>รายละเอียดรายวิชา</h2>
                    <div className="card-container">
                        {courses.map((course, index) => (
                            <div className="card mb-3" key={index}>
                                <div className="card-body">
                                    <h5 className="card-title">รหัสวิชา: {course.code}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">หลักสูตร: {course.curriculum}</h6>
                                    <p className="card-text">ชื่อวิชา: {course.name}</p>
                                    <p className="card-text">หน่วยกิต: {course.credit}</p>
                                    <p className="card-text">ประเภท: {course.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleTable;
