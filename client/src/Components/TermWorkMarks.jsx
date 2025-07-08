import React, { useState } from "react";
import axios from "axios";
import "../css/TermWorkMarks.css";
import jsPDF from "jspdf";
import "jspdf-autotable"; // only import, no need to assign or register manually

const TermWorkMarks = () => {
  const [subject, setSubject] = useState("");
  const [group, setGroup] = useState("");
  const [marksData, setMarksData] = useState([]); // <-- ADD THIS

  const calculateMarks = async () => {
    if (!subject || !group) {
      alert("Please select both subject and group");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/calculateTermWork",
        {
          subject,
          group,
        }
      );

      alert(res.data.message);

      // Set marks data in state
      if (res.data.data) {
        setMarksData(res.data.data); // <-- ADD THIS
      }
    } catch (err) {
      if (err.response?.data?.data) {
        setMarksData(err.response.data.data); // <-- Also handle this in case of 409 with data
      }

      if (err.response?.status === 409) {
        alert("Term work already calculated.");
      } else if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert("Error calculating term work");
      }
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = "logo.png"; // From public folder

    img.onload = () => {
      const imgWidth = 20;
      const imgHeight = 20;

      // Add logo
      doc.addImage(img, "PNG", 15, 10, imgWidth, imgHeight);

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Pune Institute of Computer Technology, Pune", 105, 20, {
        align: "center",
      });
      doc.text("TERMWORK SHEET", 105, 30, { align: "center" });

      doc.setLineWidth(0.5);
      doc.line(10, 35, 200, 35);

      // Course info
      const courseCode = subject.toUpperCase();
      doc.setFontSize(12);
      doc.text(`Course Code: ${courseCode}`, 15, 45);
      doc.text(`Course Name: ${subject}`, 80, 45);

      if (group.startsWith("S")) {
        doc.text(`Class: ${group}`, 150, 45);
      } else {
        doc.text(`Batch: ${group}`, 150, 45);
      }

      // ✅ Debugging: Log entire marksData to inspect values
      console.log("📋 Marks Data:");
      console.table(
        marksData.map((entry) => ({
          Roll_No: entry.roll_no,
          Name: entry.name,
          Converted: entry.converted,
        }))
      );

      const tableColumn = ["Roll No", "Name", "Marks"];
      const tableRows = marksData.map((entry) => [
        entry.roll_no,
        entry.name || "-",
        entry.converted,
      ]);

      // If any name is missing, warn in console
      const missingNames = marksData.filter((entry) => !entry.name);
      if (missingNames.length > 0) {
        console.warn("⚠️ Some entries are missing names:");
        console.table(missingNames);
      }

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: { fontSize: 11, halign: "center" },
        headStyles: { fillColor: [0, 102, 204] },
        theme: "grid",
        columnStyles: {
          1: { halign: "left" },
        },
      });

      doc.save(`Termwork_${subject}_${group}.pdf`);
    };

    img.onerror = () => {
      alert("Failed to load logo image");
    };
  };

  return (
    <div className="marks-wrapper">
      <h2>Calculate Term Work Marks</h2>

      <div className="marks-form">
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Choose Subject</option>
          <option value="EM3">EM3</option>
          <option value="DMS">DMS</option>
          <option value="CG">CG</option>
          <option value="PA">PA</option>
        </select>

        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">Choose Class or Batch</option>
          <option value="SE9">SE9</option>
          <option value="SE10">SE10</option>
          <option value="SE11">SE11</option>
          <option value="E9">E9</option>
          <option value="F9">F9</option>
          <option value="G9">G9</option>
          <option value="H9">H9</option>
          <option value="E10">E10</option>
          <option value="F10">F10</option>
          <option value="G10">G10</option>
          <option value="H10">H10</option>
          <option value="E11">E11</option>
          <option value="F11">F11</option>
          <option value="G11">G11</option>
          <option value="H11">H11</option>
        </select>

        <button onClick={calculateMarks}>Calculate</button>
      </div>

      {/* Display table if marksData has values */}
      {marksData.length > 0 && (
        <>
          <table className="termwork-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Total Marks</th>
                <th>Converted Marks</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((entry) => (
                <tr key={entry.roll_no}>
                  <td>{entry.roll_no}</td>
                  <td>{entry.total}</td>
                  <td>{entry.converted}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Download Button outside table */}
          <div className="actions">
            <button onClick={downloadPDF}>Download PDF</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TermWorkMarks;
