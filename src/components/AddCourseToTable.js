import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import "../assets/AddCourse.css";
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { Alert, Button, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';

const optionsDay = [
  { value: 'กรุณาเลือก', label: '- กรุณาเลือก -', isDisabled: true },
  { value: 'MON', label: 'MON' },
  { value: 'TUE', label: 'TUE' },
  { value: 'WED', label: 'WED' },
  { value: 'THU', label: 'THU' },
  { value: 'FRI', label: 'FRI' },
  { value: 'SAT', label: 'SAT' },
  { value: 'SUN', label: 'SUN' }
];

const optionsType = [
  { value: 'กรุณาเลือก', label: '- กรุณาเลือก -', isDisabled: true },
  { value: 'วิชาแกน', label: 'วิชาแกน' },
  { value: 'วิชาเฉพาะบังคับ', label: 'วิชาเฉพาะบังคับ' },
  { value: 'วิชาเฉพาะเลือก', label: 'วิชาเฉพาะเลือก' },
];

const optionsTerm = [
  { value: 'กรุณาเลือก', label: '- กรุณาเลือก -', isDisabled: true },
  { value: 'ฤดูร้อน', label: 'ฤดูร้อน' },
  { value: 'ต้น', label: 'ต้น' },
  { value: 'ปลาย', label: 'ปลาย' },
];

const optionsMajor = [
  { value: 'กรุณาเลือก', label: '- กรุณาเลือก -', isDisabled: true },
  { value: 'T12', label: 'T12' },
];

const AddCourseTotable = ({
  handleCourseChange,
  handleAddCourse,
  courseForm,
  item_id,
}) => {

  const teacherRef = collection(db, "teacher");
  const roomRef = collection(db, "room");
  const [rooms, setRooms] = useState([]);
  const [teachers, setTeacher] = useState([]);
  const [timeError, setTimeError] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const optionsRoom = [
    { value: 'กรุณาเลือก', label: '- กรุณาเลือก -', isDisabled: true },
    ...rooms.map((item) => ({
      value: item.roomid,
      label: item.roomid
    }))
  ];

  const optionsTeacher = [
    { value: 'กรุณาเลือก', label: '- กรุณาเลือก -', isDisabled: true },
    ...teachers.map((item) => ({
      value: item.firstname + ' ' + item.lastname,
      label: `${item.firstname} ${item.lastname}`
    }))
  ];
  
  useEffect(() => {
    const unsubscribe = onSnapshot(teacherRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeacher(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setValidationError(null);
  };

  const handleShow = () => setShow(true);
  const options = ["1", "2", "3", "4", "5+"];

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const [hour, minute] = value.split(':').map(Number);
    if ((hour < 7 || hour > 20) || (minute % 15 !== 0)) {
      setTimeError(true);
      setValidationError('เวลาต้องอยู่ระหว่าง 07:00 ถึง 20:00 และใส่นาทีได้แค่ 00, 15, 30, 45 เท่านั้น');
      setTimeout(() => {
        setValidationError(null);
      }, 5000);
      handleCourseChange({ target: { name, value: '' } });
    } else {
      setTimeError(false);
      setValidationError(null);
      handleCourseChange(e);
    }
  };

  const handleSave = () => {

    if (!courseForm.day || !courseForm.TimeStart || !courseForm.TimeStop || !courseForm.teacher || !courseForm.subjecttype || !courseForm.sec || !courseForm.room || !courseForm.student || !courseForm.major || !courseForm.years || !courseForm.term || !courseForm.grade_level) {
      setValidationError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setTimeout(() => {
        setValidationError(null);
      }, 5000);
      return;
    }

    if (
      courseForm.day === '-' ||
      courseForm.subjecttype === '-' ||
      courseForm.term === '-' ||
      courseForm.grade_level.length === 0
    ) {
      setValidationError('กรุณาเลือกข้อมูลให้ครบถ้วน');
      setTimeout(() => {
        setValidationError(null);
      }, 5000);
      return;
    }
    setValidationError(null);
    handleAddCourse(item_id);
    handleClose();
  };

  const customStyles1 = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: (provided, state) => ({
      ...provided,
      width: 150, // กำหนดความกว้างเป็น 200px หรือตามที่คุณต้องการ
    }),
    menu: (provided, state) => ({
      ...provided,
      width: 150, // ความกว้างของเมนูตรงกับ control
      minHeight: '100px', // กำหนดความสูงขั้นต่ำสำหรับเมนู
      maxHeight: '400px', // กำหนดความสูงสูงสุด สำหรับการเลื่อนภายในเมนู
    }),
  };

  const customStyles2 = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: (provided, state) => ({
      ...provided,
      width: 150, // กำหนดความกว้างเป็น 200px หรือตามที่คุณต้องการ
    }),
    menu: (provided, state) => ({
      ...provided,
      width: 200, // ความกว้างของเมนูตรงกับ control
      minHeight: '100px', // กำหนดความสูงขั้นต่ำสำหรับเมนู
      maxHeight: '400px', // กำหนดความสูงสูงสุด สำหรับการเลื่อนภายในเมนู
    }),
  };

  const selectedOption = options.find(option => option.value === courseForm.subjecttype);

  return (
    <div className="form-group">
      <Button className="btn1" onClick={handleShow}>
        + เลือก
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered={true}
        scrollable={true}
        size="md"
      >
        <Modal.Body
          closeButton
          style={{
            overflowY: "auto",
            overflowX: "auto",
            padding: "7%",
          }}
        >
          <h1>เพิ่มรายวิชาเข้าตาราง</h1>
          <div className="row">
            <div className="col-md-6 d-flex justify-content-center">
              <form>
                <div className="form-group mt-2">
                  <label htmlFor="day">วันที่ต้องการสอน</label>
                  <Select
                    options={optionsDay}
                    onChange={(selectedOption) => handleCourseChange({ target: { name: 'day', value: selectedOption.value } })}
                    placeholder="กรุณาเลือก"
                    isSearchable={true}
                    styles={customStyles1}
                    menuPortalTarget={document.body}
                  />
                </div>

                <div className="form-group mt-2">
                  <label htmlFor="TimeStart">เวลา</label>
                  <input
                    className={`form-control ${timeError ? 'is-invalid' : ''}`}
                    onChange={handleTimeChange}
                    type="time"
                    name="TimeStart"
                    style={{ width: "150px" }}
                  />

                  <label htmlFor="TimeStop">ถึง</label>
                  <input
                    className={`form-control ${timeError ? 'is-invalid' : ''}`}
                    onChange={handleTimeChange}
                    type="time"
                    name="TimeStop"
                    style={{ width: "150px" }}
                  />
                </div>
              </form>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <form>
                <div className="form-group mt-2">
                  <label htmlFor="teacher">อาจารย์</label>
                  <div className='d-flex justify-content-between'>
                    <Select
                      options={optionsTeacher}
                      onChange={(selectedOption) => handleCourseChange({ target: { name: 'teacher', value: selectedOption.value } })}
                      placeholder="กรุณาเลือก"
                      isSearchable={true}
                      styles={customStyles2}
                      menuPortalTarget={document.body}
                    />
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label >ประเภทวิชา</label>
                  <Select
                    options={optionsType}
                    onChange={(selectedOption) => handleCourseChange({ target: { name: 'subjecttype', value: selectedOption.value } })}
                    value={selectedOption}
                    placeholder="กรุณาเลือก"
                    isSearchable={true}
                    styles={customStyles1}
                    menuPortalTarget={document.body}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 d-flex justify-content-center">
              <form>
                <div className="form-group mt-2">
                  <label htmlFor="sec">หมู่เรียน</label>
                  <input
                    className="form-control"
                    onChange={(e) => handleCourseChange(e)}
                    type="number"
                    name="sec"
                    value={courseForm.sec || ""}
                    style={{ width: "150px" }} // Adjust the width as needed
                    min="0"
                  />
                </div>
                <div className="form-group mt-2">
                  <label htmlFor="room">ห้อง</label>
                  <Select
                    options={optionsRoom}
                    onChange={(selectedOption) => handleCourseChange({ target: { name: 'room', value: selectedOption.value } })}
                    placeholder="กรุณาเลือก"
                    isSearchable={true}
                    styles={customStyles1}
                    menuPortalTarget={document.body}
                  />
                  <div className="form-group mt-2">
                    <label htmlFor="student">จำนวนนิสิต</label>
                    <input
                      className="form-control"
                      onChange={(e) => handleCourseChange(e)}
                      type="number"
                      name="student"
                      style={{ width: "150px" }}
                      min="0"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <form>
                <div className="form-group mt-2">
                  <label htmlFor="major">สาขา</label>
                  <Select
                    options={optionsMajor}
                    onChange={(selectedOption) => handleCourseChange({ target: { name: 'major', value: selectedOption.value } })}
                    placeholder="กรุณาเลือก"
                    isSearchable={true}
                    styles={customStyles1}
                    menuPortalTarget={document.body}
                  />
                </div>

                <div className="form-group mt-2">
                  <label htmlFor="years">ปีการศึกษา</label>
                  <input
                    className="form-control"
                    onChange={(e) => handleCourseChange(e)}
                    type="number"
                    name="years"
                    style={{ width: "150px" }}
                    min="0"
                  />
                </div>
                <div className="form-group mt-2">
                  <label htmlFor="term">ภาคเรียน</label>
                  <Select
                    options={optionsTerm}
                    onChange={(selectedOption) => handleCourseChange({ target: { name: 'term', value: selectedOption.value } })}
                    placeholder="กรุณาเลือก"
                    isSearchable={true}
                    styles={customStyles1} 
                    menuPortalTarget={document.body}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <form>
                <div
                  className="form-group mt-2"
                  style={{ marginLeft: "12%" }}
                >
                  <label htmlFor="grade_level">ชั้นปี</label>
                  <div className="d-flex">
                    {options.map((option, index) => (
                      <div key={index} className="form-check" style={{ marginRight: '16px' }}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`option${index}`}
                          name="grade_level"
                          checked={courseForm.grade_level && courseForm.grade_level.includes(option)}
                          value={option}
                          onChange={(e) => {
                            const checkedOptions = e.target.checked
                              ? [...(courseForm.grade_level || []), option]
                              : (courseForm.grade_level || []).filter((grade) => grade !== option);
                            handleCourseChange({ target: { name: 'grade_level', value: checkedOptions } });
                          }}
                        />
                        <label htmlFor={`option${index}`} className="form-check-label checkbox-label">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
          {validationError && (
            <Alert variant="danger" className="mt-3">
              {validationError}
            </Alert>
          )}
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
    </div>
  );
};

export default AddCourseTotable;