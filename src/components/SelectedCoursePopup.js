// SelectedCoursePopup.js
import React from "react";

const SelectedCoursePopup = ({ selectedCourses, onClose, handleDeleteCourse }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>รายวิชาที่เลือก</h2>
        <table>
          <thead>
            <tr>
              <th>รายวิชา</th>
              <th>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map((course, index) => (
              <tr key={index}>
                <td>{course.name}</td>
                <td>
                  <button onClick={() => handleDeleteCourse(course.id)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose}>ปิด</button>
      </div>
    </div>
  );
};

export default SelectedCoursePopup;