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
    // Check for empty fields
    // Perform validation
    if (!form.firstname || !form.lastname) {
      setValidationError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
  
    // Clear any previous validation error
    setValidationError(null);
  
    // Show confirmation modal before adding data
    setShowConfirmationModal(true);

    // Close data entry modal
    setShowDataEntryModal(false);
  };

  const handleConfirmAddData = async () => {
    // Add data if user confirms
    await addDoc(roitaiRefT, form)
      .then(() => {
        // Clear form and errors after successful addition
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
              maxHeight: "calc(100vh - 210px)",
              overflowY: "auto",
              overflowX: "auto",
              padding: "50px",
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

              </div>
              <div className="form-group mt-3 d-flex justify-content-end">
                <button
                  className="btn1 mt-2 d-flex justify-content-end"
                  onClick={handleAddData}
                  type="button"
                  disabled={Object.keys(errors).some((key) => errors[key])} // Disable if there are errors
                >
                  บันทึก
                </button>
              </div>

                {validationError && (
                <Alert variant="danger" className="mt-3">
                  {validationError}
                </Alert>
                )}
            </form>
          </Modal.Body>
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
              <Button variant="success" className="btn1"  onClick={handleConfirmAddData}>
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
