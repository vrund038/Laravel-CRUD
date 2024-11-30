import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', gender: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/students');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  },

 []);

  const handleAddStudent = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (response.ok) {
        const addedStudent = await response.json();
        setStudents((prev) => [...prev, addedStudent]);
      }
    } catch (error) {
      console.error('Error adding student:', error);
    } finally {
      setModalOpen(false);
      setNewStudent({ name: '', age: '', gender: '' });
    }
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleUpdateStudent = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedStudent),
      });
      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents((prev) => prev.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)));
      }
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setEditModalOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/students/${id}`, { method: 'DELETE' });
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Student List</h1>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Student
        </button>
      </div>
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.gender}</td>
              <td>
                <button className="btn btn-link text-primary" onClick={() => handleEditClick(student)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn btn-link text-danger" onClick={() => handleDeleteStudent(student.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Student Modal */}
      {modalOpen && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Student</h5>
                <button type="button" className="close" onClick={() => setModalOpen(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newStudent.age}
                    onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddStudent}>
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editModalOpen && selectedStudent && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Student</h5>
                <button type="button" className="close" onClick={() => setEditModalOpen(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedStudent.name}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedStudent.age}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, age: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    value={selectedStudent.gender}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateStudent}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;