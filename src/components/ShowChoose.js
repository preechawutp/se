import React, { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { db } from '../firebase';

const ShowChoose = () => {
    const [showModal, setShowModal] = useState(false);
    const [allCourse, setAllCourse] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'ChooseSubject'), (querySnapshot) => {
            const coursesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            coursesData.sort((a, b) => a.teacher.localeCompare(b.teacher));
            setAllCourse(coursesData);
            setFilteredCourses(coursesData);
        });

        return () => unsubscribe();
    }, []);

    const fetchAllCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'ChooseSubject'));
            const coursesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            coursesData.sort((a, b) => a.teacher.localeCompare(b.teacher));
            setAllCourse(coursesData);
            setFilteredCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses: ', error);
        }
    };


    const groupByTeacherAndYearsTerm = (courses) => {
        const groupedCourses = {};
        courses.forEach(course => {
            const key = `${course.teacher}_${course.years}_${course.term}`;
            if (!groupedCourses[key]) {
                groupedCourses[key] = [];
            }
            groupedCourses[key].push(course);
        });
        return groupedCourses;
    };

    useEffect(() => {
        fetchAllCourses();
    }, []);

    useEffect(() => {
        const filtered = allCourse.filter(course => course.teacher.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredCourses(filtered);
    }, [searchTerm, allCourse]);



    return (
        <div>
            <Button className='btn1 mt-3' onClick={() => setShowModal(true)}>รายวิชาทั้งหมดที่ถูกจัด</Button>
            <div>
                <Modal size="xl"
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    centered
                >
                    <Modal.Body
                        style={{
                            overflowY: "auto",
                            padding: '3%'
                        }}>
                        <div className="mb-3">
                            <h3>รายวิชาทั้งหมดที่ถูกจัด</h3>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ค้นหาตามชื่ออาจารย์"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {Object.entries(groupByTeacherAndYearsTerm(filteredCourses)).map(([groupKey, courses]) => {
                            const [teacher, years, term] = groupKey.split('_');
                            return (
                                <div key={groupKey}>
                                    <div className='d-flex'>
                                        <h5>{teacher}</h5><p>-ปีการศึกษา {years} ภาค{term}</p>
                                    </div>
                                    <table className="table text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>วิชา</th>

                                                <th>ประเภท</th>
                                                <th>เวลา</th>
                                                <th>จำนวนที่เปิดรับ</th>
                                                <th>ห้อง</th>
                                                <th>หมู่เรียน</th>
                                                <th>ประเภทวิชา</th>
                                                <th>หน่วยกิต</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map(course => (
                                                <tr key={course.id}>
                                                    <td>{course.code}-{course.name}</td>
                                                    <td>{course.type}</td>
                                                    <td>{course.day} {course.TimeStart} - {course.TimeStop}</td>
                                                    <td>{course.student}</td>
                                                    <td>{course.room}</td>
                                                    <td>{course.sec}</td>
                                                    <td>{course.subjecttype}</td>
                                                    <td>{course.credit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ShowChoose;
