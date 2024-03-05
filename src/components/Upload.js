import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Modal, Table, Alert } from "react-bootstrap";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [xlData, setXlData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleUploadModalClose = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setXlData(null);
    setErrorMessage(null);
  };

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validFileTypes = [".xlsx", ".xls"];
    const fileType = file ? file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2) : null;

    if (!file || !validFileTypes.includes(`.${fileType.toLowerCase()}`)) {
      setErrorMessage("ประเภทไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์ Excel (.xlsx หรือ .xls)");
      setSelectedFile(null);
      setXlData(null);
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet_name_list = workbook.SheetNames;
        const dataFromSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        setXlData(dataFromSheet);
        setShowUploadModal(true);
        setErrorMessage(null); // Clear the error message when a valid file is selected
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!xlData) {
      setErrorMessage("กรุณาใส่ไฟล์ Excel ก่อนกดอัปโหลด");
      return;
    }

    setShowUploadModal(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmUpload = async () => {
    // Send data to Firebase Firestore
    xlData.forEach(async (item) => {
      try {
        await addDoc(collection(db, "course"), item);
        console.log("Document successfully written!");
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    });

    setShowConfirmationModal(false);
  };

  const handleShow = () => {
    setSelectedFile(null);
    setXlData(null);
    setErrorMessage(null);
    setShowUploadModal(true);
  };

  return (
    <div className="form-group p-3">
      <Button className="btn1" onClick={handleShow}>
        อัปโหลด
      </Button>

      <Modal
        show={showUploadModal}
        onHide={handleUploadModalClose}
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
                className="btn1 mt-3"
                onClick={handleUpload}
              >
                อัปโหลด
              </button>
            </div>
          </form>
          {errorMessage && (
            <Alert variant="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}
        </Modal.Body>
      </Modal>

      {/* Confirmation Dialog Modal */}
      <Modal
        show={showConfirmationModal}
        onHide={handleConfirmationModalClose}
        centered
      >
        <Modal.Header>
          <Modal.Title>ยืนยันการอัปโหลด</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>ต้องการอัปโหลดใช่หรือไม่?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirmationModalClose}>
            ยกเลิก
          </Button>
          <Button variant="success" onClick={handleConfirmUpload}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Upload;
