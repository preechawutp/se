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

const Main = () => {
  const [form, setForm] = useState({});
  const [courseForm, setCourseForm] = useState({});
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  const roitaiRef = collection(db, 'course');
  const selectedCourseRef = collection(db, 'selected_course');

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
    const isSelected = await checkCourseSelected(id);
    if (!isSelected) {
      const selectedItem = data.find((item) => item.id === id);
      const { id: itemId, ...newItem } = selectedItem;
      if (!newItem) return;
      let object = {};
      for (let [key, value] of Object.entries(courseForm)) {
        object[key] = value;
      }
      // เพิ่ม refId เข้าไปใน object
      object.refId = id;
      object.code = newItem.code;
      object.credit = newItem.credit;
      object.grade = newItem.grade;
      object.name = newItem.name;
      object.type = newItem.type;
      // object ที่ได้จะมีค่าจาก form และ refId
      const courseItem = object;
      const docRef = await addDoc(selectedCourseRef, courseItem);
    } else {
      console.log('Course already selected');
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

  return (
    <div>
      <Navbar />
      <div className="container-sm mt-5">
        <h2>รายวิชา</h2>
        <div className="form-group d-flex justify-content-between align-items-center" style={{ width: '100%' }}>
          <div className="input-group mb-3 mt-3" style={{ width: '60%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex" style={{ width: '40%', justifyContent: 'flex-end' }}>
            <AddCourse handleChange={handleChange} handleAddData={handleAddData} form={form} />
            <AddTeacher />
            <Upload handleChange={handleChange} />
            <Course data={selectedCourses} handleDeleteSelectedCourse={handleDeleteSelectedCourse}/>
          </div>
        </div>
        <DataTable
          data={data.filter((item) =>
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
          setEditId={setEditId}
          setForm={setForm}
          handleAddData={handleAddData}
        />
      </div>
    </div>
  );
};

export default Main;
