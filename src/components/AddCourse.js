import React, { useState } from "react";
import "../assets/AddCourse.css";
import { Button, Modal, Alert } from "react-bootstrap"; // Import Alert from react-bootstrap

const AddCourse = ({ handleChange, handleAddData, form }) => {
  const [show, setShow] = useState(false);
  const [validationError, setValidationError] = useState(null);

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
              <div className="form-group mt-2 ">
                <label htmlFor="code">รหัสวิชา</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  type="number"
                  name="code"
                  value={form.code || ""}
                />
              </div>

              <div className="form-group mt-2">
                <label htmlFor="grade">หลักสูตร</label>
                <input
                  className="form-control "
                  onChange={(e) => handleChange(e)}
                  type="number"
                  name="grade"
                  value={form.grade || ""}
                />
              </div>

              <div className="form-group mt-2">
                <label htmlFor="name">ชื่อวิชา</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(e)}
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
                required/>

                <label htmlFor="type">ประเภท</label>
                <select
                  className="form-select"
                  onChange={(e) => handleChange(e)}
                  name="type"
                  value={form.type || ""}
                  style={{ width: '30%' }}
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
    </div>
  );
};

export default AddCourse;