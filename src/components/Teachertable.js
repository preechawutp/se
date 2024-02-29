import React, { useEffect, useState } from 'react';
import fetchTeachers from './FetchTeachers';
import Navbar from './Navbar';

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
    return teacher.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
           teacher.lastname.toLowerCase().includes(searchQuery.toLowerCase());
    // Add more conditions for other fields if needed
  });

  return (
    <div>
      <Navbar/>
      <div className='container'>
        <div className='mt-5'>
          <h2>รายชื่ออาจารย์</h2>
          <input
            type='text'
            placeholder='ค้นหา ชื่อ หรือ นามสกุล...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='form-control mb-3'
            style={{ width: "35%" }}
          />
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