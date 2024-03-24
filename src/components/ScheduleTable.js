import React, { useState, useEffect, useRef } from 'react';
// import html2canvas from 'html2canvas'; // Import html2canvas library for converting HTML to canvas
import { saveAs } from 'file-saver'; // Import file-saver library for saving canvas as PNG

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
    const [duplicateCourse, setDuplicateCourse] = useState([]);
    const [searchedCourse, setSearchedCourses] = useState([]);
    const selectedCourseRef = collection(db, 'ChooseSubject');
    const tableRef = useRef(null);

    const timeSlots = Array.from({ length: 26 }, (_, index) => {
        const startHour = Math.floor(index / 2) + 7 < 10 ? '0' + `${Math.floor(index / 2) + 7}` : `${Math.floor(index / 2) + 7}`;
        const startMinute = index % 2 === 0 ? '00' : '30';
        const endHour = Math.floor((index + 1) / 2) + 7 < 10 ? '0' + `${Math.floor((index + 1) / 2) + 7}` : `${Math.floor((index + 1) / 2) + 7}`;
        const endMinute = (index + 1) % 2 === 0 ? '00' : '30';
        return `${startHour}:${startMinute}-${endHour}:${endMinute}`;
    });

    const daysOfWeek = ['จันทร์/MON', 'อังคาร/TUE', 'พุธ/WED', 'พฤหัสบดี/THU', 'ศุกร์/FRI', 'เสาร์/SAT', 'อาทิตย์/SUN'];
        
    // This function is use for query course from search data
    const queryCourses = async ({
        teacher,
        term,
        year,
    }) => {
        const q = query(selectedCourseRef,
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
    // This function should call after query selected course
    useEffect(() => {
        addDummyCourse();
        checkDuplicatedTime();
    }, [searchedCourse]);
    // Function to simulate adding a course to the schedule
    // This should be replaced with your actual logic to add courses
    const addDummyCourse = () => {
        setCourses([]);
        for (let i = 0; i < searchedCourse.length; i++) {
            setCourses(prevCourses => [...prevCourses, {
                id: prevCourses.length + 1,
                code: searchedCourse[i].code,
                curriculum: searchedCourse[i].grade,
                name: searchedCourse[i].name,
                credit: searchedCourse[i].credit,
                type: searchedCourse[i].type,
                day: searchedCourse[i].day,
                startTime: searchedCourse[i].TimeStart,
                endTime: searchedCourse[i].TimeStop,
                teacher: searchedCourse[i].teacher,
                student: searchedCourse[i].student,
                room: searchedCourse[i].room,
            }]);
        }
    };

    var dupCourse = []
    const checkDuplicatedTime = () => {
        for (let i = 0; i < searchedCourse.length - 1; i++) {
            if (searchedCourse[i].day === searchedCourse[i + 1].day) {
                if (searchedCourse[i].TimeStart.split('-')[0] <= searchedCourse[i + 1].TimeStart.split('-')[0] && searchedCourse[i + 1].TimeStart.split('-')[0] <= searchedCourse[i].TimeStop.split('-')[0]) {
                    dupCourse.push(i + 1)
                }
                else if (searchedCourse[i].TimeStart.split('-')[0] <= searchedCourse[i + 1].TimeStop.split('-')[0] && searchedCourse[i + 1].TimeStop.split('-')[0] <= searchedCourse[i].TimeStop.split('-')[0]) {
                    dupCourse.push(i + 1)
                }
            }

        }
        setDuplicateCourse(dupCourse)
    };

    const changeColor = (course) => {
        // Check if the course ID exists in the duplicateCourse array
        if (course) {
            if (duplicateCourse.includes(course.id)) {
                return "red";
            } else {
                return "base";
            }
        } else {
            return ""; // Return empty string for non-existent courses
        }
    };
/* global html2canvas */
    const saveAsPNG = () => {
        html2canvas(tableRef.current).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'schedule_table.png');
            });
        });
    };

    return (
        <div>
            <Navbar />
            <div className='container'>
                <div className="schedule-table-container mt-5" >
                    <h2>ตารางสอน</h2>
                    <Dropdown queryCourses={queryCourses} />
                    <table className="schedule-table" ref={tableRef}>
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
                                                    <td key={timeIndex} colSpan={colspan} className="cellselected" style={{ background: changeColor(courseForThisSlot) }}>
                                                        <div>
                                                            <span>{`${courseForThisSlot.code} ${courseForThisSlot.name}`}</span>
                                                            <br />
                                                            <span>{`อาจารย์: ${courseForThisSlot.teacher}`}</span>
                                                            <br />
                                                            <span>{`ห้อง: ${courseForThisSlot.room}`}</span>
                                                        </div>
                                                    </td>
                                                );
                                            } else {
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
                    <button className="btn1" onClick={saveAsPNG}>Save PNG</button></div>
                <div className="course-detail-table mt-3">
                    <h2>รายละเอียดรายวิชา</h2>

                    <table className="table table-hover mt-4">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">รหัสวิชา</th>
                                <th scope="col">ชื่อวิชา</th>
                                <th scope="col">หน่วยกิต</th>
                                <th scope="col">วันสอน</th>
                                <th scope="col">เวลา</th>
                                <th scope="col">ประเภท</th>
                                <th scope="col">จำนวนที่เปิดรับ</th>
                                <th scope="col">ห้อง</th>
                                <th scope="col">อาจารย์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course, index) => (
                                <tr key={index}>
                                    <th scope="col">{index + 1}</th>
                                    <th scope="col">{course.code}-{course.curriculum}</th>
                                    <th scope="col">{course.name}</th>
                                    <th scope="col">{course.credit}</th>
                                    <th scope="col">{course.day}</th>
                                    <th scope="col">{course.startTime} - {course.endTime} น.</th>
                                    <th scope="col">{course.type}</th>
                                    <th scope="col">{course.student}</th>
                                    <th scope="col">{course.room}</th>
                                    <th scope="col">{course.teacher}</th>
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


