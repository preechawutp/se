import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

const FormInputData = () => {
  const [form, setForm] = useState({});
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);

  const roitaiRef = collection(db, "course");
  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    };
  }, []);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(roitaiRef, (snapshot) => {
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
    console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddData = async () => {
    await addDoc(roitaiRef, form)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  console.log(editId);
  return (
    <div className="container">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="number"
                name="code"
                placeholder="code"
              />
            </th>
            <th scope="col">
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="number"
                name="grade"
                placeholder="grade"
              />
            </th>
            <th scope="col">
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="text"
                name="name"
                placeholder="name"
              />
            </th>
            <th scope="col">
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="number"
                name="credit"
                placeholder="credit"
              />
            </th>
            <th scope="col">
              <input
                className="form-control"
                onChange={(e) => handleChange(e)}
                type="text"
                name="type"
                placeholder="type"
              />
            </th>
            <th scope="col">
              <button className="btn btn-primary" onClick={handleAddData}>
                Add Subject
              </button>
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">รหัสวิชา</th>
            <th scope="col">หลักสูตร</th>
            <th scope="col">ชื่อวิชา</th>
            <th scope="col">หน่วยกิต</th>
            <th scope="col">Lec/Lab</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>

              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="code"
                      value={form.code !== undefined ? form.code : item.code}
                      placeholder="code"
                    />
                  </>
                ) : (
                  item.code
                )}
              </td>

              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="grade"
                      value={
                        form.grade !== undefined ? form.grade : item.grade
                      }
                      placeholder="grade"
                    />
                  </>
                ) : (
                  item.grade
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="name"
                      value={form.name !== undefined ? form.name : item.name}
                      placeholder="name"
                    />
                  </>
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="credit"
                      value={form.credit !== undefined ? form.credit : item.credit}
                      placeholder="credit"
                    />
                  </>
                ) : (
                  item.credit
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <input
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="type"
                      value={form.type !== undefined ? form.type : item.type}
                      placeholder="type"
                    />
                  </>
                ) : (
                  item.type
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormInputData;
