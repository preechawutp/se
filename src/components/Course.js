import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Course = ({ 
  data,
  handleDeleteSelectedCourse,
 }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="form-group">
      <button className="btn1" onClick={handleShow} >
        รายวิชาที่เลือก 
      </button>
      <div className="form-inline">
        <Modal 
          show={show} 
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered={true}
          scrollable={true}
          size="xl"
        >
          <Modal.Body style={{
            maxHeight: 'calc(100vh - 210px)',
            overflowY: 'auto',
            overflowX: 'auto',
            padding: '50px' // เพิ่ม padding เพื่อเพิ่มช่องว่างระหว่างขอบ
          }}>
            <h1>วิชาที่เลือก</h1>
            {Array.isArray(data) && data.length > 0 ? (
              <table className="table table-borderless mt-5">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">รหัสวิชา</th>
                    <th scope="col">หลักสูตร</th>
                    <th scope="col" style={{ width : '20%'}}>ชื่อวิชา</th>
                    <th scope="col">หน่วยกิต</th>
                    <th scope="col">ประเภท</th>
                    <th scope="col">ลบ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.code}</td>
                      <td>{item.grade}</td>
                      <td>{item.name}</td>
                      <td>{item.credit}</td>
                      <td>{item.type}</td>
                      <td>
                        <button className="btn1" onClick={() => handleDeleteSelectedCourse(item.id)}>
                          <i className="fa-solid fa-trash"></i> ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>ไม่มีข้อมูล</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn1" onClick={handleClose}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Course;