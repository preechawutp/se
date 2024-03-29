import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import "../assets/AddCourse.css";
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { Alert, Button, Modal, Form } from 'react-bootstrap';

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
      }, 2000);
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
      }, 2000);
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
      }, 2000);
      return;
    }
    setValidationError(null);
    handleAddCourse(item_id);
    handleClose();
  };

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
                  <select
                    className="form-select"
                    onChange={(e) => handleCourseChange(e)}
                    name="day"
                    style={{ width: "150px" }}
                    defaultValue="-"
                  >
                    <option value="-" disabled>- กรุณาเลือก -</option>
                    <option value="MON">MON</option>
                    <option value="TUE">TUE</option>
                    <option value="WED">WED</option>
                    <option value="THU">THU</option>
                    <option value="FRI">FRI</option>
                    <option value="SAT">SAT</option>
                    <option value="SUN">SUN</option>
                  </select>
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
                    <select
                      className="form-select "
                      onChange={(e) => handleCourseChange(e)}
                      name="teacher"
                      style={{ width: "150px" }}
                      defaultValue=""
                    >
                      <option value="" disabled>- กรุณาเลือก -</option>
                      {teachers.map((item, index) => (
                        <option key={index} value={item.firstname + ' ' + item.lastname}> {item.firstname} {item.lastname} </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label >ประเภทวิชา</label>
                  <select
                    className="form-select"
                    onChange={(e) => handleCourseChange(e)}
                    name="subjecttype"
                    value={courseForm.subjecttype || ""}
                    style={{ width: "150px" }}
                  >
                    <option value="" disabled>- กรุณาเลือก -</option>
                    <option value="วิชาแกน">วิชาแกน</option>
                    <option value="วิชาเฉพาะ">วิชาเฉพาะ</option>
                    <option value="วิชาเฉพาะเลือก">วิชาเฉพาะเลือก</option>
                  </select>
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
                  <select
                    className="form-select "
                    onChange={(e) => handleCourseChange(e)}
                    name="room"
                    style={{ width: "150px" }}
                    defaultValue=""
                  >
                    <option value="" disabled>- กรุณาเลือก -</option>
                    {rooms.map((item, index) => (
                      <option key={index} value={item.roomid}> {item.roomid} </option>
                    ))}
                  </select>
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
                  <select
                    className="form-select"
                    onChange={(e) => handleCourseChange(e)}
                    name="major"
                    style={{ width: "150px" }}
                    defaultValue="-"
                  >
                    <option value="-" disabled>- กรุณาเลือก -</option>
                    <option value="T12">T12</option>
                  </select>
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
                  <select
                    className="form-select"
                    onChange={(e) => handleCourseChange(e)}
                    name="term"
                    style={{ width: '150px' }}
                    defaultValue="-"
                  >
                    <option value="-" disabled>- กรุณาเลือก -</option>
                    <option value="ฤดูร้อน">ฤดูร้อน</option>
                    <option value="ต้น">ต้น</option>
                    <option value="ปลาย">ปลาย</option>
                  </select>
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
