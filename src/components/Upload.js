import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Modal, Table, Alert, Form } from "react-bootstrap";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [xlData, setXlData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadOption, setUploadOption] = useState(null); // State for selected upload option

  const handleUploadModalClose = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setXlData(null);
    setErrorMessage(null);
    setUploadOption(null); // Reset upload option
  };

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false);
  };

  const handleFileChange = (file) => {
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
        setErrorMessage(null);
        document.getElementById('instruction-text').style.display = 'none';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!xlData) {
      setErrorMessage("กรุณาใส่ไฟล์ Excel ก่อนกดอัปโหลด");
      return;
    }

    if (!uploadOption) {
      setErrorMessage("กรุณาเลือกตัวเลือกการอัปโหลด");
      return;
    }

    let collectionRef = null;
    let uniqueFields = null;
    let existingDocs = {};

    if (uploadOption === "course") {
      collectionRef = "course";
      uniqueFields = ["code", "grade"];
    } else if (uploadOption === "teacher") {
      collectionRef = "teacher";
      uniqueFields = ["firstname", "lastname"];
    } else if (uploadOption === "room") {
      collectionRef = "room";
      uniqueFields = ["roomid"];
    }

    if (!collectionRef || !uniqueFields) {
      setErrorMessage("ไม่พบตัวเลือกการอัปโหลดที่ถูกต้อง");
      return;
    }

    const querySnapshot = await getDocs(collection(db, collectionRef));
    querySnapshot.forEach((doc) => {
      let uniqueKey = "";
      uniqueFields.forEach(field => {
        uniqueKey += doc.data()[field];
      });
      existingDocs[uniqueKey] = true;
    });

    const duplicateEntries = [];
    xlData.forEach((item) => {
      let uniqueKey = "";
      uniqueFields.forEach(field => {
        uniqueKey += item[field];
      });
      if (existingDocs[uniqueKey]) {
        duplicateEntries.push(uniqueKey);
      }
    });

    if (duplicateEntries.length > 0) {
      setErrorMessage(`ข้อมูลที่ซ้ำ: ${duplicateEntries.join(", ")}`);
      return;
    }

    setShowUploadModal(false);
    setShowConfirmationModal(true);
  };


  const handleConfirmUpload = async () => {
    let collectionRef = null;

    if (uploadOption === "course") {
      collectionRef = "course";
    } else if (uploadOption === "teacher") {
      collectionRef = "teacher";
    } else if (uploadOption === "room") {
      collectionRef = "room";
    }

    if (!collectionRef) {
      setErrorMessage("ไม่พบตัวเลือกการอัปโหลดที่ถูกต้อง");
      return;
    }

    xlData.forEach(async (item) => {
      try {
        await addDoc(collection(db, collectionRef), item);
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

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleCheckboxChange = (option) => {
    setUploadOption(option);
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
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Modal.Body style={{
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '6%',
        }}
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <h1>อัปโหลด</h1>
          <Form.Check
            type="checkbox"
            label="อัปโหลดรายวิชา"
            checked={uploadOption === "course"}
            onChange={() => handleCheckboxChange("course")}
            className="mt-3"
          />

          <Form.Check
            type="checkbox"
            label="อัปโหลดรายชื่ออาจารย์"
            checked={uploadOption === "teacher"}
            onChange={() => handleCheckboxChange("teacher")}
            className="mt-3"
          />

          <Form.Check
            type="checkbox"
            label="อัปโหลดรายชื่อห้อง"
            checked={uploadOption === "room"}
            onChange={() => handleCheckboxChange("room")}
            className="mt-3"
          />
          <div className="form-group">
            <div
              className="form-group mt-4"
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                className="form-control"
                type="file"
                accept=".xlsx, .xls"
                id="formFile"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              <p id="instruction-text" style={{ marginTop: "10px", textAlign: "left", paddingLeft: "10px" }}>*ลากไฟล์ Excel มาที่นี่หรือคลิกเพื่อเลือกไฟล์</p>
            </div>

            {xlData && (
              <div className="form-group mt-3">
                <h6>ข้อมูลที่จะอัปโหลด</h6>
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

          </div>
          {errorMessage && (
            <Alert variant="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}


        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            id="submit"
            className="btn1"
            onClick={handleUpload}
          >
            อัปโหลด
          </button>
          <Button variant="secondary" onClick={handleUploadModalClose}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirmationModal}
        onHide={handleConfirmationModalClose}
        size="x"
        centered
      >
        <Modal.Body closeButton style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: 'calc(100vh - 210px)',
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '10%',
        }}>
          <i className="ti ti-alert-circle mb-2" style={{ fontSize: "7em", color: "#6E2A26" }}></i>
          <h5>ต้องการอัปโหลดใช่หรือไม่?</h5>
          <div className="form-group mt-2" style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="success" className="btn1" onClick={handleConfirmUpload}>
              ยืนยัน
            </Button>
            <Button variant="danger" className="btn-cancel" style={{ marginLeft: "20%" }} onClick={handleConfirmationModalClose}>
              ยกเลิก
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Upload;
