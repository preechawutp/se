import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "../assets/showCouse.css";
import { db, copySelectedCourseToNewFirestore } from '../firebase';


const ShowCourse = () => {
    return (
        <div className="showcourse">
            <Navbar />
            <div className="container-sm mt-5">
                <h1 className="hh1">หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์</h1>
                <h2 className="hh2">ภาษาไทย : หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์</h2>
                <h2 className="hh2">ภาษาอังกฤษ : Bachelor of Engineering Program in Computer Engineering</h2>

                <div className="form-group mt-2 d-flex justify-content-end ">
                    <button
                        type="button"
                        className="btn1"
                        id="submit"
                        onClick={async () => {
                            await copySelectedCourseToNewFirestore(); // Call the function to copy data
                        }}
                    >
                        อัพเดทหลักสูตร
                    </button>
                </div>

                <table className="table table-hover mt-4">
                    <thead>
                        <tr>
                            <th scope="col">ปีที่ปรับปรุง</th>
                            <th scope="col">หน่วยกิตรวม</th>
                            <th scope="col">ดาวน์โหลดไฟล์หลักสูตร</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <th scope="col">test</th>
                                <th scope="col">test</th>
                                <th scope="col"><a href="" className="link-primary">Download</a></th>
                            </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ShowCourse;