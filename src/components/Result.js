import React from 'react';
import '../assets/st.css';
import Navbar from "./Navbar";
import Dropdown from './Dropdown';


const Result = () => {

  return (
    <div> 
        <Navbar/>
    <div className='container'>
        <div className="schedule-table-container mt-5">
        <h2>ตารางสอน</h2>
        <Dropdown/>
            <table className="table table-hover mt-3">
                <thead class="thead-light">
                    <tr>
                    <th scope="col">ลำดับที่</th>
                    <th scope="col">รหัสวิชา</th>
                    <th scope="col">ชื่อวิชา</th>
                    <th scope="col">หน่วยกิต</th>
                    </tr>
                </thead>
                <tbody>
                    <tr scope="row">
                        <td>1</td>
                        <td>000000000</td>
                        <td>Test</td>
                        <td>3</td>
                    </tr>
                    <tr scope="row">
                        <td>1</td>
                        <td>000000000</td>
                        <td>Test</td>
                        <td>3</td>
                    </tr>
                    <tr scope="row">
                        <td>1</td>
                        <td>000000000</td>
                        <td>Test</td>
                        <td>3</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Result;
