// server/routes/unitTestMarks.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/unit-test-marks
router.post("/", async (req, res) => {
  console.log("Welcome");
  const { subject, students } = req.body;

  console.log(students);

  if (!subject || !students || !Array.isArray(students)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    // Step 1: Get course_code from courses table
    const [courseResult] = await db
      .promise()
      .query("SELECT course_code FROM courses WHERE course_name = ?", [
        subject,
      ]);

    if (courseResult.length === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const courseCode = courseResult[0].course_code;

    // Step 2: Insert marks
    const insertQuery = `
      INSERT INTO assignment_marks (course_code, roll_no, total, converted_marks)
      VALUES (?, ?, ?, ?)
    `;

    for (const student of students) {
      const roll_no = student.Roll_No; // ✅ correct property
      const marks = student.marks;
      const convertedMarks = student.convertedMarks;

      console.log(roll_no);

      await db
        .promise()
        .query(insertQuery, [courseCode, roll_no, marks, convertedMarks]);
    }

    return res.status(200).json({ message: "Marks inserted successfully" });
  } catch (err) {
    console.error("Insertion error:", err);
    return res.status(500).json({ error: "Failed to insert marks" });
  }
});

module.exports = router;
