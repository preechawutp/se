// Main.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

import AddCourse from './AddCourse';
import Navbar from './Navbar';
import DataTable from './DataTable';
import AddTeacher from './AddTeacher';
import Upload from './Upload';
import Course from './Course';
import '../App.css';
import Footer from './Footer'


const Main = () => {
  const [form, setForm] = useState({});
  const [courseForm, setCourseForm] = useState({});
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [tableData, setTableData] = useState([]);

  const roitaiRef = collection(db, 'course');
  const selectedCourseRef = collection(db, 'selected_course');
  const allRelatedData = [...data, ...selectedCourses];

  useEffect(() => {
    const unsubscribe = onSnapshot(roitaiRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(selectedCourseRef, (snapshot) => {
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

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงในฟอร์ม
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCourseChange = (e) => {
    setCourseForm({
      ...courseForm,
      [e.target.name]: e.target.value,
    });
  };

  // ฟังก์ชันสำหรับเพิ่มข้อมูลใหม่
  const handleAddData = async () => {
    await addDoc(roitaiRef, form).catch((err) => console.log(err));
  };

  // ตรวจสอบว่าวิชาถูกเลือกแล้วหรือยัง
  const checkCourseSelected = async (courseId) => {
    const q = query(selectedCourseRef, where('refId', '==', courseId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // เพิ่มวิชาที่เลือก
  const handleAddCourse = async (id) => {
    const selectedItem = data.find((item) => item.id === id);
    if (!selectedItem) return; // หยุดการทำงานของฟังก์ชันหากไม่พบรายวิชา

    const { id: itemId, ...newItem } = selectedItem; // ละเว้น id ของรายวิชาจาก object ที่จะเพิ่ม
    if (!newItem) return; // หยุดการทำงานของฟังก์ชันหากไม่มีข้อมูลใหม่

    let object = {};
    for (let [key, value] of Object.entries(courseForm)) {
      object[key] = value; // คัดลอกข้อมูลจากฟอร์ม
    }

    // เพิ่มข้อมูลรายวิชาลงใน object
    object.refId = id;
    object.code = newItem.code;
    object.credit = newItem.credit;
    object.grade = newItem.grade;
    object.name = newItem.name;
    object.type = newItem.type;

      // ตรวจสอบค่า object.sec ก่อนที่จะใช้ใน query
    if (!object.sec) {
      console.log('Section is missing.'); // แสดงข้อความว่า Section หายไป
      return;
    }

    // ตรวจสอบว่ามีวิชาที่มี sec ซ้ำกันในฐานข้อมูลหรือไม่
    const q = query(selectedCourseRef, where('sec', '==', object.sec));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // ถ้าพบ sec ที่ซ้ำกันอยู่แล้วในฐานข้อมูล
      // ตรวจสอบชื่อของวิชาที่เหมือนกันด้วย
      let isSameCourseName = false;
      querySnapshot.forEach((doc) => {
        const existingCourse = doc.data();
        if (existingCourse.name === object.name) {
          isSameCourseName = true;
          // หยุดการทำงานของฟังก์ชันหากพบชื่อวิชาเหมือนกัน
          console.log('This course already exists with the same section and name.');
          return;
        }
      });
      // ถ้าชื่อวิชาไม่เหมือนกัน ให้เพิ่มวิชาเข้าไปในฐานข้อมูล
      if (!isSameCourseName) {
        const courseItem = object; // สร้าง object สำหรับเพิ่มลงในฐานข้อมูล
        const docRef = await addDoc(selectedCourseRef, courseItem); // เพิ่มลงในฐานข้อมูล
        console.log(`Course added with ID: ${docRef.id}`); // แสดงข้อความยืนยัน
      }
    } else {
      // ถ้าไม่พบ sec ที่ซ้ำกันในฐานข้อมูล ให้เพิ่มวิชาเข้าไปเลย
      const courseItem = object; // สร้าง object สำหรับเพิ่มลงในฐานข้อมูล
      const docRef = await addDoc(selectedCourseRef, courseItem); // เพิ่มลงในฐานข้อมูล
      console.log(`Course added with ID: ${docRef.id}`); // แสดงข้อความยืนยัน
    }
  };


  // แก้ไขข้อมูล
  const handleEdit = (id) => {
    setEditId(id);
    const selectedItem = data.find((item) => item.id === id);
    setForm(selectedItem);
  };

  // อัปเดตข้อมูล
  const handleUpdate = async () => {
    if (editId) {
      const docRef = doc(db, 'course', editId);
      await updateDoc(docRef, form).then(() => {
        setEditId(null);
        setForm({});
      }).catch((err) => console.log(err));
    }
  };

  // ลบข้อมูล
  const handleDelete = async (id) => {
    const docRef = doc(db, 'course', id);
    console.log(docRef)
    await deleteDoc(docRef).catch((err) => console.log(err));
  };


  const handleDeleteSelectedCourse = async (id) => {
    const courseRef = doc(db, 'selected_course', id);
    console.log("Delete")
    console.log(courseRef)
    await deleteDoc(courseRef).catch((err) => console.log(err));
  };

  // บันทึกการเปลี่ยนแปลงหลังจากแก้ไข
  const handleSave = () => {
    handleUpdate();
  };

  const handleAddToTable = (newItem) => {
    for (let i = 0; i < newItem.length; i++) {
      const itemId = newItem[i].id
      const courseRef = doc(db, 'selected_course', itemId)
      updateDoc(courseRef, { status: "active" })
    }
  }


  return (
    <div>
      <Navbar />
      <div className="container-sm mt-5">
        <h2>รายวิชา</h2>
        <div className="d-flex justify-content-between" style={{ width: '100%' }}>
          <div className="input-group mb-3 mt-3" style={{ width: '40%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex">
            <AddCourse handleChange={handleChange} handleAddData={handleAddData} form={form} />
            <AddTeacher />
            <Upload handleChange={handleChange} handleAddData={handleAddData} />
            <Course data={selectedCourses} handleDeleteSelectedCourse={handleDeleteSelectedCourse} handleAddToTable={handleAddToTable} />
          </div>
        </div>
        <DataTable
          data={allRelatedData.filter((item) =>
            Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
          )}
          editId={editId}
          form={form}
          courseForm={courseForm}
          handleCourseChange={handleCourseChange}
          handleChange={handleChange}
          handleSave={handleSave}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleAddCourse={handleAddCourse}
          handleAddData={handleAddData}
          handleAddToTable={handleAddToTable}
          setEditId={setEditId}
          setForm={setForm}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
//1150
