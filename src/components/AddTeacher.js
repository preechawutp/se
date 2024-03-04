import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

const AddTeacher = () => {
  const roitaiRefT = collection(db, "teacher");
  const [form, setForm] = useState({ firstname: "", lastname: "" });
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Validation for Thai and English letters
    const thaiAndEnglishRegex = /^[A-Za-zก-๙]+$/;
    const isValidInput = thaiAndEnglishRegex.test(value);
  
    setForm({
      ...form,
      [name]: value,
    });
  
    setErrors({
      ...errors,
      [name]: isValidInput ? "" : "กรุณากรอกเฉพาะตัวอักษรไทยหรืออังกฤษ",
    });
  };
  

  const handleAddData = async () => {
    // Check for empty fields
    const emptyFields = Object.keys(form).filter((key) => !form[key]);
  
    if (emptyFields.length > 0) {
      // Display warning for empty fields
      const emptyFieldErrors = emptyFields.reduce((acc, field) => {
        acc[field] = "กรุณากรอกข้อมูล";
        return acc;
      }, {});
  
      setErrors({ ...errors, ...emptyFieldErrors });
      return;
    }
  
    // Check if there are any validation errors
    const validationErrors = Object.values(errors).filter((error) => error);
  
    if (validationErrors.length > 0) {
      // Display warning for validation errors
      return;
    }
  
    // Add data if no errors
    await addDoc(roitaiRefT, form)
      .then(() => {
        // Clear form and errors after successful addition
        setForm({ firstname: "", lastname: "" });
        setErrors({});
        handleClose();
      })
      .catch((err) => console.log(err));
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setForm({ firstname: "", lastname: "" });
    setErrors({});
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <div className="form-group p-3  ">
        <Button className="btn1" onClick={handleShow}>
          เพิ่มอาจารย์
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered={true}
          scrollable={true}
          size="s"
        >
          <Modal.Body
            closeButton
            style={{
              maxHeight: "calc(100vh - 210px)",
              overflowY: "auto",
              overflowX: "auto",
              padding: "50px", // เพิ่ม padding เพื่อเพิ่มช่องว่างระหว่างขอบ
            }}
          >
            <h1>เพิ่มอาจารย์</h1>
            <form className="row">
              <div className="form-group">
                <label htmlFor="firstname">ชื่อจริง</label>
                <input
                  className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange(e)}
                  type="text"
                  name="firstname"
                  value={form.firstname}
                />
                {errors.firstname && (
                  <div className="invalid-feedback">{errors.firstname}</div>
                )}
              </div>

              <div className="form-group mt-3">
                <label htmlFor="lastname">นามสกุล</label>
                <input
                  className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange(e)}
                  type="text"
                  name="lastname"
                  value={form.lastname}
                />
                {errors.lastname && (
                  <div className="invalid-feedback">{errors.lastname}</div>
                )}
              </div>
              <div className="form-group mt-3 d-flex justify-content-end">
              <button
                className="btn1 mt-2 d-flex justify-content-end"
                onClick={handleAddData}
                disabled={Object.keys(errors).some((key) => errors[key])} // Disable if there are errors
              >
                บันทึก
              </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default AddTeacher;
