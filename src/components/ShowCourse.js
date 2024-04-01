import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import "../assets/showCouse.css";
import { db, copySelectedCourseToNewFirestore } from '../firebase';
import FetchYearCourse from './FetchYearCourse';
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ShowCourse = () => {
    const [year, setYear] = useState([]);
    const [totalCredits, setTotalCredits] = useState({});
    const [totalSubject, setTotalSubjects] = useState(0);
    const [loading, setLoading] = useState(true);
    const [lastUpdateTime, setLastUpdateTime] = useState(null); // เพิ่ม state เก็บวัน/เวลาที่อัพเดทล่าสุด

    const uniqueGrades = useMemo(() => [...new Set(year.map(item => item.grade))], [year]);

    useEffect(() => {
        const getYear = async () => {
            const yearData = await FetchYearCourse();
            setYear(yearData);
        };
        getYear();
    }, []);

    useEffect(() => {
        const fetchTotalCredits = async () => {
            const credits = {};
            for (const grade of uniqueGrades) {
                const totalCredit = await getTotalCredit(grade);
                credits[grade] = totalCredit;
            }
            setTotalCredits(credits);
            setLoading(false);
        };
        fetchTotalCredits();
    }, [year, uniqueGrades]);

    useEffect(() => {
        // กำหนดเงื่อนไขเพื่อเรียกใช้ getTotalSubject สำหรับทุกเกรดที่มีอยู่ใน uniqueGrades
        uniqueGrades.forEach(async (grade) => {
            try {
                const total = await getTotalSubject(grade);
                setTotalSubjects(prevState => ({ ...prevState, [grade]: total })); // ใช้ prevState เพื่ออัปเดตค่า totalSubjects
            } catch (error) {
                console.error("Error getting total subjects:", error);
            }
        });
    }, [uniqueGrades]);

    useEffect(() => {
        const fetchLastUpdateTime = async () => {
            const lastUpdate = await getLastUpdateTime(); // Assume this function gets the last update time from Firebase Firestore
            setLastUpdateTime(lastUpdate);
        };
        fetchLastUpdateTime();
    }, []);

    const getTotalCredit = async (grade) => {
        const querySnapshot = await getDocs(collection(db, `course_${grade}`));
        let totalCredit = 0;
        querySnapshot.forEach((doc) => {
            const credit = parseInt(doc.data().credit);
            totalCredit += credit;
        });
        return totalCredit;
    };

    const getTotalSubject = async (grade) => {
        const querySnapshot = await getDocs(collection(db, `course_${grade}`));
        let totalSubject = 0;
        querySnapshot.forEach((doc) => {
            totalSubject++; // เพิ่มจำนวนวิชาทีละหนึ่งเมื่อวนลูปผ่านไป
        });
        return totalSubject;
    };

    const handleDownload = async (grade) => {
        const querySnapshot = await getDocs(collection(db, `course_${grade}`));
        const data = [];
        querySnapshot.forEach((doc) => {
            const { code, grade, credit, name, nameTH, type } = doc.data();
            // เปลี่ยนการเรียงลำดับของข้อมูลตามที่ต้องการ
            data.push({ "รหัสวิชา": code, "หลักสูตร": grade, "หน่วยกิต": credit, "ชื่อ ภาษาไทย": nameTH, "ชื่อ ภาษาอังกฤษ": name, "หมู่เรียน": type });
        });
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `course_${grade}`);
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `course_${grade}.xlsx`);
    };


    useEffect(() => {
        const fetchLastUpdateTime = async () => {
            const lastUpdateRef = doc(db, 'timestamp', 'xHT6YRaTiOlpbFCQhKj4'); // Replace 'your_document_id' with the actual document ID
            const unsubscribe = onSnapshot(lastUpdateRef, (doc) => {
                if (doc.exists()) {
                    setLastUpdateTime(doc.data().lastUpdate);
                }
            });

            return () => unsubscribe();
        };
        fetchLastUpdateTime();
    }, []);

    const getLastUpdateTime = async () => {
        const docSnap = await getDoc(doc(db, 'timestamp', 'xHT6YRaTiOlpbFCQhKj4')); // Replace 'your_document_id' with the actual document ID
        return docSnap.data().lastUpdate;
    };

    if (loading) {
        return <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="loader"></div>
        </div>;
    }

    return (
        <div className="showcourse">
            <Navbar />
            <div className="container-sm mt-5">
                <h1 className="hh1">หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์</h1>
                <h2 className="hh2">ภาษาไทย : หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์</h2>
                <h2 className="hh2">ภาษาอังกฤษ : Bachelor of Engineering Program in Computer Engineering</h2>

                <div className="form-group mt-2 d-flex justify-content-between ">
                    {lastUpdateTime && (
                        <p className="mt-3 mb-2">อัพเดทล่าสุดเมื่อ: {lastUpdateTime.toDate().toLocaleString()}</p>
                    )}
                    <button
                        type="button"
                        className="btn1 mt-3 mb-2"
                        id="submit"
                        onClick={async () => {
                            setLoading(true);
                            await copySelectedCourseToNewFirestore();
                            setLoading(false);
                        }}
                    >
                        อัพเดทหลักสูตร
                    </button>
                </div>

                <table className="table table-hover mt-4">
                    <thead>
                        <tr>
                            <th scope="col">สาขาวิชา</th>
                            <th scope="col">ปีที่ปรับปรุง</th>
                            <th scope="col">หน่วยกิตรวม</th>
                            <th scope="col">จำนวนวิชา</th>
                            <th scope="col">ปีที่ศึกษา</th>
                            <th scope="col">รหัสนิสิต</th>
                            <th scope="col">ดาวน์โหลดไฟล์หลักสูตร</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueGrades.map((grade, index) => (
                            <tr key={index}>
                                <th scope="col">วิศวกรรมศาสตรบัณฑิต(วิศวกรรมคอมพิวเตอร์)</th>
                                <th scope="col">25{grade}</th>
                                <th scope="col">{totalCredits[grade]}</th>
                                <th scope="col">{totalSubject[grade]}</th>
                                <th scope="col">4</th>
                                <th scope="col">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>
                                            {parseInt(grade, 10) + i}*
                                            {i < 4 && <>,</>}
                                        </span>
                                    ))}
                                </th>
                                <th scope="col">
                                    <button
                                        onClick={() => handleDownload(grade)}
                                        className="link-primary"
                                        style={{ border: "none", background: "none", cursor: "pointer" }}
                                    >
                                        Download
                                    </button>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ShowCourse;
