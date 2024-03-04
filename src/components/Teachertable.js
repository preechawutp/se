import React, { useEffect, useState } from 'react';
import fetchTeachers from './FetchTeachers';
import Navbar from './Navbar';
import AddTeacher from './AddTeacher';

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTeachers = await fetchTeachers();
        setTeachers(fetchedTeachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    fetchData();
  }, []);

  const filteredTeachers = teachers.filter(teacher => {
    return (teacher.firstname && teacher.firstname.toLowerCase().includes(searchQuery.toLowerCase())) ||
           (teacher.lastname && teacher.lastname.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div>
      <Navbar/>
      <div className='container-sm mt-5'>
        <div className='mt-5'>
          <h2>รายชื่ออาจารย์</h2>
          <div className="d-flex justify-content-between align-items-center" style={{ width: '100%' }}>
            <div className="input-group mb-3 mt-3" style={{ width: '40%' }}>
              <input
                type='text'
                placeholder='ค้นหา ชื่อ หรือ นามสกุล...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='form-control mb-3 mt-3'
                style={{ width: "35%" }}
              /> 
              <div className="d-flex">
                <AddTeacher />
              </div>
          </div>
        </div>


          <table className='table table-hover' style={{ width: "70%" }}>
            <thead class="table caption-top">
              <tr>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher, index) => (
                <tr key={index}>
                  <td>{teacher.firstname}</td>
                  <td>{teacher.lastname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherTable;