import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

const AddRoom = () => {
  const roomRef = collection(db, "room"); // Update Firestore collection reference
  const [form, setForm] = useState({ roomid: "" }); // Update form state
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
    const unsubscribe = onSnapshot(roomRef, (snapshot) => { // Update snapshot reference
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Assuming you want to set data for rooms, update accordingly
      setData(newData);
    });
    return () => {
      unsubscribe();
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validation for Thai and English letters

    setForm({
      ...form,
      [name]: value,
    });

  };

  const handleAddData = async () => {
    if (!form.roomid) {
      setValidationError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
  
    // Check if the room ID already exists in the database
    const existingRoom = data.find((room) => room.roomid === form.roomid);
  
    if (existingRoom) {
      setValidationError("มีหมายเลขห้องนี้อยู่ในระบบแล้ว");
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
    await addDoc(roomRef, form)
      .then(() => {
        setForm({ roomid: "" });
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
    setForm({ roomid: "" });
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
          เพิ่มห้อง
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
            <h1>เพิ่มห้อง</h1>
            <div className="form-group">
              <label htmlFor="roomid">เลขห้อง</label> {/* Updated label */}
              <input
                className={`form-control ${errors.roomid ? "is-invalid" : ""}`}
                onChange={(e) => handleChange(e)}
                type="text"
                name="roomid"
                placeholder="Ex. 17305"
                value={form.roomid}
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

export default AddRoom;
