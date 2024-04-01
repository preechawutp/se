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
  const [renamedData, setRenamedData] = useState([]); // State for storing renamed data

  const [showInfoModalS, setShowInfoModalS] = useState(false);
  const [showInfoModalT, setShowInfoModalT] = useState(false);
  const [showInfoModalR, setShowInfoModalR] = useState(false);

  const handleShowInfoS = () => {
    setShowInfoModalS(true); // Function to show the info modal
  };

  const handleCloseInfoS = () => {
    setShowInfoModalS(false); // Function to close the info modal
  };

  const handleShowInfoT = () => {
    setShowInfoModalT(true); // Function to show the info modal
  };

  const handleCloseInfoT = () => {
    setShowInfoModalT(false); // Function to close the info modal
  };

  const handleShowInfoR = () => {
    setShowInfoModalR(true); // Function to show the info modal
  };

  const handleCloseInfoR = () => {
    setShowInfoModalR(false); // Function to close the info modal
  };

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

    // เปลี่ยนชื่อคีย์ตามแผนที่การแมปที่กำหนด
    const newRenamedData = renameKeys(xlData, keyMappings[uploadOption]);
    setRenamedData(newRenamedData);

    let collectionRef = null;
    let uniqueFields = null;
    let uniqueFieldsTH = null;

    switch (uploadOption) {
      case "course":
        collectionRef = "course";
        uniqueFields = ["code", "grade", "credit", "nameTH", "name", "type"];
        uniqueFieldsTH = ["รหัสวิชา", "หน่วยกิต", "หลักสูตร", "ชื่อ ภาษาไทย", "ชื่อ ภาษาอังกฤษ", "หมู่เรียน"];
        break;
      case "teacher":
        collectionRef = "teacher";
        uniqueFields = ["firstname", "lastname"];
        uniqueFieldsTH = ["ชื่อ", "นามสกุล"];
        break;
      case "room":
        collectionRef = "room";
        uniqueFields = ["roomid"];
        uniqueFieldsTH = ["หมายเลขห้อง"];
        break;
      default:
        setErrorMessage("ไม่พบตัวเลือกการอัปโหลดที่ถูกต้อง");
        return;
    }

    // ตรวจสอบความถูกต้องของรายการใหม่หลังจากเปลี่ยนชื่อคีย์
    const invalidEntries = newRenamedData.filter(item => !uniqueFields.every(field => field in item));
    if (invalidEntries.length > 0) {
      const requiredFields = uniqueFieldsTH.join(", ");
      setErrorMessage(`ไฟล์ Excel ไม่ตรงกับฟิลด์ที่ต้องการ กรุณาใช้ ${requiredFields}`);
      return;
    }

    // ตรวจสอบความซ้ำซ้อนของข้อมูล
    const existingDocs = new Set();
    const querySnapshot = await getDocs(collection(db, collectionRef));
    querySnapshot.forEach(doc => {
      const uniqueKey = uniqueFields.map(field => doc.data()[field]).join("_");
      existingDocs.add(uniqueKey);
    });

    const duplicateEntries = newRenamedData.filter(item => existingDocs.has(uniqueFields.map(field => item[field]).join("_")));
    if (duplicateEntries.length > 0) {
      const duplicatesList = duplicateEntries.map(item => uniqueFields.map(field => item[field]).join(", ")).join("; ");
      setErrorMessage(`ข้อมูลที่ซ้ำ: ${duplicatesList}`);
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

    renamedData.forEach(async (item) => {
      try {
        await addDoc(collection(db, uploadOption), item);
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

  const keyMappings = {
    course: {
      'รหัสวิชา': 'code',
      'หน่วยกิต': 'credit',
      'หลักสูตร': 'grade',
      'ชื่อ ภาษาไทย': 'nameTH',
      'ชื่อ ภาษาอังกฤษ': 'name',
      'หมู่เรียน': 'type',
    },
    teacher: {
      'ชื่อ': 'firstname',
      'นามสกุล': 'lastname',
    },
    room: {
      'หมายเลขห้อง': 'roomid',
    }
  };

  const renameKeys = (data, keyMap) => {
    return data.map(item => {
      const newItem = {};
      Object.keys(item).forEach(key => {
        newItem[keyMap[key] || key] = item[key];
      });
      return newItem;
    });
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
          <div>
            <Form.Check
              type="checkbox"
              label="อัปโหลดรายวิชา"
              checked={uploadOption === "course"}
              onChange={() => handleCheckboxChange("course")}
              className="mt-3 d-inline-block mr-2"
            />
            <Button
              variant="link"
              onClick={handleShowInfoS}
              className="mb-2 p-0"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                marginLeft: '10px',
                textDecoration: 'none' // Added to remove underline
              }}
            >
              ?
            </Button>
          </div>

          <div>
            <Form.Check
              type="checkbox"
              label="อัปโหลดรายชื่ออาจารย์"
              checked={uploadOption === "teacher"}
              onChange={() => handleCheckboxChange("teacher")}
              className="mt-3 d-inline-block mr-2"
            />
            <Button
              variant="link"
              onClick={handleShowInfoT}
              className="mb-2 p-0"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                marginLeft: '10px',
                textDecoration: 'none' // Added to remove underline
              }}
            >
              ?
            </Button>
          </div>

          <div>
            <Form.Check
              type="checkbox"
              label="อัปโหลดรายชื่อห้อง"
              checked={uploadOption === "room"}
              onChange={() => handleCheckboxChange("room")}
              className="mt-3 d-inline-block mr-2"
            />
            <Button
              variant="link"
              onClick={handleShowInfoR}
              className="mb-2 p-0"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                marginLeft: '10px',
                textDecoration: 'none' // Added to remove underline
              }}
            >
              ?
            </Button>
          </div>

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

      <Modal show={showInfoModalS} onHide={handleCloseInfoS} centered>
        <Modal.Header closeButton>
          <Modal.Title>แบบฟอร์มการอัปโหลดรายวิชา</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ตัวอย่างรูปแบบการนำเข้ารายวิชา
          <div>
            <img src={`${process.env.PUBLIC_URL}\Ex_subject.png`} alt="ตัวอย่างรายวิชา" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
          <div>
            ดาวน์โหลดแบบฟอร์มได้
            <a href={`${process.env.PUBLIC_URL}/Subject.xlsx`} download="Subject.xlsx">
              ที่นี่
            </a>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfoS}>ยกเลิก</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInfoModalT} onHide={handleCloseInfoT} centered>
        <Modal.Header closeButton>
          <Modal.Title>แบบฟอร์มการอัปโหลดรายชื่ออาจารย์</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ตัวอย่างรูปแบบการนำเข้ารายชื่ออาจารย์
          <div>
            <img src={`${process.env.PUBLIC_URL}\Ex_teacher.png`} alt="ตัวอย่างรายชื่ออาจารย์" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
          <div>
            ดาวน์โหลดแบบฟอร์มได้
            <a href={`${process.env.PUBLIC_URL}/Teacher.xlsx`} download="Teacher.xlsx">
              ที่นี่
            </a>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfoT}>ยกเลิก</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInfoModalR} onHide={handleCloseInfoR} centered>
        <Modal.Header closeButton>
          <Modal.Title>แบบฟอร์มการอัปโหลดรายชื่อห้อง</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ตัวอย่างรูปแบบการนำเข้ารายชื่อห้อง
          <div>
            <img src={`${process.env.PUBLIC_URL}\Ex_room.png`} alt="ตัวอย่างรายชื่อห้อง" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
          <div>
            ดาวน์โหลดแบบฟอร์มได้
            <a href={`${process.env.PUBLIC_URL}/Room.xlsx`} download="Room.xlsx">
              ที่นี่
            </a>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfoR}>ยกเลิก</Button>
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