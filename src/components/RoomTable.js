import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import { Button, Modal } from 'react-bootstrap';
import AddRoom from './AddRoom';

const RoomTable = () => {
    const [rooms, setRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [curpage, setCurpage] = useState(1);
    const roomsPerPage = 10;

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'room'), (snapshot) => {
            const fetchedRooms = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setRooms(fetchedRooms);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (roomid) => {
        try {
            await deleteDoc(doc(db, 'room', roomid));
            setRoomToDelete(null);
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    const deleteAll = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'room'));
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref).catch((err) => console.log(err));
            });
            setRoomToDelete(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmationModalClose = () => setRoomToDelete(null);

    const filteredRooms = rooms.filter(room => {
        return room.roomid && room.roomid.toLowerCase().includes(searchQuery.toLowerCase());
    });


    const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
    const indexLast = curpage * roomsPerPage;
    const indexFirst = indexLast - roomsPerPage;
    const currentItems = filteredRooms.slice(indexFirst, indexLast);

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
        setRoomToDelete('all');
    };

    return (
        <div>
            <Navbar />
            <div className='container mt-5'>
                <div className='mt-5'>
                    <h2 className="text-center">รายชื่อห้อง</h2>
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <input
                            type='text'
                            placeholder='ค้นหา ID ห้อง...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='form-control rounded'
                            style={{ width: "40%" }}
                        />
                        <AddRoom />
                    </div>

                    <div className="d-flex justify-content-center">
                        <table className='table table-hover' style={{ width: "50%" }}>
                            <thead className="table caption-top">
                                <tr>
                                    <th style={{ width: "45%" }}>ID ห้อง</th>
                                    <th style={{ width: "5%" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((room) => (
                                        <tr key={room.id}>
                                            <td>{room.roomid}</td>
                                            <td>
                                                <button className="btn1" onClick={() => setRoomToDelete(room)}>
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center">ไม่พบห้อง</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                    <div className='row'>
                        <div className='col'></div>
                        <div className='col'>
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
                        <div className='col mb-3 mt-2 d-flex justify-content-end'>
                            <button
                                className="btn-cancel"
                                onClick={handleDeleteAll}
                            >
                                ลบข้อมูลทั้งหมด
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <Modal
                show={roomToDelete !== null}
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
                        <Button variant="success" className="btn1" onClick={() => handleDelete(roomToDelete.id)}>
                            ยืนยัน
                        </Button>
                        <Button variant="danger" className="btn-cancel" style={{ marginLeft: "20%" }} onClick={handleConfirmationModalClose}>
                            ยกเลิก
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={roomToDelete === 'all'}
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

export default RoomTable;
