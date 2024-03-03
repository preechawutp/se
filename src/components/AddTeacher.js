import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const AddTeacher = () => {
  const roitaiRefT = collection(db, "teacher");
  const [form, setForm] = useState({});
  const [data, setData] = useState([]); // Define the setData state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    };
  }, []);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(roitaiRefT, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(newData);
    });
    return () => {
      unsubscribe();
    };
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddData = async () => {
    await addDoc(roitaiRefT, form)
      .then((res) => {})
      .catch((err) => console.log(err));
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
    <div className="form-group p-3  ">
      <Button className="btn1" onClick={handleShow}>
        เพิ่มอาจารย์
      </Button>

      <Modal 
          show={show} 
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered={true}
          scrollable={true}
          size="s"
        >
        <Modal.Body closeButton style={{
            maxHeight: 'calc(100vh - 210px)',
            overflowY: 'auto',
            overflowX: 'auto',
            padding: '50px' // เพิ่ม padding เพื่อเพิ่มช่องว่างระหว่างขอบ
          }}>
          <h1>เพิ่มอาจารย์</h1>
          <form className="row">
            <div className="form-group">
              <label htmlFor="firstname">ชื่อจริง</label>
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="text"
                name="firstname"
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="lastname">นามสกุล</label>
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="text"
                name="lastname"
              />
            </div>
            <div className="form-group mt-3 d-flex justify-content-end">
          <button className="btn1 mt-2 d-flex justify-content-end" onClick={handleAddData}>
              บันทึก
          </button>
        </div>
          </form>
        </Modal.Body>

      </Modal>
      </div>
    </>
  );
};

export default AddTeacher;