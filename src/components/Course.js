import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { copySelectedCourseToChooseSubject } from '../firebase';

const Course = ({ data, handleDeleteSelectedCourse, handleAddToTable }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedCourseCount, setSelectedCourseCount] = useState(0);

  useEffect(() => {
    setSelectedCourseCount(data.length); // อัปเดตจำนวน selected courses 
  }, [data]);


  return (
    <div className="form-group col-xl-4 p-3">
      <Button variant="primary" onClick={handleShow} className="btn1 position-relative">
        รายวิชาที่เลือก
        {selectedCourseCount > 0 && (
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {selectedCourseCount}
          </span>
        )}
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
          overflowX: 'auto',
          padding: '5%'
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
                  <th scope="col"></th>
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
                        <i className="fa-solid fa-trash"></i>
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
            onClick={async () => {
              await handleAddToTable(data);
              await copySelectedCourseToChooseSubject();
              handleClose();
            }}
          >
            จัดข้อมูลลงตาราง
          </button>
          <Button variant="secondary" onClick={handleClose}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Course;