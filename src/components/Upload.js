import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Modal } from "react-bootstrap";

const Upload = ({ handleChange, handleAddData, form }) => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    <div className="form-group p-3  ">
        <Button className="btn1" onClick={handleShow}>
          อัปโหลด
        </Button>

        <Modal
          show={show} 
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered={true}
          scrollable={true}
          size="s"
        >
        <Modal.Body closeButton style={{
            maxHeight: 'calc(100vh - 210px)',
            overflowY: 'auto',
            overflowX: 'auto',
            padding: '10%'
          }}>
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
              </Modal.Body>
        </Modal>
      </div>
  );
};

export default Upload;  