import React, { useState } from "react";
// import "../assets/AddTeacher.css";

const AddTeacher = ({ handleChange, handleAddData, form }) => {
  const [isPopup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!isPopup);
  };

  return (
    <div className="form-group col-xl-5 p-3">
      <div className="form-inline">
        <button className="btn1" onClick={togglePopup}>
          เพิ่มอาจารย์
        </button>

        {isPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="close"><button className="btn-close" onClick={togglePopup}></button></div>
              
              <h1>เพิ่มอาจารย์</h1>
              <form className="row">
              <div className="form-group">
                <label htmlFor="firstname">ชื่อ</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  type="text"
                  name="firstname"
                //   value={form.code || ""}
                />
              </div>

              <div className="form-group mt-2">
                <label htmlFor="lastname">นามสกุล</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  type="text"
                  name="lastname"
                //   value={form.grade || ""}

                />
              </div>

              <div className="form-group mt-2">
                  <button
                    type="button"
                    className="btn1"
                    id="submit"
                    onClick={() => {
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

export default AddTeacher;