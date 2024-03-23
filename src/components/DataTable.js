import React, { useState } from "react";
import "../assets/DataTable.css"; // เชื่อมต่อไฟล์ CSS
import AddCourseToTable from "./AddCourseToTable";
import { Modal, Button } from "react-bootstrap";

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
  const courseperpage = 20;  //เปลี่ยนเอา

  const indexlast = curpage * courseperpage;
  const indexfirst = indexlast - courseperpage;
  const currentItems = data.slice(indexfirst, indexlast);

  const turtlepage = Math.ceil(data.length / courseperpage);

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

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleShowConfirmationModal = (itemId) => {
    setShowConfirmationModal(true);
    setItemToDelete(itemId);
  };

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = () => {
    handleDelete(itemToDelete);
    handleConfirmationModalClose();
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
              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="code"
                      value={form.code !== undefined ? form.code : item.code}
                      placeholder="code"
                    />
                  </>
                ) : (
                  item.code
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="grade"
                      value={form.grade !== undefined ? form.grade : item.grade}
                      placeholder="grade"
                    />
                  </>
                ) : (
                  item.grade
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="name"
                      value={form.name !== undefined ? form.name : item.name}
                      placeholder="name"
                    />
                  </>
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="credit"
                      value={form.credit !== undefined ? form.credit : item.credit}
                      placeholder="credit"
                    />
                  </>
                ) : (
                  item.credit
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="type"
                      value={form.type !== undefined ? form.type : item.type}
                      placeholder="type"
                    />
                  </>
                ) : (
                  item.type
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <div className="form-group d-flex justify-content-between">
                      <div className="d-inline-flex">
                        <button className="btn1 " onClick={() => handleSave()}>
                          <i className="fa-solid fa-floppy-disk"></i> บันทึก
                        </button>
                        <button
                          className="btn1"
                          onClick={() => {
                            setEditId(false);
                            setForm({});
                          }}
                        >
                          <i className="fa-solid fa-ban"></i> ยกเลิก
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <button className="btn1" onClick={() => handleEdit(item.id)}>
                      <i className="fa-solid fa-pencil"></i> แก้ไข
                    </button>
                    <button className="btn1" onClick={() => handleShowConfirmationModal(item.id)}>
                      <i className="fa-solid fa-trash"></i> ลบ
                    </button>
                  </>
                )}
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
        <span>{` ${curpage} / ${turtlepage}`}</span>
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
          <h5>ต้องการยืนยันใช่หรือไม่?</h5>

          <div className="form-group mt-2" style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="success" className="btn1"  onClick={handleConfirmDelete}>
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
