import React, { useState } from "react";
import "../assets/AddCourse.css";
import { Button, Modal, Alert } from "react-bootstrap";
import Select from 'react-select';

const options = [
  { value: '- กรุณาเลือก -', label: '- กรุณาเลือก -', isDisabled: true },
  { value: 'บรรยาย', label: 'บรรยาย' },
  { value: 'ปฎิบัติ', label: 'ปฎิบัติ' }
];

const AddCourse = ({ handleChange, handleAddData, form }) => {
  const [show, setShow] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [courseCode, setCourseCode] = useState("");
  const [courseGrade, setCourseGrade] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCredit, setCourseCredit] = useState("");
  const [courseType, setCourseType] = useState("");

  const selectedOption = options.find(option => option.value === form.type);

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

  const customStyles2 = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: (provided, state) => ({
      ...provided,
      width: 170, // กำหนดความกว้างเป็น 200px หรือตามที่คุณต้องการ
    }),
    menu: (provided, state) => ({
      ...provided,
      width: 170, // ความกว้างของเมนูตรงกับ control
      minHeight: 'auto', // กำหนดความสูงขั้นต่ำสำหรับเมนู
      maxHeight: '400px', // กำหนดความสูงสูงสุด สำหรับการเลื่อนภายในเมนู
    }),
  };

  const handleCreditChange = (e) => {
    // ตรวจสอบว่าค่าที่ป้อนไม่เกิน 6
    if (parseInt(e.target.value) <= 6) {
      handleChange(e);
      setCourseCredit(e.target.value);
    } else {
      // แสดงข้อความแจ้งเตือนถ้าเกินค่าสูงสุด
      alert('ค่าหน่วยกิตต้องไม่เกิน 6');
    }
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
                onChange={(e) => {
                  handleChange(e); // เรียกใช้ handleChange เพื่ออัปเดต form
                  setCourseCode(e.target.value); // เรียกใช้ setCourseCode เพื่ออัปเดต courseCode
                }}
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
                onChange={(e) => {
                  handleChange(e); // เรียกใช้ handleChange เพื่ออัปเดต form
                  setCourseGrade(e.target.value); // เรียกใช้ setCourseCode เพื่ออัปเดต courseCode
                }}
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
                    setCourseName(e.target.value);
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
                onChange={handleCreditChange}
                type="number"
                name="credit"
                value={form.credit || ""}
                style={{ width: '30%' }}
                required
                min="0"
                max="6" // กำหนดค่าสูงสุดเป็น 6
              />

              <label htmlFor="type">ประเภท</label>
              <Select
                options={options}
                onChange={(selectedOption) => {
                  handleChange({ target: { name: 'type', value: selectedOption.value } }); // เรียกใช้ handleChange เพื่ออัปเดต form
                  setCourseType(selectedOption.value); // เรียกใช้ setCourseType เพื่ออัปเดต courseType
                }} 
                value={selectedOption}
                placeholder="- กรุณาเลือก -"
                isSearchable={true}
                styles={customStyles2}
                menuPortalTarget={document.body}
              />

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
          <div>
            รหัสวิชา: {courseCode}-{courseGrade}
          </div>
          <div>
            ชื่อวิชา: {courseName}
          </div>
          <div>
            ประเภท: {courseType}
          </div>
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