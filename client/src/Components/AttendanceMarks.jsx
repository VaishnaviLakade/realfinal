import React, { useState } from "react";
import axios from "axios";
import "../css/AttendanceMarks.css";

const AttendanceMarks = () => {
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [converted, setConverted] = useState(false);

  const fetchStudents = async (e) => {
    e.preventDefault();
    if (!className) return alert("Please select a class");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/students/class?class=${className}`
      );
      const studentData = res.data.map((s) => ({
        ...s,
        marks: "",
        convertedMarks: "",
      }));
      setStudents(studentData);
      setConverted(false);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch students");
    }
  };

  const handleMarksChange = (i, value) => {
    const updated = [...students];
    updated[i].marks = value;
    setStudents(updated);
  };

  const convertMarks = () => {
    const updated = students.map((s) => {
      const att = parseFloat(s.marks);
      let cm = 0;
      if (att >= 95.0 && att <= 100.0) cm = 20;
      else if (att >= 90.0 && att <= 95.0) cm = 16;
      else if (att >= 85.0 && att <= 90.0) cm = 12;
      else if (att >= 80.0 && att <= 85.0) cm = 8;
      else if (att >= 75.0 && att <= 80.0) cm = 4;
      else if (att <= 75.0) {
        cm = 0;
      }

      return { ...s, convertedMarks: cm };
    });
    setStudents(updated);
    setConverted(true);
  };

  const submitMarks = async () => {
    if (!converted) return alert("Please convert marks first");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/attendanceMarks",
        {
          className,
          students,
        }
      );
      alert("Attendance Marks submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit marks");
    }
  };

  return (
    <div className="marks-wrapper">
      <h2>Attendance Marks</h2>
      <form className="marks-form" onSubmit={fetchStudents}>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        >
          <option value="">Choose Class</option>
          <option value="SE9">SE9</option>
          <option value="SE10">SE10</option>
          <option value="SE11">SE11</option>
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
                <th>Attendance (%)</th>
                <th>Converted (out of 20)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.Roll_No}>
                  <td>{s.Roll_No}</td>
                  <td>{s.Name}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.marks}
                      onChange={(e) => handleMarksChange(i, e.target.value)}
                    />
                    /100%
                  </td>
                  <td>{s.convertedMarks !== "" ? s.convertedMarks : "/20"}</td>
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

export default AttendanceMarks;
