import React, { useState, useEffect } from "react";
// import "../assets/AddTeacher.css";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const AddTeacher = () => {
  const roitaiRefT = collection(db, "teacher");
    // State variables for form data, existing data, editId, and search term
    const [form, setForm] = useState({});
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    };
  }, []);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(roitaiRefT, (snapshot) => {
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
    await addDoc(roitaiRefT, form)
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
    const docRef = doc(db, "teacher", editId);
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

  const [isPopup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!isPopup);
  };

  return (
    <div className="form-group">
      <div className="form-inline">
        <button className="btn1" onClick={togglePopup}>
          เพิ่มอาจารย์
        </button>

        {isPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="close"><button className="btn-close" onClick={togglePopup}></button></div>
              
              <h1>เพิ่มอาจารย์</h1>
              <form className="row">
              <div className="form-group">
                <label htmlFor="firstname">ชื่อจริง:</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  type="text"
                  name="firstname"
                //   value={form.code || ""}
                  placeholder="First Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastname">นามสกุล :</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  type="text"
                  name="lastname"
                //   value={form.grade || ""}
                  placeholder="Last Name"
                />
              </div>

              <div className="form-group mt-2 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn1"
                    id="submit"
                    onClick={() => {
                      handleAddData();
                      togglePopup(); // Close the popup after clicking "บันทึก"
                    }}
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTeacher;