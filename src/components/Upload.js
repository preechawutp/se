import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Modal, Table } from "react-bootstrap"; // assuming you have a Table component

const Upload = ({ handleChange, handleAddData, form }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [xlData, setXlData] = useState(null); // State to hold Excel data
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    // Clear the selected file and Excel data when closing the modal
    setSelectedFile(null);
    setXlData(null);
  };

  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Read the file and set the Excel data for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet_name_list = workbook.SheetNames;
        const dataFromSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        setXlData(dataFromSheet);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (xlData) {
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
      handleClose(); // Close the modal after uploading
    }
  };

  return (
    <div className="form-group p-3">
      <Button className="btn1" onClick={handleShow}>
        อัปโหลด
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered={true}
        scrollable={true}
        size="lg"
      >
        <Modal.Body closeButton style={{
          maxHeight: 'calc(100vh - 210px)',
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '10%',
        }}>
          <style>
            {`
              /* WebKit */
              ::-webkit-scrollbar {
                width: 12px;
              }

              ::-webkit-scrollbar-track {
                background: #f1f1f1;
              }

              ::-webkit-scrollbar-thumb {
                background: #888;
              }

              ::-webkit-scrollbar-thumb:hover {
                background: #555;
              }
            `}
          </style>
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
            {xlData && (
              <div className="form-group mt-2">
                <h5>ข้อมูลที่จะอัปโหลด:</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {Object.keys(xlData[0]).map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {xlData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
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
