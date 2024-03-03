// Main.js (ส่วนที่เปลี่ยนแปลง)
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ScheduleTable from './ScheduleTable'; // เพิ่มการ import ScheduleTable

const Course = ({ 
  data,
  handleDeleteSelectedCourse,
  handleAddToTable // เพิ่ม props handleAddToTable เข้ามาในพารามิเตอร์
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="form-group col-xl-4 p-3">
      <Button variant="primary" onClick={handleShow} className="btn1">
        รายวิชาที่เลือก 
      </Button>

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
      overflowX: 'auto'
     }}>
        <h1>วิชาที่เลือก</h1>
              {Array.isArray(data) && data.length > 0 ? (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">รหัสวิชา</th>
                      <th scope="col">หลักสูตร</th>
                      <th scope="col">ชื่อวิชา</th>
                      <th scope="col">หน่วยกิต</th>
                      <th scope="col">ประเภท</th>
                      <th scope="col">หมู่</th>
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
                        <td>{item.sec}</td>
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
          <button
            type="button"
            className="btn1"
            onClick={() => {
              handleAddToTable(data); // เรียกใช้ handleAddToTable ที่ถูกส่งมาจาก Main component
              handleClose(); // ปิด Modal หลังจากจัดข้อมูล
            }}
          >
            จัดข้อมูลลงตาราง
          </button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Course;
