import React, { useState } from "react";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="169px" // Set width to 169 pixels
    height="169px" // Set height to 169 pixels
    viewBox="0 0 24 24"
  >
    <path
      fill="#6E2A26"
      d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"
    />
  </svg>
);

const Confirm = ({ onConfirm, onCancel }) => {
  const [isPopup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!isPopup);
  };

  return (
    <div className="form-group">
      <div className="form-inline">
        <button className="btn1" onClick={togglePopup}>
          บันทึก
        </button>

        {isPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="close">
                <button className="btn-close" onClick={togglePopup}></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CheckIcon />
                <h4>ต้องการยืนยันหรือไม่ ?</h4>
              </div>
              <div className="form-group mt-2" style={{ textAlign: "center" }}>
                <button
                  type="button"
                  className="btn1"
                  id="submit"
                  onClick={() => {
                    onConfirm(); 
                    togglePopup();
                  }}
                >
                  ยืนยัน
                </button>

                <button
                  type="button"
                  className="btn-cancel"
                  id="submit"
                  onClick={() => {
                    onCancel(); 
                    togglePopup(); 
                  }}
                  style={{ marginLeft: "10%" }}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Confirm;
