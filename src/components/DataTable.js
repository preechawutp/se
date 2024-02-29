import React, { useState, useEffect } from "react";
import AddCourseToTable from "./AddCourseToTable";
import SelectedCoursePopup from "./SelectedCoursePopup";

const DataTable = ({
  data,
  editId,
  form,
  handleChange,
  handleSave,
  handleEdit,
  handleDelete,
  setEditId,
  setForm,
}) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const storedSelectedCourses = JSON.parse(localStorage.getItem("selectedCourses"));
    if (storedSelectedCourses) {
      setSelectedCourses(storedSelectedCourses);
    }
  }, []);

  const handleSelectCourse = (course) => {
    const updatedSelectedCourses = [...selectedCourses, course];
    setSelectedCourses(updatedSelectedCourses);
    localStorage.setItem("selectedCourses", JSON.stringify(updatedSelectedCourses));
    setIsPopupOpen(false);
  };

  const handleDeleteCourse = (courseId) => {
    const updatedSelectedCourses = selectedCourses.filter(
      (course) => course.id !== courseId
    );
    setSelectedCourses(updatedSelectedCourses);
    localStorage.setItem("selectedCourses", JSON.stringify(updatedSelectedCourses));
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className={`data-table ${isPopupOpen ? 'contracted' : ''}`}>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">รหัสวิชา</th>
            <th scope="col">หลักสูตร</th>
            <th scope="col">ชื่อวิชา</th>
            <th scope="col">หน่วยกิต</th>
            <th scope="col">ประเภท</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{item.code}</td>
              <td>{item.grade}</td>
              <td>{item.name}</td>
              <td>{item.credit}</td>
              <td>{item.type}</td>
              <td>
                <div className="d-flex align-items-center">
                  <button
                    className="btn1"
                    onClick={() => handleSelectCourse(item)}
                  >
                    เลือก
                  </button>
                  <button className="btn1" onClick={() => handleDelete(item.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddCourseToTable />

      <button className="btn1" onClick={() => setIsPopupOpen(true)}>ดูรายวิชาที่เลือก</button>
      {isPopupOpen && (
        <SelectedCoursePopup
          selectedCourses={selectedCourses}
          handleDeleteCourse={handleDeleteCourse}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default DataTable;