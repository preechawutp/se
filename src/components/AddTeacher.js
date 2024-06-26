// AddTeacher.js

import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
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
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDataEntryModal, setShowDataEntryModal] = useState(false);
  const [validationError, setValidationError] = useState(null);


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
    if (!form.firstname || !form.lastname) {
      setValidationError("กรุณากรอกข้อมูลให้ครบ");
      setTimeout(() => {
        setValidationError(null);
      }, 5000);
      return;
    }
    // Check if the teacher already exists in the database
    const existingTeacher = data.find(
      (teacher) =>
        teacher.firstname.toLowerCase() === form.firstname.toLowerCase() &&
        teacher.lastname.toLowerCase() === form.lastname.toLowerCase()
    );

    if (existingTeacher) {
      setValidationError("มีรายชื่ออาจารย์ท่านนี้อยู่ในระบบแล้ว");
      setTimeout(() => {
        setValidationError(null);
      }, 5000);
      return;
    }

    setValidationError(null);
    setShowConfirmationModal(true);
    setShowDataEntryModal(false);
  };
  const handleConfirmAddData = async () => {
    await addDoc(roitaiRefT, form)
      .then(() => {
        setForm({ firstname: "", lastname: "" });
        setErrors({});
        setShowConfirmationModal(false);
        handleClose();
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    if (showDataEntryModal) {
      setShowDataEntryModal(false);
    } else {
      setShow(false);
    }
    setForm({ firstname: "", lastname: "" });
    setErrors({});
    setValidationError(null);
  };


  const handleShow = () => {
    setShow(true);
    setShowDataEntryModal(true);
  };


  const handleConfirmationModalClose = () => setShowConfirmationModal(false);

  return (
    <>
      <div className="form-group p-3">
        <Button className="btn1" onClick={handleShow}>
          เพิ่มอาจารย์
        </Button>

        <Modal
          show={showDataEntryModal}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered={true}
          scrollable={true}
          size="s"
        >
          <Modal.Body
            closeButton
            style={{
              overflowY: "auto",
              overflowX: "auto",
              padding: "6%",
            }}
          >
            <h1>เพิ่มอาจารย์</h1>
            <div className="form-group">
              <label htmlFor="firstname">ชื่อจริง</label>
              <input
                className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
                onChange={(e) => handleChange(e)}
                type="text"
                name="firstname"
                placeholder="Ex. กาญจนา"
                value={form.firstname}
              />


            </div>

            <div className="form-group mt-3">
              <label htmlFor="lastname">นามสกุล</label>
              <input
                className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
                onChange={(e) => handleChange(e)}
                type="text"
                name="lastname"
                placeholder="Ex. เอี่ยมสอาด"
                value={form.lastname}
              />

            </div>
            {validationError && (
              <Alert variant="danger" className="mt-3">
                {validationError}
              </Alert>
            )}

          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn1"
              onClick={handleAddData}
              type="button"
              disabled={Object.keys(errors).some((key) => errors[key])} // Disable if there are errors
            >
              บันทึก
            </button>
            <Button variant="secondary" onClick={handleClose}>
              ยกเลิก
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirmation Dialog Modal */}
        <Modal
          show={showConfirmationModal}
          onHide={handleConfirmationModalClose}
          size="x"
          centered
        >
          <Modal.Body closeButton style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: 'calc(100vh - 210px)',
            overflowY: 'auto',
            overflowX: 'auto',
            padding: '10%',
          }}>
            <i className="ti ti-alert-circle mb-2" style={{ fontSize: "7em", color: "#6E2A26" }}></i>
            <h5>ต้องการยืนยันใช่หรือไม่?</h5>
            <div className="form-group mt-2" style={{ display: "flex", justifyContent: "center" }}>
              <Button variant="success" className="btn1" onClick={handleConfirmAddData}>
                ยืนยัน
              </Button>
              <Button variant="danger" className="btn-cancel" style={{ marginLeft: "20%" }} onClick={handleConfirmationModalClose}>
                ยกเลิก
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default AddTeacher;
