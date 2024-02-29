import React, { useState } from "react";
import "../assets/DataTable.css"; // เชื่อมต่อไฟล์ CSS
import AddCourseToTable from "./AddCourseToTable";

const DataTable = ({
  data,
  editId,
  form,
  courseForm,
  handleAddData,
  handleChange,
  handleSave,
  handleEdit,
  handleDelete,
  handleAddCourse,
  setEditId, // เพิ่ม setEditId เข้ามา
  setForm,
  handleCourseChange,
}) => {
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">รหัสวิชา</th>
          <th scope="col">หลักสูตร</th>
          <th scope="col">ชื่อวิชา</th>
          <th scope="col">หน่วยกิต</th>
          <th scope="col">ประเภท</th>
          <th scope="col">การจัดการ</th>
          <th scope="col">เลือก</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>
              {editId === item.id ? (
                <>
                  <input
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    type="number"
                    name="code"
                    value={form.code !== undefined ? form.code : item.code}
                    placeholder="code"
                  />
                </>
              ) : (
                item.code
              )}
            </td>
            <td>
              {editId === item.id ? (
                <>
                  <input
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    type="number"
                    name="grade"
                    value={form.grade !== undefined ? form.grade : item.grade}
                    placeholder="grade"
                  />
                </>
              ) : (
                item.grade
              )}
            </td>
            <td>
              {editId === item.id ? (
                <>
                  <input
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="name"
                    value={form.name !== undefined ? form.name : item.name}
                    placeholder="name"
                  />
                </>
              ) : (
                item.name
              )}
            </td>
            <td>
              {editId === item.id ? (
                <>
                  <input
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    type="number"
                    name="credit"
                    value={form.credit !== undefined ? form.credit : item.credit}
                    placeholder="credit"
                  />
                </>
              ) : (
                item.credit
              )}
            </td>
            <td>
              {editId === item.id ? (
                <>
                  <input
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="type"
                    value={form.type !== undefined ? form.type : item.type}
                    placeholder="type"
                  />
                </>
              ) : (
                item.type
              )}
            </td>
            <td>
              {editId === item.id ? (
                <>
                  <button className="btn1" onClick={() => handleSave()}>
                    <i className="fa-solid fa-floppy-disk"></i> บันทึก
                  </button>
                  <button
                    className="btn1"
                    onClick={() => {
                      setEditId(false);
                      setForm({});
                    }}
                  >
                    <i className="fa-solid fa-ban"></i> ยกเลิก
                  </button>
                </>
              ) : (
                <>
                  <button className="btn1" onClick={() => handleEdit(item.id)}>
                    <i className="fa-solid fa-pencil"></i> แก้ไข
                  </button>
                  <button className="btn1" onClick={() => handleDelete(item.id)}>
                    <i className="fa-solid fa-trash"></i> ลบ
                  </button>
                </>
              )}
            </td>
            <td>
              <div className="d-flex align-items-center">
                <AddCourseToTable handleCourseChange={handleCourseChange} handleAddCourse={handleAddCourse} courseForm={courseForm} item_id={item.id} />
                
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;