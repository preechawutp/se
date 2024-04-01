import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';

const Guide = () => {
    const [showA, setShowA] = useState(true);
    const [showB, setShowB] = useState(false);

    const toggleShowA = () => setShowA(!showA);
    const toggleShowB = () => setShowB(!showB);

    return (
        <>
            <Col className="mb-2" style={{ position: 'relative' }}>
                <Button
                    onClick={toggleShowB}
                    className="btn1"
                >
                    <i class="fa-solid fa-question"></i>
                </Button>
                <Modal onHide={toggleShowB} show={showB} animation={false} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px' }}>
                    <Modal.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">คู่มือการใช้งาน</strong>
                    </Modal.Header>
                    <Modal.Body>
                        🔴 คือ เวลาชนกัน<br />
                        🟡 คือ ประเภทวิชาชนกัน<br />
                        🟠 คือ ห้องชนกัน<br />
                        🔵 คือ หมู่เรียนซ้ำกัน<br />
                        <br />    
                        ประเภทวิชา<br />
                        - วิชาแกนปีเดียวกันเองชนกันไม่ได้<br />
                        - วิชาแกนชนวิชาเฉพาะบังคับไม่ได้<br />
                        - วิชาเฉพาะบังคับปีเดียวกันเองชนกันไม่ได้<br />
                        - วิชาเฉพาะบังคับชนวิชาแกนไม่ได้<br />
                        - วิชาเฉพาะบังคับชนวิชาเฉพาะเลือกไม่ได้<br />
                        - วิชาเฉพาะเลือกชนวิชาเฉพาะบังคับไม่ได้<br /><br />
                        - วิชาแกนชนวิชาเฉพาะเลือกได้<br />
                        - วิชาเฉพาะเลือกชนวิชาแกนได้<br />
                        - วิชาเฉพาะเลือกปีเดียวชนกันเองได้<br />
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" style={{ marginLeft: "20%" }} onClick={toggleShowB}>
                        ยกเลิก
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Col>
        </>
    );
};

export default Guide; 
