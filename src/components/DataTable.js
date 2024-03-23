import React, { useState } from "react";
import "../assets/DataTable.css"; // เชื่อมต่อไฟล์ CSS
import AddCourseToTable from "./AddCourseToTable";
import { Button, Modal } from "react-bootstrap";

const DataTable = ({
  data,
  editId,
  form,
  courseForm,
  handleAddData,
  handleChange,
  handleSave,
  handleEdit,
  handleDelete,
  handleAddCourse,
  setEditId, 
  setForm,
  handleCourseChange,
}) => {
  const [curpage, setcurpage] = useState(1);
  const courseperpage = 20;

  const indexlast = curpage * courseperpage;
  const indexfirst = indexlast - courseperpage;
  const currentItems = data.slice(indexfirst, indexlast);

  const turtlepage = Math.ceil(data.length / courseperpage);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleNextPage = () => {
    if (curpage < turtlepage) {
      setcurpage((kornpage) => kornpage + 1);
    }
  };
  
  const handlekornpage = () => {
    if (curpage > 1) {
      setcurpage((kornpage) => kornpage - 1);
    }
  };

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false);
    setItemToDelete(null); // Reset item to delete when modal is closed
  };

  const handleConfirmDeleteData = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete);
      setShowConfirmationModal(false);
      setItemToDelete(null); // Reset item to delete after deletion
    }
  };

  const handleshow = (itemId) => {
    setShowConfirmationModal(true);
    setItemToDelete(itemId);
  };

  return (
    <div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">รหัสวิชา</th>
            <th scope="col">หลักสูตร</th>
            <th scope="col">ชื่อวิชา</th>
            <th scope="col">หน่วยกิต</th>
            <th scope="col">ประเภท</th>
            <th scope="col">การจัดการ</th>
            <th scope="col">เลือก</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.code}</td>
              <td>{item.grade}</td>
              <td>{item.name}</td>
              <td>{item.credit}</td>
              <td>{item.type}</td>
              <td>
                <div className="form-group d-flex justify-content-between">
                  <div className="d-inline-flex">
                    <button className="btn1" onClick={() => handleEdit(item.id)}>
                      <i className="fa-solid fa-pencil"></i> แก้ไข
                    </button>
                    <button className="btn1" onClick={() => handleshow(item.id)}>
                      <i className="fa-solid fa-trash"></i> ลบ
                    </button>
                  </div>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <AddCourseToTable handleCourseChange={handleCourseChange} handleAddCourse={handleAddCourse} courseForm={courseForm} item_id={item.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination mb-3">
        <button className="btn1" onClick={handlekornpage} disabled={curpage === 1}>
          กลับ
        </button>
        <span>{`${curpage} / ${turtlepage}`}</span>
        <button className="btn1" onClick={handleNextPage} disabled={curpage === turtlepage}>
          ถัดไป
        </button>
      </div>

      {/* Confirmation Dialog Modal */}
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
          <h5>ต้องการยืนยันการลบหรือไม่?</h5>   
          <div className="form-group mt-2" style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="success" className="btn1" onClick={handleConfirmDeleteData}>
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

export default DataTable;
