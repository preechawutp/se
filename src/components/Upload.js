import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const Upload = ({ handleChange, handleAddData, form }) => {
  const [isPopup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!isPopup);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet_name_list = workbook.SheetNames;
        const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        // ส่งข้อมูลไป Firebase Firestore
        xlData.forEach(async (item) => {
          try {
            await addDoc(collection(db, "course"), item);
            console.log("Document successfully written!");
          } catch (error) {
            console.error("Error writing document: ", error);
          }
        });
      } else {
        console.error("No data found!");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="form-group">
      <div className="form-inline">
        <button className="btn1" onClick={togglePopup}>
          อัปโหลด
        </button>

        {isPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="close">
                <button className="btn-close" onClick={togglePopup}></button>
              </div>

              <h1>อัปโหลด</h1>
              <form className="row">
                <div className="form-group mt-2">
                  <input
                    class="form-control"
                    type="file"
                    accept=".xlsx, .xls"
                    id="formFile"
                    
                  />
                </div>
                <div className="form-group mt-2 d-flex justify-content-end">
                  <button
                    type="button"
                    id="submit"
                    className="btn1 mt-3 "
                    onClick={() => {
                      handleUpload();
                      togglePopup(); // Close the popup after clicking "บันทึก"
                    }}
                  >
                    อัปโหลด
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

export default Upload;
