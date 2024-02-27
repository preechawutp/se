import React, { useState } from "react";

const AddCourseToTable = ({ handleChange, handleAddData, form }) => {
  
  const [isPopup, setPopup] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const togglePopup = () => {
    setPopup(!isPopup);
  };

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  return (
    <div className="form-group">
      <div className="form-inline">
        <button className="btn1" onClick={togglePopup}>
          +เลือก
        </button>

        {isPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="close"><button className="btn-close" onClick={togglePopup}></button></div>

              <h3>เพิ่มรายวิชาเข้าตาราง</h3>

              <form>

              <div className="form-group mt-2 ">
                <label htmlFor="code">test</label>
                <input
                  className="form-control"
                  type="text"
                />
              </div>

              <div className="form-group mt-2 ">
                <label htmlFor="code">test</label>
                <input
                  className="form-control"
                  type="text"
                />
              </div>

              <div className="form-group mt-2">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <span>เช็คสถานะ</span>
                  </label>
                </div>

              <div className="form-group mt-2 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn1"
                    id="submit"
                    onClick={() => {
                      togglePopup();
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

export default AddCourseToTable;