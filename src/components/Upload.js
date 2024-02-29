import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const Upload = ({ handleChange, handleAddData, form }) => {
  const [isPopup, setPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const togglePopup = () => {
    setPopup(!isPopup);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = event.target.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheet_name_list = workbook.SheetNames;
          const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

          // Send data to Firebase Firestore
          xlData.forEach(async (item) => {
            try {
              await addDoc(collection(db, "course"), item);
              console.log("Document successfully written!");
            } catch (error) {
              console.error("Error writing document: ", error);
            }
          });

          // Trigger handleAddData after uploading the file
          handleAddData();
        } else {
          console.error("No data found!");
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
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
                    className="form-control"
                    type="file"
                    accept=".xlsx, .xls"
                    id="formFile"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="form-group mt-2 d-flex justify-content-end">
                  <button
                    type="button"
                    id="submit"
                    className="btn1 mt-3 "
                    onClick={handleUpload}
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