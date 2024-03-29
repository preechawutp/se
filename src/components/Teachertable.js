import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import AddTeacher from './AddTeacher';
import { Button, Modal } from 'react-bootstrap';

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teacherToDelete, setTeacherToDelete] = useState(null); // State for the teacher to be deleted
  const [curpage, setCurpage] = useState(1);
  const coursePerPage = 10;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'teacher'), (snapshot) => {
      const fetchedTeachers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeachers(fetchedTeachers);
    });

    return () => unsubscribe(); // Unsubscribe from snapshot listener when component unmounts
  }, []);

  const handleDelete = async (teacherId) => {
    try {
      await deleteDoc(doc(db, 'teacher', teacherId));
      setTeacherToDelete(null); // Reset teacher to be deleted after deletion
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const deleteAll = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'teacher'));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref).catch((err) => console.log(err));
      });
      setTeacherToDelete(null);
    } catch (error) {
      console.error(error);
    }

  };

  const handleConfirmationModalClose = () => setTeacherToDelete(null);

  const filteredTeachers = teachers.filter(teacher => {
    return (teacher.firstname && teacher.firstname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (teacher.lastname && teacher.lastname.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const totalPages = Math.ceil(filteredTeachers.length / coursePerPage);
  const indexLast = curpage * coursePerPage;
  const indexFirst = indexLast - coursePerPage;
  const currentItems = filteredTeachers.slice(indexFirst, indexLast);

  const handleNextPage = () => {
    if (curpage < totalPages) {
      setCurpage(curpage + 1);
    }
  };

  const handlePrevPage = () => {
    if (curpage > 1) {
      setCurpage(curpage - 1);
    }
  };

  const handleDeleteAll = () => {
    setTeacherToDelete('all');
  };

  return (
    <div>
      <Navbar />
      <div className='container mt-5'>
        <div className='mt-5'>
          <h2 className="text-center">รายชื่ออาจารย์</h2>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <input
              type='text'
              placeholder='ค้นหา ชื่อ หรือ นามสกุล...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='form-control rounded'
              style={{ width: "40%" }}
            />
            <AddTeacher />
          </div>

          <div className="d-flex justify-content-center">
            <table className='table table-hover' style={{ width: "50%" }}>
              <thead className="table caption-top">
                <tr>
                  <th style={{ width: "50%" }}>ชื่อ</th>
                  <th style={{ width: "50%" }}>นามสกุล</th>
                  <th style={{ width: "25%" }}></th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.firstname}</td>
                      <td>{teacher.lastname}</td>
                      <td>
                        <button className="btn1" onClick={() => setTeacherToDelete(teacher)}>
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">ไม่พบรายชื่ออาจารย์</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col">
          </div>
          <div className="col">
            <div className="pagination mb-3">
              <button className="btn1" onClick={handlePrevPage} disabled={curpage === 1}>
                กลับ
              </button>
              <span>{` ${curpage} / ${totalPages}`}</span>
              <button className="btn1" onClick={handleNextPage} disabled={curpage === totalPages}>
                ถัดไป
              </button>
            </div>
          </div>
          <div className="col mb-3 mt-2 d-flex justify-content-end">
            <button
              className="btn-cancel"
              onClick={handleDeleteAll}
            >
              ลบข้อมูลทั้งหมด
            </button>
          </div>
        </div>

      </div>
      {/* Confirmation Dialog Modal ลบเดียว*/}
      <Modal
        show={teacherToDelete !== null}
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
            <Button variant="success" className="btn1" onClick={() => handleDelete(teacherToDelete.id)}>
              ยืนยัน
            </Button>
            <Button variant="danger" className="btn-cancel" style={{ marginLeft: "20%" }} onClick={handleConfirmationModalClose}>
              ยกเลิก
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Confirmation Dialog Modal ลบหมด*/}
      <Modal
        show={teacherToDelete === 'all'}
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
            <Button variant="success" className="btn1" onClick={deleteAll}>
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

export default TeacherTable;
