import React from 'react';
import '../assets/st.css';
import Navbar from "./Navbar";
import Dropdown from './Dropdown';


const ScheduleTable = ({ 
  data,
  handleDeleteSelectedCourse,
 }) => {
    const timeSlots = Array.from({ length: 26 }, (_, index) => {
    const startHour = Math.floor(index / 2) + 7;
    const startMinute = index % 2 === 0 ? '00' : '30';
    const endHour = Math.floor((index + 1) / 2) + 7;
    const endMinute = (index + 1) % 2 === 0 ? '00' : '30';
  
    // Additional condition to check for the new time slot
    if (index === 28) {
      return `${startHour}:${startMinute}-20:00`;
    }
  
    return `${startHour}:${startMinute}-${endHour}:${endMinute}`;
  });
  const daysOfWeek = ['จันทร์/M', 'อังคาร/Tu', 'พุธ/W', 'พฤหัสบดี/Th', 'ศุกร์/F', 'เสาร์/Sat', 'อาทิตย์/Sun'];

  return (
      <div> 
        <Navbar/>
        
      <div className='container'>
      
      <div className="schedule-table-container mt-5">
      <h2>ตารางสอน</h2>
      <Dropdown/>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Day/Time</th>
              {timeSlots.map((time, index) => (
                <th key={index}>{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day, dayIndex) => (
              <tr key={dayIndex}>
                <td>{day}</td>
                {timeSlots.map((time, timeIndex) => (
                  <td key={timeIndex}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      </div>
      </div>
  );
};

export default ScheduleTable;
