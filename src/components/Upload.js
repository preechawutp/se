import React, { useState } from "react";
// import "../assets/Upload.css";

const Upload = ({ handleChange, handleAddData, form }) => {
  const [isPopup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!isPopup);
  };

  return (
    <div className="form-group col-xl-5 p-3">
      <div className="form-inline">
        <button className="btn1" onClick={togglePopup}>
          อัปโหลด
        </button>

        {isPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="close"><button className="btn-close" onClick={togglePopup}></button></div>
              
              <h1>อัปโหลด</h1>
              <form className="row">
                <div className="form-group mt-2">
                  <input class="form-control" type="file" accept=".xlsx, .xls" id="formFile"/>
                </div>
                <div className="form-group mt-2 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn1 mt-3 "
                    // onClick={handleUpload}
                  >อัปโหลด</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;