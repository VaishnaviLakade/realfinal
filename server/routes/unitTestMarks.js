const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/unitTestMarks
router.post("/", async (req, res) => {
  const { subject, students } = req.body;

  if (!subject || !students || !Array.isArray(students)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    // 1. Get course_code from course_name
    const [courseRows] = await db
      .promise()
      .query("SELECT course_code FROM courses WHERE course_name = ?", [
        subject,
      ]);

    if (courseRows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const courseCode = courseRows[0].course_code;

    // 2. Insert each student's marks
    const insertQuery = `
      INSERT INTO unit_test_marks (course_code, roll_no, marks, converted_marks)
      VALUES (?, ?, ?, ?)
    `;

    const promises = students.map((s) =>
      db
        .promise()
        .query(insertQuery, [courseCode, s.Roll_No, s.marks, s.convertedMarks])
    );

    await Promise.all(promises);

    res.json({ message: "Unit test marks submitted successfully!" });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
