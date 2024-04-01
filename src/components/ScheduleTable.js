import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';

import '../assets/st.css';
import Navbar from "./Navbar";
import Dropdown from './Dropdown';
import { db } from '../firebase';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
} from 'firebase/firestore';
import ShowChoose from './ShowChoose';
import { Alert, Button, Modal } from 'react-bootstrap';
import EditCourseInTable from "./EditCourseInTable";
import Guide from './Guide';



const ScheduleTable = ({ onClickHandler }) => {
    const [courses, setCourses] = useState([]);
    const [duplicateCourse, setDuplicateCourse] = useState([]);
    const [searchedCourse, setSearchedCourses] = useState([]);
    const [allCourse, setAllCourse] = useState([]);
    const [dupType, setDupType] = useState([]);
    const [dupRoom, setDupRoom] = useState([]);
    const [dupSec, setDupSec] = useState([]);
    const [pairDupType, setPairDupType] = useState([]);
    const [pairDupRoom, setPairDupRoom] = useState([]);
    const [pairDupSec, setPairDupSec] = useState([]);
    const [pairDupCourse, setpairDupCourse] = useState([]);
    const selectedCourseRef = collection(db, 'ChooseSubject');
    const tableRef = useRef(null);
    const [validationError, setValidationError] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    const timeSlots = Array.from({ length: 26 }, (_, index) => {
        const startHour = Math.floor(index / 2) + 7 < 10 ? '0' + `${Math.floor(index / 2) + 7}` : `${Math.floor(index / 2) + 7}`;
        const startMinute = index % 2 === 0 ? '00' : '30';
        const endHour = Math.floor((index + 1) / 2) + 7 < 10 ? '0' + `${Math.floor((index + 1) / 2) + 7}` : `${Math.floor((index + 1) / 2) + 7}`;
        const endMinute = (index + 1) % 2 === 0 ? '00' : '30';
        return `${startHour}:${startMinute}-${endHour}:${endMinute}`;
    });

    const daysOfWeek = ['จันทร์/MON', 'อังคาร/TUE', 'พุธ/WED', 'พฤหัสบดี/THU', 'ศุกร์/FRI', 'เสาร์/SAT', 'อาทิตย์/SUN'];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'ChooseSubject'));
                const coursesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAllCourse(coursesData);
            } catch (error) {
                console.error('Error fetching courses: ', error);
            }
        };
        fetchCourses();
    }, []);

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
        AddCourseTotable();
        checkDuplicatedTime();
        checkSubjectType();
        checkRoomOverlap();
        checkSecOverlap();
    }, [searchedCourse]);

    // Function to simulate adding a course to the schedule
    // This should be replaced with your actual logic to add courses
    const AddCourseTotable = () => {
        setCourses([]);
        for (let i = 0; i < searchedCourse.length; i++) {
            setCourses(prevCourses => [...prevCourses, {
                id: prevCourses.length + 1,
                course_id: searchedCourse[i].id,
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
                years: searchedCourse[i].years,
                sec: searchedCourse[i].sec,
                term: searchedCourse[i].term,
                subjecttype: searchedCourse[i].subjecttype, //(วิชาแกน,วิชาเฉพาะเลือก,วิชาเฉพาะบังคับ)
            }]);
        }
    };

    var dupCourse = []
    var pair_dupCourse = []
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
        setpairDupCourse(pair_dupCourse)
    };

    var duplicateTypes = [];
    var pair_dupType = [];
    const checkSubjectType = () => {
        for (let i = 0; i < allCourse.length; i++) {
            for (let j = 0; j < allCourse.length; j++) {
                if (i !== j && !duplicateTypes.includes(allCourse[i].id)) {
                    if (
                        allCourse[i].years !== allCourse[j].years ||
                        allCourse[i].term !== allCourse[j].term
                    ) {
                        continue;
                    }
                    if (allCourse[i].day === allCourse[j].day) {
                        const timeStart1 = allCourse[i].TimeStart.split("-")[0];
                        const timeStop1 = allCourse[i].TimeStop.split("-")[0];
                        const timeStart2 = allCourse[j].TimeStart.split("-")[0];
                        const timeStop2 = allCourse[j].TimeStop.split("-")[0];
                        if (
                            (timeStart1 <= timeStart2 && timeStart2 <= timeStop1) ||
                            (timeStart1 <= timeStop2 && timeStop2 <= timeStop1) ||
                            (timeStart2 <= timeStart1 && timeStart1 <= timeStop2) ||
                            (timeStart2 <= timeStop1 && timeStop1 <= timeStop2)
                        ) {
                            // Check subject type rules
                            if (allCourse[i].subjecttype === allCourse[j].subjecttype) {
                                if (allCourse[i].subjecttype === "วิชาแกน") {
                                    // Core courses of the same year should not clash
                                    duplicateTypes.push(allCourse[i].id);
                                    if (!pair_dupType.some(pair => pair[0] === allCourse[j] && pair[1] === allCourse[i])) {
                                        pair_dupType.push([allCourse[i], allCourse[j]]);
                                    }
                                } else if (allCourse[i].subjecttype === "วิชาเฉพาะบังคับ") {
                                    // Core courses should not clash with required elective courses
                                    duplicateTypes.push(allCourse[i].id);
                                    if (!pair_dupType.some(pair => pair[0] === allCourse[j] && pair[1] === allCourse[i])) {
                                        pair_dupType.push([allCourse[i], allCourse[j]]);
                                    }
                                }
                            } else if (
                                (allCourse[i].subjecttype === "วิชาเฉพาะบังคับ" && allCourse[j].subjecttype === "วิชาแกน") ||
                                (allCourse[i].subjecttype === "วิชาแกน" && allCourse[j].subjecttype === "วิชาเฉพาะบังคับ")
                            ) {
                                // Core courses can clash with elective courses
                                duplicateTypes.push(allCourse[i].id);
                                if (!pair_dupType.some(pair => pair[0] === allCourse[j] && pair[1] === allCourse[i])) {
                                    pair_dupType.push([allCourse[i], allCourse[j]]);
                                }
                            } else if (
                                (allCourse[i].subjecttype === "วิชาเฉพาะเลือก" && allCourse[j].subjecttype === "วิชาเฉพาะบังคับ") ||
                                (allCourse[i].subjecttype === "วิชาเฉพาะบังคับ" && allCourse[j].subjecttype === "วิชาเฉพาะเลือก")
                            ) {
                                // Required elective courses should not clash with core courses
                                duplicateTypes.push(allCourse[i].id);
                                if (!pair_dupType.some(pair => pair[0] === allCourse[j] && pair[1] === allCourse[i])) {
                                    pair_dupType.push([allCourse[i], allCourse[j]]);
                                }
                            }
                        }
                    }
                }
            }
        }
        setDupType(duplicateTypes);
        setPairDupType(pair_dupType);
    };

    var duplicateRooms = [];
    var pair_dupRoom = [];
    const checkRoomOverlap = () => {
        for (let i = 0; i < allCourse.length; i++) {
            for (let j = 0; j < allCourse.length; j++) {
                if (i !== j && !duplicateRooms.includes(allCourse[i].id)) {
                    if (allCourse[i].year === allCourse[j].year && // Check for same year
                        allCourse[i].day === allCourse[j].day &&
                        allCourse[i].room === allCourse[j].room) {
                        const timeStart1 = parseInt(allCourse[i].TimeStart.split("-")[0]);
                        const timeStop1 = parseInt(allCourse[i].TimeStop.split("-")[0]);
                        const timeStart2 = parseInt(allCourse[j].TimeStart.split("-")[0]);
                        const timeStop2 = parseInt(allCourse[j].TimeStop.split("-")[0]);

                        // Check for time overlap
                        if ((timeStart1 <= timeStart2 && timeStart2 <= timeStop1) ||
                            (timeStart1 <= timeStop2 && timeStop2 <= timeStop1) ||
                            (timeStart2 <= timeStart1 && timeStart1 <= timeStop2) ||
                            (timeStart2 <= timeStop1 && timeStop1 <= timeStop2)) {
                            duplicateRooms.push(allCourse[i].room);
                            if (!pair_dupRoom.some(pair => pair[0] === allCourse[j] && pair[1] === allCourse[i])) {
                                pair_dupRoom.push([allCourse[i], allCourse[j]]);
                            }
                        }
                    }
                }
            }
        }
        setDupRoom(duplicateRooms);
        setPairDupRoom(pair_dupRoom);
    };

    var duplicateSec = [];
    var pair_dupSec = [];
    const checkSecOverlap = () => {
        for (let i = 0; i < allCourse.length; i++) {
            for (let j = 0; j < allCourse.length; j++) {
                if (i !== j && !duplicateSec.includes(allCourse[i].id)) {
                    if (
                        allCourse[i].name === allCourse[j].name && // Check if course names are the same
                        allCourse[i].sec === allCourse[j].sec // Check if sections are the same
                    ) {
                        // If sections are the same for the same course, consider it as section clash
                        duplicateSec.push(allCourse[i].sec);
                        if (!pair_dupSec.some(pair => pair[0] === allCourse[j] && pair[1] === allCourse[i])) {
                            pair_dupSec.push([allCourse[i], allCourse[j]]);
                        }
                    }
                }
            }
        }
        setDupSec(duplicateSec);
        setPairDupSec(pair_dupSec);
    };

    const changeColor = (course) => {
        // ตรวจสอบว่ามีวิชาหรือไม่
        if (course) {
            // ตรวจสอบว่า ID ของวิชามีในอาเรย์ของวิชาที่ซ้ำซ้อนหรือไม่
            if (duplicateCourse.includes(course.id)) {
                return "red"; // ถ้าเป็นซ้ำซ้อน สีเป็นสีแดง
            } else if (dupType.includes(course.course_id)) {
                return "yellow"; // ถ้าซ้ำซ้อน สีเป็นสีเหลือง
            } else if (dupRoom.includes(course.room)) {
                return "orange"; // ถ้าซ้ำซ้อนกับห้อง สีเป็นสีส้ม
            } else if (dupSec.includes(course.sec)) {
                return "blue"; // ถ้าซ้ำซ้อนกับหมู่เรียน สีเป็นสีน้ำเงิน
            } else {
                return "base"; // ถ้าไม่ซ้ำซ้อนหรือข้อขัดแย้ง สีเป็นสีเริ่มต้น
            }
        } else {
            return ""; // สีว่างสำหรับวิชาที่ไม่มีอยู่
        }
    };


    useEffect(() => {
        var error_list = []
        let error = "";
        for (let i = 0; i < pairDupCourse.length; i++) {
            const course1 = pairDupCourse[i][0];
            const course2 = pairDupCourse[i][1];
            if (searchedCourse != 0) {
                if (course1.teacher === searchedCourse[0].teacher || course2.teacher === searchedCourse[0].teacher) {
                    if (course1 && course2) {
                        error = `เวลาวิชา ${course1.code} ${course1.name} (อาจารย์ ${course1.teacher}) ชนกับ ${course2.code} ${course2.name} (อาจารย์ ${course2.teacher})`;
                    }
                    error_list.push(error)
                }
            }
        }

        for (let i = 0; i < pairDupType.length; i++) {
            const course1 = pairDupType[i][0];
            const course2 = pairDupType[i][1];
            if (searchedCourse != 0) {
                if (course1.teacher === searchedCourse[0].teacher || course2.teacher === searchedCourse[0].teacher) {
                    if (course1 && course2) {
                        error = `ประเภทวิชา ${course1.code} ${course1.name} (อาจารย์ ${course1.teacher}) ชนกับ ${course2.code} ${course2.name} (อาจารย์ ${course2.teacher})`;
                    }
                    error_list.push(error)
                }
            }
        }

        for (let i = 0; i < pairDupRoom.length; i++) {
            const course1 = pairDupRoom[i][0];
            const course2 = pairDupRoom[i][1];
            if (searchedCourse != 0) {
                if (course1.teacher === searchedCourse[0].teacher || course2.teacher === searchedCourse[0].teacher) {
                    if (course1 && course2) {
                        error = `ห้องวิชา ${course1.code} ${course1.name} (อาจารย์ ${course1.teacher}) ชนกับ ${course2.code} ${course2.name} (อาจารย์ ${course2.teacher})`;
                    }
                    error_list.push(error)
                }
            }
        }

        for (let i = 0; i < pairDupSec.length; i++) {
            const course1 = pairDupSec[i][0];
            const course2 = pairDupSec[i][1];
            if (searchedCourse != 0) {
                if (course1.teacher === searchedCourse[0].teacher || course2.teacher === searchedCourse[0].teacher) {
                    if (course1 && course2) {
                        error = `เซควิชา ${course1.code} ${course1.name} (อาจารย์ ${course1.teacher}) ชนกับ ${course2.code} ${course2.name} (อาจารย์ ${course2.teacher})`;
                    }
                    error_list.push(error)
                }
            }
        }
        setValidationError(error_list);
    }, [duplicateCourse, dupType, dupRoom, dupSec]); //1.ทำ forloop 2.เอา else ออก ให้เหลือ if 3.เเก้ฟังก์ชันให้หมดควรโชว์ทั้งหมดไม่ใช่โชว์เเค่2ตัวเช่นเวลาชน sec ชนต้องโชว์ทั้งหมด



    /* global html2canvas */
    const saveAsPNG = () => {
        html2canvas(tableRef.current).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'schedule_table.png');
            });
        });
    };

    const deleteCourse = async (courseId) => {
        console.log("Deleting course with ID:", courseId);
        setCourseToDelete(courseId);
        setShowConfirmationModal(true);
    };

    const handleConfirmEdit = async () => {
        try {
            const docRef = doc(db, 'checkSerch', 'ibxgkBDV1OdKSnAC44Y7');
            await updateDoc(docRef, {
                check: 1
            });
            console.log('Data updated successfully.');
        } catch (error) {
            console.error('Error updating data: ', error);
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteDoc(doc(db, 'ChooseSubject', courseToDelete));
            setCourses(prevCourses => prevCourses.filter(course => course.id !== courseToDelete));
            setShowConfirmationModal(false);
            setCourseToDelete(null);
            // Refresh the page
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error deleting course: ', error);
        }

        try {
            const docRef = doc(db, 'checkSerch', 'ibxgkBDV1OdKSnAC44Y7');
            await updateDoc(docRef, {
                check: 1
            });
            console.log('Data updated successfully.');
        } catch (error) {
            console.error('Error updating data: ', error);
        }
    };

    const handleConfirmationModalClose = () => {
        setShowConfirmationModal(false);
        setCourseToDelete(null);
    };

    return (
        <div>
            <Navbar />
            <div className='container'>
                <div className="schedule-table-container mt-5" >
                <div className='d-flex justify-content-between'>
                    <h2>ตารางสอน</h2><Guide/>
                </div>
                    <div className='d-flex justify-content-between'>
                        <Dropdown queryCourses={queryCourses} />
                        <div className='d-flex justify-content-end mb-3'>
                            <ShowChoose />
                        </div>
                    </div>

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
                </div>
                {validationError && validationError.map((error, index) => (
                    <Alert key={index} variant="danger" className="mt-3">
                        {error}
                    </Alert>
                ))}
                <div className="course-detail-table mt-3">
                    <div className='d-flex'>
                        <h2 className="mb-3 mt-3">รายละเอียดรายวิชา</h2>
                            <button className="btn1 m-3" onClick={saveAsPNG}>บันทึกเป็นรูปภาพ</button>
                    </div>
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
                                    <th scope="col">
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <EditCourseInTable
                                                item_id={course.course_id}
                                                queryCourses={queryCourses}
                                            />
                                            <button className='btn1' onClick={() => {
                                                deleteCourse(course.course_id);
                                            }} style={{ marginRight: '5px' }}> {/* Adjust marginRight to control space */}
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Confirmation Dialog Modal */}
            <Modal
                show={showConfirmationModal}
                onHide={handleConfirmationModalClose}
                size="x"
                centered
            >
                <Modal.Body
                    closeButton
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        maxHeight: 'calc(100vh - 210px)',
                        overflowY: 'auto',
                        overflowX: 'auto',
                        padding: '10%',
                    }}
                >
                    <i className="ti ti-alert-circle mb-2" style={{ fontSize: "7em", color: "#6E2A26" }}></i>
                    <h5>ต้องการยืนยันใช่หรือไม่?</h5>
                    <div className="form-group mt-2" style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="success" className="btn1" onClick={handleConfirmDelete}>
                            ยืนยัน
                        </Button>
                        <Button variant="danger" className="btn-cancel" style={{ marginLeft: "20%" }} onClick={handleConfirmationModalClose}>
                            ยกเลิก
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ScheduleTable;