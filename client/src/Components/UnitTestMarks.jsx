import React, { useState } from "react";
import axios from "axios";
import "../css/UnitTestMarks.css"; // Create this CSS file as needed

const UnitTestMarks = () => {
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [converted, setConverted] = useState(false);

  const fetchStudents = async (e) => {
    e.preventDefault();
    if (!subject || !className) {
      alert("Please select both subject and class");
      return;
    }

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
      console.error(err);
      alert("Failed to fetch students");
    }
  };
  const handleMarksChange = (i, value) => {
    let num = parseFloat(value);
    if (isNaN(num)) num = "";
    else if (num > 90) num = 90;
    else if (num < 0) num = 0;

    const updated = [...students];
    updated[i].marks = num;
    setStudents(updated);
  };
  const convertMarks = () => {
    const updated = students.map((s) => {
      const raw = parseFloat(s.marks);
      const converted = Math.ceil((raw / 90) * 20);
      return { ...s, convertedMarks: isNaN(converted) ? "" : converted };
    });
    setStudents(updated);
    setConverted(true);
  };

  const submitMarks = async () => {
    if (!converted) {
      alert("Please convert marks before submitting");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/unitTestMarks", {
        subject,
        students,
      });
      alert("Unit Test Marks submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit marks");
    }
  };

  return (
    <div className="marks-wrapper">
      <h2>Unit Test Marks</h2>
      <form className="marks-form" onSubmit={fetchStudents}>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Choose Subject</option>
          <option value="EM3">EM3</option>
          <option value="PA">PA</option>
          <option value="DMS">DMS</option>
          <option value="CG">CG</option>
        </select>

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
                <th>Marks (out of 90)</th>
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
                      value={s.marks}
                      min="0"
                      max="90"
                      onChange={(e) => handleMarksChange(i, e.target.value)}
                    />
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

export default UnitTestMarks;
