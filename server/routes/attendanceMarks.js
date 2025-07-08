// server/routes/attendanceMarks.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  const { className, students } = req.body;

  if (!students || students.length === 0) {
    return res.status(400).json({ error: "No student data received" });
  }

  const insertQuery = `
    INSERT INTO attendence_marks (roll_no, attendence, converted_marks)
    VALUES (?, ?, ?)
  `;

  try {
    const promises = students.map(({ Roll_No, marks, convertedMarks }) => {
      return db.promise().query(insertQuery, [Roll_No, marks, convertedMarks]);
    });

    await Promise.all(promises);
    res.json({ message: "Attendance marks inserted successfully" });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Failed to insert attendance marks" });
  }
});

module.exports = router;
