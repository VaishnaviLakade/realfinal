import React, { useState } from "react";
import axios from "axios";
import "../css/AssignmentMarks.css"; // create this for styling

const AssignmentMarks = () => {
  const [subject, setSubject] = useState("");
  const [batch, setBatch] = useState("");
  const [totalAss, setTotalAss] = useState("");
  const [students, setStudents] = useState([]);
  const [converted, setConverted] = useState(false);

  const fetchStudents = async (e) => {
    e.preventDefault();
    if (!subject || !batch || !totalAss) {
      alert("Please select all fields");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/students?batch=${batch}`
      );
      const studentData = res.data.map((s) => ({
        ...s,
        marks: "",
        convertedMarks: "",
      }));
      setStudents(studentData);
      setConverted(false);
    } catch (err) {
      alert("Failed to fetch students");
    }
  };

  const handleMarksChange = (i, value) => {
    const updated = [...students];
    updated[i].marks = value;
    setStudents(updated);
  };

  const convertMarks = () => {
    const maxMarks = totalAss * 10;
    const updated = students.map((s) => ({
      ...s,
      convertedMarks: Math.ceil((parseInt(s.marks || 0) / maxMarks) * 60),
    }));
    setStudents(updated);
    setConverted(true);
  };

  const submitMarks = async () => {
    if (!converted) {
      alert("Please convert marks first");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/assignmentMarks",
        {
          subject,
          students,
        }
      );
      alert("Marks submitted successfully!");
    } catch (err) {
      console.log(err);
      alert("Submission failed", err);
    }
  };

  return (
    <div className="marks-wrapper">
      <h2>Unit Test Marks</h2>
      <form className="marks-form" onSubmit={fetchStudents}>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Choose Subject</option>
          <option value="EM3">EM3</option>
          <option value="DMS">DMS</option>
          <option value="CG">CG</option>
          <option value="PA">PA</option>
          <option value="PBL">PBL</option>
        </select>

        <select value={batch} onChange={(e) => setBatch(e.target.value)}>
          <option value="">Choose Batch</option>
          <option value="E9">E9</option>
          <option value="F9">F9</option>
          <option value="G9">G9</option>
          <option value="H9">H9</option>
          <option value="E10">E10</option>
          <option value="F10">F10</option>
          <option value="G10">G10</option>
          <option value="H10">H10</option>
        </select>

        <select value={totalAss} onChange={(e) => setTotalAss(e.target.value)}>
          <option value="">Total Assignments</option>
          {[...Array(9)].map((_, i) => (
            <option key={i} value={i + 7}>
              {i + 7}
            </option>
          ))}
        </select>

        <button type="submit">Show Students</button>
      </form>

      {students.length > 0 && (
        <>
          <table className="marks-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Marks</th>
                <th>Converted (out of 60)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.Roll_no}>
                  <td>{s.Roll_No}</td>
                  <td>{s.Name}</td>
                  <td>
                    <input
                      type="number"
                      value={s.marks}
                      min={0}
                      max={totalAss * 10}
                      onChange={(e) => handleMarksChange(i, e.target.value)}
                    />
                    /{totalAss * 10}
                  </td>
                  <td>{s.convertedMarks ? s.convertedMarks : "/60"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="actions">
            <button onClick={convertMarks}>Convert Marks</button>
            <button onClick={submitMarks} disabled={!converted}>
              Submit Marks
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignmentMarks;
