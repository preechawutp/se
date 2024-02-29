// SelectedCoursePopup.js
import React from "react";

const SelectedCoursePopup = ({ selectedCourses, onClose, handleDeleteCourse }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>รายวิชาที่เลือก</h2>
        <ul>
          {selectedCourses.map((course, index) => (
            <li key={index}>
              {course.name}{" "}
              <button onClick={() => handleDeleteCourse(course.id)}>ลบ</button>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>ปิด</button>
      </div>
    </div>
  );
};

export default SelectedCoursePopup;
