const express = require("express");
const router = express.Router();
const db = require("../db");

const rollRanges = {
  SE9: [23101, 23180],
  SE10: [23201, 23280],
  SE11: [23361, 23363],
  E9: [105, 106],
  F9: [23121, 23140],
  G9: [23141, 23160],
  H9: [23161, 23180],
  E10: [23201, 23220],
  F10: [23221, 23240],
  G10: [23241, 23260],
  H10: [23261, 23280],
  E11: [23301, 23320],
  F11: [23321, 23340],
  G11: [23341, 23360],
  H11: [23361, 23363],
};

// POST /api/calculateTermWork
router.post("/", async (req, res) => {
  const { subject, group } = req.body;

  if (!subject || !group || !rollRanges[group]) {
    return res.status(400).json({ error: "Invalid subject or group" });
  }

  const [startRoll, endRoll] = rollRanges[group];

  try {
    const [courseRes] = await db
      .promise()
      .query("SELECT course_code FROM courses WHERE course_name = ?", [
        subject,
      ]);

    if (courseRes.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const courseCode = courseRes[0].course_code;

    // Get student list
    const [students] = await db
      .promise()
      .query(
        "SELECT Roll_No, Name FROM Student WHERE Roll_No BETWEEN ? AND ?",
        [startRoll, endRoll]
      );

    const rollList = students.map((s) => s.Roll_No);
    const rollToName = Object.fromEntries(
      students.map((s) => [s.Roll_No, s.Name])
    );

    const getMarks = async (table) => {
      const [rows] = await db
        .promise()
        .query(
          `SELECT roll_no, converted_marks FROM ${table} WHERE roll_no BETWEEN ? AND ? AND course_code = ?`,
          [startRoll, endRoll, courseCode]
        );
      return Object.fromEntries(
        rows.map((r) => [r.roll_no, r.converted_marks])
      );
    };

    const [attRows] = await db
      .promise()
      .query(
        `SELECT roll_no, converted_marks FROM attendence_marks WHERE roll_no BETWEEN ? AND ?`,
        [startRoll, endRoll]
      );

    const attendanceMarks = Object.fromEntries(
      attRows.map((r) => [r.roll_no, r.converted_marks])
    );

    const unitTestMarks = await getMarks("unit_test_marks");
    const assignmentMarks = await getMarks("assignment_marks");

    const allMarksExist = rollList.every(
      (roll) =>
        roll in unitTestMarks &&
        roll in assignmentMarks &&
        roll in attendanceMarks
    );
    console.log("rollList", rollList);
    console.log("unitTestMarks", unitTestMarks);
    console.log("assignmentMarks", assignmentMarks);
    console.log("attendanceMarks", attendanceMarks);

    if (!allMarksExist) {
      return res.status(400).json({
        error:
          "Please enter Unit Test, Assignment, and Attendance marks for all students first.",
      });
    }

    // Check if already calculated
    const [existing] = await db
      .promise()
      .query(
        `SELECT roll_no FROM termwork_marks WHERE roll_no BETWEEN ? AND ? AND course_code = ?`,
        [startRoll, endRoll, courseCode]
      );
    if (existing.length === rollList.length) {
      const [existingMarks] = await db
        .promise()
        .query(
          `SELECT roll_no, termwork_marks, converted_marks FROM termwork_marks WHERE roll_no BETWEEN ? AND ? AND course_code = ?`,
          [startRoll, endRoll, courseCode]
        );
      // Fetch names
      const [namesRows] = await db
        .promise()
        .query(
          "SELECT Roll_No, Name FROM Student WHERE Roll_No BETWEEN ? AND ?",
          [startRoll, endRoll]
        );

      const nameMap = Object.fromEntries(
        namesRows.map((s) => [s.Roll_No, s.Name])
      );

      // Prepare final response
      const finalData = rollList.map((roll) => {
        const total =
          unitTestMarks[roll] + assignmentMarks[roll] + attendanceMarks[roll];
        const converted = Math.ceil((total / 100) * 25);

        return {
          roll_no: roll,
          name: nameMap[roll] || "-", // Add name here
          total,
          converted,
        };
      });

      res.json({
        message: "Term work marks calculated successfully",
        data: finalData,
      });
    }

    // Insert term work marks
    const insertQuery = `INSERT INTO termwork_marks (roll_no, course_code, termwork_marks, converted_marks) VALUES (?, ?, ?, ?)`;
    const insertPromises = [];

    for (let roll of rollList) {
      const total =
        unitTestMarks[roll] + assignmentMarks[roll] + attendanceMarks[roll];
      const converted = Math.ceil((total / 100) * 25);

      insertPromises.push(
        db.promise().query(insertQuery, [roll, courseCode, total, converted])
      );
    }

    await Promise.all(insertPromises);

    res.json({
      message: "Term work marks calculated successfully",
      data: rollList.map((roll) => ({
        roll_no: roll,
        total:
          unitTestMarks[roll] + assignmentMarks[roll] + attendanceMarks[roll],
        converted: Math.ceil(
          ((unitTestMarks[roll] +
            assignmentMarks[roll] +
            attendanceMarks[roll]) /
            100) *
            25
        ),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
