//Main.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import AddCourse from "./AddCourse";
import Navbar from "./Navbar";
import DataTable from "./DataTable";
import AddTeacher from "./AddTeacher";
import Upload from "./Upload";
import "../App.css"
import LoginForm from './LoginForm';
import AddCourseToTable from "./AddCourseToTable";
import Confirm from "./Confirm";



const Main = () => {

  // State variables for form data, existing data, editId, and search term
  const [form, setForm] = useState({});
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered data based on search term
  const filteredData = data.filter((item) => {
    const values = Object.values(item).join(" ").toLowerCase();
    return values.includes(searchTerm.toLowerCase());
  });

  // Firestore collection reference
  const ref = collection(db, "course");

  // useEffect for real-time data loading and cleanup
  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    };
  }, []);

  // Function to load real-time data from Firestore
  const loadRealtime = () => {
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(newData);
    });
    return () => {
      unsubscribe();
    };
  };
  

  // Event handler for input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Event handler for adding data to Firestore
  const handleAddData = async () => {
    await addDoc(ref, form)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  // Event handler for initiating edit mode
  const handleEdit = (id) => {
    setEditId(id);
    const selectedItem = data.find((item) => item.id === id);
    setForm(selectedItem);
  };

  // Event handler for updating data in Firestore
  const handleUpdate = async () => {
    const docRef = doc(db, "course", editId);
    await updateDoc(docRef, form)
      .then(() => {
        setEditId(null);
        setForm({});
      })
      .catch((err) => console.log(err));
  };

  // Event handler for deleting data from Firestore
  const handleDelete = async (id) => {
    const docRef = doc(db, "course", id);
    await deleteDoc(docRef).catch((err) => console.log(err));
  };

  const handleSave = () => {
    handleUpdate();
    setEditId(null);
    setForm({});
  };

  const [displayName, setDisplayName] = useState('');
  console.log(editId);
  return (
    
    <div>

      <Navbar/>
      <div className="container-sm mt-5">
        <h2>รายวิชา</h2>
        {/* <Confirm/> */}
        {/* <button className="btn1">Logout</button> */}
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
            <AddCourse handleChange={handleChange} handleAddData={handleAddData} form={form} className="ml-2" />
            <AddTeacher handleChange={handleChange} handleAddData={handleAddData} form={form} className="ml-2" />
            <Upload handleChange={handleChange} />
          </div>
        </div>
       
        <DataTable
          data={filteredData}
          editId={editId}
          form={form}
          handleChange={handleChange}
          handleSave={handleSave}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setEditId={setEditId}
          setForm={setForm}
        />

      </div>
    </div>
  );
};

export default Main;
