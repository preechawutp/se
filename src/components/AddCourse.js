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

  const handleShow = () => setShow(true);

  const handleSave = () => {
    // Perform validation
    if (!form.code || !form.grade || !form.name || !form.credit || !form.type) {
      setValidationError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    // Clear any previous validation error
    setValidationError(null);

    // Show confirmation modal before adding data
    setShowConfirmationModal(true);
  };

  const handleConfirmAddData = () => {
    // Close confirmation modal
    setShowConfirmationModal(false);

    // Call the handleAddData function if data is valid
    handleAddData();

    // Close the modal
    handleClose();
  };

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
          closeButton
          style={{
            overflowY: "auto",
            overflowX: "auto",
            padding: "10%",
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
                    // If the input is valid, update the state
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
                <option value="">- กรุณาเลือก -</option>
                <option value="บรรยาย">บรรยาย</option>
                <option value="ปฎิบัติ">ปฎิบัติ</option>
              </select>
            </div>

            <div className="form-group mt-3 d-flex justify-content-end">
              <button
                type="button"
                className="btn1"
                id="submit"
                onClick={handleSave}
              >
                บันทึก
              </button>
            </div>

            {/* Display validation error if exists */}
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
        onHide={() => setShowConfirmationModal(false)}
        centered
      >
        <Modal.Header>
          <Modal.Title>ยืนยันการเพิ่มรายวิชา</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>ต้องการเพิ่มรายวิชาใช่หรือไม่?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowConfirmationModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="success" onClick={handleConfirmAddData}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCourse;
