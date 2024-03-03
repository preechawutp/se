import React, { useState } from "react";
import "../assets/AddCourse.css";

const AddCourse = ({ 
  handleChange, 
  handleAddData, 
  form,
}) => {

  const [isPopup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!isPopup);
  };

  return (
    <div className="form-group col-xl-4 p-3">
      <div className="form-inline">
        <button className="btn1" onClick={togglePopup}>
          เพิ่มรายวิชา
        </button>

        {isPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="close"><button className="btn-close" onClick={togglePopup}></button></div>
              
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

              <div className="form-group mt-2">
                <label htmlFor="credit">หน่วยกิต</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  type="number"
                  name="credit"
                  value={form.credit || ""}
                required/>
              </div>

              <div className="form-group">
                <label htmlFor="type">ประเภท</label>
                <select
                  className="form-select"
                  onChange={(e) => handleChange(e)}
                  name="type"
                  value={form.type || ""}
                >
                  <option value="บรรยาย">บรรยาย</option>
                  <option value="ปฎิบัติ">ปฎิบัติ</option>
                </select>
              </div>

              <div className="form-group mt-2">
                  <button
                    type="button"
                    className="btn1"
                    id="submit"
                    onClick={() => {
                      handleAddData();
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

export default AddCourse;