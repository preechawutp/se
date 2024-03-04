import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import "../assets/AddCourse.css";
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';

const AddCourseTotable = ({ 
  handleCourseChange, 
  handleAddCourse,
  courseForm,
  item_id,
}) => {
  const teacherRef = collection(db, "teacher");
  const [teachers, setTeacher] = useState([]);
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

  const [isPopup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!isPopup);
  };

  const options = ["1", "2", "3", "4", "5"];

  return (
    <div className="form-group">
      <div className="form-inline">
        <button className="btn1" onClick={togglePopup}>
          + เลือก
        </button>

        {isPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="close"><button className="btn-close" onClick={togglePopup}></button></div>

              <h1>เพิ่มรายวิชาเข้าตาราง</h1>
              <form>
                <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="day">วันที่ต้องการสอน</label>
                  <select
                    className="form-select"
                    onChange={(e) => handleCourseChange(e)}
                    name="day"
                    style={{ width: "150px" }} 
                  >
                    <option value="-">- กรุณาเลือก -</option>
                    <option value="MON">MON</option>
                    <option value="TUE">TUE</option>
                    <option value="WED">WED</option>
                    <option value="THU">THU</option>
                    <option value="FRI">FRI</option>
                    <option value="SAT">SAT</option>
                    <option value="SUN">SUN</option>
                  </select>
                  
                </div>

                <div className="form-group mt-2 d-flex justify-content-between align-items-center gap-2">
                  <label htmlFor="TimeStart">เวลา</label>
                  <input
                    className="form-control"
                    onChange={(e) => handleCourseChange(e)}
                    type="time"
                    name="TimeStart"
                    
                  />

                  <label htmlFor="TimeStop">ถึง</label>
                  <input
                    className="form-control"
                    onChange={(e) => handleCourseChange(e)}
                    type="time"
                    name="TimeStop"
                  />
                </div>

                <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="teacher">อาจารย์</label>
                  <select
                    className="form-select"
                    onChange={(e) => handleCourseChange(e)}
                    name="teacher"
                    style={{ width: "150px" }} 
                  >
                    {teachers.map((item, index) => (
                      <option value={item}> {item.firstname} {item.lastname} </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="sec">หมู่เรียน</label>
                  <input
                    className="form-control"
                    onChange={(e) => handleCourseChange(e)}
                    type="number"
                    name="sec"
                    value={courseForm.sec || ""}
                    style={{ width: "150px" }} // Adjust the width as needed
                  />
                </div>

                <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="room">ห้อง</label>
                  <input
                    className="form-control"
                    onChange={(e) => handleCourseChange(e)}
                    type="number"
                    name="room"
                    style={{ width: "150px" }}
                  />
                </div>

                <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="major">สาขา</label>
                  <select
                    className="form-select"
                    onChange={(e) => handleCourseChange(e)}
                    name="major"
                    style={{ width: "150px" }}
                  >
                    <option value="T12">- T12 -</option>

                  </select>
                </div>

                <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="student">ปีการศึกษา</label>
                  <input
                    className="form-control"
                    onChange={(e) => handleCourseChange(e)}
                    type="number"
                    name="years"
                    style={{ width: "150px" }}
                  />
                </div>

                <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="student">ภาคเรียน</label>
                  <input
                    className="form-control"
                    onChange={(e) => handleCourseChange(e)}
                    type="text"
                    name="term"
                    style={{ width: "150px" }}
                  />
                </div>

                <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="student">จำนวนนิสิต</label>
                  <input
                    className="form-control"
                    onChange={(e) => handleCourseChange(e)}
                    type="number"
                    name="student"
                    style={{ width: "150px" }}
                  />
                </div>

                <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="grade_level">ชั้นปี</label>
                  <div className="d-flex">
                    {options.map((option, index) => (
                      <div key={index} className="form-check" style={{ marginRight: '16px' }}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`option${index}`}
                          name="grade_level"
                          value={option}
                          onChange={(e) => handleCourseChange(e)}
                        />
                        <label htmlFor={`option${index}`} className="form-check-label">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group mt-2 d-flex justify-content-end ">
                  <button
                    type="button"
                    className="btn1"
                    id="submit"
                    onClick={() => {
                      handleAddCourse(item_id);
                      togglePopup(); // Close the popup after clicking "บันทึก"
                    }}
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCourseTotable;