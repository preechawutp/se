// AddCourse.js

import React, { useState } from "react";
import "../assets/AddCourse.css";
import { Button, Modal, Alert } from "react-bootstrap";

const AddCourse = ({ handleChange, handleAddData, form }) => {
  const [show, setShow] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleClose = () => {
    setShow(false);
    setValidationError(null);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleSave = () => {
    if (!form.code || !form.grade || !form.name || !form.credit || !form.type) {
      setValidationError("กรุณากรอกข้อมูลให้ครบ");
      setTimeout(() => {
        setValidationError(null);
      }, 2000);
      return;
    }
    setValidationError(null);
    setShowConfirmationModal(true);
    handleClose();
  };

  const handleConfirmAddData = () => {
    setShowConfirmationModal(false);
    handleAddData();
    handleClose();
  };

  const handleConfirmationModalClose = () => setShowConfirmationModal(false);

  return (
    <div className="form-group p-3">
      <Button className="btn1" onClick={handleShow}>
        เพิ่มรายวิชา
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
          style={{
            overflowY: "auto",
            overflowX: "auto",
            padding: "6%",
          }}
        >
          <h1>เพิ่มรายวิชา</h1>
          <form>
            <div className="form-group mt-2">
              <label htmlFor="code">รหัสวิชา</label>
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="number"
                name="code"
                value={form.code || ""}
                min="0"
              />
            </div>

            <div className="form-group mt-2">
              <label htmlFor="grade">หลักสูตร</label>
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="number"
                name="grade"
                value={form.grade || ""}
                min="0"
              />
            </div>

            <div className="form-group mt-2">
              <label htmlFor="name">ชื่อวิชา</label>
              <input
                className="form-control"
                onChange={(e) => {
                  // Use a regular expression to allow only Thai and English characters
                  const validInput = /^[a-zA-Zก-๙\s]*$/;
                  if (validInput.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
                type="text"
                name="name"
                value={form.name || ""}
              />
            </div>

            <div className="form-group mt-3 d-flex justify-content-between align-items-center">
              <label htmlFor="credit">หน่วยกิต</label>
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="number"
                name="credit"
                value={form.credit || ""}
                style={{ width: '30%' }}
                required
                min="0"
              />

              <label htmlFor="type">ประเภท</label>
              <select
                className="form-select"
                onChange={(e) => handleChange(e)}
                name="type"
                value={form.type || ""}
                style={{ width: '38%' }}
              >
                <option value="" disabled selected>- กรุณาเลือก -</option>
                <option value="บรรยาย">บรรยาย</option>
                <option value="ปฎิบัติ">ปฎิบัติ</option>
              </select>
            </div>

            {/* Display validation error if exists */}
            {validationError && (
              <Alert variant="danger" className="mt-3">
                {validationError}
              </Alert>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn1"
            id="submit"
            onClick={handleSave}
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
        <Modal.Body
          closeButton
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: 'calc(100vh - 210px)',
            overflowY: 'auto',
            overflowX: 'auto',
            padding: '10%',
          }}
        >
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
  );
};

export default AddCourse;
