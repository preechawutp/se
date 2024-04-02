import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { copySelectedCourseToChooseSubject } from '../firebase';
import { Card } from 'react-bootstrap';

const Course = ({ data, handleDeleteSelectedCourse, handleAddToTable }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedCourseCount, setSelectedCourseCount] = useState(0);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    setSelectedCourseCount(data.length);
  }, [data]);

  const handleDeleteAllSelectedCourses = () => {
    data.forEach(item => handleDeleteSelectedCourse(item.id));
  };

  return (
    <div className="form-group col-xl-4 p-3">
      <Button variant="primary" onClick={handleShow} className="btn1 position-relative">
        รายวิชาที่เลือก
        {selectedCourseCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
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
            <table className="table table-hover text-nowrap text-center">
              <thead>
                <tr>
                  <th scope="col"><strong>ชื่อวิชา</strong></th>
                  <th scope="col"><strong>หมู่เรียน</strong></th>
                  <th scope="col"><strong>ประเภท</strong></th>
                  <th scope="col"><strong>อาจารย์ผู้สอน</strong></th>
                  <th scope="col"><strong>เวลา</strong></th>
                  <th scope="col"><strong>หน่วยกิต</strong></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr onClick={() => setExpandedRow(expandedRow === index ? null : index)}>
                      <td>{item.code}-{item.grade} {item.name}</td>
                      <td>{item.sec}</td>
                      <td>{item.type}</td>
                      <td>{item.teacher}</td>
                      <td>{item.day} {item.TimeStart} - {item.TimeStop}</td>
                      <td>{item.credit}</td>
                      <td>
                        <button className="btn1" onClick={e => {
                          e.stopPropagation();
                          handleDeleteSelectedCourse(item.id);
                        }}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                    {expandedRow === index && (
                      <tr>
                        <td colSpan="6">

                          <div className='row'>
                            <div className='col'>
                              <strong>ประเภทวิชา</strong> {item.subjecttype}
                            </div>
                            <div className='col'>
                              <strong>นักศึกษา</strong> {item.student}
                            </div>
                            <div className='col'>
                              <strong>ห้องเรียน</strong> {item.room}
                            </div>
                            <div className='col'>
                              <strong>สาขา</strong> {item.major}
                            </div>
                            <div className='col'>
                              <strong>ภาคเรียน</strong> {item.term}
                            </div>
                          </div>

                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
              await handleDeleteAllSelectedCourses();
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
