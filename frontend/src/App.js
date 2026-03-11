import React, { useEffect, useState } from "react";
import { getStudents, addStudent, updateStudent, deleteStudent } from "./api";
import "./App.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { FaUserGraduate, FaMoon, FaSun, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

function App() {

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    const res = await getStudents();
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addStudent(form);
    setForm({ name: "", email: "", age: "" });
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete student?")) {
      await deleteStudent(id);
      fetchStudents();
    }
  };

  const handleUpdate = async () => {
    await updateStudent(editingStudent.id, editingStudent);
    setEditingStudent(null);
    fetchStudents();
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

    const downloadExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(students);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    });

    saveAs(data, "students.xlsx");

  };

  return (
    <div className={darkMode ? "app dark" : "app"}>

      {/* SIDEBAR */}

      <div className="sidebar">

        <h2 className="logo">
          <FaUserGraduate /> SMS
        </h2>

        <p>Dashboard</p>
        <p>Students</p>
        <p>Settings</p>

      </div>

      {/* MAIN CONTENT */}

      <div className="main">

        <div className="topbar">

          <h1 className="title">
            Student Management System
          </h1>

          <button
            className="themeBtn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

        </div>

        {/* DASHBOARD CARD */}

        <div className="dashboard">

          <div className="cardStat">
            <FaUserGraduate className="cardIcon" />
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>

        </div>

        {/* ADD STUDENT FORM */}

        <div className="formCard">

          <form onSubmit={handleSubmit}>

            <input
              placeholder="Student Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              placeholder="Age"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />

            <button className="addBtn">
              Add Student
            </button>

          </form>

        </div>

        {/* SEARCH */}

        <div className="searchBox">

          <FaSearch />

          <input
            placeholder="Search student..."
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <button className="downloadBtn" onClick={downloadExcel}>
        Download Excel
        </button>

        {/* STUDENT TABLE */}

        <div className="tableCard">

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map((s) => (

                <tr key={s.id}>

                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.age}</td>

                  <td>

                    <button
                      className="editBtn"
                      onClick={() => setEditingStudent(s)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() => handleDelete(s.id)}
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* EDIT MODAL */}

      {editingStudent && (

        <div className="modal">

          <div className="modalContent">

            <h2>Edit Student</h2>

            <input
              value={editingStudent.name}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  name: e.target.value
                })
              }
            />

            <input
              value={editingStudent.email}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  email: e.target.value
                })
              }
            />

            <input
              value={editingStudent.age}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  age: e.target.value
                })
              }
            />

            <div className="modalBtns">

              <button
                className="saveBtn"
                onClick={handleUpdate}
              >
                Save
              </button>

              <button
                className="cancelBtn"
                onClick={() => setEditingStudent(null)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;